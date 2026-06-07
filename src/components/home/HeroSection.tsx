"use client";

// src/components/home/HeroSection.tsx
// Djarum Foundation–inspired hero: warm cream left zone that gradient-blends
// into a full-bleed auto-rotating image slideshow on the right.
// Full viewport width, no container padding constraining backgrounds.
// Left contains: highlight heading, subhighlight text, stat shapes only.

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
      className="relative w-full min-h-screen overflow-hidden"
    >
      {/* ══════════════════════════════════════════════════════════════
          DESKTOP / TABLET LAYOUT (≥ md)
          Two-zone: left cream text area → gradient blend → right image
          ══════════════════════════════════════════════════════════════ */}

      {/* ── Left Background Zone ── */}
      <div
        className="absolute inset-0 hidden md:block"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(135deg, #F8F1E9 0%, #F0E3D3 100%)",
        }}
      />

      {/* ── Right Image Zone (full-bleed, all slideshow images stacked) ── */}
      <div
        data-hero-image-zone=""
        className="absolute top-0 right-0 bottom-0 hidden md:block"
        style={{
          width: "58%",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 50%)",
          maskImage: "linear-gradient(to right, transparent 0%, black 50%)",
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

      {/* The Djarum Foundation–style transition is now handled seamlessly 
          via CSS mask-image on the right image zone container above, 
          which avoids any color mismatches between background and overlay. */}

      {/* ── Left Content Container (desktop/tablet) ── */}
      <div className="relative z-20 hidden md:flex items-center min-h-screen">
        <div
          className="w-full pl-6 sm:pl-12 lg:pl-20 xl:pl-28 2xl:pl-36 pr-8"
          style={{ maxWidth: "52%" }}
        >
          {/* Heading */}
          <h1
            data-hero-heading=""
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] mb-5"
          >
            <span className="text-gray-900">Literasi Hari Ini,</span>
            <br />
            <span className="text-brand-blue">Inovasi Masa Depan</span>
          </h1>

          {/* Subhighlight */}
          <p
            data-hero-sub=""
            className="text-base lg:text-lg text-gray-500 leading-relaxed max-w-lg mb-8"
          >
            Membangun ekosistem literasi berbasis teknologi untuk mendukung
            pembelajaran siswa di era digital
          </p>

          {/* Stat Shapes — horizontal row */}
          <div className="flex flex-wrap gap-3 lg:gap-4">
            {HERO_STATS.map((stat) => (
              <div
                key={stat.label}
                data-hero-stat=""
                className="flex flex-col items-center justify-center px-4 py-3 lg:px-5 lg:py-4 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-100 shadow-sm min-w-[90px] lg:min-w-[100px] hover:shadow-md transition-shadow duration-300"
              >
                <span
                  className="text-xl lg:text-2xl font-bold"
                  style={{ color: stat.accent }}
                >
                  {stat.value}
                </span>
                <span className="text-[11px] lg:text-xs text-gray-500 font-medium mt-0.5 text-center">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          MOBILE LAYOUT (< md)
          Stacked: image on top, text content below on cream background
          ══════════════════════════════════════════════════════════════ */}
      <div className="md:hidden">
        {/* Mobile Image — stacked on top, full-width */}
        <div className="relative w-full h-[50vh] min-h-[280px]">
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
                sizes="100vw"
                priority={i === 0}
              />
            </div>
          ))}
          {/* Bottom fade into cream */}
          <div
            className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, #F8F1E9 0%, rgba(248,241,233,0) 100%)",
            }}
          />
        </div>

        {/* Mobile Text Content */}
        <div
          className="px-5 pt-6 pb-12"
          style={{
            background: "linear-gradient(to bottom, #F8F1E9 0%, #F0E3D3 100%)",
          }}
        >
          <h1
            data-hero-heading=""
            className="text-3xl sm:text-4xl font-bold leading-[1.15] mb-4"
          >
            <span className="text-gray-900">Literasi Hari Ini,</span>
            <br />
            <span className="text-brand-blue">Inovasi Masa Depan</span>
          </h1>

          <p
            data-hero-sub=""
            className="text-base text-gray-500 leading-relaxed mb-6 max-w-md"
          >
            Membangun ekosistem literasi berbasis teknologi untuk mendukung
            pembelajaran siswa di era digital
          </p>

          {/* Stat Shapes — 2×2 grid on mobile */}
          <div className="grid grid-cols-2 gap-3">
            {HERO_STATS.map((stat) => (
              <div
                key={stat.label}
                data-hero-stat=""
                className="flex flex-col items-center justify-center px-3 py-3 rounded-xl bg-white/80 border border-gray-100 shadow-sm"
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
