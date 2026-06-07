"use client";

import { BookOpen, Sparkles, MessageCircle } from "lucide-react";

// ── Props ────────────────────────────────────────────────────────────────────
interface EmptyStateProps {
  onSuggestionClick: (query: string) => void;
}

// ── Suggestion chips — quick-start queries for students ─────────────────────
const SUGGESTIONS: string[] = [
  "Carikan buku matematika untuk kelas 10 SMA",
  "Aku butuh buku IPA tentang sistem tata surya",
  "Rekomendasi buku Bahasa Indonesia untuk SMP",
  "Buku pelajaran sejarah yang menarik untuk dibaca",
];

/**
 * EmptyState — Warm welcome screen shown before the first query.
 * Renders the Booki mascot identity, greeting copy, and suggestion chips.
 */
const EmptyState = ({ onSuggestionClick }: EmptyStateProps) => {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="flex max-w-lg flex-col items-center text-center">
        {/* ── Mascot Icon ──────────────────────────────────────────────── */}
        <div className="relative mb-6">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-2xl
              bg-gradient-to-br from-brand-blue to-brand-pink
              shadow-lg shadow-brand-blue/20 animate-float"
          >
            <BookOpen className="h-10 w-10 text-white" strokeWidth={1.8} />
          </div>
          <div
            className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center
              rounded-full bg-brand-orange shadow-md animate-gentle-pulse"
          >
            <Sparkles className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
        </div>

        {/* ── Greeting ─────────────────────────────────────────────────── */}
        <h2 className="mb-2 text-2xl font-bold text-gray-800 sm:text-3xl">
          Halo! Aku Booki 📚
        </h2>
        <p className="mb-8 max-w-md text-sm leading-relaxed text-gray-500 sm:text-base">
          Ceritakan buku seperti apa yang kamu cari, dan aku akan merekomendasikan
          yang terbaik untukmu dari koleksi Rumah Literasi!
        </p>

        {/* ── Suggestion Chips ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 w-full sm:max-w-md">
          <p className="flex items-center justify-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gray-400">
            <MessageCircle className="h-3.5 w-3.5" />
            Coba tanyakan
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onSuggestionClick(suggestion)}
                className="group rounded-xl border border-gray-200 bg-white px-4 py-3
                  text-left text-sm leading-snug text-gray-600
                  transition-all duration-200
                  hover:border-brand-blue/30 hover:bg-brand-blue/5
                  hover:text-brand-blue hover:shadow-sm
                  active:scale-[0.98]"
              >
                <span className="line-clamp-2">{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
