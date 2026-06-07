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
              </li>
            </ul>
          </div>

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
          </div>
        </div>
      </div>
    </footer>
  );
}
