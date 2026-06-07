"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import type { ChatMessage, RAGChatRequest, BookRecommendation } from "@/types";
import MessageBubble from "@/components/booki/MessageBubble";
import ChatInput from "@/components/booki/ChatInput";
import EmptyState from "@/components/booki/EmptyState";
import { BookOpen } from "lucide-react";

// ── Props ────────────────────────────────────────────────────────────────────
interface ChatPanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  onSendMessage: (request: RAGChatRequest) => void;
  onSelectBook: (book: BookRecommendation) => void;
}

/**
 * ChatPanel — Left panel of the Booki workspace.
 *
 * Contains:
 * 1. Scrollable message list (or EmptyState when no messages)
 * 2. Typing indicator when loading
 * 3. Error toast when API fails
 * 4. Fixed ChatInput bar at the bottom
 */
const ChatPanel = ({
  messages,
  isLoading,
  error,
  onSendMessage,
  onSelectBook,
}: ChatPanelProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [pendingQuery, setPendingQuery] = useState<string>("");

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Handle suggestion chip click from EmptyState
  const handleSuggestionClick = useCallback((query: string) => {
    setPendingQuery(query);
    // Auto-submit the suggestion
    onSendMessage({ query });
    // Clear pending after a brief delay
    setTimeout(() => setPendingQuery(""), 100);
  }, [onSendMessage]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-full flex-col bg-neutral-creamLight/30">
      {/* ── Message Area ───────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-hide"
      >
        {isEmpty ? (
          <EmptyState onSuggestionClick={handleSuggestionClick} />
        ) : (
          <div className="mx-auto max-w-3xl space-y-4 px-4 py-6 sm:px-6">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                onSelectBook={onSelectBook}
              />
            ))}

            {/* ── Typing Indicator ──────────────────────────────────── */}
            {isLoading && (
              <div className="flex items-start gap-3 animate-message-appear">
                <div
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center
                    rounded-full bg-gradient-to-br from-brand-blue to-brand-pink
                    shadow-sm"
                >
                  <BookOpen className="h-4 w-4 text-white" strokeWidth={2} />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md
                  border border-gray-100 bg-white px-4 py-3 shadow-sm">
                  <span
                    className="h-2 w-2 rounded-full bg-brand-blue animate-typing-dots"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="h-2 w-2 rounded-full bg-brand-blue animate-typing-dots"
                    style={{ animationDelay: "200ms" }}
                  />
                  <span
                    className="h-2 w-2 rounded-full bg-brand-blue animate-typing-dots"
                    style={{ animationDelay: "400ms" }}
                  />
                </div>
              </div>
            )}

            {/* ── Error Toast ───────────────────────────────────────── */}
            {error && (
              <div className="mx-auto max-w-md animate-message-appear">
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                  <p className="text-sm text-red-600">
                    ⚠️ {error}
                  </p>
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* ── Input Bar (fixed at bottom) ────────────────────────────────── */}
      <div className="flex-shrink-0">
        <ChatInput
          onSubmit={onSendMessage}
          isLoading={isLoading}
          initialQuery={pendingQuery}
        />
      </div>
    </div>
  );
};

export default ChatPanel;
