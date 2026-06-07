import type { Metadata } from "next";
import BookiWorkspace from "@/components/booki/BookiWorkspace";

export const metadata: Metadata = {
  title: "Booki — Rekomendasi Buku AI | Rumah Literasi Tambaksogra",
  description:
    "Tanyakan pada Booki, asisten AI Rumah Literasi Tambaksogra, untuk menemukan buku pelajaran terbaik berdasarkan kebutuhan belajarmu.",
};

/**
 * BookiPage — Server Component page shell for the /booki route.
 *
 * All interactivity is delegated to the BookiWorkspace client component.
 * This server component only handles SEO metadata.
 */
export default function BookiPage() {
  return <BookiWorkspace />;
}