"use client";

// src/components/home/ProfileSection.tsx
// Section 2: Institutional profile with centered title,
// left-column timeline visualization, right-column narrative text.
// No images, no value cards. GSAP ScrollTrigger animations.

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookOpen, Lightbulb, Cpu } from "lucide-react";
import type { LucideIcon } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ──────────────────────────────────────────────────────────────────────
// Timeline milestones
// ──────────────────────────────────────────────────────────────────────
interface TimelineMilestone {
  year: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accentColor: string;
  bgColor: string;
  borderColor: string;
}

const TIMELINE: TimelineMilestone[] = [
  {
    year: "2016",
    title: "Taman Baca Berdiri",
    description:
      "Bermula dari ruang baca sederhana dengan koleksi buku sumbangan warga desa.",
    icon: BookOpen,
    accentColor: "#0A96E6",
    bgColor: "#FFFFFF",
    borderColor: "border-brand-blue/30",
  },
  {
    year: "2019",
    title: "Rumah Literasi",
    description:
      "Berkembang menjadi pusat pembelajaran komunitas dengan program kelas reguler.",
    icon: Lightbulb,
    accentColor: "#FBAD1A",
    bgColor: "#FFFFFF",
    borderColor: "border-brand-orange/30",
  },
  {
    year: "2024",
    title: "Integrasi Teknologi",
    description:
      "Meluncurkan Booki, asisten AI cerdas untuk rekomendasi buku belajar.",
    icon: Cpu,
    accentColor: "#E9559B",
    bgColor: "#FFFFFF",
    borderColor: "border-brand-pink/30",
  },
];

// ──────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────
export const ProfileSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from("[data-profile-title]", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
      });

      gsap.from("[data-timeline-item]", {
        scrollTrigger: {
          trigger: "[data-timeline-item]",
          start: "top 88%",
        },
        x: -30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
      });

      gsap.from("[data-profile-text]", {
        scrollTrigger: {
          trigger: "[data-profile-text]",
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="profile-section" className="pt-20 pb-32 lg:pt-28 lg:pb-40 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Centered Section Title ── */}
        <div className="text-center mb-14 lg:mb-20" data-profile-title="">
          {/* Logo above title — 2× larger, unoptimized to preserve transparency */}
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.webp"
              alt="Logo Rumah Literasi Tambaksogra"
              width={112}
              height={112}
              className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 object-contain"
              unoptimized
            />
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Rumah Literasi Tambaksogra
          </h2>
        </div>

        {/* ── Two-Column Layout: Timeline (left) + Narrative (right) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
          {/* ── Left Column: Timeline ── */}
          <div className="space-y-0 order-1">
            <div className="relative isolate">

              {/* Garis Vertikal - Diturunkan ke z-[-10] agar benar-benar tenggelam di bawah komponen apa pun */}
              <div
                className="absolute left-[23px] top-6 bottom-6 w-0.5 z-[-10]"
                style={{
                  background:
                    "linear-gradient(180deg, #0A96E6 0%, #FBAD1A 50%, #E9559B 100%)",
                }}
                aria-hidden="true"
              />

              {/* Items wrapper */}
              <div className="space-y-10">
                {TIMELINE.map((milestone) => (
                  <div
                    key={milestone.year}
                    data-timeline-item=""
                    className="relative flex gap-5"
                  >
                    {/* Year circle - Diperkuat dengan z-[20] dan paksa bg-white murni */}
                    <div className="relative z-[20] shrink-0">
                      <div
                        className="w-12 h-12 rounded-full border-2 flex items-center justify-center shadow-sm bg-white"
                        style={{ borderColor: milestone.accentColor }}
                      >
                        <milestone.icon
                          size={20}
                          style={{ color: milestone.accentColor }}
                        />
                      </div>
                    </div>

                    {/* Content card */}
                    <div className="flex-1 pb-3 relative z-10">
                      <span
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: milestone.accentColor }}
                      >
                        {milestone.year}
                      </span>
                      <h3 className="font-bold text-gray-800 text-base mt-1">
                        {milestone.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Column: Narrative Text ── */}
          <div className="order-2" data-profile-text="">
            <p className="text-sm sm:text-base text-gray-600 leading-loose">
              <strong className="text-gray-800">
                Rumah Literasi Desa Tambaksogra
              </strong>{" "}
              hadir sebagai ruang belajar yang tumbuh dari kepedulian tulus
              terhadap anak-anak di{" "}
              <strong className="text-gray-800">
                Desa Tambaksogra, Kecamatan Sumbang, Banyumas
              </strong>
              , sebuah tempat di mana membaca buku, belajar komputer, berkreasi,
              dan bermain bersama menjadi jembatan menuju mimpi yang lebih
              besar.
            </p>
            <p className="text-sm sm:text-base text-gray-600 leading-loose mt-6">
              Sejak berdiri pada{" "}
              <strong className="text-gray-800">2016</strong>, kami membuka
              pintu selebar-lebarnya bagi anak usia pra-sekolah hingga SMA untuk
              mengakses ilmu secara gratis, didampingi para relawan dan
              mahasiswa yang dengan penuh semangat berbagi pengalaman dan
              pengetahuan.
            </p>
            <p className="text-sm sm:text-base text-gray-600 leading-loose mt-6">
              Bersama komunitas dan berbagai pihak yang peduli, kami percaya
              bahwa{" "}
              <strong className="text-gray-800">
                literasi bukan sekadar kemampuan membaca
              </strong>
              , melainkan bekal hidup yang akan membentuk generasi unggul yang{" "}
              <strong className="text-gray-800">
                cerdas, kreatif, dan berkarakter
              </strong>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
