# Rumah Literasi Tambaksogra & Booki RAG System - Frontend Architecture

## Chain of Thought Reasoning

1. **Folder Structure Pattern**: I've chosen a feature-driven organizational pattern within Next.js App Router's `src/app` directory. By splitting global and feature-specific components (`components/layout`, `components/booki`, `components/admin`), we keep the institutional profile elements independent from the highly dynamic RAG and Admin features.

2. **Separating Global UI from Feature Logic**:
   - Since the "Booki" RAG system shares the main layout (Navbar and Footer), it resides under `src/app/booki/page.tsx`, seamlessly integrating into the root `layout.tsx`.
   - The Admin dashboard utilizes Route Groups or a nested `layout.tsx` inside `src/app/admin/layout.tsx` to provide a dedicated sidebar for its 4 sub-views (Add Book, Update Book, Delete Book, Blog Management) while remaining protected.
   - We will implement Mantine UI globally through a `MantineProvider` wrapped inside the root layout (`src/components/providers/MantineThemeProvider.tsx`) to ensure Mantine components work flawlessly in the App Router without causing SSR hydration mismatches.

3. **Cloudflare Edge Deployment**: The architecture emphasizes Edge compatibility. All API routes and server-side Supabase SSR integrations are designed to run efficiently on `@cloudflare/next-on-pages` using standard Next.js edge runtime configurations.

4. **Chronological Phased Execution**: The To-Do list flows logically from highest certainty/lowest cognitive load (scaffolding static UI) to highest complexity (the Booki RAG system). We first lay down the foundational layout and theming, then build the static institutional pages. From there, we tackle Supabase Auth and the protected Admin layouts. Finally, with all infrastructure solid, we focus entirely on the Capstone Core: the Booki streaming RAG interface and its state management via React Context.

---

## 1. File and Folder Architecture Blueprint

```text
Rumah-Literasi-Tambaksogra/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.mjs
├── eslint.config.mjs
└── src/
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx                # [Placeholder] Root layout with MantineProvider, Navbar, Footer
    │   ├── page.tsx                  # [Placeholder] Institutional Home Page
    │   ├── about/
    │   │   └── page.tsx              # [Placeholder] About/Tentang Page
    │   ├── programs/
    │   │   └── page.tsx              # [Placeholder] Programs Page
    │   ├── blog/
    │   │   ├── page.tsx              # [Placeholder] Blog Listing
    │   │   └── [slug]/
    │   │       └── page.tsx          # [Placeholder] Blog Detail Page
    │   ├── donation/
    │   │   └── page.tsx              # [Placeholder] Donation UI
    │   ├── booki/
    │   │   └── page.tsx              # [Placeholder] Booki RAG System Chat Interface
    │   ├── login/
    │   │   └── page.tsx              # [Placeholder] Login/Register Auth View
    │   ├── admin/
    │   │   ├── layout.tsx            # [Placeholder] Protected Admin Layout with Sidebar
    │   │   ├── page.tsx              # [Placeholder] Admin Dashboard Overview
    │   │   ├── books/
    │   │   │   ├── add/
    │   │   │   │   └── page.tsx      # [Placeholder] Add Book View
    │   │   │   ├── update/
    │   │   │   │   └── page.tsx      # [Placeholder] Update Book View
    │   │   │   └── delete/
    │   │   │       └── page.tsx      # [Placeholder] Delete Book View
    │   │   └── blog/
    │   │       └── page.tsx          # [Placeholder] Blog Management View
    │   └── api/
    │       └── chat/
    │           └── route.ts          # [Placeholder] Edge API route for AI RAG streaming
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.tsx            # [Placeholder]
    │   │   ├── Footer.tsx            # [Placeholder]
    │   │   └── AdminSidebar.tsx      # [Placeholder]
    │   ├── booki/
    │   │   ├── ChatContainer.tsx     # [Placeholder]
    │   │   ├── MessageBubble.tsx     # [Placeholder]
    │   │   └── ChatInput.tsx         # [Placeholder]
    │   ├── ui/
    │   │   └── Loader.tsx            # [Placeholder]
    │   └── providers/
    │       └── MantineThemeProvider.tsx # [Placeholder] Mantine Context Wrapper
    ├── hooks/
    │   └── useBookiChat.ts           # [Placeholder] React hook for chat state & streaming
    ├── lib/
    │   ├── supabase/
    │   │   ├── client.ts             # [Placeholder] Supabase Browser Client
    │   │   ├── server.ts             # [Placeholder] Supabase Server Client
    │   │   └── middleware.ts         # [Placeholder] Supabase Edge Middleware (Auth Guard)
    │   └── utils.ts                  # [Placeholder] Utility functions (e.g., Tailwind merge)
    └── types/
        └── index.ts                  # [Placeholder] Shared TypeScript interfaces
```

---

## 2. Chronological Phased To-Do List

### Phase 1: Setup & Layout Foundation
- **Task**: Initialize Application Core
- **Objective**: Scaffold Next.js App Router, configure Tailwind CSS, Mantine UI, and standard layouts.
- **Key Elements**: MantineProvider integration inside Root Layout, global `.css` definitions, Navbar & Footer layout implementations, basic GSAP configuration setup.

### Phase 2: Static & Presentational Profile Pages
- **Task**: Build Informational Pages
- **Objective**: Develop the non-interactive profile content to establish the institutional presence.
- **Key Elements**: Home Page hero sections, About/Tentang page, Donation page UI layout. Implement simple `@gsap/react` entrance animations (fade-ins, slide-ups) for visual polish.

### Phase 3: Dynamic Profile Content
- **Task**: Build Programs and Blog Views
- **Objective**: Create the UI components meant to consume dynamic data (which will later come from Supabase).
- **Key Elements**: Programs page layout, Blog Listing grid layout, and individual Blog Detail `[slug]` pages. Incorporate GSAP scroll triggers for list item staggers.

### Phase 4: Supabase Authentication & Admin Routing
- **Task**: Secure the Application and Build Admin Shell
- **Objective**: Integrate `@supabase/ssr` to handle user authentication and protect the Admin routes.
- **Key Elements**: Login/Register views, Supabase middleware configuration for route guarding `/admin`, Admin Sidebar layout, and the 4 Admin sub-views (Add Book, Update Book, Delete Book, Blog Management) UI mockups.

### Phase 5: The "Booki" RAG System Interface & State (Capstone Core)
- **Task**: Implement Interactive AI Chat
- **Objective**: Build the stateful, streaming interface for the "Booki" book recommendation agent.
- **Key Elements**: `ChatContainer`, `MessageBubble`, and `ChatInput` components. Create the `useBookiChat` hook utilizing React Context/Hooks to manage message arrays, loading states, and edge-runtime API streaming from the backend. Integrate seamlessly into the global layout at the `/booki` route.
