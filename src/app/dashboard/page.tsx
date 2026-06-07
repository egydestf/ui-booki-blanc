import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Sparkles, BookOpen, Compass, ArrowRight, BookMarked, MessageSquare } from "lucide-react";

export default async function UserDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name, avatar_url, role")
    .eq("id", user.id)
    .single();

  // Direct administrators to the admin dashboard
  if (profile?.role === "admin") {
    redirect("/admin/dashboard");
  }

  const displayName = profile?.full_name || profile?.username || user.email?.split("@")[0] || "Pembaca";
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8F1E9] via-white to-[#F8F1E9]/30 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Banner */}
        <div 
          className="relative overflow-hidden rounded-2xl p-8 sm:p-10 mb-8 border border-white/20 text-white shadow-xl"
          style={{
            background: "linear-gradient(135deg, #0A96E6 0%, #056fae 100%)",
            boxShadow: "0 10px 30px rgba(10, 150, 230, 0.25)"
          }}
        >
          {/* Decorative backdrop blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-brand-pink/20 rounded-full blur-2xl -mb-12 pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-center gap-6 z-10">
            <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-2xl font-bold tracking-wider backdrop-blur-sm shadow-inner shrink-0">
              {initials}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Selamat Datang, {displayName}!
              </h1>
              <p className="text-white/80 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                Akses rekomendasi buku AI personal, pantau riwayat bacaan Anda, dan eksplorasi program Rumah Literasi Tambaksogra dari satu tempat.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* Card 1: Booki Chat bot */}
          <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue mb-5 group-hover:scale-110 transition-transform duration-300">
                <Sparkles size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Tanya Booki AI</h3>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                Butuh referensi buku pelajaran SD, SMP, atau SMA? Tanyakan langsung pada asisten AI cerdas kami untuk rekomendasi instan.
              </p>
            </div>
            <Link
              href="/booki"
              className="mt-6 inline-flex items-center gap-1.5 text-brand-blue font-bold text-sm group-hover:gap-2.5 transition-all"
            >
              <span>Mulai Percakapan</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Card 2: Library Catalog */}
          <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-pink/10 flex items-center justify-center text-brand-pink mb-5 group-hover:scale-110 transition-transform duration-300">
                <BookOpen size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Katalog Buku</h3>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                Jelajahi koleksi buku fisik dan digital terbaik yang tersedia di perpustakaan Rumah Literasi Tambaksogra secara terstruktur.
              </p>
            </div>
            <Link
              href="/programs"
              className="mt-6 inline-flex items-center gap-1.5 text-brand-pink font-bold text-sm group-hover:gap-2.5 transition-all"
            >
              <span>Eksplorasi Program</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Card 3: Saved/History (Placeholder) */}
          <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange mb-5 group-hover:scale-110 transition-transform duration-300">
                <Compass size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Jelajahi Blog</h3>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                Ikuti perkembangan kegiatan belajar-mengajar, rilis dokumentasi, dan wawasan edukasi terbaru dari kami.
              </p>
            </div>
            <Link
              href="/blog"
              className="mt-6 inline-flex items-center gap-1.5 text-brand-orange font-bold text-sm group-hover:gap-2.5 transition-all"
            >
              <span>Baca Artikel</span>
              <ArrowRight size={16} />
            </Link>
          </div>
          
        </div>

        {/* Dashboard Feed Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left panel: Quick activity */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 p-6 shadow-md">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BookMarked size={18} className="text-brand-blue" />
              Aktivitas Terakhir Anda
            </h3>
            
            <div className="border border-dashed border-slate-200 rounded-lg p-8 text-center text-slate-400">
              <MessageSquare size={36} className="mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-medium">Belum ada riwayat percakapan dengan Booki.</p>
              <p className="text-xs text-slate-400 mt-1">Gunakan tombol Coba Booki di navigasi untuk memulai obrolan baru.</p>
            </div>
          </div>

          {/* Right panel: Information sidebar */}
          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-md">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Rumah Literasi Info</h3>
            <div className="space-y-4">
              <div className="p-4 bg-brand-blue/5 rounded-lg border border-brand-blue/10">
                <h4 className="text-xs font-extrabold uppercase text-brand-blue tracking-wide">Jam Operasional</h4>
                <p className="text-sm text-slate-700 font-semibold mt-1">Senin - Sabtu: 14:00 - 17:00</p>
                <p className="text-xs text-slate-500 mt-0.5">Minggu dan Hari Libur Nasional tutup.</p>
              </div>

              <div className="p-4 bg-brand-pink/5 rounded-lg border border-brand-pink/10">
                <h4 className="text-xs font-extrabold uppercase text-brand-pink tracking-wide">Butuh Bantuan?</h4>
                <p className="text-sm text-slate-700 font-semibold mt-1">Hubungi Tim Pembimbing</p>
                <p className="text-xs text-slate-500 mt-0.5">Silakan datang langsung ke Rumah Literasi di desa Tambaksogra untuk peminjaman buku.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
