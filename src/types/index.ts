// src/types/index.ts

export interface SystemHealthResponse {
  status: 'healthy' | string;
  message: string;
}

export interface BookRecommendation {
  book_id: string;
  title: string;
  author: string;
  jenjang: 'SD' | 'SMP' | 'SMA' | string;
  kelas: string;
  mata_pelajaran: string;
  summary: string;
  cover_image: string;
  similarity_score: number;
  relevance_score: number;
}

export interface RAGChatRequest {
  query: string;
  filter_jenjang?: string;
  filter_kelas?: string;
  filter_mapel?: string;
}

export interface RAGChatResponse {
  status: 'success' | string;
  query: string;
  answer: string;
  recommendations: BookRecommendation[];
}

export interface AdminBookSummary {
  book_id: string;
  judul_buku: string;
  jenjang: string;
  [key: string]: any;
}

export interface CatalogPaginationResponse {
  books: AdminBookSummary[];
  current_page: number;
  total_books: number;
  total_pages: number;
}

export interface MutationResponse {
  status: 'ok' | string;
  message: string;
  book_id: string;
}

// Chat message for the Booki conversational UI
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;                        // User: query text. Assistant: `answer` narrative.
  recommendations?: BookRecommendation[]; // Only present on assistant messages
  timestamp: Date;
}

export type UserRole = 'admin' | 'user';

