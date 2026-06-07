"use client";

// src/components/home/BlogHighlightsSection.tsx
// Teaser grid listing the 3 most recent blog/news articles.
// Uses type-safe slug references for /blog/[slug] route navigation.
// GSAP ScrollTrigger for staggered card entrance.

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@mantine/core";
import { Calendar, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ──────────────────────────────────────────────────────────────────────
// Mock blog article data with type-safe slug references
// ──────────────────────────────────────────────────────────────────────
interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
}

const MOCK_ARTICLES: BlogArticle[] = [
  {
    slug: "perayaan-hari-buku-nasional-2026",
    title: "Perayaan Hari Buku Nasional 2026 di Rumah Literasi",
    excerpt:
      "Rangkaian kegiatan seru memperingati Hari Buku Nasional bersama ratusan anak-anak Desa Tambaksogra, mulai dari lomba membaca hingga pameran buku kreatif.",
    date: "17 Mei 2026",
    image: "/images/kegiatan-siswa-rumah-baca-05.webp",
    category: "Kegiatan",
  },
  {
    slug: "kelas-sains-cilik-eksperimen-dapur",
    title: "Kelas Sains Cilik: Eksperimen Seru dengan Bahan Dapur",
    excerpt:
      "Anak-anak belajar prinsip kimia dasar melalui eksperimen menyenangkan menggunakan cuka, baking soda, dan pewarna makanan yang aman.",
    date: "3 Mei 2026",
    image: "/images/kegiatan-siswa-rumah-baca-07.webp",
    category: "Program",
  },
  {
    slug: "kisah-sukses-alumni-meraih-beasiswa",
    title: "Kisah Sukses: Alumni Rumah Literasi Meraih Beasiswa",
    excerpt:
      "Dina Amelia, alumni program bimbingan belajar, berhasil meraih beasiswa penuh di SMA unggulan berkat semangat belajar yang dipupuk sejak kecil.",
    date: "20 April 2026",
    image: "/images/kegiatan-siswa-rumah-baca-06.webp",
    category: "Cerita",
  },
];

// ──────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────
export const BlogHighlightsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from("[data-blog-header]", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
      });

      gsap.from("[data-blog-card]", {
        scrollTrigger: {
          trigger: "[data-blog-card]",
          start: "top 88%",
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ── */}
        <div className="text-center mb-12 lg:mb-16">
          <span
            data-blog-header=""
            className="text-brand-orange font-semibold text-sm uppercase tracking-wider"
          >
            Blog &amp; Berita
          </span>
          <h2
            data-blog-header=""
            className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2"
          >
            Berita &amp; Artikel Terbaru
          </h2>
          <p
            data-blog-header=""
            className="text-sm sm:text-base text-gray-600 mt-3 max-w-2xl mx-auto leading-relaxed"
          >
            Ikuti perkembangan terbaru dari kegiatan dan program Rumah Literasi
            Desa Tambaksogra.
          </p>
        </div>

        {/* ── Blog Cards Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_ARTICLES.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              data-blog-card=""
              className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 block"
            >
              {/* Article Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-brand-blue">
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar size={12} />
                  <time>{article.date}</time>
                </div>

                <h3 className="font-semibold text-gray-800 text-base leading-snug line-clamp-2 group-hover:text-brand-blue transition-colors">
                  {article.title}
                </h3>

                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>

                <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-blue group-hover:gap-2 transition-all">
                  Baca Selengkapnya
                  <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* ── CTA ── */}
        <div className="text-center mt-12">
          <Button
            component={Link}
            href="/blog"
            variant="outline"
            size="lg"
            color="brandBlue"
            rightSection={<ArrowRight size={16} />}
          >
            Lihat Semua Berita
          </Button>
        </div>
      </div>
    </section>
  );
};
