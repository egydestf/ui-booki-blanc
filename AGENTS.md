# AGENTS.md — Frontend Development Governance Document
## Rumah Literasi Tambaksogra & Booki RAG System

> **This document is the single, authoritative Source of Truth for all frontend development governance.**
> Every AI agent, developer, or contributor working in this repository **must** read, understand, and comply with all rules stated herein before writing a single line of code.
>
> **Last audited against repository:** `pan-don/interface_booki` · branch `main`
> **Document phase:** Phase 1 — Layout Foundation & Home Page
> **Document language:** English (final)

---

## Table of Contents

1. [Project Context](#1-project-context)
2. [Architectural Rules](#2-architectural-rules)
3. [Design System Specification](#3-design-system-specification)
4. [Responsive Design Rules](#4-responsive-design-rules)
5. [Component Engineering Rules](#5-component-engineering-rules)
6. [Performance Rules](#6-performance-rules)
7. [Animation Rules](#7-animation-rules)
8. [Accessibility Rules](#8-accessibility-rules)
9. [Decision-Making Framework](#9-decision-making-framework)
10. [API Contract & Data Integration Rules](#10-api-contract--data-integration-rules)
11. [Security & Authentication Rules](#11-security--authentication-rules)
12. [Pre-Completion Mandatory Checklist](#12-pre-completion-mandatory-checklist)
13. [Active Task Focus — Home Page](#13-active-task-focus--home-page)

---

## 1. Project Context

### 1.1 Project Identity

| Attribute | Value |
|---|---|
| **Project Name** | Rumah Literasi Tambaksogra |
| **Core Features** | Institutional Profile Website + AI-powered Book Recommendation System (Booki RAG) |
| **Framework** | Next.js 16.2.6 with App Router |
| **UI Runtime** | React 19.2.0 |
| **UI Component Library** | Mantine UI 8.3.18 |
| **Styling** | Tailwind CSS v3.4.17 + PostCSS |
| **Animation** | GSAP 3.13.0 + `@gsap/react` 2.1.2 |
| **Icon Library** | Lucide React 0.553.0 |
| **Auth & Backend Data** | Supabase (`@supabase/ssr` 0.10.0, `@supabase/supabase-js` 2.58.0) |
| **Deployment Target** | Cloudflare Pages via `@opennextjs/cloudflare` 1.19.11 |
| **Worker Configuration** | `wrangler.jsonc` — compatibility flags: `nodejs_compat`, `global_fetch_strictly_public` |
| **Language** | TypeScript 5.9.2 (`strict: true` mode) |
| **AI Backend** | Flask on Hugging Face Spaces (separate REST API) |

### 1.2 Authoritative Dependency Versions

The following versions are extracted directly from `package.json` in the live repository. These supersede any version numbers found in older companion documents such as `FRONTEND_ARCHITECTURE.md`, which still references the outdated Next.js 14 / React 18 / Mantine 7 stack.

```json
{
  "next": "16.2.6",
  "react": "19.2.0",
  "react-dom": "19.2.0",
  "@mantine/core": "^8.3.18",
  "@mantine/hooks": "^8.3.18",
  "gsap": "^3.13.0",
  "@gsap/react": "^2.1.2",
  "lucide-react": "^0.553.0",
  "@supabase/ssr": "^0.10.0",
  "@supabase/supabase-js": "^2.58.0",
  "tailwindcss": "^3.4.17",
  "typescript": "^5.9.2",
  "@opennextjs/cloudflare": "^1.19.11",
  "wrangler": "^4.95.0"
}
```

> ⚠️ **VERSION CONFLICT NOTICE:** `FRONTEND_ARCHITECTURE.md` in this repository is a legacy planning document and contains outdated dependency versions (Next.js 14, React 18, Mantine 7). **Always treat `package.json` and this `AGENTS.md` as the only authoritative sources.** Do not reference `FRONTEND_ARCHITECTURE.md` for technology specifications.

### 1.3 Application Route Map

```
/                     → Home Page (Institutional)
/about                → About Us Page
/programs             → Literacy Programs Page
/blog                 → Blog Listing Page
/blog/[slug]          → Blog Detail Page (dynamic route)
/donation             → Donation Page
/booki                → Booki RAG Chat Interface  ← CAPSTONE CORE FEATURE
/login                → Login / Authentication Page
/admin                → Admin Dashboard (Protected)
/admin/books/add      → Add Book (PDF Upload)
/admin/books/update   → Update Book Metadata
/admin/books/delete   → Delete Book
/admin/blog           → Blog Content Management
/api/chat             → Edge Route Handler (RAG Streaming Proxy) ← ONLY API ROUTE
```

### 1.4 User Personas

The application serves two distinct user types:

**End Users / Students:** Access institutional profile pages (Home, About, Programs, Blog, Donation) and use the Booki chatbot interface to receive AI-powered book recommendations in a natural, conversational manner.

**Administrators of Rumah Literasi:** Access the authentication-protected admin dashboard to manage the book collection (add via PDF, update metadata, delete records) and manage blog content. Admin data operations communicate directly with the Flask backend API from Server Actions or protected Route Handlers.

### 1.5 Build Scripts

```bash
npm run dev          # Local development server
npm run build        # Standard Next.js production build
npm run lint         # ESLint check (eslint-config-next/core-web-vitals + TypeScript)
npm run cf:build     # Build for Cloudflare Pages via opennextjs-cloudflare
npm run cf:preview   # Local preview of the Cloudflare build
npm run cf:deploy    # Deploy to Cloudflare Pages
```

---

## 2. Architectural Rules

### 2.1 Core Architecture Principles

**RULE #1 — App Router is the Absolute Standard**
All pages and layouts use the Next.js App Router under `src/app/`. The legacy `pages/` directory is strictly forbidden. No exceptions.

**RULE #2 — Server/Client Component Boundary Management**
Components that use React state hooks (`useState`, `useEffect`, `useContext`), browser event listeners, or third-party libraries requiring the DOM **must** declare `"use client"` as their very first line. Server Components are the default. Maximize their usage to reduce client-side JavaScript bundle size.

```typescript
// ✅ CORRECT — Client Component explicitly declared
"use client";
import { useState } from "react";

// ✅ CORRECT — Server Component (no directive needed, this is the default)
import { createServerSupabaseClient } from "@/lib/supabase/server";
```

**RULE #3 — Feature-Driven Folder Organization**
The `src/components/` directory is organized by feature domain, not by technical type:

```
src/components/
├── layout/       → Global layout components (Navbar, Footer, AdminSidebar)
├── booki/        → All components specific to the Booki RAG feature
├── ui/           → Generic, reusable UI primitives (Loader, etc.)
└── providers/    → Context wrapper components (MantineThemeProvider, etc.)
```

**RULE #4 — The `@/` Path Alias is Mandatory**
All internal imports **must** use the `@/` path alias, which maps to the `src/` directory. Relative imports crossing more than one directory level (`../../`) are **forbidden**.

```typescript
// ✅ CORRECT
import type { BookRecommendation } from "@/types";
import { MantineThemeProvider } from "@/components/providers/MantineThemeProvider";

// ❌ WRONG — Deep relative import
import type { BookRecommendation } from "../../types";
```

**RULE #5 — Logic Placement Matrix**

| Logic Type | Correct Location |
|---|---|
| Server-side data fetching | Server Component directly, or Server Action |
| Complex reusable UI state | Custom Hook in `src/hooks/` |
| External AI API calls (RAG Backend) | `src/app/api/chat/route.ts` Route Handler only |
| Admin CRUD operations | Server Actions (`"use server"`) inside `src/app/admin/` |
| Pure utility functions (no side effects) | `src/lib/utils.ts` |
| Supabase client configuration | `src/lib/supabase/client.ts`, `server.ts`, `middleware.ts` |
| Shared TypeScript interfaces and types | `src/types/index.ts` |

**RULE #6 — The Single Existing API Route**
As defined in `FRONTEND_ARCHITECTURE.md` and confirmed by the actual repository structure, **only one** Next.js Route Handler exists in this project's architecture:

```
src/app/api/chat/route.ts   ← The ONLY API route in this project
```

Any instruction, code pattern, or example referencing endpoints such as `/api/admin/add`, `/api/admin/update`, or any other path under `/api/` other than `/api/chat` is **architecturally incorrect and must not be implemented**. Admin data operations (CRUD) are handled via **Next.js Server Actions**, not Route Handlers.

**RULE #7 — Edge Runtime Declaration for the Chat Route Handler**
The chat route handler at `src/app/api/chat/route.ts` **must** declare the Edge Runtime to ensure compatibility with Cloudflare Pages deployment:

```typescript
// src/app/api/chat/route.ts — REQUIRED declaration
export const runtime = "edge";

export async function POST(request: Request) {
  // Implementation: proxy the request to the Flask backend
}
```

> **Context Note:** The current repository placeholder at `src/app/api/chat/route.ts` does not yet contain this export. It **must** be added when the route is implemented. Failing to include it will cause the Cloudflare Pages deployment (`cf:build`) to fail.

**RULE #8 — Admin CRUD Uses Server Actions, Not Route Handlers**
Admin data operations must be implemented as Next.js Server Actions inside the `src/app/admin/` directory or in a dedicated `src/lib/actions/` file. This approach is consistent with the SSR strategy defined for Admin pages, avoids CORS complexity, and keeps sensitive credentials server-side.

```typescript
// ✅ CORRECT — Server Action for admin operations
"use server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function deleteBook(bookId: string) {
  const supabase = createServerSupabaseClient();
  // Verify admin session first, then call Flask backend or Supabase
}

// ❌ WRONG — Creating a new Route Handler for admin data
// src/app/api/admin/add/route.ts  ← DO NOT CREATE THIS
```

### 2.2 Dependency Direction (Forbidden Imports)

```
src/app/**         → MAY import from: components/, hooks/, lib/, types/
src/components/**  → MAY import from: hooks/, lib/, types/  |  MUST NOT import from: app/
src/hooks/**       → MAY import from: lib/, types/          |  MUST NOT import from: app/, components/
src/lib/**         → MAY import from: types/               |  MUST NOT import from: app/, components/, hooks/
src/types/**       → Imports nothing (pure type definitions only)
```

### 2.3 Cloudflare Worker Compatibility (wrangler.jsonc)

The `wrangler.jsonc` file at the project root configures the Cloudflare Worker. Key constraints inferred from its content:

- **`nodejs_compat` flag is enabled:** Standard Node.js APIs are polyfilled, but do not assume full Node.js compatibility. Avoid `fs`, `child_process`, and other deep Node.js internals.
- **`global_fetch_strictly_public` flag is enabled:** All `fetch()` calls from the worker must target public, externally-accessible URLs. Internal loopback addresses are not permitted.
- **Worker name:** `rumah-literasi-tambaksogra` (matches `package.json` `name` field).
- **Image optimization** is enabled via the Cloudflare Images binding. Use `next/image` to leverage this.

---

## 3. Design System Specification

### 3.1 Brand Color Palette (Source of Truth)

These values are extracted directly from `tailwind.config.ts` in the live repository. Use named tokens, never raw hex codes, in component code.

#### Primary Brand Colors

| Tailwind Token | Hex Value | Primary Usage |
|---|---|---|
| `brand-blue` | `#0A96E6` | Primary accent, CTA buttons, links, interactive elements |
| `brand-pink` | `#E9559B` | Secondary accent, highlights, category badges |
| `brand-orange` | `#FBAD1A` | Tertiary accent, icons, warm decorative elements |
| `brand-yellow` | `#FDC33E` | Standard yellow variant |
| `brand-yellowLight` | `#FECC4E` | Light yellow, highlight backgrounds |

#### Neutral Colors

| Tailwind Token | Hex Value | Primary Usage |
|---|---|---|
| `neutral-cream` | `#F0E3D3` | Content section backgrounds, book cards |
| `neutral-creamLight` | `#F8F1E9` | Page background, empty area fill |
| `neutral-white` | `#FFFFFF` | Card backgrounds, modals, reading areas |

#### Mantine Dynamic Palette

`MantineThemeProvider.tsx` uses `generateColors()` to compute 10 shade variants (0–9) from the five brand hex values above. These shades become available as CSS custom properties:

```
var(--mantine-color-brand-blue-6)
var(--mantine-color-brand-pink-5)
...
```

Use these tokens when overriding or extending Mantine component styles via `sx` or `styles` props.

### 3.2 Typography

| Property | Value |
|---|---|
| **Primary Font** | `Plus Jakarta Sans` (loaded via `next/font/google` in `src/app/layout.tsx`) |
| **CSS Variable Name** | `--font-plus-jakarta` (verified from `LAPORAN_PENGEMBANGAN.md` — `layout.tsx` sets the variable on the `<html>` tag) |
| **Applied class** | Applied to `<html>` as `className={plusJakartaSans.variable}` |
| **Tailwind Integration** | Reference via `font-sans` after configuring `fontFamily` in `tailwind.config.ts` |

> ⚠️ **CSS TOKEN CORRECTION:** An earlier draft of this document incorrectly stated the CSS variable name as `--font-plus-jakarta-sans`. The actual token as applied by the `layout.tsx` root layout — consistent with Next.js `next/font` conventions — is `--font-plus-jakarta`. Always verify by inspecting `src/app/layout.tsx` directly before referencing this variable in custom CSS.

**Typography scale rules:**
- Body text minimum: `text-sm` (14px) for readability.
- Page headings: `text-2xl` and above with `font-bold` or `font-semibold`.
- Never use below `text-xs` (12px) for functional content.
- Long-form paragraph text uses `leading-relaxed` or `leading-loose`.

### 3.3 Spacing & Layout Tokens

All spacing must use Tailwind's 4px-base system (`p-1` = 4px, `p-2` = 8px, etc.).

| Context | Recommended Values |
|---|---|
| Padding inside cards/containers | `p-4` to `p-6` |
| Gap between grid items | `gap-4` to `gap-6` |
| Section vertical margin | `py-12` to `py-24` |
| Navbar/Footer content padding | `px-4` (mobile) → `px-8` (desktop) |
| Interactive element border radius | `rounded-lg` (8px) or `rounded-xl` (12px) |
| Maximum content container width | `max-w-7xl mx-auto` |
| Narrative page content (About, Blog) | `max-w-3xl mx-auto` |
| Booki chat interface width | `max-w-4xl mx-auto` |

### 3.4 CSS Architecture & Import Order (CRITICAL — DO NOT REORDER)

The import order in `src/app/globals.css` determines global CSS specificity resolution. **This order must never be changed.**

```css
/* ① Mantine base styles — MUST be first. Establishes all Mantine CSS custom properties. */
@import '@mantine/core/styles.css';

/* ② Tailwind directives wrapped in @layer to prevent specificity conflicts with Mantine */
@layer tailwind {
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
}

/* ③ Local font and base variable declarations */
@layer base {
  /* The actual variable name MUST match what layout.tsx sets on the <html> element */
  /* Verify in src/app/layout.tsx before adding custom font references here */
}
```

**Styling hierarchy (apply in this order of preference):**
1. **Mantine components** → For all interactive UI elements (Button, TextInput, Modal, Select, Table, Badge, Skeleton, Loader, etc.)
2. **Tailwind utility classes** → For layout, spacing, colors, and modifications outside Mantine's scope
3. **CSS Module or inline style** → Only for values that cannot be handled by either (e.g., GSAP-driven dynamic transform values)

### 3.5 PostCSS & Mantine Breakpoint Mapping

The `postcss.config.mjs` file registers `postcss-preset-mantine` and `postcss-simple-vars` with the following Mantine breakpoint variables. These are available inside Mantine's `sx` prop patterns but are separate from Tailwind breakpoints.

```
mantine-breakpoint-xs: 36em  (≈ 576px)
mantine-breakpoint-sm: 48em  (≈ 768px)
mantine-breakpoint-md: 62em  (≈ 992px)
mantine-breakpoint-lg: 75em  (≈ 1200px)
mantine-breakpoint-xl: 88em  (≈ 1408px)
```

When writing responsive styles using Mantine's `sx` prop, use these variables. When writing responsive layout with Tailwind classes, use Tailwind's breakpoint prefixes (see Section 4).

---

## 4. Responsive Design Rules

### 4.1 Breakpoint System

This project uses Tailwind CSS breakpoints exclusively for layout. **Mobile-first is the default strategy.** Write base styles for mobile, then layer up with breakpoint prefixes.

| Name | Breakpoint | Tailwind Prefix | Target Device |
|---|---|---|---|
| **Mobile** | < 640px | *(no prefix)* | Phones (default base) |
| **SM** | ≥ 640px | `sm:` | Large phones / small tablets |
| **MD** | ≥ 768px | `md:` | Tablets |
| **LG** | ≥ 1024px | `lg:` | Laptops / small desktops |
| **XL** | ≥ 1280px | `xl:` | Standard desktops |
| **2XL** | ≥ 1536px | `2xl:` | Wide desktops |

### 4.2 Responsive Grid Rules

**Book Recommendation Cards (Bento Grid for `/booki`):**
```
Mobile (default)  → grid-cols-1
SM (≥ 640px)      → sm:grid-cols-2
MD (≥ 768px)      → md:grid-cols-3
LG (≥ 1024px)     → lg:grid-cols-4
```

**Admin Book Grid (target 4×5 = 20 items per page per API spec):**
```
Mobile (default)  → grid-cols-1
SM (≥ 640px)      → sm:grid-cols-2
MD (≥ 768px)      → md:grid-cols-3
LG (≥ 1024px)     → lg:grid-cols-4
XL (≥ 1280px)     → xl:grid-cols-5
```

**Blog Listing Grid:**
```
Mobile (default)  → grid-cols-1
MD (≥ 768px)      → md:grid-cols-2
LG (≥ 1024px)     → lg:grid-cols-3
```

### 4.3 Responsive Navigation Rules

- **Desktop (≥ lg):** Horizontal navbar with full navigation links visible.
- **Mobile (< lg):** Hamburger menu button opens a Mantine `Drawer` with stacked vertical links.
- Navbar minimum height: `h-16` (64px). Always `sticky top-0 z-50`.
- Footer is always full-width; no `max-width` constraint.

### 4.4 Responsive Typography Patterns

```html
<!-- Hero / Primary Page Heading -->
<h1 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold">

<!-- Section Subheading -->
<h2 class="text-xl sm:text-2xl lg:text-3xl font-semibold">

<!-- Standard body text -->
<p class="text-sm sm:text-base leading-relaxed">

<!-- Caption / helper text -->
<span class="text-xs sm:text-sm text-gray-500">
```

### 4.5 Touch Target Size

All interactive elements (buttons, links, form inputs) must have a minimum tap target of **44×44px** on mobile viewports, per WCAG 2.5.5. Use padding to meet this requirement rather than increasing the visual size of the element.

---

## 5. Component Engineering Rules

### 5.1 Standard Component Anatomy

Every component created **must** follow this file structure precisely:

```typescript
// ① Directive (if Client Component — must be the absolute first line)
"use client";

// ② Imports — ordered: React/Next.js → External libraries → Internal (@/)
// Use `import type` for type-only imports
import { useState, useCallback } from "react";
import type { RefObject } from "react";
import { Button, TextInput } from "@mantine/core";
import { Send } from "lucide-react";
import type { RAGChatRequest } from "@/types";

// ③ Props interface — always explicitly defined, never use `any`
interface ChatInputProps {
  onSubmit: (request: RAGChatRequest) => void;
  isLoading: boolean;
  placeholder?: string;
}

// ④ Component — arrow function for consistency
const ChatInput = ({ onSubmit, isLoading, placeholder }: ChatInputProps) => {
  // ④-a State declarations
  const [value, setValue] = useState<string>("");

  // ④-b Derived / computed values
  const isDisabled = isLoading || value.trim().length === 0;

  // ④-c Handlers (useCallback for handlers passed to child components)
  const handleSubmit = useCallback(() => {
    if (isDisabled) return;
    onSubmit({ query: value.trim() });
    setValue("");
  }, [value, isDisabled, onSubmit]);

  // ④-d Render — loading, error, and empty states must ALL be handled
  return (
    <div className="flex gap-2 p-4">
      <TextInput
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        placeholder={placeholder ?? "Ask Booki for a book recommendation..."}
        disabled={isLoading}
        aria-label="Enter your book query"
        className="flex-1"
      />
      <Button
        onClick={handleSubmit}
        disabled={isDisabled}
        loading={isLoading}
        aria-label="Send query to Booki"
      >
        <Send size={16} />
      </Button>
    </div>
  );
};

// ⑤ Named export for components used in multiple places, default for pages
export default ChatInput;
```

### 5.2 TypeScript Rules

- **`strict: true` is mandatory** and must never be disabled in `tsconfig.json`.
- **`any` is forbidden.** The ESLint config (`eslint.config.mjs`) already enforces `"@typescript-eslint/no-explicit-any": "warn"`. Treat all warnings as errors. If `any` is genuinely unavoidable (e.g., complex generic indexing), add an inline comment explaining why.
- All shared interfaces and types **must** be defined in `src/types/index.ts`.
- Use `interface` for object shapes and component props. Use `type` for unions, intersections, and primitive aliases.
- Props interfaces **must** be explicitly defined. Inline or anonymous prop types are not permitted for exported components.
- Use `import type { ... }` for type-only imports to improve build performance.

### 5.3 Canonical Data Contract Types (`src/types/index.ts`)

The following interfaces are the official data contracts between frontend and backend. **Do not modify these without coordinating with the backend team.**

```typescript
// Request payload to POST /api/chat (the Next.js Route Handler proxy)
export interface RAGChatRequest {
  query: string;
  filter_jenjang?: string;
  filter_kelas?: string;
  filter_mapel?: string;
}

// A single book item in the RAG recommendation response
export interface BookRecommendation {
  book_id: string;
  title: string;
  author: string;
  jenjang: string;
  kelas: string;
  mata_pelajaran: string;
  summary: string;
  cover_image: string;
  similarity_score: number;
  relevance_score: number;
}

// A single book item in the Admin catalog response (GET /api/admin/books on Flask)
export interface AdminBookSummary {
  book_id: string;
  judul_buku: string;
  jenjang: string;
  // Add remaining fields as the admin UI is built
  [key: string]: string | number | boolean; // generic indexer — justified for open schema
}

// The full successful RAG response from the Flask backend
export interface RAGResponse {
  status: "success";
  query: string;
  answer: string;             // Narrative text — render in MessageBubble
  recommendations: BookRecommendation[]; // Book cards — render in a separate grid
}
```

### 5.4 Custom Hook Rules

All complex stateful or reusable logic **must** be extracted to a custom hook in `src/hooks/`.

Rules for custom hooks:
- Hook names **must** be prefixed with `use` (e.g., `useBookiChat`, `useAdminBooks`).
- Every hook **must** declare and export a named return type interface.
- Hooks must not contain JSX rendering logic.
- The current placeholder `src/hooks/useBookiChat.ts` returns `{}` without a return type — **this violates the TypeScript strict rules above and must be corrected when the hook is implemented.**

```typescript
// ✅ CORRECT — Hook with explicit return type
"use client";
import type { RAGChatRequest, BookRecommendation } from "@/types";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendations?: BookRecommendation[];
}

export interface UseBookiChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (request: RAGChatRequest) => Promise<void>;
  clearMessages: () => void;
}

export const useBookiChat = (): UseBookiChatReturn => {
  // Implementation
};
```

### 5.5 Three Mandatory UI States

Every component that performs asynchronous data fetching **must** handle all three conditions:

```typescript
// ✅ REQUIRED — All three states handled before rendering data
if (isLoading) return <Skeleton height={200} radius="md" />;
if (error) return <ErrorState message={error} onRetry={refetch} />;
if (!data || data.length === 0) return <EmptyState />;

// Only then render the data
return <DataGrid items={data} />;
```

### 5.6 ESLint Configuration Summary

The live `eslint.config.mjs` uses `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`. Key enforced rules:

- `@typescript-eslint/no-unused-vars`: **warn** (variables prefixed with `_` are exempt)
- `@typescript-eslint/no-explicit-any`: **warn** (treat as error)
- `@next/next/no-img-element`: **warn** (treat as error — always use `<Image>` from `next/image`)

---

## 6. Performance Rules

### 6.1 Rendering Strategy by Page

| Page / Route | Rendering Strategy | Rationale |
|---|---|---|
| `/` (Home) | Static Generation (SSG) | Static institutional content |
| `/about` | Static Generation (SSG) | Rarely changing content |
| `/programs` | Static Generation (SSG) or ISR | Programmatic content updates |
| `/blog` | ISR (revalidate periodically) | Content changes but not real-time |
| `/blog/[slug]` | ISR | Per-article stability |
| `/donation` | Static Generation (SSG) | Mostly static layout |
| `/booki` | Client-Side Rendering (CSR) | Full interactivity, AI streaming |
| `/login` | Client-Side Rendering (CSR) | Interactive form |
| `/admin/**` | CSR + Server Actions | Dynamic data + auth verification |

### 6.2 Image Optimization Rules

- **Always** use `<Image>` from `next/image`. The `@next/next/no-img-element` ESLint rule enforces this.
- Supabase Storage images are already allowed in `next.config.mjs` via `remotePatterns` for `*.supabase.co`.
- Always provide `alt`, `width`, and `height` attributes to prevent Cumulative Layout Shift (CLS).
- Use `priority={true}` for above-the-fold hero images. Use `loading="lazy"` for images below the fold.

```typescript
// ✅ CORRECT
import Image from "next/image";
<Image
  src={book.cover_image}
  alt={`Cover of ${book.title}`}
  width={200}
  height={280}
  className="rounded-lg object-cover"
/>

// ❌ WRONG — triggers ESLint warning
<img src={book.cover_image} alt="book" />
```

### 6.3 Code Splitting & Lazy Loading

Use `next/dynamic` for large components not needed on initial page load:

```typescript
import dynamic from "next/dynamic";

// ChatContainer is only needed on the /booki route
const ChatContainer = dynamic(
  () => import("@/components/booki/ChatContainer"),
  {
    loading: () => <ChatContainerSkeleton />,
    ssr: false, // Chat interface does not benefit from SSR
  }
);
```

**Components that must be lazy-loaded:**
- `ChatContainer` and all Booki sub-components
- Complex admin dashboard charts or data tables
- Modals and Drawers that are not visible on initial render

### 6.4 Import Specificity (Tree-Shaking)

Import only what you use. Barrel imports from large libraries defeat tree-shaking:

```typescript
// ✅ CORRECT — specific, tree-shakeable
import { Button, TextInput, Modal } from "@mantine/core";
import { Search, BookOpen } from "lucide-react";

// ❌ WRONG — imports entire library namespace
import * as Mantine from "@mantine/core";
```

---

## 7. Animation Rules

### 7.1 Animation Philosophy

Animations in this project must **support content, not distract from it.** The target audience includes young students who need a responsive, pleasant interface that does not impede focus. Animation should feel like natural page flow, not a performance.

Crucially: **Always respect the user's `prefers-reduced-motion` preference** (see Rule 7.5).

### 7.2 Animation Technology Hierarchy

| Layer | Technology | When to Use |
|---|---|---|
| **Layer 1: Micro-interactions** | Tailwind `transition` utilities | Hover states, focus rings, simple color/opacity changes |
| **Layer 2: CSS Animations** | Tailwind `animate-*` or `@keyframes` | Pulse loaders, simple fade-ins that don't need JS control |
| **Layer 3: Orchestrated Animations** | GSAP + `@gsap/react` | Entrance timelines, scroll triggers, stagger lists, complex sequences |

**Principle:** Never reach for GSAP when a Tailwind class will do. GSAP is reserved for animations requiring precision timeline control or JavaScript-driven dynamic values.

### 7.3 Approved GSAP Patterns

**Entrance Animation (single element):**
```typescript
"use client";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );
  }, { scope: ref });

  return <div ref={ref}>...</div>;
};
```

**Stagger Animation (dynamic list):**
```typescript
useGSAP(() => {
  gsap.fromTo(
    ".book-card",
    { opacity: 0, y: 30, scale: 0.95 },
    {
      opacity: 1, y: 0, scale: 1,
      duration: 0.5,
      ease: "power2.out",
      stagger: 0.08,
    }
  );
}, { scope: containerRef, dependencies: [bookData] });
```

**ScrollTrigger:**
```typescript
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

useGSAP(() => {
  gsap.fromTo(".program-card",
    { opacity: 0, x: -50 },
    {
      opacity: 1, x: 0, duration: 0.6, stagger: 0.1,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        once: true,
      },
    }
  );
}, { scope: containerRef });
```

### 7.4 Timing & Easing Reference

| Context | Duration | Easing |
|---|---|---|
| Hover / micro-interactions | 150–200ms | `ease-in-out` (Tailwind) |
| Single element entrance | 500–800ms | `power2.out` (GSAP) |
| Stagger list entrance | 400–600ms + 80ms stagger | `power2.out` (GSAP) |
| Page transition | 300–400ms | `power1.inOut` (GSAP) |
| Error feedback animation | 200–300ms | `elastic.out` or `back.out` |

### 7.5 Reduced Motion — Non-Negotiable

Every GSAP animation block **must** check for the `prefers-reduced-motion` user preference:

```typescript
useGSAP(() => {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReduced) return; // Respect the user's accessibility preference

  gsap.fromTo(/* ... */);
}, { scope: ref });
```

Additionally, add this global rule to `globals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 8. Accessibility Rules

### 8.1 Target Standard

This project targets **WCAG 2.1 Level AA** compliance as a minimum.

### 8.2 Semantic HTML

- Use semantic HTML elements: `<nav>`, `<main>`, `<header>`, `<footer>`, `<article>`, `<section>`, `<aside>`, `<figure>`.
- Every page **must** contain exactly one `<h1>` describing the page's primary purpose.
- Heading hierarchy must be sequential: `h1` → `h2` → `h3`. Skipping levels is not permitted.
- Icon-only buttons **must** have `aria-label`.
- Informational images **must** have descriptive `alt` text. Decorative images use `alt=""`.

### 8.3 Color Contrast Requirements

| Combination | Minimum Ratio | Note |
|---|---|---|
| Body text on white background | 4.5:1 | WCAG AA mandatory |
| Large text (≥ 18pt bold) on background | 3:1 | WCAG AA mandatory |
| Interactive element focus indicator | 3:1 against adjacent colors | WCAG 2.1 AA |
| `brand-blue` (#0A96E6) on white | **Verify with a tool** | Check before deploying |
| `brand-pink` (#E9559B) on white | **Verify with a tool** | Check before deploying |

**Principle:** Never convey information through color alone. Always pair color with text or an icon.

### 8.4 Keyboard Navigation

- All interactive elements must be keyboard-accessible via `Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`, and arrow keys where applicable.
- Mantine handles keyboard navigation for its components natively. Verify keyboard behavior for all custom components.
- `outline: none` without a visible focus replacement is **forbidden**. Focus rings must always be visible.
- Mantine `Modal` and `Drawer` components must trap focus within the overlay when open.

### 8.5 ARIA for Dynamic Content

```typescript
// Loading status readable by screen readers
<div role="status" aria-live="polite" aria-label="Booki is processing your request">
  {isLoading && <Loader size="sm" />}
</div>

// Chat message history
<ul role="log" aria-label="Conversation with Booki" aria-live="polite">
  {messages.map(msg => (
    <li key={msg.id} aria-label={`Message from ${msg.role === "user" ? "you" : "Booki"}`}>
      <MessageBubble message={msg} />
    </li>
  ))}
</ul>
```

### 8.6 Form Accessibility

- Every input field **must** have a label connected via `htmlFor`/`id`.
- Error messages must use `aria-live="assertive"` and appear adjacent to the relevant field.
- Use Mantine form components (`TextInput`, `Select`, `Checkbox`) which include built-in accessibility attributes.

---

## 9. Decision-Making Framework

### 9.1 Decision Tree: "Should this be a Client Component?"

```
Does this component use any of the following?
├── useState, useEffect, useRef, useReducer, or any other React hook?
│   └── YES → Add "use client" as the first line
├── Browser event handlers (onClick, onChange, onSubmit, onKeyDown)?
│   └── YES → Add "use client" as the first line
├── Third-party library requiring browser APIs (GSAP, etc.)?
│   └── YES → Add "use client" as the first line
└── None of the above?
    └── NO → Keep as Server Component (no directive needed)
```

### 9.2 Decision Tree: "Where does this logic belong?"

```
Is this logic...
├── Fetching data on the server only?
│   └── → Server Component directly, or Server Action in src/app/admin/
├── Used by more than one component?
│   └── → Custom Hook in src/hooks/ or utility in src/lib/utils.ts
├── A pure data transformation with no side effects?
│   └── → Utility function in src/lib/utils.ts
├── Related to Supabase client configuration?
│   └── → src/lib/supabase/ (client.ts, server.ts, or middleware.ts)
└── Used by only one component?
    └── → Keep it inside that component
```

### 9.3 Decision Tree: "GSAP or Tailwind for this animation?"

```
Does this animation require...
├── Coordinated timeline (multiple elements animated together)?
│   └── → GSAP
├── ScrollTrigger (animation triggered by scroll position)?
│   └── → GSAP + ScrollTrigger plugin
├── Stagger effect on a dynamically-rendered list?
│   └── → GSAP
├── Dynamic values derived from JavaScript/React state?
│   └── → GSAP
└── Simple hover, opacity, color, or transform change?
    └── → Tailwind transition utilities (lighter, simpler)
```

### 9.4 Decision Tree: "How to communicate with the RAG Backend?"

```
Is the request originating from...
├── A Server Component or Server Action?
│   └── → Call the Flask backend URL directly with fetch()
│       → CORS is irrelevant for server-to-server calls
├── A Client Component or Custom Hook?
│   └── → NEVER call the Flask backend directly from the browser
│       → Call the internal Next.js Route Handler: POST /api/chat
│           → The Route Handler then proxies to the Flask API
└── An Admin CRUD operation (add/update/delete)?
    └── → Use a Server Action in src/app/admin/ or src/lib/actions/
        → Server Actions call the Flask admin endpoints directly
        → DO NOT create new Route Handlers for admin operations
```

### 9.5 Decision Tree: "Admin CRUD — Which pattern?"

```
Admin data operation type:
├── Display / list books (read-only)?
│   └── → Fetch data in an Admin Server Component directly
├── Add a book (PDF upload)?
│   └── → Server Action with FormData forwarded to Flask backend
│       → DO NOT use POST /api/admin/add (this route does not exist in Next.js)
│       → The Server Action calls: POST https://[hf-space]/api/admin/add
├── Update book metadata?
│   └── → Server Action calling: PUT https://[hf-space]/api/admin/update/<id>
└── Delete a book?
    └── → Server Action calling: DELETE https://[hf-space]/api/admin/delete/<id>
```

### 9.6 Development Priority Matrix

| Priority | Criteria | Example |
|---|---|---|
| **P0 — Critical** | Causes production crash or deployment failure | Missing `export const runtime = "edge"` in route handler |
| **P1 — High** | Blocks core functionality | Booki streaming not working |
| **P2 — Medium** | Important feature with a workaround available | Admin Server Action not yet wired |
| **P3 — Low** | UX enhancement, visual polish | Animation timing fine-tuning |

---

## 10. API Contract & Data Integration Rules

### 10.1 Environment Variables

```bash
# .env.local (NEVER commit to the repository)

# Safe for client-side access (NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]

# Server-only — NEVER expose to the client
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
BACKEND_URL=https://[hf-username]-booki-rag.hf.space
```

Variables without `NEXT_PUBLIC_` are only accessible in Server Components, Server Actions, and Route Handlers. Any attempt to access them in a Client Component will return `undefined`.

### 10.2 The Only Existing API Route: `/api/chat`

`src/app/api/chat/route.ts` is the **only** Next.js Route Handler in this project. Its responsibilities are:

1. Receive a `POST` request from the client (`useBookiChat` hook).
2. Forward the request body to the Flask backend at `process.env.BACKEND_URL + "/api/recommend"`.
3. Stream or return the Flask response to the client.
4. **Must** declare `export const runtime = "edge";` for Cloudflare Pages compatibility.

```typescript
// src/app/api/chat/route.ts — Required structure
export const runtime = "edge"; // ← THIS LINE IS MANDATORY

export async function POST(request: Request): Promise<Response> {
  const body = await request.json();
  
  const backendResponse = await fetch(
    `${process.env.BACKEND_URL}/api/recommend`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  // Return the response (or stream it if streaming is supported)
  return new Response(backendResponse.body, {
    status: backendResponse.status,
    headers: { "Content-Type": "application/json" },
  });
}
```

### 10.3 RAG Response Parsing Rule

The Flask backend response from `/api/recommend` contains two logically separate parts that **must** be rendered independently:

```typescript
// ✅ CORRECT — Separate the narrative text from the book cards
const handleResponse = (data: RAGResponse) => {
  // The "answer" string is a narrative paragraph — render in MessageBubble as text
  addMessage({ role: "assistant", content: data.answer });
  
  // The "recommendations" array is structured data — render as a separate BookCard grid
  if (data.recommendations.length > 0) {
    setBookResults(data.recommendations);
  }
};

// ❌ WRONG — Never parse book metadata from within the "answer" text string
const extractTitlesFromLLMText = (answerText: string) => {
  const matches = answerText.match(/Judul: (.+)/g); // FORBIDDEN
};
```

### 10.4 Conditional CORS Headers

The Flask backend enforces strict CORS and only allows requests from the domain set in `FRONTEND_URL`. Since all client-to-backend communication is proxied through the Next.js Route Handler (`/api/chat`), CORS is not a concern for end-user browsers. However, ensure the Flask backend's `FRONTEND_URL` environment variable is set to the Cloudflare Pages production domain.

---

## 11. Security & Authentication Rules

### 11.1 Admin Route Protection — Two Layers

Admin routes at `/admin/**` must be protected at **two independent layers** for defense in depth.

**Layer 1 — Supabase Middleware (`src/middleware.ts`):**
Runs at the edge on every request. Redirects unauthenticated users to `/login` before the page even renders.

```typescript
// src/middleware.ts
import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

**Layer 2 — Server Component Verification:**
Even with middleware in place, every Admin Server Component must independently verify the session. Do not rely solely on middleware.

```typescript
// src/app/admin/page.tsx (or any admin page)
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const AdminDashboard = async () => {
  const supabase = createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect("/login"); // Defense in depth

  return <div>Admin content</div>;
};
```

### 11.2 Sensitive Data Handling

- Never log authentication tokens, session cookies, or user PII to `console.log()`.
- Error messages shown to users must be friendly and must not expose stack traces, database table names, or internal API URLs.
- The Flask backend URL (`BACKEND_URL`) is a server-only variable and must never appear in client-side code or be exposed in browser network responses.

---

## 12. Pre-Completion Mandatory Checklist

> ⛔ **THIS CHECKLIST IS NON-NEGOTIABLE.**
> Any task marked as "complete" without running through this checklist is considered **incomplete** and must be revisited. There are no exceptions.

```
BEFORE MARKING ANY TASK AS DONE, VERIFY ALL 8 POINTS:

[ ] 1. LINT CHECK
       - No active ESLint errors (mentally run: npm run lint)
       - No unused imports or variables remaining
       - No console.log() left in production code
       - No `any` type used without an explanatory inline comment
       - No <img> tag used — only <Image> from next/image
       - All @typescript-eslint rules pass

[ ] 2. TYPESCRIPT TYPE VERIFICATION
       - No TypeScript compiler errors (mentally: tsc --noEmit exits with code 0)
       - All component props have explicitly defined interfaces
       - All custom hook return values have an explicitly defined interface
       - All async function return types are declared
       - All type-only imports use `import type { ... }`

[ ] 3. RESPONSIVENESS VERIFICATION
       - Layout tested mentally at: 375px (Mobile), 768px (Tablet), 1280px (Desktop)
       - No element overflows its container horizontally on mobile
       - Grid/flex layout behaves correctly at all breakpoints
       - All tap targets are at least 44×44px on mobile
       - Mobile navigation (Drawer) functions correctly
       - Font sizes remain readable at all viewport widths

[ ] 4. ACCESSIBILITY VERIFICATION
       - All informational images have descriptive `alt` text
       - All icon-only buttons have `aria-label`
       - Heading hierarchy (h1 → h2 → h3) does not skip levels
       - All form inputs have associated labels
       - Color contrast meets 4.5:1 ratio for body text
       - No `outline: none` without a visible focus replacement
       - Dynamic content uses appropriate aria-live regions

[ ] 5. LOADING STATE VERIFICATION
       - All data-fetching components show a Mantine Skeleton or Loader
       - Submit buttons display the Mantine `loading` prop during requests
       - Loading state prevents duplicate request submission
       - Skeleton dimensions match the approximate size of actual content

[ ] 6. ERROR STATE VERIFICATION
       - All data-fetching components render a user-friendly error message
       - Error messages are written in user-friendly language (not technical jargon)
       - Transient errors (network failure) include a "Try Again" retry action
       - Authentication errors redirect to /login
       - Errors do not cause unhandled promise rejections or page crashes

[ ] 7. EMPTY STATE VERIFICATION
       - Lists that can be empty (search results, book lists) show an informative message
       - Empty state messages guide the user toward a next action
       - The Booki chat interface shows a welcome/onboarding message for a new session
       - Admin pages without data show a CTA to add content

[ ] 8. PERFORMANCE IMPACT VERIFICATION
       - No unnecessary library imports have been added
       - All new images use <Image> from next/image
       - Large new components have been considered for dynamic import (lazy loading)
       - No unnecessary side effects in useEffect
       - useEffect, useCallback, useMemo dependency arrays are correct and complete
       - GSAP timelines and ScrollTriggers are cleaned up on component unmount
       - No `export const runtime = "edge"` missing from any Route Handler
```

### 12.1 Task Completion Report Template

Use this template when reporting a completed task:

```markdown
## Task Completion Report: [Task Name]

**Files Modified / Created:**
- `src/components/layout/Navbar.tsx` (created)
- `src/app/page.tsx` (modified)

**Summary of Changes:**
[Brief description of what was done and why]

**Checklist Verification:**
- [x] 1. Lint: Clean, no errors
- [x] 2. TypeScript: All types defined, tsc exits 0
- [x] 3. Responsiveness: Verified at 375px, 768px, 1280px ✓
- [x] 4. Accessibility: aria-label, alt, heading hierarchy ✓
- [x] 5. Loading State: Mantine Skeleton on data fetch ✓
- [x] 6. Error State: User-friendly error message with retry ✓
- [x] 7. Empty State: Appropriate empty message ✓
- [x] 8. Performance: Dynamic import, GSAP cleanup, edge runtime ✓

**Notes / Caveats:**
[Anything that needs follow-up or was deliberately deferred]
```

---

## 13. Active Task Focus — Home Page

> 🔄 **THIS CHAPTER IS FLEXIBLE AND MUTABLE.**
> The content of this chapter changes as development progresses from page to page. When the Home Page is complete and the team moves to the next page (e.g., About, Programs), this chapter must be updated to reflect the new active task. Always update this chapter before starting work on any new page.

---

### 13.1 Current Active Page

**Target Route:** `/` (Home Page)
**Target File:** `src/app/page.tsx`
**Current Status:** Placeholder / Boilerplate — needs full implementation
**Phase:** Phase 2 — Static & Presentational Profile Pages

---

### 13.2 Home Page Objectives

The Home Page is the **primary institutional entry point** for Rumah Literasi Tambaksogra. It must communicate the organization's identity, mission, and key offerings at a glance. It must also serve as a clear funnel directing users toward the Booki RAG system, programs, and donation pages.

**This page must NOT require any authenticated session or dynamic server data.** It is a fully static page that should be generated at build time (SSG).

---

### 13.3 Home Page Section Architecture

Build the Home Page in the following sections, in order. Each section is a separate component under `src/components/home/`.

```
src/components/home/
├── HeroSection.tsx         → Full-screen hero with headline and Booki CTA
├── StatsBanner.tsx         → Key impact numbers (books, readers, programs)
├── AboutSnippet.tsx        → Short mission statement with link to /about
├── FeaturedPrograms.tsx    → 3-card preview of programs with link to /programs
├── BookiPromo.tsx          → Promotional section for the Booki RAG system
├── LatestBlog.tsx          → 2-3 latest blog post teasers with link to /blog
└── DonationCTA.tsx         → Call-to-action block for /donation
```

**Assembly in `src/app/page.tsx`:**
```typescript
// src/app/page.tsx — Server Component (no "use client")
import HeroSection from "@/components/home/HeroSection";
import StatsBanner from "@/components/home/StatsBanner";
import AboutSnippet from "@/components/home/AboutSnippet";
import FeaturedPrograms from "@/components/home/FeaturedPrograms";
import BookiPromo from "@/components/home/BookiPromo";
import LatestBlog from "@/components/home/LatestBlog";
import DonationCTA from "@/components/home/DonationCTA";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <StatsBanner />
      <AboutSnippet />
      <FeaturedPrograms />
      <BookiPromo />
      <LatestBlog />
      <DonationCTA />
    </main>
  );
}
```

---

### 13.4 Section-by-Section Specifications

#### `HeroSection.tsx`

- **Type:** Client Component (`"use client"` — requires GSAP entrance animation)
- **Layout:** Full viewport height (`min-h-screen`) with a centered content block
- **Content:**
  - Main headline: Name of the institution
  - Subheading: Short mission tagline
  - Two CTA buttons: "Explore Booki →" (links to `/booki`) and "Learn About Us" (links to `/about`)
  - Background: Gradient using brand colors (`brand-blue` to `brand-pink`) or a warm cream background with a decorative illustration
- **Animation:** GSAP entrance — headline fades up, subheading staggered after, buttons staggered last. Duration: ~800ms total with power2.out easing.
- **Accessibility:** `<h1>` must be the institution name. Both buttons must be `<a>` tags (links), not `<button>` elements, since they navigate to other pages.

#### `StatsBanner.tsx`

- **Type:** Server Component (static data — no hooks needed)
- **Layout:** Horizontal flex or 3-column grid of stat cards
- **Content:** 3 key statistics (e.g., total books, registered readers, active programs) — use placeholder numbers for now
- **Animation:** Scroll-triggered count-up animation via GSAP (add `"use client"` when implementing animation)
- **Accessibility:** Each stat must have a descriptive `aria-label` (e.g., `aria-label="Over 500 books in our collection"`)

#### `AboutSnippet.tsx`

- **Type:** Server Component
- **Layout:** Two-column on desktop (text left, decorative image/illustration right); single column on mobile
- **Content:** 2–3 sentences about the organization's mission, a "Read More →" link to `/about`
- **Animation:** Scroll-triggered fade-in from left (text) and fade-in from right (image) using GSAP ScrollTrigger
- **Image:** Use `<Image>` from `next/image`. Provide a placeholder if no actual image is available yet.

#### `FeaturedPrograms.tsx`

- **Type:** Server Component (static data for now)
- **Layout:** 3-column card grid on desktop, 1-column on mobile
- **Content:** 3 program cards. Each card has: program icon (Lucide icon), title, short description, and a link
- **Data:** Use hard-coded static data array for now. When Supabase integration is built, swap to a server fetch.
- **Animation:** Stagger entrance with GSAP ScrollTrigger on the card grid

#### `BookiPromo.tsx`

- **Type:** Client Component (may have interactive hover effects or animation)
- **Layout:** Full-width section with a prominent visual (illustration or decorative element) and text
- **Content:** Headline promoting the Booki AI, 2–3 feature highlights, a bold "Try Booki Now →" CTA button linking to `/booki`
- **Styling:** Use `brand-blue` as the dominant color for this section to differentiate it visually
- **Note:** This is the most important conversion section on the page. Make it visually distinctive.

#### `LatestBlog.tsx`

- **Type:** Server Component
- **Layout:** 2–3 card horizontal row on desktop, stacked on mobile
- **Content:** Blog post teaser cards (title, date, category badge, short excerpt, "Read More" link)
- **Data:** Static placeholder data for now. Will connect to Supabase blog table later.
- **Animation:** Stagger card entrance on scroll

#### `DonationCTA.tsx`

- **Type:** Server Component
- **Layout:** Full-width section with a clear headline, supporting text, and a prominent button
- **Content:** Motivational donation message, "Donate Now →" button linking to `/donation`
- **Styling:** Warm background using `neutral-cream` or `neutral-creamLight`. Consider a subtle `brand-orange` or `brand-yellow` accent.

---

### 13.5 Home Page — Components to Build First (Pre-Requisite)

Before building the Home Page sections, the following shared layout components must exist and be functional:

```
src/components/layout/Navbar.tsx     → Must be complete first
src/components/layout/Footer.tsx     → Must be complete first
src/app/layout.tsx                   → Root layout must wrap with Navbar + Footer
src/components/providers/MantineThemeProvider.tsx  → Already implemented in Phase 0
```

The root `src/app/layout.tsx` must inject:
1. `<ColorSchemeScript />` in `<head>` to prevent FOUC
2. `<MantineThemeProvider>` wrapping all children
3. `<Navbar />` before `{children}`
4. `<Footer />` after `{children}`

---

### 13.6 Home Page — Checklist Before Moving to Next Page

Use the standard checklist from Chapter 12, **plus** these Home Page-specific items:

```
HOME PAGE SPECIFIC CHECKS:

[ ] HeroSection h1 contains the institution name (not a placeholder)
[ ] All CTA buttons link to the correct routes (/booki, /about, /donation)
[ ] StatsBanner numbers are accurate or clearly marked as placeholders
[ ] FeaturedPrograms cards all have proper alt text on images/icons
[ ] BookiPromo CTA link correctly navigates to /booki
[ ] LatestBlog post data is clearly labeled as placeholder
[ ] DonationCTA button links to /donation
[ ] All GSAP ScrollTriggers fire correctly when scrolling down
[ ] Page renders without hydration mismatch warnings in browser console
[ ] ColorSchemeScript prevents any FOUC on initial load
[ ] Page is a Server Component at the top level (src/app/page.tsx)
[ ] Static metadata (title, description) exported from page.tsx for SEO
[ ] export const metadata confirmed present in src/app/page.tsx
```

---

### 13.7 Updating This Chapter for the Next Page

When the Home Page is complete and verified, update this chapter as follows:

1. Change the **Current Active Page** in Section 13.1 to the new target (e.g., "About Page" at `/about`).
2. Replace Sections 13.2–13.6 with the equivalent specifications for the new page.
3. Commit the updated `AGENTS.md` as part of the task handoff.
4. Announce the update to the team so all agents reload this document.

**Page development sequence (recommended order):**

```
[✓] Phase 0: Infrastructure & Foundation
[ ] Phase 1: Navbar + Footer (layout components — prerequisite for all pages)
[ ] Phase 2a: Home Page          ← CURRENT ACTIVE FOCUS
[ ] Phase 2b: About Page
[ ] Phase 2c: Donation Page
[ ] Phase 3a: Programs Page
[ ] Phase 3b: Blog Listing
[ ] Phase 3c: Blog Detail [slug]
[ ] Phase 4a: Login Page
[ ] Phase 4b: Admin Layout + Sidebar
[ ] Phase 4c: Admin sub-pages (Books, Blog management)
[ ] Phase 5:  Booki RAG Interface (Capstone)
```

---

## Appendix: Quick Reference

### Technology Documentation Links

| Technology | Version | Documentation |
|---|---|---|
| Next.js | 16.2.6 | https://nextjs.org/docs |
| React | 19.2.0 | https://react.dev |
| Mantine UI | 8.3.18 | https://mantine.dev |
| Tailwind CSS | 3.4.17 | https://tailwindcss.com/docs |
| GSAP | 3.13.0 | https://gsap.com/docs/v3 |
| `@gsap/react` | 2.1.2 | https://gsap.com/resources/React |
| Supabase JS | 2.58.0 | https://supabase.com/docs/reference/javascript |
| Lucide React | 0.553.0 | https://lucide.dev/icons |
| OpenNext Cloudflare | 1.19.11 | https://opennext.js.org/cloudflare |
| TypeScript | 5.9.2 | https://www.typescriptlang.org/docs |

### Critical File Locations

```
src/app/layout.tsx                          → Root layout (Mantine, Navbar, Footer, Font)
src/app/globals.css                         → Global CSS (import order is sacred)
src/app/page.tsx                            → Home Page (current active task)
src/app/api/chat/route.ts                   → The ONLY Next.js API Route Handler
src/components/providers/MantineThemeProvider.tsx → Mantine context + brand colors
src/lib/supabase/client.ts                  → Supabase browser client
src/lib/supabase/server.ts                  → Supabase server client (SSR)
src/middleware.ts                           → Supabase session + admin route guard
src/types/index.ts                          → All shared TypeScript interfaces
src/hooks/useBookiChat.ts                   → Booki chat state hook (needs full impl.)
tailwind.config.ts                          → Brand colors and Tailwind config
postcss.config.mjs                          → PostCSS + Mantine breakpoint vars
wrangler.jsonc                              → Cloudflare Worker configuration
open-next.config.ts                         → OpenNext Cloudflare adapter config
```

---

*This document is a living specification. It must be updated at each phase boundary.*
*Always verify rules against the actual repository files before implementing.*
*Repository: `pan-don/interface_booki` · Branch: `main`*