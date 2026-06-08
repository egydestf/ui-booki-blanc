"use client";

// src/components/home/ProgramsGridSection.tsx
// 7 literacy programs — center-focus horizontal carousel.
// The card closest to the center of the scroll container is automatically
// highlighted (blue gradient + scale) as the user scrolls.
// All other cards remain white. Fixed card dimensions — no layout shift.

import { useRef, useState, useEffect, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BookOpen,
  BookCopy,
  Mic2,
  Monitor,
  BrainCircuit,
  Palette,
  GraduationCap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ── Design tokens ─────────────────────────────────────────────────────
const BRAND_BLUE = "#0A96E6";
const BRAND_PINK = "#E9559B";
const BRAND_ORANGE = "#FBAD1A";

// Fixed card dimensions — identical for every card, active or not
const CARD_W = 256; // px
const CARD_H = 320; // px
const CARD_GAP = 20; // px — gap between cards

// ── Helper ────────────────────────────────────────────────────────────
const alpha = (hex: string, a: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
};

// ── Program data ──────────────────────────────────────────────────────
interface ProgramItem {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string; // icon/border colour on white cards
}

const PROGRAMS: ProgramItem[] = [
  {
    id: "baca-buku",
    icon: BookOpen,
    title: "Layanan Baca Buku",
    description:
      "Nikmati ratusan koleksi buku dari cerita anak hingga ensiklopedia di ruang baca kami yang nyaman dan terbuka untuk semua kalangan secara gratis.",
    accent: BRAND_BLUE,
  },
  {
    id: "peminjaman-buku",
    icon: BookCopy,
    title: "Layanan Peminjaman Buku",
    description:
      "Pinjam buku favoritmu dan bawa pulang untuk dibaca di rumah. Sistem peminjaman kami mudah dan sepenuhnya gratis untuk seluruh warga Tambaksogra.",
    accent: BRAND_PINK,
  },
  {
    id: "read-aloud",
    icon: Mic2,
    title: "Layanan Read Aloud",
    description:
      "Sesi mendongeng dan membaca nyaring bersama fasilitator berpengalaman yang dirancang untuk menumbuhkan imajinasi dan kecintaan membaca sejak usia dini.",
    accent: BRAND_ORANGE,
  },
  {
    id: "kelas-komputer",
    icon: Monitor,
    title: "Kelas Komputer",
    description:
      "Belajar literasi digital dasar dan penggunaan komputer secara praktis untuk mempersiapkan generasi muda menghadapi tantangan dan peluang di era teknologi.",
    accent: BRAND_BLUE,
  },
  {
    id: "kelas-bahasa-matematika",
    icon: BrainCircuit,
    title: "Kelas Bahasa Inggris dan Matematika",
    description:
      "Bimbingan belajar yang komunikatif dan interaktif untuk menguasai dasar Bahasa Inggris dan Matematika secara menyenangkan sesuai jenjang usia.",
    accent: BRAND_PINK,
  },
  {
    id: "kelas-kreativitas",
    icon: Palette,
    title: "Kelas Kreativitas",
    description:
      "Workshop seni dan kerajinan tangan berbasis proyek kreatif yang melatih imajinasi, motorik halus, dan kemampuan berekspresi secara bebas dan menyenangkan.",
    accent: BRAND_ORANGE,
  },
  {
    id: "kelas-mahasiswa",
    icon: GraduationCap,
    title: "Kelas Bersama Mahasiswa",
    description:
      "Program kolaborasi interaktif bersama mahasiswa relawan yang berbagi ilmu dan pengalaman belajar secara langsung kepada anak-anak desa dengan penuh semangat.",
    accent: BRAND_BLUE,
  },
];

// ── ProgramCard ───────────────────────────────────────────────────────
interface CardProps {
  program: ProgramItem;
  isActive: boolean; // true = center card → blue gradient style
}

const ProgramCard = ({ program, isActive }: CardProps) => {
  const Icon = program.icon;

  // ── Style derivation ──────────────────────────────────────────────
  // Active (center) card: blue gradient, cloud-white decorative blobs, white text
  // Idle card: pure white, accent-tinted icon and border
  const cardBg = isActive
    ? `linear-gradient(145deg, ${BRAND_BLUE} 0%, #0b7dcb 55%, #0569ad 100%)`
    : "#ffffff";

  const borderStyle = isActive
    ? "none"
    : `1.5px solid ${alpha(program.accent, 0.18)}`;

  const shadowStyle = isActive
    ? `0 16px 48px ${alpha(BRAND_BLUE, 0.40)}, 0 4px 16px rgba(0,0,0,0.10)`
    : "0 2px 14px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)";

  const iconBg = isActive
    ? "rgba(255,255,255,0.20)"
    : alpha(program.accent, 0.10);

  const iconBorder = isActive
    ? "1.5px solid rgba(255,255,255,0.30)"
    : `1.5px solid ${alpha(program.accent, 0.22)}`;

  const iconColor = isActive ? "#ffffff" : program.accent;
  const titleColor = isActive ? "#ffffff" : "#1a1a2e";
  const descColor = isActive ? "rgba(255,255,255,0.80)" : "#64748b";

  return (
    <div
      data-program-card=""
      className="flex-shrink-0 relative"
      style={{
        width: `${CARD_W}px`,
        height: `${CARD_H}px`,
        // z-index: active card stacks on top of neighbours
        zIndex: isActive ? 10 : 1,
        position: "relative",
      }}
    >
      {/* ── Card shell ── */}
      <div
        className="w-full h-full rounded-2xl flex flex-col items-center justify-center px-6 overflow-hidden"
        style={{
          background: cardBg,
          border: borderStyle,
          boxShadow: shadowStyle,
          transform: isActive ? "scale(1.06)" : "scale(1)",
          transition:
            "transform 0.45s cubic-bezier(0.34,1.28,0.64,1), " +
            "box-shadow 0.40s ease, " +
            "background 0.40s ease, " +
            "border 0.40s ease",
          willChange: "transform",
        }}
      >
        {/* Cloud blobs — only visible on active card for the "awan" feel */}
        {isActive && (
          <>
            <div
              className="absolute pointer-events-none"
              style={{
                width: "160px",
                height: "160px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.07)",
                top: "-50px",
                right: "-40px",
              }}
            />
            <div
              className="absolute pointer-events-none"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
                bottom: "-30px",
                left: "-20px",
              }}
            />
          </>
        )}

        {/* ── Icon ── */}
        <div
          className="flex items-center justify-center rounded-2xl mb-5 relative z-10"
          style={{
            width: "60px",
            height: "60px",
            background: iconBg,
            border: iconBorder,
            transform: isActive ? "translateY(-4px)" : "translateY(0)",
            transition: "transform 0.45s cubic-bezier(0.34,1.28,0.64,1)",
            boxShadow: isActive
              ? "0 8px 24px rgba(255,255,255,0.15)"
              : "none",
          }}
        >
          <Icon size={26} style={{ color: iconColor }} />
        </div>

        {/* ── Title ── */}
        <h3
          className="text-center font-bold text-[15px] leading-snug mb-3 relative z-10"
          style={{ color: titleColor }}
        >
          {program.title}
        </h3>

        {/* ── Description ── */}
        <p
          className="text-center text-[13px] leading-relaxed relative z-10"
          style={{ color: descColor }}
        >
          {program.description}
        </p>
      </div>
    </div>
  );
};

// ── Main Section ──────────────────────────────────────────────────────
export const ProgramsGridSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Index of the card currently closest to the center of the scroll container
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // ── Center-card detection via scroll event ────────────────────────
  const updateActiveIndex = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const scrollLeft = el.scrollLeft;
    let closestIdx = 0;
    let closestDist = Infinity;

    PROGRAMS.forEach((_, i) => {
      const targetPos = i * (CARD_W + CARD_GAP);
      const dist = Math.abs(scrollLeft - targetPos);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    });

    setActiveIndex(closestIdx);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    // Run once on mount so the initial center card is highlighted
    updateActiveIndex();

    el.addEventListener("scroll", updateActiveIndex, { passive: true });
    return () => el.removeEventListener("scroll", updateActiveIndex);
  }, [updateActiveIndex]);

  // ── Auto-scroll: cycles 0→1→…→6→0 every 3.5 s ───────────────────
  // Pauses for 5 s after any user interaction, then resumes.
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPausedRef = useRef<boolean>(false);
  // Track active index in a ref so the interval closure always sees latest value
  const activeIndexRef = useRef<number>(0);

  // Keep the ref in sync with state
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const pauseAutoScroll = useCallback(() => {
    isPausedRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, 5000);
  }, []);

  const startAutoScroll = useCallback(() => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    autoScrollRef.current = setInterval(() => {
      if (isPausedRef.current) return;
      const next = (activeIndexRef.current + 1) % PROGRAMS.length;
      const el = scrollContainerRef.current;
      if (!el) return;
      const targetScrollLeft = next * (CARD_W + CARD_GAP);
      el.scrollTo({ left: targetScrollLeft, behavior: "smooth" });
    }, 3500);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    startAutoScroll();

    // Pause when user manually interacts
    const onPointerDown = () => pauseAutoScroll();
    const onTouchStart = () => pauseAutoScroll();
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("touchstart", onTouchStart, { passive: true });

    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("touchstart", onTouchStart);
    };
  }, [startAutoScroll, pauseAutoScroll]);

  // ── GSAP — section entrance animations ────────────────────────────
  useGSAP(
    () => {
      if (!sectionRef.current) return;

      // Header elements slide up on scroll-enter
      if (headerRef.current) {
        gsap.from(headerRef.current.querySelectorAll("[data-h-el]"), {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 82%",
            toggleActions: "play none none none",
          },
          y: 32,
          opacity: 0,
          duration: 0.65,
          stagger: 0.13,
          ease: "power3.out",
          immediateRender: false,
        });
      }

      // Cards stagger in from right
      gsap.from("[data-program-card]", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          toggleActions: "play none none none",
        },
        x: 56,
        opacity: 0,
        duration: 0.52,
        stagger: 0.08,
        ease: "power2.out",
        immediateRender: false,
      });
    },
    { scope: sectionRef }
  );

  // ── Scroll-snap dot indicator update ──────────────────────────────
  const scrollToCard = useCallback((index: number) => {
    pauseAutoScroll();
    const el = scrollContainerRef.current;
    if (!el) return;
    const targetScrollLeft = index * (CARD_W + CARD_GAP);
    el.scrollTo({ left: targetScrollLeft, behavior: "smooth" });
  }, [pauseAutoScroll]);

  return (
    <section
      ref={sectionRef}
      id="programs-section"
      aria-label="Program Kami"
      className="py-20 lg:py-32 bg-neutral-creamLight"
    >
      {/* ── Section Header ── */}
      <div
        ref={headerRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-14 lg:mb-20"
      >
        <h2
          data-h-el=""
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4"
        >
          Program Kami
        </h2>
        <p
          data-h-el=""
          className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-2xl mx-auto"
        >
          Tujuh program unggulan Rumah Literasi Tambaksogra dirancang untuk mendukung
          pertumbuhan belajar anak-anak desa secara menyeluruh, mulai dari membaca dan
          menulis hingga teknologi digital dan kreativitas seni.
        </p>
      </div>

      {/*
        ── Carousel Architecture ─────────────────────────────────────────────────
        The max-w-7xl wrapper (no side padding) contains the carousel and
        clips overflow at the container boundary. Edge fades are solid crisp
        gradients — no CSS blur filter. The scroll container's 50%-based
        padding is relative to the container width so ALL 7 cards reach
        the visual center when snapped.
        ─────────────────────────────────────────────────────────────── */}
      {/* max-w-7xl clips the carousel — NO side padding so fades go edge-to-edge */}
      <div className="max-w-7xl mx-auto relative" style={{ overflow: "hidden" }}>
        {/* Left crisp fade — solid background to transparent, no blur */}
        <div
          className="absolute left-0 top-0 bottom-0 z-20 pointer-events-none"
          style={{
            width: "80px",
            background: "linear-gradient(to right, #F8F1E9 55%, rgba(248,241,233,0) 100%)",
          }}
        />
        {/* Right crisp fade — solid background to transparent, no blur */}
        <div
          className="absolute right-0 top-0 bottom-0 z-20 pointer-events-none"
          style={{
            width: "80px",
            background: "linear-gradient(to left, #F8F1E9 55%, rgba(248,241,233,0) 100%)",
          }}
        />

        {/* Scrollable track */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none" as React.CSSProperties["msOverflowStyle"],
            // Vertical padding absorbs card scale(1.06) so it never clips
            paddingTop: "56px",
            paddingBottom: "72px",
            scrollSnapType: "x mandatory",
          }}
        >
          <div
            className="flex"
            style={{
              gap: `${CARD_GAP}px`,
            }}
          >
            {/* Left spacer for centering the first card */}
            <div
              className="flex-shrink-0"
              style={{
                width: `calc(50% - ${CARD_W / 2}px - ${CARD_GAP}px)`,
              }}
            />

            {PROGRAMS.map((program, i) => (
              <div
                key={program.id}
                className="flex-shrink-0"
                style={{ scrollSnapAlign: "center" }}
              >
                <ProgramCard program={program} isActive={i === activeIndex} />
              </div>
            ))}

            {/* Right spacer for centering the last card */}
            <div
              className="flex-shrink-0"
              style={{
                width: `calc(50% - ${CARD_W / 2}px - ${CARD_GAP}px)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Dot navigation ── */}
      <div className="flex justify-center gap-2 mt-8">
        {PROGRAMS.map((p, i) => (
          <button
            key={p.id}
            type="button"
            aria-label={`Lihat program ${p.title}`}
            onClick={() => scrollToCard(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === activeIndex ? "28px" : "8px",
              height: "8px",
              background: i === activeIndex ? BRAND_BLUE : alpha(BRAND_BLUE, 0.22),
            }}
          />
        ))}
      </div>
    </section>
  );
};
