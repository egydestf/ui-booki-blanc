// src/app/api/chat/route.ts
// Server-side proxy untuk Booki RAG backend di Hugging Face Spaces.
//
// Mengapa proxy (bukan fetch langsung dari browser)?
//   1. CORS — HF Spaces tidak selalu mengirim CORS header yang sesuai.
//   2. Security — URL backend tidak terekspos ke client bundle.
//   3. Flexibility — URL backend bisa diubah di .env.local tanpa rebuild frontend.
//
// AGENTS.md Rule #7: Edge Runtime HARUS dideklarasikan untuk kompatibilitas Cloudflare Pages.
// AGENTS.md Rule #6: Ini adalah SATU-SATUNYA API route yang boleh ada di proyek ini.

import { NextRequest, NextResponse } from "next/server";
import type { RAGChatRequest, RAGChatResponse, BookRecommendation } from "@/types";

// ── Response Normalization ────────────────────────────────────────────────────
// Backend Flask mengembalikan beberapa field dengan format yang berbeda dari
// kontrak TypeScript. Fungsi ini menormalkan setiap item rekomendasi:
//
//  1. cover_image: Backend mungkin mengirim string kosong dan menyimpan URL
//     sampul di field `link_sampul`. Fallback ke `link_sampul` jika ada.
//  2. kelas: Backend kadang mengirim array string (e.g. []) alih-alih string.
//     Normalkan ke string yang human-readable.
//  3. jenjang / mata_pelajaran: Trim whitespace ekstra.
//
type RawRecommendation = BookRecommendation & {
  link_sampul?: string;
  // kelas bisa berupa string atau array dari backend
  kelas: string | string[];
};

function normalizeRecommendation(raw: RawRecommendation): BookRecommendation {
  // Resolve cover image: gunakan cover_image jika ada, fallback ke link_sampul
  const coverImage =
    (raw.cover_image && raw.cover_image.trim() !== "")
      ? raw.cover_image.trim()
      : (raw.link_sampul?.trim() ?? "");

  // Normalize kelas: array → gabung dengan ", ", string → trim
  const kelas = Array.isArray(raw.kelas)
    ? raw.kelas.join(", ")
    : (raw.kelas?.toString().trim() ?? "");

  return {
    book_id:          raw.book_id,
    title:            raw.title?.trim() ?? "",
    author:           raw.author?.trim() ?? "",
    jenjang:          raw.jenjang?.trim() ?? "",
    kelas,
    mata_pelajaran:   raw.mata_pelajaran?.trim() ?? "",
    summary:          raw.summary ?? "",
    cover_image:      coverImage,
    similarity_score: raw.similarity_score ?? 0,
    relevance_score:  raw.relevance_score ?? 0,
  };
}

export const runtime = "edge";

// Backend URL dibaca dari environment variable (server-side only, tidak di-expose ke browser)
const BACKEND_URL =
  process.env.BOOKI_BACKEND_URL ??
  "https://afanr-backendbooki.hf.space/api/recommend";

// Timeout untuk HF Spaces (bisa cold-start, butuh waktu lebih lama)
const REQUEST_TIMEOUT_MS = 60_000; // 60 detik

export async function POST(request: NextRequest): Promise<NextResponse> {
  // ── 1. Parse & validate request body ────────────────────────────────────────
  let body: RAGChatRequest;
  try {
    body = (await request.json()) as RAGChatRequest;
  } catch {
    return NextResponse.json(
      { error: "Request body tidak valid. Harap kirim JSON yang benar." },
      { status: 400 }
    );
  }

  if (!body.query || body.query.trim().length === 0) {
    return NextResponse.json(
      { error: "Field 'query' tidak boleh kosong." },
      { status: 400 }
    );
  }

  // ── 2. Proxy ke Flask backend dengan timeout ─────────────────────────────────
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const backendResponse = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // ── 3. Forward response body langsung ke client ──────────────────────────
    if (!backendResponse.ok) {
      const errorBody = await backendResponse.json().catch(() => null);
      const errorMessage =
        (errorBody as { error?: string } | null)?.error ??
        `Backend error: ${backendResponse.status} ${backendResponse.statusText}`;

      return NextResponse.json({ error: errorMessage }, { status: backendResponse.status });
    }

    type RawResponse = Omit<RAGChatResponse, "recommendations"> & {
      recommendations: RawRecommendation[];
    };
    const data = (await backendResponse.json()) as RawResponse;

    // Terapkan normalisasi pada setiap item rekomendasi sebelum dikirim ke client.
    // Ini memperbaiki: cover_image kosong, kelas berupa array, whitespace ekstra.
    const normalized: RAGChatResponse = {
      ...data,
      recommendations: (data.recommendations ?? []).map(normalizeRecommendation),
    };

    return NextResponse.json(normalized, { status: 200 });
  } catch (err) {
    clearTimeout(timeoutId);

    // AbortError berarti timeout
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json(
        {
          error:
            "Backend tidak merespons dalam 60 detik. Mungkin sedang cold-start, coba lagi sebentar.",
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan tidak terduga saat menghubungi backend.",
      },
      { status: 500 }
    );
  }
}