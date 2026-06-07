"use client";

// src/components/home/DonationCalloutSection.tsx
// Section 6 — Donation & Volunteer CTA.
// Background: donasi.webp displayed full-bleed without dark overlay (like Section 3).
// Three glassmorphism panels: Donatur | Relawan | Hubungi Kami.
// Shape/pill badges for each action item.
// GSAP ScrollTrigger entrance animations.

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Heart,
  GraduationCap,
  BookOpen,
  Wallet,
  Package,
  CalendarDays,
  Users,
  BookMarked,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ── Brand tokens ───────────────────────────────────────────────────────
const BRAND_BLUE = "#0A96E6";
const BRAND_ORANGE = "#FBAD1A";
const BRAND_PINK = "#E9559B";
const WA_GREEN = "#25D366";

// ── Glassmorphism panel style ──────────────────────────────────────────
const GLASS_PANEL: React.CSSProperties = {
  background: "rgba(18, 16, 8, 0.42)", // Make shapes more transparent as requested
  border: "1px solid rgba(255, 255, 255, 0.14)",
  backdropFilter: "blur(22px)",
  WebkitBackdropFilter: "blur(22px)",
  boxShadow: "0 8px 40px rgba(0, 0, 0, 0.45)",
};

// ── Donation action badges ─────────────────────────────────────────────
const DONATION_BADGES = [
  { icon: BookOpen, label: "Donasi Buku", accent: BRAND_ORANGE },
  { icon: Package, label: "Perlengkapan Belajar", accent: BRAND_PINK },
  { icon: Wallet, label: "Dana Operasional", accent: BRAND_BLUE },
];

// ── Volunteer action badges ────────────────────────────────────────────
const VOLUNTEER_BADGES = [
  { icon: CalendarDays, label: "Mengajar Kelas Reguler", accent: BRAND_BLUE },
  { icon: Users, label: "Koordinasi Program", accent: BRAND_ORANGE },
  { icon: BookMarked, label: "Kegiatan Literasi", accent: BRAND_PINK },
];

// ── WhatsApp SVG icon ──────────────────────────────────────────────────
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.49" />
  </svg>
);

// ── Instagram SVG icon ─────────────────────────────────────────────────
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

// ──────────────────────────────────────────────────────────────────────
// Sub-component: Action Badge Pill
// ──────────────────────────────────────────────────────────────────────
interface BadgeProps {
  icon: React.ElementType;
  label: string;
  accent: string;
}

const ActionBadge = ({ icon: Icon, label, accent }: BadgeProps) => (
  <div
    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-white/90 select-none"
    style={{
      background: `${accent}22`,
      border: `1px solid ${accent}44`,
    }}
  >
    <Icon size={12} style={{ color: accent }} className="shrink-0" />
    {label}
  </div>
);

// ──────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────
export const DonationCalloutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const donateColRef = useRef<HTMLDivElement>(null);
  const volunteerColRef = useRef<HTMLDivElement>(null);
  const contactCardRef = useRef<HTMLDivElement>(null);

  // ── GSAP Scroll-triggered entrance animations ──────────────────────
  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const trigger = {
        trigger: sectionRef.current,
        start: "top 78%",
        toggleActions: "play none none none",
      };

      const tl = gsap.timeline({ scrollTrigger: trigger });

      // Column A — slides in from left
      if (donateColRef.current) {
        tl.from(
          donateColRef.current,
          { x: -60, opacity: 0, duration: 0.7, ease: "power3.out", immediateRender: false },
          0
        );
      }

      // Column B — mirror slide from right
      if (volunteerColRef.current) {
        tl.from(
          volunteerColRef.current,
          { x: 60, opacity: 0, duration: 0.7, ease: "power3.out", immediateRender: false },
          0.1
        );
      }

      // Contact card — fade up from bottom
      if (contactCardRef.current) {
        tl.from(
          contactCardRef.current,
          { y: 40, opacity: 0, duration: 0.65, ease: "power3.out", immediateRender: false },
          0.36
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="donation-section"
      aria-label="Donasi dan Relawan Rumah Literasi Tambaksogra"
      className="relative w-full overflow-hidden aspect-auto lg:aspect-[3/1] border-t border-b border-black/10"
      style={{
        // Mirrors Section 3: dark background colour that shows behind the image
        backgroundColor: "#121008",
        backgroundImage: "url('/images/donasi.webp')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
    >
      {/* ── Subtle ambient glow blobs (no dark overlay — image shows through) ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "8%", left: "2%",
          width: "360px", height: "360px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${BRAND_ORANGE}18 0%, transparent 70%)`,
          filter: "blur(56px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "6%", right: "3%",
          width: "300px", height: "300px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${BRAND_PINK}14 0%, transparent 70%)`,
          filter: "blur(48px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: "40%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "500px", height: "500px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${BRAND_BLUE}0c 0%, transparent 65%)`,
          filter: "blur(60px)",
        }}
      />

      {/* ── Content — restricted to max-w-5xl (20% narrower than standard max-w-7xl) ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-0 flex flex-col justify-center h-full">

        {/* ── Section Header ── */}
        <div className="text-center mb-6 lg:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-2">
            Langkah Kecil,{" "}
            <span style={{ color: "#7AF51C" }}>Dampak Besar</span>
          </h2>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-xl mx-auto">
            Setiap kontribusi sekecil apapun membuka jendela pengetahuan bagi
            anak-anak desa yang bermimpi lebih tinggi.
          </p>
        </div>

        {/* ── Dual Column Grid (Left & Right) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 mb-4 lg:mb-5">

          {/* ─── Column A: Menjadi Donatur ───────────────────────────── */}
          <div
            ref={donateColRef}
            className="rounded-2xl p-5 lg:p-6 flex flex-col gap-3"
            style={GLASS_PANEL}
          >
            {/* Header row */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: `${BRAND_ORANGE}22`,
                  border: `1.5px solid ${BRAND_ORANGE}44`,
                }}
              >
                <Heart size={20} style={{ color: BRAND_ORANGE }} />
              </div>
              <h3 className="text-base lg:text-lg font-bold text-white leading-none">
                Menjadi Donatur
              </h3>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-300 leading-relaxed">
              Satu buku yang kamu donasikan bisa menjadi cahaya bagi puluhan anak.
              Pilih bentuk kontribusi yang paling sesuai kemampuanmu.
            </p>

            {/* Shape/pill badges */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {DONATION_BADGES.map(({ icon, label, accent }) => (
                <ActionBadge key={label} icon={icon} label={label} accent={accent} />
              ))}
            </div>

            {/* Accent bar */}
            <div
              className="h-0.5 w-12 rounded-full mt-auto"
              style={{ background: `linear-gradient(90deg, ${BRAND_ORANGE}, ${BRAND_PINK})` }}
            />
          </div>

          {/* ─── Column B: Menjadi Relawan ───────────────────────────── */}
          <div
            ref={volunteerColRef}
            className="rounded-2xl p-5 lg:p-6 flex flex-col gap-3"
            style={GLASS_PANEL}
          >
            {/* Header row */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: `${BRAND_BLUE}22`,
                  border: `1.5px solid ${BRAND_BLUE}44`,
                }}
              >
                <GraduationCap size={20} style={{ color: BRAND_BLUE }} />
              </div>
              <h3 className="text-base lg:text-lg font-bold text-white leading-none">
                Menjadi Relawan
              </h3>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-300 leading-relaxed">
              Jika kamu mahasiswa atau profesional yang ingin berbagi ilmu —
              kami butuhkan kamu di sini. Pilih peran yang paling cocok.
            </p>

            {/* Shape/pill badges */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {VOLUNTEER_BADGES.map(({ icon, label, accent }) => (
                <ActionBadge key={label} icon={icon} label={label} accent={accent} />
              ))}
            </div>

            {/* Accent bar */}
            <div
              className="h-0.5 w-12 rounded-full mt-auto"
              style={{ background: `linear-gradient(90deg, ${BRAND_BLUE}, #0569ad)` }}
            />
          </div>
        </div>

        {/* ── Full-Width Manager Contact Card below ── */}
        <div
          ref={contactCardRef}
          className="rounded-2xl p-5 lg:p-6"
          style={GLASS_PANEL}
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-8">

            {/* Identity */}
            <div className="flex items-center gap-4 shrink-0">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white font-black text-base"
                style={{
                  background: `linear-gradient(135deg, ${BRAND_PINK} 0%, #c7417f 100%)`,
                  boxShadow: `0 4px 14px ${BRAND_PINK}44`,
                }}
              >
                FF
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 leading-none mb-1">
                  Pengelola Komunitas
                </p>
                <h4 className="text-sm font-bold text-white leading-tight">
                  Fatiyah Fidiyanti
                </h4>
                <p className="text-xs text-white/45 mt-0.5">
                  Rumah Literasi Desa Tambaksogra
                </p>
              </div>
            </div>

            {/* Contact prompt */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-300 leading-relaxed">
                Punya pertanyaan seputar mekanisme donasi atau ingin mendaftar menjadi
                relawan pengajar? Hubungi Kak Fatiyah langsung via WhatsApp atau Instagram!
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full sm:w-auto">

              {/* WhatsApp */}
              <a
                href="https://wa.me/6282136833365?text=Halo%20Kak%20Fatiyah,%20saya%20tertarik%20untuk%20berkontribusi%20di%20Rumah%20Literasi%20Tambaksogra."
                target="_blank"
                rel="noopener noreferrer"
                id="cta-whatsapp-donation"
                aria-label="Hubungi via WhatsApp"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white min-h-[38px] transition-all duration-200 select-none w-full sm:w-auto"
                style={{ background: WA_GREEN, boxShadow: `0 3px 12px ${WA_GREEN}33` }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.03)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 6px 18px ${WA_GREEN}55`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 3px 12px ${WA_GREEN}33`;
                }}
              >
                <WhatsAppIcon />
                WhatsApp
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/rumahliterasidesatambaksogra"
                target="_blank"
                rel="noopener noreferrer"
                id="cta-instagram-donation"
                aria-label="Kunjungi Instagram kami"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white min-h-[38px] transition-all duration-200 select-none w-full sm:w-auto"
                style={{
                  background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                  boxShadow: "0 3px 12px rgba(220,39,67,0.28)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.03)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 18px rgba(220,39,67,0.50)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 3px 12px rgba(220,39,67,0.28)";
                }}
              >
                <InstagramIcon />
                Instagram
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
