// src/app/(booki)/layout.tsx
// Route group layout for the /booki workspace.
// Renders ONLY the Navbar — no Footer — so the chat interface
// can use the full remaining viewport height without footer padding.

import { Navbar } from "@/components/layout/Navbar";

export default function BookiGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
