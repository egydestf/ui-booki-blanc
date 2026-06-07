"use client";

import { useState, useCallback, useRef } from "react";
import { Send, SlidersHorizontal, X } from "lucide-react";
import { Loader } from "@mantine/core";
import type { RAGChatRequest } from "@/types";

// ── Props ────────────────────────────────────────────────────────────────────
interface ChatInputProps {
  onSubmit: (request: RAGChatRequest) => void;
  isLoading: boolean;
}

// ── Filter options sourced from the API contract ─────────────────────────────
const JENJANG_OPTIONS = ["SD", "SMP", "SMA"];
const KELAS_OPTIONS = [
  "1", "2", "3", "4", "5", "6",
  "7", "8", "9",
  "10", "11", "12",
];
const MAPEL_OPTIONS = [
  "Matematika",
  "Bahasa Indonesia",
  "Bahasa Inggris",
  "IPA",
  "IPS",
  "Biologi",
  "Fisika",
  "Kimia",
  "Sejarah",
  "Geografi",
  "Ekonomi",
  "PKn",
];

/**
 * ChatInput — Claude.ai-inspired input bar with optional filter panel.
 *
 * Features:
 * - Textarea that grows with content (up to 4 lines)
 * - Send on Enter (Shift+Enter for newline)
 * - Collapsible filter pills for jenjang/kelas/mapel
 * - Loading state with Mantine Loader
 */
const ChatInput = ({ onSubmit, isLoading }: ChatInputProps) => {
  const [value, setValue] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filterJenjang, setFilterJenjang] = useState<string>("");
  const [filterKelas, setFilterKelas] = useState<string>("");
  const [filterMapel, setFilterMapel] = useState<string>("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isDisabled = isLoading || value.trim().length === 0;

  const handleSubmit = useCallback(() => {
    if (isDisabled) return;
    const request: RAGChatRequest = {
      query: value.trim(),
      ...(filterJenjang && { filter_jenjang: filterJenjang }),
      ...(filterKelas && { filter_kelas: `Kelas ${filterKelas}` }),
      ...(filterMapel && { filter_mapel: filterMapel }),
    };
    onSubmit(request);
    setValue("");
    // Don't reset filters — user may want to keep the same context
  }, [value, filterJenjang, filterKelas, filterMapel, isDisabled, onSubmit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const clearFilters = useCallback(() => {
    setFilterJenjang("");
    setFilterKelas("");
    setFilterMapel("");
  }, []);

  const hasActiveFilters = filterJenjang || filterKelas || filterMapel;

  // Auto-resize textarea
  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      const el = e.target;
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    },
    []
  );

  return (
    <div className="border-t border-gray-100 bg-white/80 backdrop-blur-md px-4 py-3">
      {/* ── Filter Panel (collapsible) ─────────────────────────────────── */}
      {showFilters && (
        <div className="mb-3 animate-message-appear">
          <div className="flex flex-wrap items-center gap-2 rounded-xl bg-neutral-creamLight/60 px-3 py-2.5">
            {/* Jenjang */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-gray-400">Jenjang</span>
              <div className="flex gap-1">
                {JENJANG_OPTIONS.map((j) => (
                  <button
                    key={j}
                    type="button"
                    onClick={() => setFilterJenjang(filterJenjang === j ? "" : j)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-150
                      ${
                        filterJenjang === j
                          ? "bg-brand-blue text-white shadow-sm"
                          : "bg-white text-gray-500 hover:bg-brand-blue/10 hover:text-brand-blue"
                      }`}
                  >
                    {j}
                  </button>
                ))}
              </div>
            </div>

            {/* Separator */}
            <div className="h-6 w-px bg-gray-200" />

            {/* Kelas */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-gray-400">Kelas</span>
              <select
                value={filterKelas}
                onChange={(e) => setFilterKelas(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-2 py-1
                  text-xs text-gray-600 outline-none transition-colors
                  focus:border-brand-blue/40"
                aria-label="Filter kelas"
              >
                <option value="">Semua</option>
                {KELAS_OPTIONS.map((k) => (
                  <option key={k} value={k}>
                    Kelas {k}
                  </option>
                ))}
              </select>
            </div>

            {/* Separator */}
            <div className="h-6 w-px bg-gray-200" />

            {/* Mapel */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-gray-400">Mapel</span>
              <select
                value={filterMapel}
                onChange={(e) => setFilterMapel(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-2 py-1
                  text-xs text-gray-600 outline-none transition-colors
                  focus:border-brand-blue/40"
                aria-label="Filter mata pelajaran"
              >
                <option value="">Semua</option>
                {MAPEL_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="ml-auto flex items-center gap-1 rounded-lg px-2 py-1
                  text-xs font-medium text-gray-400 transition-colors
                  hover:text-red-500"
              >
                <X className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Input Row ──────────────────────────────────────────────────── */}
      <div className="flex items-end gap-2">
        {/* Filter Toggle */}
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl
            transition-all duration-200
            ${
              showFilters || hasActiveFilters
                ? "bg-brand-blue/10 text-brand-blue"
                : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            }`}
          aria-label={showFilters ? "Sembunyikan filter" : "Tampilkan filter"}
        >
          <SlidersHorizontal className="h-4.5 w-4.5" />
          {hasActiveFilters && (
            <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
              <span className="absolute h-full w-full rounded-full bg-brand-blue animate-ping opacity-75" />
              <span className="relative h-2 w-2 rounded-full bg-brand-blue" />
            </span>
          )}
        </button>

        {/* Textarea */}
        <div className="relative flex-1">
          <textarea
            ref={inputRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ceritakan buku yang kamu cari..."
            disabled={isLoading}
            rows={1}
            className="w-full resize-none rounded-xl border border-gray-200 bg-neutral-creamLight/40
              px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400
              outline-none transition-all duration-200
              focus:border-brand-blue/40 focus:bg-white focus:shadow-sm
              focus:ring-2 focus:ring-brand-blue/10
              disabled:cursor-not-allowed disabled:opacity-60"
            style={{ maxHeight: "120px" }}
            aria-label="Ketik pertanyaan untuk Booki"
          />
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl
            bg-brand-blue text-white shadow-sm
            transition-all duration-200
            hover:bg-brand-blue/90 hover:shadow-md
            active:scale-95
            disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-brand-blue/40 focus-visible:ring-offset-2"
          aria-label="Kirim pertanyaan"
        >
          {isLoading ? (
            <Loader size={18} color="white" />
          ) : (
            <Send className="h-4.5 w-4.5" />
          )}
        </button>
      </div>

      {/* ── Active filter summary ─────────────────────────────────────── */}
      {hasActiveFilters && !showFilters && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
          <SlidersHorizontal className="h-3 w-3" />
          <span>
            Filter aktif:
            {filterJenjang && ` ${filterJenjang}`}
            {filterKelas && ` • Kelas ${filterKelas}`}
            {filterMapel && ` • ${filterMapel}`}
          </span>
        </div>
      )}
    </div>
  );
};

export default ChatInput;