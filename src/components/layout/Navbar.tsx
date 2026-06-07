"use client";

<<<<<<< HEAD
// src/components/layout/Navbar.tsx
// Full-viewport-width transparent header that floats over the hero.
// Scroll-aware: transparent initially → solid on scroll.
// Mobile hamburger drawer for < lg breakpoints.
// Nav links use client-side smooth scroll to home page sections.

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Menu as MenuIcon, X, Sparkles, LogOut, LayoutDashboard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Avatar, Menu as MantineMenu, Loader } from "@mantine/core";
import type { User } from "@supabase/supabase-js";
import type { UserRole } from "@/types";

interface UserProfile {
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole | null;
}

// ──────────────────────────────────────────────────────────────────────
// Navigation link definitions — each maps to a section ID on the home page
// ──────────────────────────────────────────────────────────────────────
interface NavLink {
  sectionId: string; // id of the <section> element on the home page
  label: string;
  href?: string;     // optional: override to a full page path (e.g., /blog)
}

const NAV_LINKS: NavLink[] = [
  { sectionId: "hero-section",          label: "Beranda" },
  { sectionId: "profile-section",       label: "Tentang" },
  { sectionId: "booki-sandbox-section", label: "Booki" },
  { sectionId: "programs-section",      label: "Program" },
  { sectionId: "documentation-section", label: "Blog" },
  { sectionId: "donation-section",      label: "Donasi" },
];

// ──────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────
export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled]     = useState<boolean>(false);
  const router   = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  // Authentication & Profile state
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, full_name, avatar_url, role")
        .eq("id", userId)
        .single();
      if (!error && data) {
        setProfile({
          username: data.username,
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          role: data.role as UserRole | null,
        });
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  }, [supabase]);

  // Auth listener
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error("Error getting session:", err);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  /**
   * Smooth-scroll to a section on the home page.
   * - If already on "/", directly scrollIntoView.
   * - If on another page, navigate to "/" first, then scroll after load.
   */
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
      e.preventDefault();
      closeMenu();

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
    [pathname, router, closeMenu]
  );

  return (
    <header
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 bg-white ${
        scrolled
          ? "shadow-md border-b border-gray-100/80"
          : "border-b border-gray-100/50"
      }`}
    >
      <nav className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* ── Logo ── */}
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, "hero-section")}
            className="flex items-center gap-2.5 shrink-0"
            aria-label="Rumah Literasi Tambaksogra — Beranda"
          >
            <Image
              src="/logo.webp"
              alt="Logo Rumah Literasi Tambaksogra"
              width={40}
              height={40}
              className="w-9 h-9 lg:w-10 lg:h-10 object-contain"
              unoptimized
            />
            <div className="hidden sm:block leading-tight">
              <span className="text-base lg:text-lg font-extrabold tracking-tight block text-gray-900">
                Rumah Literasi
              </span>
              <span className="text-[10px] lg:text-xs font-semibold text-brand-blue tracking-wide uppercase">
                Tambaksogra
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <ul
            className="hidden lg:flex items-center gap-1"
            role="navigation"
            aria-label="Navigasi utama"
          >
            {NAV_LINKS.map((link) => (
              <li key={link.sectionId}>
                <a
                  href={link.href ?? `/#${link.sectionId}`}
                  onClick={(e) => handleNavClick(e, link.sectionId)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-gray-600 hover:text-brand-blue hover:bg-brand-blue/5 cursor-pointer"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* CTA Button — goes to Booki page (or login if not authenticated) */}
            <Link
              href={loading ? "#" : user ? "/booki" : "/login?redirectTo=/booki"}
              id="cta-booki-btn"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm font-bold text-white transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background:
                  "linear-gradient(135deg, #0A96E6 0%, #0780c7 100%)",
                boxShadow: "0 4px 14px rgba(10, 150, 230, 0.35)",
              }}
            >
              <Sparkles size={15} />
              <span className="hidden sm:inline">Coba Booki</span>
              <span className="sm:hidden">Booki</span>
            </Link>

            {/* Authentication UI */}
            {loading ? (
              <div className="w-10 h-10 flex items-center justify-center">
                <Loader size="xs" color="blue" />
              </div>
            ) : user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* "Panel Admin" Link next to profile avatar/username (only visible for admins) */}
                {profile?.role === "admin" && (
                  <Link
                    href="/admin/dashboard"
                    className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-200 border border-brand-pink/20 text-brand-pink hover:bg-brand-pink/5 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      boxShadow: "0 2px 8px rgba(233, 85, 155, 0.1)",
                    }}
                  >
                    <LayoutDashboard size={13} />
                    <span>Panel Admin</span>
                  </Link>
                )}

                <div className="hidden lg:block">
                  <MantineMenu shadow="md" width={200} position="bottom-end" radius="md">
                    <MantineMenu.Target>
                      <button className="flex items-center gap-2.5 p-1 px-3 rounded-full hover:bg-gray-50 border border-gray-100 transition-colors focus:outline-none">
                        <Avatar
                          src={profile?.avatar_url}
                          alt={profile?.username || user?.email}
                          radius="xl"
                          size="sm"
                          styles={{
                            placeholder: {
                              backgroundColor: "var(--mantine-color-brandBlue-0)",
                              color: "var(--mantine-color-brandBlue-6)",
                              fontWeight: 700,
                            }
                          }}
                        >
                          {(profile?.username || user?.email || "?").substring(0, 2).toUpperCase()}
                        </Avatar>
                        <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate">
                          {profile?.username || user?.email?.split('@')[0]}
                        </span>
                      </button>
                    </MantineMenu.Target>
                    <MantineMenu.Dropdown>
                      <div className="px-3 py-2 border-b border-gray-100">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Masuk sebagai</p>
                        <p className="text-sm font-bold text-gray-700 truncate">
                          {profile?.full_name || profile?.username || user?.email}
                        </p>
                        {profile?.role === "admin" && (
                          <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-brand-pink/15 text-brand-pink tracking-wider">
                            Admin
                          </span>
                        )}
                      </div>
                      
                      {profile?.role === "admin" ? (
                        <MantineMenu.Item
                          leftSection={<LayoutDashboard size={14} className="text-slate-500" />}
                          component={Link}
                          href="/admin/dashboard"
                        >
                          Dashboard Admin
                        </MantineMenu.Item>
                      ) : (
                        <MantineMenu.Item
                          leftSection={<LayoutDashboard size={14} className="text-slate-500" />}
                          component={Link}
                          href="/dashboard"
                        >
                          Dashboard
                        </MantineMenu.Item>
                      )}

                      <MantineMenu.Item
                        color="red"
                        leftSection={<LogOut size={14} />}
                        onClick={handleSignOut}
                      >
                        Keluar
                      </MantineMenu.Item>
                    </MantineMenu.Dropdown>
                  </MantineMenu>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                id="login-btn"
                className="hidden lg:inline-flex items-center px-5 py-2 rounded-lg text-sm font-bold text-gray-900 transition-all duration-200 hover:brightness-95 min-h-[44px]"
                style={{ backgroundColor: "#FECC4E" }}
              >
                Masuk
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={isMenuOpen}
              className="lg:hidden w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center transition-colors text-gray-700 hover:bg-gray-50"
            >
              {isMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu Drawer ── */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white/95 backdrop-blur-xl border-t border-gray-100 px-4 pb-4 pt-2">
          <nav
            className="flex flex-col gap-1"
            role="navigation"
            aria-label="Menu mobile"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.sectionId}
                href={link.href ?? `/#${link.sectionId}`}
                onClick={(e) => handleNavClick(e, link.sectionId)}
                className="px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-brand-blue hover:bg-brand-blue/5 transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}

            <div className="h-px bg-gray-100 my-2" />

            {/* Mobile Authentication Options */}
            {loading ? (
              <div className="flex justify-center p-2">
                <Loader size="xs" color="blue" />
              </div>
            ) : user ? (
              <div className="flex flex-col gap-1">
                <div className="px-4 py-2 border border-gray-100 rounded-lg bg-gray-50 flex items-center gap-3">
                  <Avatar src={profile?.avatar_url} size="sm" radius="xl">
                    {(profile?.username || user?.email || "?").substring(0, 2).toUpperCase()}
                  </Avatar>
                  <div className="leading-tight">
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Masuk sebagai</p>
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {profile?.username || user?.email?.split('@')[0]}
                    </p>
                    {profile?.role === "admin" && (
                      <span className="inline-block mt-0.5 px-1 rounded text-[8px] font-extrabold uppercase bg-brand-pink/15 text-brand-pink tracking-wider">
                        Admin
                      </span>
                    )}
                  </div>
                </div>

                {profile?.role === "admin" ? (
                  <>
                    <Link
                      href="/admin/dashboard"
                      onClick={closeMenu}
                      className="px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-brand-blue hover:bg-brand-blue/5 transition-colors flex items-center gap-2"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard Admin
                    </Link>
                    <Link
                      href="/admin/dashboard"
                      onClick={closeMenu}
                      className="px-4 py-3 rounded-lg text-base font-medium text-brand-pink hover:bg-brand-pink/5 transition-colors flex items-center gap-2"
                    >
                      <LayoutDashboard size={16} />
                      Panel Admin
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className="px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-brand-blue hover:bg-brand-blue/5 transition-colors flex items-center gap-2"
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                )}

                <button
                  onClick={() => {
                    closeMenu();
                    handleSignOut();
                  }}
                  className="px-4 py-3 rounded-lg text-base font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 w-full text-left"
                >
                  <LogOut size={16} />
                  Keluar
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={closeMenu}
                className="px-4 py-3 rounded-lg text-base font-bold text-gray-900 text-center transition-colors min-h-[44px] flex items-center justify-center"
                style={{ backgroundColor: "#FECC4E" }}
              >
                Masuk
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
=======
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button, Burger, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Sparkles } from "lucide-react";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Program", href: "/programs" },
  { label: "Tentang", href: "/about" },
  { label: "Coba Booki", href: "/booki", isSpecial: true },
  { label: "Donasi", href: "/donation" },
];

export function Navbar() {
  const pathname = usePathname();
  const [opened, { toggle, close }] = useDisclosure(false);

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 transition-all duration-200">
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left Slot: Branding */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center" onClick={close}>
              <Image
                src="/logo.png"
                alt="Rumah Literasi Desa Tambaksogra Logo"
                width={160}
                height={48}
                priority
                className="h-8 w-auto sm:h-10 lg:h-12 object-contain"
              />
            </Link>
          </div>

          {/* Middle Slot: Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              if (link.isSpecial) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center gap-2 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-full px-5 py-2 text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                  >
                    <span>{link.label}</span>
                    <Sparkles
                      size={16}
                      className="group-hover:animate-pulse transition-transform group-hover:scale-110"
                    />
                  </Link>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-brand-blue ${
                    isActive ? "text-brand-blue font-bold" : "text-gray-600"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Slot: Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Button
              component={Link}
              href="/login"
              variant="subtle"
              color="gray"
              radius="md"
            >
              Login
            </Button>
            <Button
              component={Link}
              href="/register"
              color="blue" // Use Mantine's color mapping or brand color
              radius="md"
              className="bg-brand-blue hover:bg-brand-blue/90"
            >
              Register
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="lg:hidden flex items-center">
            <Burger
              opened={opened}
              onClick={toggle}
              aria-label="Toggle navigation"
              size="sm"
            />
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        size="md"
        padding="md"
        title="Menu Utama"
        hiddenFrom="lg"
        zIndex={100}
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <div className="flex flex-col gap-4 mt-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            if (link.isSpecial) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  className="group flex items-center justify-center gap-2 bg-brand-blue text-white rounded-full px-5 py-3 text-base font-semibold shadow-sm"
                >
                  <span>{link.label}</span>
                  <Sparkles size={18} className="group-hover:animate-pulse" />
                </Link>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? "bg-brand-blue/10 text-brand-blue font-bold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="h-px bg-gray-100 my-2" />

          <div className="flex flex-col gap-3">
            <Button
              component={Link}
              href="/login"
              variant="light"
              color="gray"
              fullWidth
              size="md"
              radius="md"
              onClick={close}
            >
              Login
            </Button>
            <Button
              component={Link}
              href="/register"
              fullWidth
              size="md"
              radius="md"
              className="bg-brand-blue hover:bg-brand-blue/90"
              onClick={close}
            >
              Register
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
}
>>>>>>> bb032ecad45fe6ebea2effbd747e7b735ad502dd
