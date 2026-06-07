"use client";

import Image from "next/image";
import type { BookRecommendation } from "@/types";

// ── Props ────────────────────────────────────────────────────────────────────
interface BookCardProps {
  book: BookRecommendation;
  onSelect: (book: BookRecommendation) => void;
}

/**
 * BookCard — Minimalist recommendation card displayed within the AI response.
 *
 * Shows only the cover image (3:4 aspect ratio) and title (2-line clamp)
 * per the CO-STAR spec: "minimalist, displaying only a beautifully scaled
 * cover image and the book title."
 */
const BookCard = ({ book, onSelect }: BookCardProps) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(book)}
      className="group flex flex-col overflow-hidden rounded-xl
        bg-white border border-gray-100
        shadow-sm transition-all duration-300 ease-out
        hover:shadow-lg hover:shadow-brand-blue/8
        hover:scale-[1.02] hover:-translate-y-0.5
        active:scale-[0.98]
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-brand-blue/40 focus-visible:ring-offset-2"
      aria-label={`Lihat detail buku: ${book.title}`}
    >
      {/* ── Cover Image ───────────────────────────────────────────────── */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-cream">
        {book.cover_image ? (
          <Image
            src={book.cover_image}
            alt={`Sampul buku ${book.title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out
              group-hover:scale-105"
          />
        ) : (
          /* Fallback placeholder when no cover URL is available */
          <div className="flex h-full w-full items-center justify-center
            bg-gradient-to-br from-neutral-cream to-neutral-creamLight">
            <span className="text-4xl">📖</span>
          </div>
        )}

        {/* ── Relevance Score Badge ─────────────────────────────────── */}
        {book.relevance_score >= 0.8 && (
          <div className="absolute right-2 top-2 rounded-full bg-white/90
            backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold text-brand-blue
            shadow-sm">
            {Math.round(book.relevance_score * 100)}% cocok
          </div>
        )}
      </div>

      {/* ── Title ─────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col justify-center px-3 py-2.5">
        <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-800
          group-hover:text-brand-blue transition-colors duration-200">
          {book.title}
        </h4>
      </div>
    </button>
  );
};

export default BookCard;
