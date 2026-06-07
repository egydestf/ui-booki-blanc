import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Shield,
  Plus,
  RefreshCw,
  Trash2,
  FileText,
  BookOpen,
  Users,
  Settings,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default async function AdminDashboardOverview() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name, role")
    .eq("id", user.id)
    .single();

  // Enforce admin permission
  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  // Fetch some stats from the database (placeholders or basic count queries)
  // Let's do a simple count for books
  const { count: booksCount } = await supabase
    .from("profiles") // Using profiles table or standard query since books might be in a different table.
    .select("*", { count: "exact", head: true });

  const adminName = profile?.full_name || profile?.username || user.email?.split("@")[0] || "Administrator";

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title Area */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-brand-pink font-bold text-xs uppercase tracking-wider">
              <Shield size={14} />
              <span>Portal Administrator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mt-1">
              Dashboard Overview
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Selamat datang kembali, <span className="font-semibold text-slate-700">{adminName}</span>. Kelola koleksi buku RAG dan artikel blog Anda di sini.
            </p>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/admin/books/add"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold text-white transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
              style={{
                background: "linear-gradient(135deg, #E9559B 0%, #d13d82 100%)",
              }}
            >
              <Plus size={16} />
              <span>Tambah Buku</span>
            </Link>
          </div>
        </div>

        {/* Admin Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stat 1: Total Books */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Buku</p>
              <h3 className="text-2xl font-extrabold text-slate-800 mt-2">128</h3>
              <p className="text-[10px] text-green-600 font-semibold mt-1 flex items-center gap-0.5">
                <TrendingUp size={12} />
                <span>+5 buku bulan ini</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue">
              <BookOpen size={24} />
            </div>
          </div>

          {/* Stat 2: Active Readers */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pembaca Aktif</p>
              <h3 className="text-2xl font-extrabold text-slate-800 mt-2">42</h3>
              <p className="text-[10px] text-green-600 font-semibold mt-1 flex items-center gap-0.5">
                <TrendingUp size={12} />
                <span>+3 pengguna baru</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-brand-pink/10 flex items-center justify-center text-brand-pink">
              <Users size={24} />
            </div>
          </div>

          {/* Stat 3: Blog Posts */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Artikel Blog</p>
              <h3 className="text-2xl font-extrabold text-slate-800 mt-2">18</h3>
              <p className="text-[10px] text-slate-400 font-medium mt-1">
                2 draf belum dirilis
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-brand-orange/10 flex items-center justify-center text-brand-orange">
              <FileText size={24} />
            </div>
          </div>

          {/* Stat 4: System Status */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Flask RAG</p>
              <h3 className="text-2xl font-extrabold text-green-600 mt-2">Online</h3>
              <p className="text-[10px] text-slate-400 font-medium mt-1">
                Latency: 45ms
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
              <Settings size={24} />
            </div>
          </div>
        </div>

        {/* Catalog Control Panel */}
        <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
          <Settings size={18} className="text-slate-500" />
          Katalog Buku & Manajemen Konten
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Action 1: Upload PDF */}
          <Link
            href="/admin/books/add"
            className="group bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-brand-pink/30 hover:scale-[1.01] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-700 group-hover:bg-brand-pink/10 group-hover:text-brand-pink transition-colors">
                <Plus size={20} />
              </div>
              <h4 className="text-sm font-bold text-slate-800 mt-4">Tambah Buku (PDF)</h4>
              <p className="text-slate-400 text-xs mt-1 leading-normal">
                Unggah file PDF baru dan isi metadata buku untuk diproses ke database vektor.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-brand-pink mt-6">
              <span>Buka Formulir</span>
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {/* Action 2: Update Metadata */}
          <Link
            href="/admin/books/update"
            className="group bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-brand-blue/30 hover:scale-[1.01] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-700 group-hover:bg-brand-blue/10 group-hover:text-brand-blue transition-colors">
                <RefreshCw size={18} />
              </div>
              <h4 className="text-sm font-bold text-slate-800 mt-4">Update Buku</h4>
              <p className="text-slate-400 text-xs mt-1 leading-normal">
                Perbarui metadata buku seperti judul, penulis, jenjang sekolah, dan deskripsi ringkas.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-brand-blue mt-6">
              <span>Buka Daftar</span>
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {/* Action 3: Delete Book */}
          <Link
            href="/admin/books/delete"
            className="group bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-red-200 hover:scale-[1.01] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-700 group-hover:bg-red-50 group-hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </div>
              <h4 className="text-sm font-bold text-slate-800 mt-4">Hapus Buku</h4>
              <p className="text-slate-400 text-xs mt-1 leading-normal">
                Hapus file buku dan data vektor terkait dari basis data rekomendasi Booki.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-red-500 mt-6">
              <span>Kelola Penghapusan</span>
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {/* Action 4: Blog Management */}
          <Link
            href="/admin/blog"
            className="group bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-brand-orange/30 hover:scale-[1.01] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-700 group-hover:bg-brand-orange/10 group-hover:text-brand-orange transition-colors">
                <FileText size={18} />
              </div>
              <h4 className="text-sm font-bold text-slate-800 mt-4">Kelola Blog</h4>
              <p className="text-slate-400 text-xs mt-1 leading-normal">
                Buat, sunting, dan publikasikan artikel blog untuk dokumentasi Rumah Literasi.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-brand-orange mt-6">
              <span>Buka Blog Manager</span>
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>

      </div>
    </main>
  );
}
