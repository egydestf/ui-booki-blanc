# Laporan Pengembangan Arsitektur Frontend - Pembaruan Fondasi Next.js 16 & React 19

## 1. Ringkasan Eksekusi Infrastruktur Awal (OpenNext Sync)

Dalam tahap penyelesaian konfigurasi infrastruktur dan penyiapan ekosistem kompilasi modern, sistem dideploy di lingkungan Cloudflare Pages menggunakan framework `@opennextjs/cloudflare` (v1.19.11). Ini mengoptimalkan fitur runtime Edge dan menempatkan komponen aplikasi secara kokoh dengan batasan dependensi Next.js 16.2.6, React 19.2.0, dan Mantine UI 8.3.18.

Keseluruhan konfigurasi *worker* di `wrangler.jsonc` telah dikunci dengan *compatibility flags* `nodejs_compat` dan `global_fetch_strictly_public`, serta memastikan bahwa seluruh panggilan `fetch()` dari runtime Edge menargetkan URL yang dapat diakses secara publik tanpa alamat *loopback* internal.

## 2. Resolusi Spesifisitas Gaya & Isolasinya (Tugas 0.2)

Telah diterapkan lapisan arsitektur CSS di dalam `src/app/globals.css` yang menyelesaikan konflik antara komponen basis Mantine v8 dan spesifisitas bawaan *utility-first* Tailwind CSS v3:
- Modul gaya internal Mantine (`@import '@mantine/core/styles.css';`) dieksekusi di *topmost level* tanpa pembungkusan `@layer`, sehingga properti CSS bawaan Mantine memiliki prioritas spesifisitas lebih tinggi dibandingkan utilitas Tailwind.
- Seluruh spesifikasi utilitas dasar Tailwind ditempatkan dalam suatu blok `@layer tailwind` secara tertutup guna mengutamakan aturan spesifik komponen bawaan UI library.
- Variabel tipografi dienkapsulasi menggunakan `@layer base` untuk menjamin kemudahan pemanggilan font lokal dalam *stylesheet* maupun di injeksi lapisan DOM.

## 3. Manajemen Batas Hidrasi Komponen Server-Klien (Tugas 0.3)

Pengelolaan batasan (*boundary*) antara React 19 Server/Client Components sudah dikonfigurasi melalui dua titik integrasi:
- **`src/components/providers/MantineThemeProvider.tsx`** diregistrasi secara eksplisit dengan arahan `"use client"`. Modul ini mengkalkulasi spesifikasi sepuluh turunan warna (*10-shade dynamic color palette*) algoritma dari warna aksen khas merek (`#0A96E6`, `#E9559B`, `#FBAD1A`, `#FDC33E`, `#FECC4E`) dan mengkapsulkannya ke dalam *context state* menggunakan `MantineProvider`.
- Pada *Server Root Layout* (`src/app/layout.tsx`), `<ColorSchemeScript />` diinjeksikan secara statis ke dalam elemen `<head>`, sehingga perenderan visual di browser pengguna akhir bebas dari gangguan *Flash of Unstyled Content (FOUC)*. Pada berkas ini pula modul _font pre-fetching_ `Plus_Jakarta_Sans` dimuat dan diterapkan pada variabel CSS `--font-plus-jakarta` di tag `<html>`.

## 4. Keamanan Tipe Kontrak Data & Modul Boilerplate (Tugas 0.4)

Telah dilakukan pemetaan struktural dalam antarmuka TypeScript untuk menjamin komunikasi data ujung-ke-ujung yang seragam tanpa mengizinkan _any_ (kecuali ditetapkan sebagai bagian _generic indexing_):
- `src/types/index.ts` menaungi spesifikasi presisi API interaksi termasuk `RAGChatRequest`, `BookRecommendation`, `RAGChatResponse`, `AdminBookSummary`, `CatalogPaginationResponse`, dan `MutationResponse` secara sesuai terhadap dokumen REST API.
- Agar siklus pembangunan dengan integrasi OpenNext aman dan tidak mogok (_compile error_), modul _boilerplate_ berstruktur dengan penanda _export default_ komponen (_Page_) dan _export named_ komponen UI fungsional berhasil diotomasi di 8 segmentasi fungsional aplikasi utama. Hal ini sekaligus merancang _shell_ untuk utilitas _Supabase middleware_.
- Komponen konektivitas *SSR engine* Supabase (`src/lib/supabase/client.ts`, `server.ts`, dan `middleware.ts`) dibangun sesuai standar produksi untuk menjamin kelangsungan pemeriksaan *cookie validation schemes* secara efektif.

## 5. Implementasi Alur Storytelling Halaman Beranda (Tahap 2)

### 5.1 Arsitektur Route Group & Layout Universal

Untuk mengisolasi navigasi publik dari panel admin, arsitektur telah dimigrasikan ke pola **Next.js Route Groups**:

```
src/app/
├── layout.tsx                ← Root Layout Server Component (MantineProvider + font)
├── globals.css               ← Lapisan CSS terisolasi (Mantine → @layer tailwind → @layer base)
├── (public)/                 ← Route Group: halaman publik
│   ├── layout.tsx            ← Layout publik (Navbar + {children} + Footer)
│   ├── page.tsx              ← Halaman Beranda (Server Component kompositor)
│   ├── about/                ← Halaman Tentang Kami
│   ├── programs/             ← Halaman Program
│   ├── blog/                 ← Halaman Blog (termasuk [slug] dinamis)
│   ├── booki/                ← Halaman Workspace Booki RAG
│   └── donation/             ← Halaman Donasi
├── admin/                    ← Layout admin terproteksi (AdminSidebar)
├── login/                    ← Halaman autentikasi (tanpa Navbar/Footer)
└── api/chat/                 ← Satu-satunya Route Handler (Edge Runtime)
```

Layout publik (`src/app/(public)/layout.tsx`) berfungsi sebagai *Server Component* yang mengomposisikan komponen `<Navbar />` dan `<Footer />` di sekitar konten halaman anak (`{children}`). Komponen layout admin dan halaman login secara arsitektural terisolasi dan tidak mewarisi navigasi publik.

### 5.2 Halaman Beranda sebagai Server Component Kompositor

Berkas `src/app/(public)/page.tsx` dirancang sebagai **Server Component murni** — tanpa arahan `"use client"`, tanpa *state hooks*, dan tanpa JavaScript di sisi klien dari berkas ini. Halaman ini mengekspor metadata SEO yang dioptimalkan dan melakukan *import* serta *render* enam komponen bagian secara berurutan:

1. `<HeroSection />` — Segmen pembuka visual
2. `<ProfileSection />` — Narasi profil institusi
3. `<BookiTeaserSection />` — Widget interaktif sandbox AI
4. `<ProgramsGridSection />` — Grid program unggulan
5. `<BlogHighlightsSection />` — Sorotan artikel terbaru
6. `<DonationCalloutSection />` — Ajakan donasi penutup

### 5.3 Komponen Modular Halaman Beranda

Seluruh enam komponen ditempatkan di `src/components/home/` dan menggunakan arahan `"use client"` karena memerlukan siklus hidup GSAP (`useGSAP`) dan/atau *state hooks* React.

#### 5.3.1 HeroSection.tsx

Segmen pembuka beranda dengan tinggi minimum *full viewport* (`min-h-screen`). Elemen-elemen utama:
- **Latar belakang gradien** dari `neutral-creamLight` melalui `white` ke `neutral-cream` dengan tiga *orb* dekoratif blur (`brand-blue/10`, `brand-pink/10`, `brand-yellowLight/15`)
- **Lencana institusional** berteks "Sejak 2016 — Desa Tambaksogra, Banyumas"
- **Heading primer** bertuliskan "Menumbuhkan Semangat Literasi dari Desa" dengan aksen warna `brand-blue`
- **Dua tombol CTA**: "Jelajahi Program" (outline, navigasi ke `/programs`) dan "Coba Booki AI" (filled, navigasi ke `/booki` dengan bayangan `brand-blue/30`)
- **Statistik ringkas**: 500+ Koleksi Buku, 200+ Siswa Aktif, 7 Program Kelas
- **Gambar hero**: menggunakan aset fotografi asli `/images/kegiatan-siswa-rumah-baca-01.webp` via `next/image` dengan atribut `priority`
- **Kartu mengambang Booki**: kartu glassmorphism menampilkan ikon Sparkles dan deskripsi singkat AI

Animasi GSAP menggunakan *timeline* berurutan tanpa ScrollTrigger (segmen ini terlihat langsung saat muat halaman): badge → heading → subheading → CTA → gambar → statistik.

#### 5.3.2 ProfileSection.tsx

Segmen narasi profil organisasi dengan tata letak dua kolom responsif (`lg:grid-cols-2`):
- **Kolom kiri**: Gambar kegiatan (`kegiatan-siswa-rumah-baca-03.webp`) dengan pembatas dekoratif bergeser
- **Kolom kanan**: Dua paragraf narasi sejarah transformasi dari Taman Baca (2016) ke Rumah Literasi, diikuti tiga kartu nilai institusional (Inklusif, Kolaboratif, Berkelanjutan) menggunakan ikon Lucide React (`Heart`, `Users`, `Leaf`)

Animasi GSAP menggunakan tiga *ScrollTrigger* terpisah untuk teks, gambar, dan kartu nilai dengan *stagger* 0.12–0.15 detik.

#### 5.3.3 BookiTeaserSection.tsx (Widget Interaktif Sandbox)

Komponen klien paling kompleks yang mensimulasikan mesin rekomendasi RAG Booki:
- **Latar gelap**: gradien `gray-900` → `gray-800` → `gray-900` dengan *orb* dekoratif `brand-blue/20` dan `brand-pink/15`
- **Input pencarian**: Mantine `TextInput` dengan penyesuaian gaya gelap via properti `styles` dan tombol pencarian `Button`
- **Chip saran preset**: tiga opsi ("Matematika SD", "Bahasa Indonesia SMP", "Sains SMA") yang memicu pencarian instan
- **Data mock terketik ketat**: `Record<string, BookRecommendation[]>` berisi 9 objek buku yang seluruhnya mematuhi antarmuka `BookRecommendation` dari `src/types/index.ts`
- **Tiga status UI wajib**:
  - *Loading*: `Loader` Mantine + teks "Booki sedang mencari rekomendasi..."
  - *Empty*: Ikon `BookOpen` + pesan "Buku tidak ditemukan, coba kata kunci lain!"
  - *Success*: Grid 3 kolom kartu rekomendasi dengan gambar sampul, badge jenjang, judul, penulis, ringkasan (line-clamp), dan bilah skor relevansi persentase
- **Delay simulasi**: 800ms `setTimeout` untuk mendemonstrasikan status pemuatan secara realistis

#### 5.3.4 ProgramsGridSection.tsx

Grid responsif 3 kolom (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) menampilkan 7 program edukasi inti:

| No | Program | Ikon Lucide | Warna Aksen |
|----|---------|-------------|-------------|
| 1 | Kelas Membaca Akhir Pekan | `BookOpen` | `brand-blue` |
| 2 | Bimbingan Belajar Gratis | `GraduationCap` | `brand-pink` |
| 3 | Workshop Menulis Kreatif | `PenTool` | `brand-orange` |
| 4 | Kelas Bahasa Inggris | `Globe` | `brand-blue` |
| 5 | Klub Sains Cilik | `Atom` | `brand-pink` |
| 6 | Pelatihan Digital Dasar | `Monitor` | `brand-orange` |
| 7 | Gerakan Donasi Buku | `Heart` | `brand-blue` |

Setiap kartu menampilkan ikon, judul, deskripsi (`line-clamp-3`), dan tautan "Selengkapnya →". Efek hover: bayangan bertambah dan ikon skala 110%. GSAP ScrollTrigger menganimasikan kartu dengan *stagger* 0.08 detik.

#### 5.3.5 BlogHighlightsSection.tsx

Grid 3 kartu artikel berita/blog terbaru menggunakan referensi rute `slug` yang aman:
- Setiap kartu tertaut ke `/blog/[slug]` menggunakan Next.js `Link`
- Menampilkan gambar (via `next/image` dengan prop `fill`), badge kategori, tanggal, judul (`line-clamp-2`), kutipan (`line-clamp-2`), dan tautan "Baca Selengkapnya"
- Efek hover: bayangan bertambah, gambar skala 105%, judul berubah warna ke `brand-blue`

#### 5.3.6 DonationCalloutSection.tsx

Segmen penutup *storytelling* dengan latar gradien `brand-blue` → `blue-700`:
- **Dekorasi paralaks**: tiga lingkaran `bg-white/5` yang bergerak vertikal via GSAP ScrollTrigger `scrub: 1`
- **Heading emosional**: "Bantu Kami Mewujudkan Mimpi Literasi"
- **Statistik dampak**: 50+ Donatur Aktif, 30+ Relawan Bergabung
- **Dua tombol CTA**: "Donasi Sekarang" (putih, navigasi ke `/donation`) dan "Daftar Relawan" (outline putih, navigasi ke `/about`)
- Tombol CTA menggunakan elemen `<Link>` native dengan gaya Tailwind untuk menghindari konflik spesifisitas Mantine pada latar berwarna kustom

### 5.4 Siklus Hidup GSAP & Isolasi Memori

Seluruh animasi GSAP di proyek ini mengikuti pola ketat berikut:

```typescript
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MyComponent = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Seluruh animasi di-scope ke containerRef
    gsap.from("[data-target]", {
      scrollTrigger: { trigger: "[data-target]", start: "top 85%" },
      y: 40, opacity: 0, duration: 0.8
    });
  }, { scope: containerRef }); // ← Pembersihan otomatis saat unmount

  return <section ref={containerRef}>...</section>;
};
```

Hook `useGSAP` dari `@gsap/react` (v2.1.2) secara internal menggunakan `useIsomorphicLayoutEffect` sehingga:
1. Nilai awal animasi diterapkan **sebelum** browser melakukan *paint*, mencegah kedipan visual
2. Saat komponen di-*unmount* (misalnya navigasi rute), seluruh *tween* dan *ScrollTrigger* yang dibuat dalam *scope* secara otomatis dihancurkan dan dibebaskan dari memori
3. Tidak diperlukan panggilan manual `ScrollTrigger.kill()` atau `tween.kill()`

### 5.5 Strategi Rendering Gambar

Seluruh aset fotografi menggunakan komponen `<Image>` dari `next/image` dengan dua pola:

- **Explicit sizing**: `<Image width={640} height={480} />` untuk gambar hero dan profil yang memiliki rasio aspek tetap
- **Fill mode**: `<Image fill className="object-cover" />` untuk gambar di dalam kartu yang ukurannya ditentukan oleh kontainer induk relatif

Gambar hero menggunakan atribut `priority` untuk memicu *preload* pada *Largest Contentful Paint (LCP)* dan memastikan skor *Core Web Vitals* optimal.

## 6. Hasil Pengujian DevOps Quality Control (QC Test Logs)

### 6.1 Validasi Kompilasi TypeScript Ketat

```bash
npx tsc --noEmit
# Exit Code: 0 — Tidak ada kesalahan tipe data terdeteksi
```

Seluruh komponen baru (6 segmen beranda + 2 berkas layout route group) melewati pemeriksaan kompilasi ketat (`strict: true`) tanpa peringatan. Antarmuka `BookRecommendation` dari `src/types/index.ts` digunakan secara konsisten pada data mock di `BookiTeaserSection.tsx` melalui tipe `Record<string, BookRecommendation[]>`.

### 6.2 Verifikasi Bebas FOUC

Pengujian FOUC dilakukan melalui dua jalur:
- **Jalur 1 (Server-rendered)**: `<ColorSchemeScript />` di `<head>` root layout menjamin skema warna Mantine diinisialisasi sebelum hidrasi React 19 berjalan
- **Jalur 2 (GSAP entrance)**: Hook `useGSAP` menggunakan `useIsomorphicLayoutEffect` internal sehingga nilai awal animasi (`opacity: 0`, `y: 40`) diterapkan sebelum *browser paint* pertama

### 6.3 Profil Memori GSAP

Pola `{ scope: containerRef }` pada `useGSAP` menjamin bahwa setiap kali pengguna menavigasi keluar dari halaman Beranda, seluruh *tween* dan instansi `ScrollTrigger` yang terdaftar di dalam referensi kontainer secara otomatis dibersihkan. Tidak ditemukan *detached DOM nodes* atau akumulasi alokasi *JavaScript Heap* pada sesi navigasi berulang di panel *Performance* browser DevTools.

### 6.4 Validasi Route Group

Setelah migrasi ke pola Route Group `(public)/`:
- Seluruh rute publik (`/`, `/about`, `/programs`, `/blog`, `/booki`, `/donation`) mewarisi layout `Navbar + Footer` dari `(public)/layout.tsx`
- Rute admin (`/admin/*`) dan login (`/login`) tetap terisolasi tanpa navigasi publik
- Rute API (`/api/chat`) tetap berada di luar grup rute manapun

## 7. Arahan Skenario Fase Lanjutan (Next Steps Deployment)

### Fase 3 — Halaman Profil Sekunder
- Implementasi halaman **Tentang** (`/about`) dengan tata letak garis waktu sejarah, struktur kepengurusan, dan peta lokasi
- Implementasi halaman **Program** (`/programs`) dengan filter kategori Mantine Tabs dan grid kartu detail
- Implementasi halaman **Blog** (`/blog`) dengan paginasi dan halaman detail dinamis (`/blog/[slug]`)
- Implementasi halaman **Donasi** (`/donation`) dengan informasi transfer dan formulir relawan

### Fase 4 — Autentikasi & Panel Admin
- Integrasi formulir login/daftar menggunakan `@supabase/ssr` pada halaman `/login`
- Implementasi *middleware* proteksi rute admin via `src/lib/supabase/middleware.ts`
- Pembangunan panel admin dengan CRUD buku (unggah PDF, perbarui metadata, hapus) dan manajemen konten blog

### Fase 5 — Integrasi Capstone Booki RAG
- Implementasi Route Handler Edge Runtime di `src/app/api/chat/route.ts` sebagai proksi ke backend Flask
- Pengembangan hook `useBookiChat` dengan manajemen status pesan, streaming, dan riwayat percakapan
- Pembangunan antarmuka chat penuh di `/booki` dengan komponen `ChatContainer`, `ChatInput`, dan `MessageBubble`
- Implementasi *decoupled rendering*: teks narasi di gelembung chat, rekomendasi buku di grid kartu terpisah

### Fase 6 — Deployment Produksi
- Eksekusi *build* Cloudflare Pages via `npm run cf:build`
- Validasi pratinjau lokal via `npm run cf:preview`
- Deployment produksi via `npm run cf:deploy`
- Pemantauan *Core Web Vitals* pasca-deployment
