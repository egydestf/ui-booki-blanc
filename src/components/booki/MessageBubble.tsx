"use client";

import { BookOpen } from "lucide-react";
import type { ChatMessage, BookRecommendation } from "@/types";
import BookCard from "@/components/booki/BookCard";

// ── Props ────────────────────────────────────────────────────────────────────
interface MessageBubbleProps {
  message: ChatMessage;
  onSelectBook: (book: BookRecommendation) => void;
}

/**
 * MessageBubble — Renders a single chat turn (user or assistant).
 *
 * - User messages: right-aligned brand-blue bubble with white text.
 * - AI messages: left-aligned with:
 *     1. Narrative `answer` text (per Decoupled Rendering in DOKUMENTASI_SINKRONISASI.md)
 *     2. Optional `recommendations[]` rendered as a BookCard grid beneath.
 */
const MessageBubble = ({ message, onSelectBook }: MessageBubbleProps) => {
  const isUser = message.role === "user";
  const hasRecommendations =
    !isUser &&
    message.recommendations !== undefined &&
    message.recommendations.length > 0;

  return (
    <div
      className={`flex w-full animate-message-appear ${isUser ? "justify-end" : "justify-start"
        }`}
    >
      <div
        className={`flex max-w-[85%] gap-3 sm:max-w-[75%] lg:max-w-[70%] ${isUser ? "flex-row-reverse" : "flex-row"
          }`}
      >
        {/* ── Avatar ──────────────────────────────────────────────────── */}
        {!isUser && (
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center
              rounded-full bg-gradient-to-br from-brand-blue to-brand-pink
              shadow-sm"
          >
            <BookOpen className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
        )}

        {/* ── Bubble Content ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          {/* ── Text Bubble ───────────────────────────────────────────── */}
          <div
            className={`rounded-2xl px-4 py-3 ${isUser
                ? "bg-brand-blue text-white rounded-br-md"
                : "bg-white border border-gray-100 text-gray-700 rounded-bl-md shadow-sm"
              }`}
          >
            <p className="whitespace-pre-line text-sm leading-relaxed sm:text-base">
              {message.content}
            </p>
          </div>

          {/* ── Recommendation Cards Grid ──────────────────────────────── */}
          {hasRecommendations && (
            <div className="mt-1">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
                📚 Rekomendasi untukmu
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {message.recommendations!.map((book) => (
                  <BookCard
                    key={book.book_id}
                    book={book}
                    onSelect={onSelectBook}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;