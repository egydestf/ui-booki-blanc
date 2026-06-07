<<<<<<< HEAD
"use client";

// src/components/layout/Footer.tsx
// Footer with cream background (#F8F1E9).
// Nav links use client-side smooth scroll to home page sections.

import { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { MapPin, Phone, Mail, Globe } from "lucide-react";

// ──────────────────────────────────────────────────────────────────────
// Footer nav links — maps to section IDs on the home page
// ──────────────────────────────────────────────────────────────────────
interface FooterNavLink {
  sectionId: string;
  label: string;
  href?: string; // optional override for external/full-page links
}

const FOOTER_NAV: FooterNavLink[] = [
  { sectionId: "hero-section", label: "Beranda" },
  { sectionId: "programs-section", label: "Program" },
  { sectionId: "profile-section", label: "Tentang" },
  { sectionId: "booki-sandbox-section", label: "Booki" },
  { sectionId: "documentation-section", label: "Blog" },
  { sectionId: "donation-section", label: "Donasi" },
];

// ──────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────
export function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  /**
   * Smooth-scroll to a section on the home page.
   * Same logic as Navbar: direct scroll if on "/", navigate-then-scroll otherwise.
   */
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
      e.preventDefault();

      const scrollToSection = () => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };

      if (pathname === "/") {
        scrollToSection();
      } else {
        router.push("/");
        setTimeout(scrollToSection, 600);
      }
    },
    [pathname, router]
  );

  return (
    <footer
      id="footer"
      className="py-16 lg:py-20 border-t border-[#e0d4c4]"
      style={{
        backgroundImage: "url('/images/noodle.webp')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
      aria-label="Footer Rumah Literasi Tambaksogra"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* ── Column 1: Logo & Description ── */}
          <div className="space-y-6">
            <Link
              href="/"
              onClick={(e) => handleNavClick(e, "hero-section")}
              className="flex items-center gap-3 cursor-pointer"
            >
              <Image
                src="/logo.webp"
                alt="Logo Rumah Literasi Tambaksogra"
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
                unoptimized
              />
              <span className="text-xl tracking-tight font-black leading-tight text-gray-900">
                Rumah Literasi <br /> Tambaksogra
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-600 max-w-xs">
              Wadah kolaborasi untuk meningkatkan literasi dan kualitas
              pendidikan anak-anak di lingkungan Tambaksogra.
            </p>
          </div>

          {/* ── Column 2: Contact Info ── */}
          <div className="space-y-6">
            <h4 className="text-gray-900 font-bold text-xl">Hubungi Kami</h4>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <span>
                  Jl. Sunan Ampel Desa Tambaksogra RT 3 RW 1 Kec. Sumbang,
                  Kab. Banyumas, Jawa Tengah
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-orange" />
                <span>0812-XXXX-XXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-orange" />
                <span>kontak@tambaksogra.org</span>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-brand-orange" />
                <span>www.tambaksogra.org</span>
=======
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Globe } from "lucide-react";

const footerLinks = [
  { label: "Beranda", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Program", href: "/programs" },
  { label: "Tentang", href: "/about" },
  { label: "Coba Booki", href: "/booki", isSpecial: true },
  { label: "Donasi", href: "/donation" },
];

export function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-200/80 pt-20 pb-10 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8 mb-16">
          {/* Column 1: Institutional Branding */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Rumah Literasi Desa Tambaksogra Logo"
                width={160}
                height={48}
                className="h-10 w-auto object-contain brightness-0 invert opacity-90"
              />
            </Link>
            <p className="text-sm leading-relaxed text-emerald-100/70 max-w-sm">
              Membangun budaya literasi dan menyediakan akses pengetahuan bagi masyarakat Desa Tambaksogra. Bersama kita wujudkan generasi cerdas dan berkarakter melalui membaca.
            </p>
          </div>

          {/* Column 2: Hubungi Kami */}
          <div className="flex flex-col gap-6">
            <h3 className="text-lg font-semibold text-emerald-50">Hubungi Kami</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3 text-sm transition-colors hover:text-amber-400">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                <span>Jl. Raya Tambaksogra, Kecamatan Sumbang, Kabupaten Banyumas, Jawa Tengah 53183</span>
              </li>
              <li className="flex items-center gap-3 text-sm transition-colors hover:text-amber-400">
                <Phone className="w-5 h-5 shrink-0" />
                <a href="tel:+6281234567890">+62 812-3456-7890</a>
              </li>
              <li className="flex items-center gap-3 text-sm transition-colors hover:text-amber-400">
                <Mail className="w-5 h-5 shrink-0" />
                <a href="mailto:info@rumahliterasitambaksogra.org">info@rumahliterasitambaksogra.org</a>
              </li>
              <li className="flex items-center gap-3 text-sm transition-colors hover:text-amber-400">
                <Globe className="w-5 h-5 shrink-0" />
                <a href="https://rumahliterasitambaksogra.org" target="_blank" rel="noopener noreferrer">rumahliterasitambaksogra.org</a>
>>>>>>> bb032ecad45fe6ebea2effbd747e7b735ad502dd
              </li>
            </ul>
          </div>

<<<<<<< HEAD
          {/* ── Column 3: Tentang Kami Navigation ── */}
          <div>
            <h4 className="text-gray-900 font-bold text-xl mb-6">
              Tentang Kami
            </h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              {FOOTER_NAV.map((link) => (
                <li key={link.sectionId}>
                  <a
                    href={link.href ?? `/#${link.sectionId}`}
                    onClick={(e) => handleNavClick(e, link.sectionId)}
                    className="text-gray-600 hover:text-brand-blue transition-colors cursor-pointer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Divider & Copyright ── */}
        <div className="mt-16 pt-8 border-t border-[#d8ccbc] flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-500">
          <p>© 2026 Rumah Literasi Tambaksogra. Hak Cipta Dilindungi.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-brand-blue transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="#" className="hover:text-brand-blue transition-colors">
              Syarat &amp; Ketentuan
            </Link>
=======
          {/* Column 3: Tentang Kami & Profil */}
          <div className="flex flex-col gap-6">
            <h3 className="text-lg font-semibold text-emerald-50">Navigasi Utama</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors hover:text-amber-400 ${
                    link.isSpecial ? "text-brand-blue font-medium hover:text-brand-blue/80" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-emerald-900/50">
              <h4 className="text-sm font-medium text-emerald-50 mb-3">Profil Lembaga</h4>
              <ul className="flex flex-col gap-2 text-sm">
                <li>
                  <Link href="/about" className="transition-colors hover:text-amber-400">Sejarah & Visi Misi</Link>
                </li>
                <li>
                  <Link href="/about" className="transition-colors hover:text-amber-400">Struktur Organisasi</Link>
                </li>
                <li>
                  <Link href="/programs" className="transition-colors hover:text-amber-400">Laporan Kegiatan</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-emerald-900 text-sm text-emerald-200/50">
          <p>&copy; 2026 Rumah Literasi Desa Tambaksogra. Hak Cipta Dilindungi.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-amber-400 transition-colors">Kebijakan Privasi</Link>
            <Link href="/terms" className="hover:text-amber-400 transition-colors">Syarat & Ketentuan</Link>
>>>>>>> bb032ecad45fe6ebea2effbd747e7b735ad502dd
          </div>
        </div>
      </div>
    </footer>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> bb032ecad45fe6ebea2effbd747e7b735ad502dd
