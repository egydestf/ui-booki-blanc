"use client";

import { useState, useCallback } from "react";
import type { BookRecommendation } from "@/types";
import { useBookiChat } from "@/hooks/useBookiChat";
import ChatPanel from "@/components/booki/ChatPanel";
import BookDetailPanel from "@/components/booki/BookDetailPanel";

/**
 * BookiWorkspace — Top-level orchestrator for the Booki AI recommendation interface.
 *
 * Manages the Golden Ratio (φ ≈ 1.618) split-screen layout:
 *
 * ┌────────────────────────────┬──────────────────┐
 * │    Chat Panel (61.8%)      │  Detail (38.2%)  │
 * │                            │                  │
 * │    Messages + Input        │  Book Details    │
 * │                            │                  │
 * └────────────────────────────┴──────────────────┘
 *
 * States:
 * - Initial: Chat panel fills 100% width.
 * - Book selected: Smooth transition to 61.8% / 38.2% split.
 * - Mobile (< lg): Detail panel is a full-screen overlay.
 */
const BookiWorkspace = () => {
  const { messages, isLoading, error, sendMessage, clearMessages: _clearMessages } =
    useBookiChat();
  const [selectedBook, setSelectedBook] = useState<BookRecommendation | null>(
    null
  );

  const handleSelectBook = useCallback((book: BookRecommendation) => {
    setSelectedBook(book);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedBook(null);
  }, []);

  const isPanelOpen = selectedBook !== null;

  return (
    <div
      className="flex h-screen w-full pt-16 sm:pt-20 overflow-hidden bg-neutral-creamLight/20"
      id="booki-workspace"
    >
      {/* ── Left Panel: Chat ────────────────────────────────────────────── */}
      <div
        className={`
          h-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isPanelOpen ? "w-full lg:w-[61.8%]" : "w-full"}
        `}
      >
        <ChatPanel
          messages={messages}
          isLoading={isLoading}
          error={error}
          onSendMessage={sendMessage}
          onSelectBook={handleSelectBook}
        />
      </div>

      {/* ── Right Panel: Book Detail (Desktop — inline split) ──────────── */}
      {isPanelOpen && (
        <div
          className="
            hidden lg:flex
            h-full w-[38.2%]
            transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          "
        >
          <BookDetailPanel book={selectedBook} onClose={handleCloseDetail} />
        </div>
      )}

      {/* ── Right Panel: Book Detail (Mobile — overlay) ────────────────── */}
      {isPanelOpen && (
        <div className="lg:hidden absolute inset-0 z-50 pt-16 sm:pt-20 bg-[#0d0d1a]">
          <BookDetailPanel book={selectedBook} onClose={handleCloseDetail} />
        </div>
      )}
    </div>
  );
};

export default BookiWorkspace;