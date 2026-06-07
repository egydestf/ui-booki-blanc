// src/app/(public)/layout.tsx
// Route Group Layout — wraps all public-facing institutional pages
// with the shared Navbar and Footer universal components.
// Covered routes: /, /about, /programs, /blog, /donation, /booki

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
