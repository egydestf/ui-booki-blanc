"use client";

import Image from "next/image";
import { X, BookOpen } from "lucide-react";
import { Badge } from "@mantine/core";
import type { BookRecommendation } from "@/types";

// ── Props ────────────────────────────────────────────────────────────────────
interface BookDetailPanelProps {
  book: BookRecommendation | null;
  onClose: () => void;
}

/**
 * BookDetailPanel — Sliding right panel (38.2% Golden Ratio width on desktop).
 *
 * Desktop (≥ lg): slides in from the right as a sibling panel.
 * Mobile  (< lg): renders as a full-screen overlay with backdrop blur.
 *
 * Displays enlarged cover, metadata badges, scores, and full summary.
 */
const BookDetailPanel = ({ book, onClose }: BookDetailPanelProps) => {
  if (!book) return null;

  const scorePercent = (score: number) => Math.round(score * 100);

  return (
    <>
      {/* ── Mobile Backdrop (< lg) ────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Panel Container ───────────────────────────────────────────── */}
      <aside
        className="
          fixed inset-y-0 right-0 z-50 w-full
          sm:w-[85vw] md:w-[70vw]
          lg:relative lg:z-auto lg:w-full
          flex flex-col
          bg-white border-l border-gray-100
          shadow-2xl lg:shadow-none
          animate-slide-in-right
          overflow-hidden
        "
        role="complementary"
        aria-label={`Detail buku: ${book.title}`}
      >
        {/* ── Header Bar ────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <BookOpen className="h-4 w-4" />
            <span>Detail Buku</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg
              text-gray-400 transition-colors duration-150
              hover:bg-gray-100 hover:text-gray-700
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-brand-blue/40"
            aria-label="Tutup panel detail"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Scrollable Content ─────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-6">
          <div className="flex flex-col items-center gap-6">
            {/* ── Cover Image ──────────────────────────────────────── */}
            <div className="relative aspect-[3/4] w-full max-w-[240px] overflow-hidden
              rounded-xl bg-neutral-cream shadow-md">
              {book.cover_image ? (
                <Image
                  src={book.cover_image}
                  alt={`Sampul buku ${book.title}`}
                  fill
                  sizes="240px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center
                  bg-gradient-to-br from-neutral-cream to-neutral-creamLight">
                  <span className="text-6xl">📖</span>
                </div>
              )}
            </div>

            {/* ── Title & Author ────────────────────────────────────── */}
            <div className="w-full text-center">
              <h3 className="text-xl font-bold leading-snug text-gray-800 sm:text-2xl">
                {book.title}
              </h3>
              <p className="mt-1 text-base text-gray-500">
                {book.author}
              </p>
            </div>

            {/* ── Metadata Badges ──────────────────────────────────── */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge
                variant="light"
                color="blue"
                size="lg"
                radius="md"
              >
                {book.jenjang}
              </Badge>
              <Badge
                variant="light"
                color="pink"
                size="lg"
                radius="md"
              >
                Kelas {book.kelas}
              </Badge>
              <Badge
                variant="light"
                color="orange"
                size="lg"
                radius="md"
              >
                {book.mata_pelajaran}
              </Badge>
            </div>

            {/* ── Score Indicators ──────────────────────────────────── */}
            <div className="grid w-full grid-cols-2 gap-3">
              <div className="rounded-xl bg-brand-blue/5 px-4 py-3 text-center">
                <p className="text-2xl font-bold text-brand-blue">
                  {scorePercent(book.similarity_score)}%
                </p>
                <p className="mt-0.5 text-xs font-medium text-gray-500">
                  Kemiripan
                </p>
              </div>
              <div className="rounded-xl bg-brand-pink/5 px-4 py-3 text-center">
                <p className="text-2xl font-bold text-brand-pink">
                  {scorePercent(book.relevance_score)}%
                </p>
                <p className="mt-0.5 text-xs font-medium text-gray-500">
                  Relevansi
                </p>
              </div>
            </div>

            {/* ── Divider ──────────────────────────────────────────── */}
            <hr className="w-full border-gray-100" />

            {/* ── Summary Section ──────────────────────────────────── */}
            <div className="w-full">
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
                Rangkuman Utama
              </h4>
              <div className="rounded-xl bg-neutral-creamLight/60 px-4 py-4">
                <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
                  {book.summary}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default BookDetailPanel;
