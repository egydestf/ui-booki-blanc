"use client";

import { useState, useCallback } from "react";
import type {
  RAGChatRequest,
  RAGChatResponse,
  ChatMessage,
} from "@/types";

// ── Return type interface (AGENTS.md Rule §5.4) ──────────────────────────────
export interface UseBookiChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (request: RAGChatRequest) => Promise<void>;
  clearMessages: () => void;
}

// ── Constants ────────────────────────────────────────────────────────────────
const API_URL =
  process.env.NEXT_PUBLIC_BOOKI_API_URL ?? "http://localhost:7860/api/recommend";

/**
 * useBookiChat — Core state machine for the Booki conversational RAG interface.
 *
 * Responsibilities:
 * 1. Maintain an ordered `messages[]` array (user + assistant turns).
 * 2. POST user queries to the Flask backend at `API_URL`.
 * 3. Separate the `answer` string from the `recommendations` array per
 *    DOKUMENTASI_SINKRONISASI.md §2B — Decoupled Rendering.
 * 4. Expose `isLoading` and `error` for the three mandatory UI states.
 */
export const useBookiChat = (): UseBookiChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (request: RAGChatRequest) => {
    // Guard — prevent empty queries
    const trimmedQuery = request.query.trim();
    if (trimmedQuery.length === 0) return;

    // ① Append the user's message immediately for instant feedback
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmedQuery,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // ② Build the strict JSON payload per DOKUMENTASI_SINKRONISASI.md §2B
      const payload: RAGChatRequest = {
        query: trimmedQuery,
        ...(request.filter_jenjang && { filter_jenjang: request.filter_jenjang }),
        ...(request.filter_kelas && { filter_kelas: request.filter_kelas }),
        ...(request.filter_mapel && { filter_mapel: request.filter_mapel }),
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const errorMessage =
          (errorBody as { error?: string } | null)?.error ??
          `Server error: ${response.status}`;
        throw new Error(errorMessage);
      }

      const data: RAGChatResponse = await response.json();

      // ③ Create assistant message — Decoupled Rendering:
      //    `answer`          → narrative text for MessageBubble
      //    `recommendations` → structured data for BookCard grid
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.answer,
        recommendations:
          data.recommendations.length > 0 ? data.recommendations : undefined,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menghubungi Booki. Coba lagi nanti.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
};