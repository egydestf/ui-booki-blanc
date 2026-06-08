"use client";

// src/components/home/HeroSection.tsx
// Perbaikan Layout Multi-Zoom Responsif (80% - 100%+)
// Menggunakan Grid Alur Alami agar gambar kanan mengikuti melarnya teks kiri.

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// ──────────────────────────────────────────────────────────────────────
// Image slideshow configuration
// ──────────────────────────────────────────────────────────────────────
const SLIDESHOW_IMAGES = [
  {
    src: "/images/kegiatan-siswa-rumah-baca-03.webp",
    alt: "Kegiatan belajar bersama di Rumah Literasi Tambaksogra",
  },
  {
    src: "/images/kegiatan-siswa-rumah-baca-02.webp",
    alt: "Siswa membaca buku di Rumah Literasi Tambaksogra",
  },
  {
    src: "/images/kegiatan-siswa-rumah-baca-01.webp",
    alt: "Murid-murid Rumah Literasi bersama pengajar",
  },
] as const;

const ROTATION_INTERVAL = 5000; // ms

// ──────────────────────────────────────────────────────────────────────
// Stat shape data — exactly 4 items per spec
// ──────────────────────────────────────────────────────────────────────
const HERO_STATS = [
  { value: "400+", label: "Buku", accent: "#0A96E6" },
  { value: "450+", label: "Eksemplar", accent: "#E9559B" },
  { value: "7", label: "Program Kelas", accent: "#FBAD1A" },
  { value: "100+", label: "Siswa Aktif", accent: "#0A96E6" },
] as const;

// ──────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────
export const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // ── Auto-rotate slideshow ──
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDESHOW_IMAGES.length);
    }, ROTATION_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // ── GSAP entrance animations ──
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from("[data-hero-heading]", {
        y: 40,
        opacity: 0,
        duration: 0.8,
      })
        .from(
          "[data-hero-sub]",
          { y: 30, opacity: 0, duration: 0.7 },
          "-=0.4"
        )
        .from(
          "[data-hero-stat]",
          { y: 20, opacity: 0, stagger: 0.1, duration: 0.5 },
          "-=0.3"
        )
        .from(
          "[data-hero-image-zone]",
          { opacity: 0, duration: 1.2, ease: "power2.out" },
          "-=0.8"
        );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="hero-section"
      className="relative w-full h-auto overflow-visible bg-[#f2f2f2]"
    >
      {/* ══════════════════════════════════════════════════════════════
          DESKTOP / TABLET LAYOUT (≥ md)
          Menggunakan CSS Grid 12 Kolom Nyata untuk Mengunci Proporsi Tinggi
          ══════════════════════════════════════════════════════════════ */}
      <div className="hidden md:grid grid-cols-12 w-full min-h-[calc(100vh-0px)] relative overflow-hidden">

        {/* Background — flat neutral */}
        <div
          className="absolute inset-0 z-0"
          aria-hidden="true"
          style={{ background: "#f2f2f2" }}
        />

        {/* Blue ambient glow — bottom-left corner, behind text */}
        <div
          className="absolute pointer-events-none z-[5]"
          aria-hidden="true"
          style={{
            bottom: "-60px",
            left: "-80px",
            width: "560px",
            height: "560px",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at bottom left, rgba(10,150,230,0.13) 0%, rgba(10,150,230,0.05) 30%, transparent 60%)",
            filter: "blur(32px)",
          }}
        />

        {/* ── SISI KIRI: Kontainer Teks Konten ── */}
        <div className="col-span-5 lg:col-span-5 xl:col-span-5 z-20 flex items-center pt-20 sm:pt-24 lg:pt-28 xl:pt-32 pb-16 lg:pb-24 xl:pb-28 pl-6 sm:pl-12 lg:pl-16 xl:pl-24 2xl:pl-32 pr-4 h-full">
          <div className="w-full">
            {/* Heading */}
            <h1
              data-hero-heading=""
              className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold leading-[1.1] mb-4 lg:mb-5"
            >
              <span className="text-gray-900">Literasi Hari Ini,</span>
              <br />
              <span className="text-brand-blue">Inovasi Masa Depan</span>
            </h1>

            {/* Subhighlight */}
            <p
              data-hero-sub=""
              className="text-sm lg:text-base text-gray-500 leading-relaxed max-w-md mb-6 lg:mb-8"
            >
              Membangun ekosistem literasi berbasis teknologi untuk mendukung
              pembelajaran siswa di era digital
            </p>

            {/* Stat Shapes — horizontal row wrapper */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 xl:gap-5">
              {HERO_STATS.map((stat) => (
                <div
                  key={stat.label}
                  data-hero-stat=""
                  className="flex flex-col items-center justify-center px-3.5 py-3 lg:px-5 lg:py-4 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-100 shadow-sm min-w-[88px] lg:min-w-[100px] xl:min-w-[112px] hover:shadow-md transition-shadow duration-300"
                >
                  <span
                    className="text-lg lg:text-xl xl:text-2xl font-bold"
                    style={{ color: stat.accent }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-[10px] lg:text-[11px] xl:text-xs text-gray-500 font-medium mt-0.5 text-center">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SISI KANAN: Kontainer Gambar Slideshow ── */}
        {/* col-span-7 bertindak sebagai tiang penyangga tinggi seksi secara alami */}
        <div
          data-hero-image-zone=""
          className="col-span-7 lg:col-span-7 xl:col-span-7 relative min-h-screen h-full z-10"
          style={{
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 15%)",
            maskImage: "linear-gradient(to right, transparent 0%, black 15%)",
          }}
        >
          {SLIDESHOW_IMAGES.map((img, i) => (
            <div
              key={img.src}
              className="absolute inset-0 transition-opacity duration-[1000ms] ease-in-out"
              style={{ opacity: activeIndex === i ? 1 : 0 }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="58vw"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          MOBILE LAYOUT (< md)
          Stacked: image on top, text content below on cream background
          ══════════════════════════════════════════════════════════════ */}
      <div className="md:hidden">
        {/* Mobile Image — stacked on top, full-width, offset by navbar h-16=64px */}
        <div className="relative w-full h-[48vh] min-h-[280px] pt-16">
          {SLIDESHOW_IMAGES.map((img, i) => (
            <div
              key={img.src}
              className="absolute inset-0 transition-opacity duration-[1000ms] ease-in-out"
              style={{ opacity: activeIndex === i ? 1 : 0 }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 767px) 100vw, 0vw"
                priority={i === 0}
              />
            </div>
          ))}
          {/* Bottom fade into page bg */}
          <div
            className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, #f2f2f2 0%, rgba(242,242,242,0) 100%)",
            }}
          />
        </div>

        {/* Mobile Text Content */}
        <div
          className="px-5 pt-8 pb-16 relative overflow-hidden"
          style={{ background: "#f2f2f2" }}
        >
          {/* Blue ambient glow — bottom-left, behind content */}
          <div
            className="absolute pointer-events-none"
            aria-hidden="true"
            style={{
              bottom: "-80px",
              left: "-80px",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse at bottom left, rgba(10,150,230,0.11) 0%, rgba(10,150,230,0.04) 45%, transparent 70%)",
              filter: "blur(28px)",
              zIndex: 0,
            }}
          />

          <h1
            data-hero-heading=""
            className="relative z-10 text-3xl sm:text-4xl font-bold leading-[1.15] mb-5"
          >
            <span className="text-gray-900">Literasi Hari Ini,</span>
            <br />
            <span className="text-brand-blue">Inovasi Masa Depan</span>
          </h1>

          <p
            data-hero-sub=""
            className="relative z-10 text-base text-gray-500 leading-relaxed mb-8 max-w-md"
          >
            Membangun ekosistem literasi berbasis teknologi untuk mendukung
            pembelajaran siswa di era digital
          </p>

          {/* Stat Shapes — 2×2 grid on mobile */}
          <div className="relative z-10 grid grid-cols-2 gap-3.5">
            {HERO_STATS.map((stat) => (
              <div
                key={stat.label}
                data-hero-stat=""
                className="flex flex-col items-center justify-center px-4 py-4 rounded-xl bg-white/80 border border-gray-100 shadow-sm"
              >
                <span
                  className="text-xl font-bold"
                  style={{ color: stat.accent }}
                >
                  {stat.value}
                </span>
                <span className="text-[11px] text-gray-500 font-medium mt-0.5 text-center">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};