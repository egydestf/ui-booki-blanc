// src/app/(public)/page.tsx
// Server Component — pure structural compositor for the Home / Beranda page.
// Renders all 6 storytelling sections in sequential flow:
// Hero → Profile → Booki → Programs → Documentation Gallery → Donation
// No "use client" directive — zero client-side JavaScript from this file.

import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { ProfileSection } from "@/components/home/ProfileSection";
import { BookiTeaserSection } from "@/components/home/BookiTeaserSection";
import { ProgramsGridSection } from "@/components/home/ProgramsGridSection";
import { DocumentationGallerySection } from "@/components/home/DocumentationGallerySection";
import { DonationCalloutSection } from "@/components/home/DonationCalloutSection";

export const metadata: Metadata = {
  title: "Beranda — Rumah Literasi Desa Tambaksogra",
  description:
    "Rumah Literasi Desa Tambaksogra mendorong semangat baca dan literasi anak-anak Indonesia sejak 2016. Temukan program unggulan kami dan rekomendasi buku cerdas dari asisten AI Booki.",
};

export default function HomePage() {
  return (
    <main>
      {/* §1 — Hero: Primary entry point with institutional identity & CTA triggers */}
      <HeroSection />

      {/* §2 — Profile: Organizational history, mission, timeline, and core values */}
      <ProfileSection />

      {/* §3 — Booki Teaser: Interactive AI sandbox with template question buttons */}
      <BookiTeaserSection />

      {/* §4 — Programs: 7-card horizontal scroll of educational & creativity classes */}
      <ProgramsGridSection />

      {/* §5 — Documentation: Mosaic photo gallery of community activities */}
      <DocumentationGallerySection />

      {/* §6 — Donation: Closing CTA for material support & volunteer registration */}
      <DonationCalloutSection />
    </main>
  );
}
