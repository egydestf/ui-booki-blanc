"use client";

// src/components/home/DocumentationGallerySection.tsx
// Mosaic/editorial photo gallery showcasing community activities.
// Uses varied image sizes for visual rhythm — NOT a uniform grid.
// GSAP ScrollTrigger for staggered entrance animations.

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ──────────────────────────────────────────────────────────────────────
// Gallery items with activity captions
// ──────────────────────────────────────────────────────────────────────
interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
  span: "large" | "medium" | "small";
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    src: "/images/kegiatan-siswa-rumah-baca-01.webp",
    alt: "Kegiatan membuat seni dan kreativitas bersama siswa",
    caption: "Membuat Seni & Kreativitas",
    span: "large",
  },
  {
    src: "/images/kegiatan-siswa-rumah-baca-02.webp",
    alt: "Sesi belajar matematika",
    caption: "Belajar Matematika",
    span: "small",
  },
  {
    src: "/images/kegiatan-siswa-rumah-baca-05.webp",
    alt: "Perayaan Hari Buku Nasional",
    caption: "Hari Buku Nasional",
    span: "small",
  },
  {
    src: "/images/kegiatan-siswa-rumah-baca-03.webp",
    alt: "Workshop menulis kreatif",
    caption: "Workshop Kreatif",
    span: "large",
  },
  {
    src: "/images/kegiatan-siswa-rumah-baca-04.webp",
    alt: "Ruang belajar siswa",
    caption: "Ruang Belajar",
    span: "medium",
  },
  {
    src: "/images/kegiatan-siswa-rumah-baca-06.webp",
    alt: "Kelas bahasa Inggris",
    caption: "Kelas Bahasa Inggris",
    span: "medium",
  },
  {
    src: "/images/kegiatan-siswa-rumah-baca-07.webp",
    alt: "Koleksi rak buku Rumah Literasi",
    caption: "Rak Buku",
    span: "medium",
  },
];

// ──────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────
export const DocumentationGallerySection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from("[data-gallery-header]", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
      });

      gsap.from("[data-gallery-item]", {
        scrollTrigger: {
          trigger: "[data-gallery-item]",
          start: "top 88%",
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="documentation-section" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header — style matches Section 4 ── */}
        <div className="text-center mb-12 lg:mb-16">
          <h2
            data-gallery-header=""
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4"
          >
            Dokumentasi Kegiatan
          </h2>
          <p
            data-gallery-header=""
            className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-2xl mx-auto"
          >
            Potret nyata semangat literasi dan kebersamaan di Rumah Literasi
            Desa Tambaksogra
          </p>
        </div>

        {/* ── Mosaic Gallery Grid ── */}
        {/* Row 1: Large (2-col) + Small */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-4 sm:mb-5">
          <GalleryCard item={GALLERY_ITEMS[0]} className="sm:col-span-2 h-60 sm:h-76 lg:h-84" />
          <GalleryCard item={GALLERY_ITEMS[1]} className="h-60 sm:h-76 lg:h-84" />
        </div>

        {/* Row 2: Small + Large (2-col) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-4 sm:mb-5">
          <GalleryCard item={GALLERY_ITEMS[2]} className="h-60 sm:h-68 lg:h-76" />
          <GalleryCard item={GALLERY_ITEMS[3]} className="sm:col-span-2 h-60 sm:h-68 lg:h-76" />
        </div>

        {/* Row 3: Three equal items */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          <GalleryCard item={GALLERY_ITEMS[4]} className="h-52 sm:h-60 lg:h-68" />
          <GalleryCard item={GALLERY_ITEMS[5]} className="h-52 sm:h-60 lg:h-68" />
          <GalleryCard item={GALLERY_ITEMS[6]} className="h-52 sm:h-60 lg:h-68" />
        </div>
      </div>
    </section>
  );
};

// ──────────────────────────────────────────────────────────────────────
// Gallery Card sub-component
// ──────────────────────────────────────────────────────────────────────
interface GalleryCardProps {
  item: GalleryItem;
  className?: string;
}

const GalleryCard = ({ item, className = "" }: GalleryCardProps) => {
  return (
    <div
      data-gallery-item=""
      className={`relative rounded-xl overflow-hidden group cursor-pointer ${className}`}
    >
      <Image
        src={item.src}
        alt={item.alt}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      {/* Hover overlay with caption */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
        <div className="p-4 sm:p-5">
          <p className="text-white font-bold text-sm sm:text-base">
            {item.caption}
          </p>
        </div>
      </div>

      {/* Always-visible subtle bottom gradient for depth */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent" />
    </div>
  );
};
