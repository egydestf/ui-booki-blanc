"use client";

// src/components/home/BookiTeaserSection.tsx
// Booki RAG Teaser — golden-ratio layout, icon left of title overlapping shape,
// richer GSAP entrance + parallax animations, CTA updated to #21AEFF.

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Modal } from "@mantine/core";
import {
  Sparkles,
  Lock,
  Rocket,
  ChevronRight,
  Zap,
  BookMarked,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ── Design tokens ─────────────────────────────────────────────────────
const GLASS_BG = "rgba(255,255,255,0.25)";
const GLASS_BORDER = "rgba(0,0,0,0.10)";
const GLASS_BLUR = "blur(32px)";
const ACCENT_PINK = "#E9559B";
const ACCENT_BLUE = "#0A96E6";
const ACCENT_CTA = "#21AEFF"; // CTA button color (Jelajahi Booki)

// Fixed dimensions for the right panel — prevents ANY layout shift
const PANEL_MIN_HEIGHT = 580; // px  total panel
const CARD_WIDTH = 160;       // px  each book card

// ── Types ─────────────────────────────────────────────────────────────

interface SandboxBook {
  id: string;
  kelas: string;
  mapel: string;
  judul: string;
  sampul: string;
  sumber: string;
  buku: string;
}

interface QueryTemplate {
  id: string;
  label: string;
  answer: string;
  bookIds: string[];
}

type SectionState = "idle" | "typing" | "revealing" | "done";

// ── Book Data ─────────────────────────────────────────────────────────

const BOOK_DATA: Record<string, SandboxBook> = {
  bcbd6d670aa68293: {
    id: "bcbd6d670aa68293",
    kelas: "X",
    mapel: "Sejarah",
    judul: "Sejarah untuk SMK Kelas X",
    sampul:
      "https://static-sc.cloudapp.web.id/content/image/coverteks/coverkurikulum21/Sejarah-BS-KLS-X-Cover.png",
    sumber: "https://buku.kemendikdasmen.go.id/katalog/sejarah-untuk-smk-kelas-x",
    buku: "https://static-sc.cloudapp.web.id/content/pdf/bukuteks/kurikulum21/Sejarah-BS-KLS-X.pdf",
  },
  "20619505330586ce": {
    id: "20619505330586ce",
    kelas: "XI",
    mapel: "Sejarah",
    judul: "Sejarah untuk SMA Kelas XI",
    sampul:
      "https://static-sc.cloudapp.web.id/content/image/coverteks/coverkurikulum21/Sejarah-BS-KLS-XI-cover.png",
    sumber: "https://buku.kemendikdasmen.go.id/katalog/sejarah-untuk-smasmk-kelas-xi",
    buku: "https://static-sc.cloudapp.web.id/content/pdf/bukuteks/kurikulum21/Sejarah-BS-KLS-XI.pdf",
  },
  "19bc7ff32c5bf362": {
    id: "19bc7ff32c5bf362",
    kelas: "XII",
    mapel: "Sejarah",
    judul: "Sejarah untuk SMA/MA Kelas XII",
    sampul:
      "https://static-sc.cloudapp.web.id/content/image/coverteks/coverkurikulum21/Sejarah_BS_KLS_XII_Cover.png",
    sumber: "https://buku.kemendikdasmen.go.id/katalog/sejarah-untuk-smama-kelas-xii",
    buku: "https://static-sc.cloudapp.web.id/content/pdf/bukuteks/kurikulum21/Sejarah_BS_KLS_XII.pdf",
  },
  "88c7498a098055b2": {
    id: "88c7498a098055b2",
    kelas: "X",
    mapel: "Koding & AI",
    judul: "Koding dan Kecerdasan Artifisial untuk SMA/MA Kelas X",
    sampul:
      "https://static-sc.cloudapp.web.id/content/image/coverteks/coverkurikulum21/KKA_BS_KLS_10_Cover.PNG",
    sumber:
      "https://buku.kemendikdasmen.go.id/katalog/koding-dan-kecerdasan-artifisial-untuk-smama-kelas-x",
    buku: "https://static-sc.cloudapp.web.id/content/pdf/bukuteks/kurikulum21/KKA_BS_KLS_10.pdf",
  },
  "280c2b95746212a5": {
    id: "280c2b95746212a5",
    kelas: "XI",
    mapel: "Koding & AI",
    judul: "Koding dan Kecerdasan Artifisial untuk SMA/MA Kelas XI",
    sampul:
      "https://static-sc.cloudapp.web.id/content/image/coverteks/coverkurikulum21/KKA_BS_KLS_11_Cover.PNG",
    sumber:
      "https://buku.kemendikdasmen.go.id/katalog/koding-dan-kecerdasan-artifisial-untuk-smama-kelas-xi",
    buku: "https://static-sc.cloudapp.web.id/content/pdf/bukuteks/kurikulum21/KKA_BS_KLS_11.pdf",
  },
  ef66cd02f7e1e555: {
    id: "ef66cd02f7e1e555",
    kelas: "V",
    mapel: "Koding & AI",
    judul: "Koding dan Kecerdasan Artifisial untuk SD/MI Kelas V",
    sampul:
      "https://static-sc.cloudapp.web.id/content/image/coverteks/coverkurikulum21/KKA_BS_KLS_5_Cover.PNG",
    sumber:
      "https://buku.kemendikdasmen.go.id/katalog/koding-dan-kecerdasan-artifisial-untuk-sdmi-kelas-v",
    buku: "https://static-sc.cloudapp.web.id/content/pdf/bukuteks/kurikulum21/KKA_BS_KLS_5.pdf",
  },
  "2322f460134df286": {
    id: "2322f460134df286",
    kelas: "VII",
    mapel: "Koding & AI",
    judul: "Koding dan Kecerdasan Artifisial untuk SMP/MTs Kelas VII",
    sampul:
      "https://static-sc.cloudapp.web.id/content/image/coverteks/coverkurikulum21/KKA_BS_KLS_7_Cover_.PNG",
    sumber:
      "https://buku.kemendikdasmen.go.id/katalog/koding-dan-kecerdasan-artifisial-untuk-smpmts-kelas-vii",
    buku: "https://static-sc.cloudapp.web.id/content/pdf/bukuteks/kurikulum21/KKA_BS_KLS_7.pdf",
  },
  ea11a898f2a218c5: {
    id: "ea11a898f2a218c5",
    kelas: "X",
    mapel: "Pend. Pancasila",
    judul: "Pendidikan Pancasila untuk SMA/MA/SMK/MAK Kelas X",
    sampul:
      "https://static-sc.cloudapp.web.id/content/image/coverteks/coverkurikulum21/Pendidikan-Pancasila-BS-KLS-X-Cover.png",
    sumber:
      "https://buku.kemendikdasmen.go.id/katalog/pendidikan-pancasila-untuk-smamasmkmak-kelas-x",
    buku: "https://static-sc.cloudapp.web.id/content/pdf/bukuteks/kurikulum21/Pendidikan-Pancasila-BS-KLS-X.pdf",
  },
  "59563d3644aea24a": {
    id: "59563d3644aea24a",
    kelas: "XI",
    mapel: "Pend. Pancasila",
    judul: "Pendidikan Pancasila untuk SMA/MA/SMK/MAK Kelas XI",
    sampul:
      "https://static-sc.cloudapp.web.id/content/image/coverteks/coverkurikulum21/Pendidikan-Pancasila-BS-KLS-XI-Cover.png",
    sumber:
      "https://buku.kemendikdasmen.go.id/katalog/pendidikan-pancasila-untuk-smamasmkmak-kelas-xi",
    buku: "https://static-sc.cloudapp.web.id/content/pdf/bukuteks/kurikulum21/Pendidikan-Pancasila-BS-KLS-XI-Rev.pdf",
  },
  "0935800c3e7f2748": {
    id: "0935800c3e7f2748",
    kelas: "XII",
    mapel: "Pend. Pancasila",
    judul: "Pendidikan Pancasila untuk SMA/MA/SMK/MAK Kelas XII",
    sampul:
      "https://static-sc.cloudapp.web.id/content/image/coverteks/coverkurikulum21/Pendidikan-Pancasila-BS-KLS-XII-Cover.png",
    sumber:
      "https://buku.kemendikdasmen.go.id/katalog/pendidikan-pancasila-untuk-smamasmkmak-kelas-xii",
    buku: "https://static-sc.cloudapp.web.id/content/pdf/bukuteks/kurikulum21/Pendidikan-Pancasila-BS-KLS-XII.pdf",
  },
};

// ── Query Templates — detailed answers per-book ───────────────────────

const QUERY_TEMPLATES: QueryTemplate[] = [
  {
    id: "sejarah",
    label: "Booki, carikan aku buku sejarah dong!",
    answer:
      "Siap! Ini 3 buku Sejarah Kurikulum Merdeka yang pas banget buat kamu. Buku Kelas X membahas akar peradaban Nusantara — dari zaman praaksara, kerajaan Hindu-Buddha, hingga masuknya Islam di Indonesia, cocok sebagai fondasi berpikir historis. Buku Kelas XI mengajak kamu menyelami era kolonialisme Belanda, perlawanan rakyat, dan puncak Kebangkitan Nasional yang membakar semangat. Buku Kelas XII menutup perjalanan dengan membahas proklamasi kemerdekaan, perjuangan mempertahankan NKRI, era Orde Baru, hingga Reformasi 1998. Ketiganya disusun dengan pendekatan naratif dan sumber primer sehingga sejarah terasa nyata, bukan sekadar hafalan!",
    bookIds: ["bcbd6d670aa68293", "20619505330586ce", "19bc7ff32c5bf362"],
  },
  {
    id: "koding-ai",
    label: "rekomendasikan aku buku dasar pemrograman dan teknologi AI untuk pemula",
    answer:
      "Mantap, mau jadi programmer masa depan! Booki nemuin 4 buku unggulan dari berbagai jenjang. Buku SD Kelas V memperkenalkan logika koding lewat blok visual Scratch — seru dan sangat ramah anak. Buku SMP Kelas VII melanjutkan dengan algoritma dasar dan Python sederhana, lengkap dengan proyek mini yang langsung bisa dijalankan. Buku SMA Kelas X mulai menyelami konsep kecerdasan buatan, machine learning, dan pemrosesan data dengan contoh kasus nyata di sekitar kita. Buku SMA Kelas XI membawa lebih dalam ke pengembangan aplikasi AI, deep learning, dan otomatisasi dunia kerja. Semua buku ini sarat ilustrasi menarik dan aktivitas praktek — dijamin bikin kamu langsung ketagihan coding!",
    bookIds: [
      "88c7498a098055b2",
      "280c2b95746212a5",
      "ef66cd02f7e1e555",
      "2322f460134df286",
    ],
  },
  {
    id: "pancasila",
    label: "Booki, carikan buku SMA tentang kebinekaan dan budaya taat hukum yang menarik",
    answer:
      "Pilihan yang sangat relevan! Ini 3 buku Pendidikan Pancasila SMA dari Kurikulum Merdeka yang Booki rekomendasikan. Buku Kelas X mengenalkan nilai-nilai Pancasila dalam kehidupan sehari-hari lewat studi kasus nyata, komik, dan infografik kece — cocok untuk membangun fondasi kewarganegaraan yang kuat. Buku Kelas XI mengupas isu demokrasi, Hak Asasi Manusia, dan tanggung jawab warga negara di era digital, dilengkapi kegiatan diskusi dan debat yang mengasah berpikir kritis. Buku Kelas XII membahas tantangan kebinekaan di tengah arus globalisasi, pentingnya supremasi hukum, dan peran generasi muda sebagai penjaga konstitusi. Ketiga buku ini dikemas interaktif dan terbukti membuat belajar Pancasila jauh lebih menyenangkan!",
    bookIds: ["ea11a898f2a218c5", "59563d3644aea24a", "0935800c3e7f2748"],
  },
];

const TYPEWRITER_SPEED_MS = 16;

// ── SkeletonCard ──────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div
    className="rounded-2xl overflow-hidden border border-white/10 animate-pulse flex flex-col shrink-0"
    style={{
      width: `${CARD_WIDTH}px`,
      background: GLASS_BG,
      minHeight: "100%",
    }}
  >
    <div className="flex-1 bg-white/10" style={{ minHeight: "130px" }} />
    <div className="p-2.5 space-y-2 shrink-0">
      <div className="flex gap-1">
        <div className="h-4 bg-white/10 rounded-full w-12" />
        <div className="h-4 bg-white/10 rounded-full w-16" />
      </div>
      <div className="h-3.5 bg-white/10 rounded-full w-full" />
      <div className="h-3.5 bg-white/10 rounded-full w-3/4" />
      <div className="flex gap-1 pt-0.5">
        <div className="h-5 bg-white/10 rounded-md flex-1" />
        <div className="h-5 bg-white/10 rounded-md flex-1" />
      </div>
    </div>
  </div>
);

// ── BookCard ──────────────────────────────────────────────────────────

interface BookCardProps {
  book: SandboxBook;
  onActionClick: () => void;
  visible: boolean;
  index: number;
}

const BookCard = ({ book, onActionClick, visible, index }: BookCardProps) => (
  <div
    className="rounded-2xl overflow-hidden border border-black/10 group hover:border-black/20 transition-all duration-500 flex flex-col shrink-0"
    style={{
      width: `${CARD_WIDTH}px`,
      minHeight: "100%",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(10px)",
      transition: `opacity 0.4s ease ${index * 80}ms, transform 0.4s ease ${index * 80}ms, border-color 0.3s`,
      background: GLASS_BG,
      backdropFilter: GLASS_BLUR,
      WebkitBackdropFilter: GLASS_BLUR,
    }}
  >
    {/* Cover image — grows to fill remaining space */}
    <div
      className="relative flex-1 overflow-hidden shrink-0"
      style={{
        minHeight: "130px",
        background: "rgba(0,0,0,0.04)",
      }}
    >
      <Image
        src={book.sampul}
        alt={`Sampul ${book.judul}`}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        style={{ objectPosition: "top" }}
        unoptimized
      />
    </div>

    {/* Info section */}
    <div className="p-2.5 flex flex-col gap-1.5 shrink-0">
      {/* Kelas + Mapel chips */}
      <div className="flex items-center gap-1 flex-wrap">
        <span
          className="px-1.5 py-0.5 rounded-full text-[9px] font-bold leading-tight"
          style={{
            background: `${ACCENT_BLUE}22`,
            color: ACCENT_BLUE,
            border: `1px solid ${ACCENT_BLUE}44`,
          }}
        >
          Kelas {book.kelas}
        </span>
        <span
          className="px-1.5 py-0.5 rounded-full text-[9px] font-medium leading-tight"
          style={{
            background: "rgba(0,0,0,0.05)",
            color: "rgba(0,0,0,0.55)",
            border: `1px solid rgba(0,0,0,0.12)`,
          }}
        >
          {book.mapel}
        </span>
      </div>

      {/* Title */}
      <h4 className="text-xs font-bold text-black leading-snug line-clamp-3">
        {book.judul}
      </h4>

      {/* Action buttons */}
      <div className="flex gap-1 pt-0.5">
        <button
          type="button"
          id={`btn-read-pdf-${book.id}`}
          onClick={onActionClick}
          className="flex-1 flex items-center justify-center rounded-md font-bold text-white transition-all duration-200 hover:brightness-110"
          style={{
            background: `linear-gradient(135deg, ${ACCENT_BLUE} 0%, #0780c7 100%)`,
            height: "18px",
            fontSize: "7px",
            letterSpacing: "0.04em",
          }}
        >
          PDF
        </button>
        <button
          type="button"
          id={`btn-catalog-${book.id}`}
          onClick={onActionClick}
          className="flex-1 flex items-center justify-center rounded-md font-semibold transition-all duration-200"
          style={{
            color: "rgba(0,0,0,0.60)",
            background: "rgba(0,0,0,0.06)",
            border: `1px solid rgba(0,0,0,0.12)`,
            height: "18px",
            fontSize: "7px",
            letterSpacing: "0.04em",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.14)";
            (e.currentTarget as HTMLButtonElement).style.color = "#0780c7";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.06)";
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(0, 0, 0, 0.60)";
          }}
        >
          Katalog
        </button>
      </div>
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────

export const BookiTeaserSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const titleShapeRef = useRef<HTMLDivElement>(null);
  const titleIconRef = useRef<HTMLDivElement>(null);
  const descCardRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [activeQueryId, setActiveQueryId] = useState<string | null>(null);
  const [sectionState, setSectionState] = useState<SectionState>("idle");
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const typewriterRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeTemplate = QUERY_TEMPLATES.find((q) => q.id === activeQueryId);
  const activeBooks: SandboxBook[] = activeTemplate
    ? activeTemplate.bookIds.map((id) => BOOK_DATA[id]).filter(Boolean)
    : [];

  const startTypewriter = useCallback((fullText: string) => {
    if (typewriterRef.current) clearInterval(typewriterRef.current);
    setDisplayedText("");
    setSectionState("typing");
    let charIndex = 0;
    typewriterRef.current = setInterval(() => {
      charIndex++;
      setDisplayedText(fullText.slice(0, charIndex));
      if (charIndex >= fullText.length) {
        if (typewriterRef.current) clearInterval(typewriterRef.current);
        setSectionState("revealing");
        setTimeout(() => setSectionState("done"), 300);
      }
    }, TYPEWRITER_SPEED_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (typewriterRef.current) clearInterval(typewriterRef.current);
    };
  }, []);

  const handleQueryClick = useCallback(
    (queryId: string) => {
      if (sectionState === "typing" && typewriterRef.current) {
        clearInterval(typewriterRef.current);
      }
      const template = QUERY_TEMPLATES.find((q) => q.id === queryId);
      if (!template) return;
      setActiveQueryId(queryId);
      setDisplayedText("");
      setSectionState("idle");
      requestAnimationFrame(() => startTypewriter(template.answer));
    },
    [sectionState, startTypewriter]
  );

  // ── GSAP Animations ───────────────────────────────────────────────
  useGSAP(
    () => {
      if (!sectionRef.current) return;

      // immediateRender: false is CRITICAL — without it, gsap.from() sets
      // the "from" state (opacity:0) the instant the hook runs, hiding
      // elements before the ScrollTrigger ever fires.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // 1. Title icon drops in from above with bounce
      if (titleIconRef.current) {
        tl.from(
          titleIconRef.current,
          {
            y: -48,
            opacity: 0,
            scale: 0.7,
            duration: 0.65,
            ease: "back.out(1.8)",
            immediateRender: false,
          },
          0
        );
      }

      // 2. Title shape slides in from left with a slight rotation
      if (titleShapeRef.current) {
        tl.from(
          titleShapeRef.current,
          {
            x: -56,
            opacity: 0,
            rotation: -4,
            duration: 0.6,
            ease: "power3.out",
            immediateRender: false,
          },
          0.1
        );
      }

      // 3. Description card fades up
      if (descCardRef.current) {
        tl.from(
          descCardRef.current,
          {
            y: 36,
            opacity: 0,
            duration: 0.65,
            ease: "power3.out",
            immediateRender: false,
          },
          0.28
        );
      }

      // 4. Query pills container slides in as a unit — avoids querySelectorAll
      //    which can return stale/empty NodeLists during React renders.
      if (pillsRef.current) {
        tl.from(
          pillsRef.current,
          {
            x: -30,
            opacity: 0,
            duration: 0.55,
            ease: "power2.out",
            immediateRender: false,
          },
          0.42
        );
      }

      // 5. CTA slides up
      if (ctaRef.current) {
        tl.from(
          ctaRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
            immediateRender: false,
          },
          0.62
        );
      }

      // 6. Right panel scales + fades in
      if (rightPanelRef.current) {
        tl.from(
          rightPanelRef.current,
          {
            scale: 0.93,
            x: 40,
            opacity: 0,
            duration: 0.75,
            ease: "power3.out",
            immediateRender: false,
          },
          0.18
        );
      }

      // ── Continuous floating animation on the title icon ────────────
      // Runs independently of the scroll timeline.
      if (titleIconRef.current) {
        gsap.to(titleIconRef.current, {
          y: -8,
          duration: 2.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 1.5,
        });
      }

      // ── Subtle parallax on section background ─────────────────────
      gsap.to(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
        backgroundPositionY: "30%",
        ease: "none",
      });
    },
    { scope: sectionRef }
  );

  const isActive =
    sectionState === "typing" ||
    sectionState === "revealing" ||
    sectionState === "done";

  // ── Render ─────────────────────────────────────────────────────────

  return (
    <>
      {/* Modal */}
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={null}
        centered
        size="md"
        radius="xl"
        overlayProps={{ blur: 4, backgroundOpacity: 0.6 }}
        styles={{
          content: {
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
            border: "1px solid rgba(233,85,155,0.3)",
          },
          body: { padding: "2rem" },
        }}
      >
        <div className="text-center space-y-5">
          <div
            className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: `${ACCENT_PINK}22`,
              border: `1px solid ${ACCENT_PINK}44`,
            }}
          >
            <Lock size={28} style={{ color: ACCENT_PINK }} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Ups, Fitur Ini Dikunci!</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Kamu bisa langsung membaca seluruh koleksi buku PDF ini secara interaktif
              setelah bergabung bersama komunitas pintar kami.{" "}
              <span style={{ color: ACCENT_PINK }} className="font-semibold">
                Gratis kok!
              </span>
            </p>
          </div>
          <div className="space-y-3">
            <Link
              href="/login"
              onClick={() => setIsModalOpen(false)}
              id="modal-cta-register"
              className="flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-300 min-h-[48px]"
              style={{
                background: `linear-gradient(135deg, ${ACCENT_PINK}, #c7417f)`,
                boxShadow: "0 4px 20px rgba(233,85,155,0.4)",
              }}
            >
              <Rocket size={16} />
              Daftar Akun Gratis Sekarang
            </Link>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="w-full px-6 py-2.5 rounded-xl text-sm text-gray-400 hover:text-gray-200 transition-colors duration-200"
            >
              Nanti saja
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Section ── */}
      <section
        ref={sectionRef}
        id="booki-sandbox-section"
        aria-label="Booki AI Book Recommendation Sandbox"
        className="relative w-full overflow-hidden"
        style={{
          backgroundColor: "#0d0d1a",
          backgroundImage: "url('/images/booki_section.webp')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* Ambient glow blobs */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "10%",
            left: "5%",
            width: "340px",
            height: "340px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${ACCENT_PINK}18 0%, transparent 70%)`,
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "15%",
            right: "8%",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${ACCENT_CTA}14 0%, transparent 70%)`,
            filter: "blur(40px)",
          }}
        />



        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 xl:py-36">
          {/*
            Golden-ratio two-column layout:
            Left  ≈ 38.2%  (the narrative / controls side)
            Right ≈ 61.8%  (the interactive demo panel)
          */}
          <div className="flex flex-col lg:flex-row gap-12 xl:gap-16 lg:items-start">

            {/* ══════════════════════════════════════════
                LEFT PANEL  (golden-ratio narrow side)
                ≈ 38% on lg+
            ══════════════════════════════════════════ */}
            <div
              ref={leftPanelRef}
              className="lg:w-[38%] xl:w-[37%] flex flex-col gap-7 lg:gap-8"
            >

              {/* ── Title block:
                  Icon sits to the LEFT of the text "Booki".
                  The icon is half-outside the shape on the left,
                  and rendered on top (z-20 > shape z-10).
                  Shape width = content-fit around the text.
              ── */}
              <div
                className="flex items-center"
                style={{ paddingLeft: "44px" }} // reserve space for the half-overflowing icon
              >
                {/*
                  Outer wrapper: relative so the icon can be absolutely
                  positioned to straddle the left edge of the shape.
                */}
                <div className="relative inline-flex items-center">

                  {/* Icon — absolutely positioned, left side,
                      centered vertically, half overflows left */}
                  <div
                    ref={titleIconRef}
                    className="absolute z-20"
                    style={{
                      left: "-44px",        // half of icon width (88px icon → 44px)
                      top: "50%",
                      transform: "translateY(-50%)",
                      filter: `drop-shadow(0 6px 24px ${ACCENT_PINK}bb) drop-shadow(0 2px 8px rgba(0,0,0,0.5))`,
                    }}
                  >
                    <Image
                      src="/images/booki_icon.webp"
                      alt="Booki mascot"
                      width={88}
                      height={88}
                      className="w-[88px] h-[88px] object-contain"
                      unoptimized
                      priority
                    />
                  </div>

                  {/* Shape — fits tightly around the "Booki" text.
                      z-10 so the icon (z-20) renders on top.
                      paddingLeft leaves room for the overlapping icon half. */}
                  <div
                    ref={titleShapeRef}
                    className="relative z-10 rounded-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${ACCENT_PINK} 0%, #c7417f 100%)`,
                      boxShadow: `0 8px 32px ${ACCENT_PINK}55, inset 0 1px 0 rgba(255,255,255,0.2)`,
                      paddingTop: "10px",
                      paddingBottom: "10px",
                      paddingLeft: "52px",  // breathing room after icon overlap
                      paddingRight: "20px",
                    }}
                  >
                    <h2 className="text-white text-4xl lg:text-5xl font-black leading-none tracking-tight whitespace-nowrap">
                      Booki
                    </h2>
                    {/* Sparkle badge */}
                    <span
                      className="absolute -top-2 -right-2 text-lg select-none"
                      style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))" }}
                    >
                      ✨
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Description — glass card ── */}
              <div
                ref={descCardRef}
                className="rounded-2xl p-6 space-y-5"
                style={{
                  background: GLASS_BG,
                  backdropFilter: GLASS_BLUR,
                  WebkitBackdropFilter: GLASS_BLUR,
                  border: `1px solid ${GLASS_BORDER}`,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
                }}
              >
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                  Temukan buku yang{" "}
                  <span style={{ color: ACCENT_PINK }}>tepat untukmu</span>
                  {" "}dengan kecerdasan AI
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Booki adalah asisten AI berbasis{" "}
                  <strong className="text-gray-900">RAG (Retrieval-Augmented Generation)</strong>{" "}
                  yang membantu siswa, orang tua, dan guru menemukan buku belajar terbaik dari
                  koleksi Rumah Literasi Tambaksogra. Cukup tanya seperti bicara ke teman!
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Ribuan Buku", color: "#374151", bg: "rgba(0,0,0,0.06)", border: "rgba(0,0,0,0.12)" },
                    { label: "SD – SMA", color: "#b45309", bg: "#FBAD1A1a", border: "#FBAD1A55" },
                    { label: "Instan & Akurat", color: "#be185d", bg: `${ACCENT_PINK}18`, border: `${ACCENT_PINK}44` },
                    { label: "Gratis", color: "#15803d", bg: "#22c55e1a", border: "#22c55e44" },
                  ].map(({ label, color, bg, border }) => (
                    <span
                      key={label}
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ background: bg, color, border: `1px solid ${border}` }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* ── Query pills ── */}
              <div ref={pillsRef} className="space-y-4">
                <p
                  className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2"
                  style={{ color: "rgba(0,0,0,0.45)" }}
                >
                  <Sparkles size={11} style={{ color: ACCENT_PINK }} />
                  Coba tanya Booki sekarang
                </p>

                <div className="flex flex-col gap-2">
                  {QUERY_TEMPLATES.map((template) => {
                    const pillActive = activeQueryId === template.id;
                    const pillLoading =
                      pillActive &&
                      (sectionState === "typing" || sectionState === "revealing");
                    return (
                      <button
                        key={template.id}
                        id={`query-pill-${template.id}`}
                        type="button"
                        onClick={() => handleQueryClick(template.id)}
                        disabled={sectionState === "typing"}
                        className="relative w-full text-left px-4 py-3 rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
                        style={{
                          background: pillActive
                            ? `linear-gradient(135deg, ${ACCENT_PINK}2e, #c7417f1a)`
                            : GLASS_BG,
                          border: `1.5px solid ${pillActive ? `${ACCENT_PINK}80` : GLASS_BORDER}`,
                          backdropFilter: GLASS_BLUR,
                          WebkitBackdropFilter: GLASS_BLUR,
                          boxShadow: pillActive
                            ? `0 4px 20px ${ACCENT_PINK}22`
                            : "0 2px 6px rgba(0,0,0,0.07)",
                        }}
                      >
                        <span className="flex items-center gap-2.5 pr-8">
                          <span
                            className="text-sm font-semibold leading-snug"
                            style={{ color: "#111827" }}
                          >
                            {template.label}
                          </span>
                        </span>
                        {pillActive && (
                          <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                            {pillLoading ? (
                              <span className="flex gap-0.5">
                                {[0, 1, 2].map((i) => (
                                  <span
                                    key={i}
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{
                                      background: ACCENT_PINK,
                                      animation: `pulseSoft 1s ease-in-out ${i * 0.2}s infinite`,
                                    }}
                                  />
                                ))}
                              </span>
                            ) : (
                              <ChevronRight size={15} style={{ color: ACCENT_PINK }} />
                            )}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── CTA — "Jelajahi Booki Selengkapnya" ── */}
              <div ref={ctaRef}>
                <Link
                  href="/booki"
                  id="booki-teaser-explore-link"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 min-h-[48px] hover:brightness-110 hover:scale-[1.03] active:scale-[0.97]"
                  style={{
                    background: `linear-gradient(135deg, ${ACCENT_CTA} 0%, #0e8fd4 100%)`,
                    color: "#ffffff",
                    boxShadow: `0 4px 20px ${ACCENT_CTA}55`,
                    border: `1.5px solid ${ACCENT_CTA}88`,
                  }}
                >
                  Jelajahi Booki Selengkapnya
                  <ChevronRight size={15} />
                </Link>
              </div>
            </div>

            {/* ══════════════════════════════════════════
                RIGHT PANEL  (golden-ratio wide side)
                ≈ 62% on lg+ — fixed-height, zero layout shift
            ══════════════════════════════════════════ */}
            <div
              ref={rightPanelRef}
              className="lg:flex-1 w-full flex flex-col"
            >
              <div
                className="rounded-3xl border flex flex-col flex-1 py-2"
                style={{
                  background: GLASS_BG,
                  backdropFilter: GLASS_BLUR,
                  WebkitBackdropFilter: GLASS_BLUR,
                  border: `1px solid ${GLASS_BORDER}`,
                  boxShadow:
                    "0 8px 40px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.5)",
                  minHeight: `600px`,
                }}
              >
                {/* ── Chat Header ── */}
                <div
                  className="rounded-xl flex items-center justify-between px-5 py-4 shrink-0"
                  style={{
                    borderBottom: `1px solid ${GLASS_BORDER}`,
                    background: "rgba(255,255,255,0.30)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${ACCENT_PINK}55, ${ACCENT_PINK}33)`,
                        border: `1px solid ${ACCENT_PINK}44`,
                      }}
                    >
                      <Image
                        src="/images/booki_icon.webp"
                        alt="Booki"
                        width={26}
                        height={26}
                        className="w-[22px] h-[22px] object-contain"
                        unoptimized
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 leading-tight">Booki</p>
                      <p
                        className="text-[10px] leading-tight"
                        style={{ color: "rgba(0,0,0,0.45)" }}
                      >
                        Asisten Rekomendasi Buku · AI
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0"
                    style={{
                      background: "rgba(74,222,128,0.1)",
                      border: "1px solid rgba(74,222,128,0.25)",
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-green-600"
                      style={{ animation: "pulseSoft 2s ease-in-out infinite" }}
                    />
                    <span className="text-[10px] font-semibold text-green-600">Online</span>
                  </div>
                </div>

                {/* ── Chat Body — proportional 45:55 split (messages:cards) ── */}
                <div className="flex flex-col flex-1 min-h-0 p-4 sm:p-5">

                  {/* ZONE 1 — Messages — 45% of body height */}
                  <div
                    className="overflow-y-auto"
                    style={{
                      flex: "45 1 0%",
                      minHeight: 0,
                      scrollbarWidth: "thin",
                      scrollbarColor: `${ACCENT_PINK}44 transparent`,
                    }}
                  >
                    {/* Idle state */}
                    {!isActive && (
                      <div className="flex flex-col items-center justify-center h-full text-center gap-3 pt-20">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center animate-float"
                          style={{
                            background: `linear-gradient(135deg, ${ACCENT_PINK}55, ${ACCENT_PINK}33)`,
                            border: `1.5px solid ${ACCENT_PINK}88`,
                          }}
                        >
                          <Image
                            src="/images/booki_icon.webp"
                            alt="Booki"
                            width={40}
                            height={40}
                            className="w-10 h-10 object-contain"
                            unoptimized
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-900 font-bold text-base">Hai! Aku Booki</p>
                          <p
                            className="text-xs leading-relaxed max-w-[220px] mx-auto"
                            style={{ color: "rgba(0,0,0,0.55)" }}
                          >
                            Pilih pertanyaan di sebelah kiri, aku akan rekomendasikan
                            buku terbaik untukmu!
                          </p>
                        </div>
                        <div className="flex gap-1.5">
                          {[0, 1, 2].map((i) => (
                            <span
                              key={i}
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                background: ACCENT_PINK,
                                opacity: 0.5,
                                animation: `pulseSoft 1.4s ease-in-out ${i * 0.25}s infinite`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Active conversation */}
                    {isActive && activeTemplate && (
                      <div className="flex flex-col gap-2.5 py-0.5">
                        {/* User bubble */}
                        <div className="flex justify-end">
                          <div
                            className="max-w-[85%] px-3.5 py-2 rounded-2xl rounded-tr-sm text-sm text-white font-medium"
                            style={{
                              background: `linear-gradient(135deg, ${ACCENT_PINK}55, #c7417f44)`,
                              border: `1px solid ${ACCENT_PINK}44`,
                            }}
                          >
                            {activeTemplate.label}
                          </div>
                        </div>

                        {/* Bot bubble */}
                        <div className="flex items-start gap-2.5">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                            style={{
                              background: `${ACCENT_PINK}22`,
                              border: `1px solid ${ACCENT_PINK}44`,
                            }}
                          >
                            <Image
                              src="/images/booki_icon.webp"
                              alt="Booki"
                              width={20}
                              height={20}
                              className="w-[18px] h-[18px] object-contain"
                              unoptimized
                            />
                          </div>
                          <div
                            className="flex-1 px-3.5 py-2.5 rounded-2xl rounded-tl-sm text-sm text-gray-800 leading-relaxed"
                            style={{
                              background: "rgba(255,255,255,0.55)",
                              border: `1px solid rgba(0,0,0,0.08)`,
                            }}
                          >
                            {displayedText}
                            {sectionState === "typing" && (
                              <span
                                className="inline-block w-0.5 h-4 ml-0.5 align-middle"
                                style={{
                                  background: ACCENT_PINK,
                                  animation: "pulseSoft 0.8s ease-in-out infinite",
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Separator */}
                  <div
                    style={{
                      flexShrink: 0,
                      height: "1px",
                      margin: "8px 0",
                      background: GLASS_BORDER,
                    }}
                  />

                  {/* ZONE 2 — Book cards — 55% of body height */}
                  <div
                    className="flex flex-col"
                    style={{ flex: "55 1 0%", minHeight: 0 }}
                  >
                    {/* Label */}
                    <p
                      className="text-[10px] font-bold uppercase tracking-widest mb-2 shrink-0 flex items-center gap-1.5"
                      style={{
                        color: isActive
                          ? "rgba(0,0,0,0.50)"
                          : "rgba(0,0,0,0.25)",
                      }}
                    >
                      <Zap size={9} style={{ color: isActive ? ACCENT_BLUE : "rgba(0,0,0,0.20)" }} />
                      Rekomendasi Buku
                    </p>

                    {/* Card row — horizontal scroll */}
                    <div
                      className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden"
                      style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: `${ACCENT_BLUE}55 transparent`,
                      }}
                    >
                      <div className="flex flex-row gap-3 h-full pb-1">

                        {/* Idle placeholder slots */}
                        {!isActive &&
                          [0, 1, 2].map((i) => (
                            <div
                              key={`placeholder-${i}`}
                              className="rounded-2xl shrink-0 flex flex-col items-center justify-center"
                              style={{
                                width: `${CARD_WIDTH}px`,
                                minHeight: "100%",
                                background: "rgba(0,0,0,0.04)",
                                border: "1px dashed rgba(0,0,0,0.15)",
                              }}
                            >
                              <BookMarked
                                size={21}
                                style={{ color: "rgba(0,0,0,0.20)" }}
                              />
                            </div>
                          ))}

                        {/* Skeletons while typing/revealing */}
                        {(sectionState === "typing" || sectionState === "revealing") &&
                          activeTemplate &&
                          activeTemplate.bookIds.map((id) => (
                            <SkeletonCard key={`skel-${id}`} />
                          ))}

                        {/* Real cards when done */}
                        {sectionState === "done" &&
                          activeBooks.map((book, i) => (
                            <BookCard
                              key={book.id}
                              book={book}
                              onActionClick={() => setIsModalOpen(true)}
                              visible={sectionState === "done"}
                              index={i}
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};
