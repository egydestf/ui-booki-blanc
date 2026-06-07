"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/types";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Alert,
  Divider,
} from "@mantine/core";
import { Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";

// Google Icon component
function GoogleIcon() {
  return (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Redirect target
  const redirectTo = searchParams.get("redirectTo") ?? "/";
  const errorParam = searchParams.get("error");

  // State
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(
    errorParam ? decodeURIComponent(errorParam) : null
  );
  const [success, setSuccess] = useState<string | null>(null);

  // Client-side validation
  const validateForm = (): boolean => {
    if (!email.trim() || !password.trim()) {
      setError("Email dan kata sandi wajib diisi.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Format email tidak valid.");
      return false;
    }
    if (password.length < 6) {
      setError("Kata sandi harus minimal 6 karakter.");
      return false;
    }
    return true;
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) throw signInError;

      const user = signInData?.user;
      if (!user) throw new Error("Gagal mengambil data pengguna.");

      // Fetch user profile role from public.profiles
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Error fetching user profile role:", profileError);
      }

      const role = (profile?.role as string) === "admin" ? "admin" : "user";

      setSuccess("Masuk berhasil! Mengalihkan...");
      
      const targetPath = role === "admin" ? "/admin/dashboard" : "/dashboard";
      router.push(targetPath);
      router.refresh();
    } catch (err: unknown) {
      console.error("Login error:", err);
      const message = err instanceof Error ? err.message : "Terjadi kesalahan saat masuk. Silakan coba lagi.";
      setError(
        message === "Invalid login credentials"
          ? "Email atau kata sandi salah."
          : message
      );
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const callbackUrl = new URL("/auth/callback", window.location.origin);
      callbackUrl.searchParams.set("next", redirectTo);

      const { error: oAuthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl.toString(),
        },
      });

      if (oAuthError) throw oAuthError;
    } catch (err: unknown) {
      console.error("Google OAuth error:", err);
      const message = err instanceof Error ? err.message : "Gagal menghubungkan dengan Google.";
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Paper
        radius="lg"
        p={{ base: "xl", sm: "32px" }}
        className="shadow-xl border border-slate-100 bg-white/95 backdrop-blur-sm"
      >
        <div className="text-center mb-8">
          <Title order={2} className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Selamat Datang Kembali
          </Title>
          <Text size="sm" className="text-slate-500 mt-2">
            Masuk untuk mengakses rekomendasi buku Booki
          </Text>
        </div>

        {error && (
          <Alert
            icon={<AlertCircle size={16} />}
            title="Gagal Masuk"
            color="red"
            variant="light"
            radius="md"
            className="mb-6 font-medium"
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            title="Berhasil"
            color="teal"
            variant="light"
            radius="md"
            className="mb-6 font-medium"
          >
            {success}
          </Alert>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <TextInput
            label="Email"
            placeholder="nama@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            leftSection={<Mail size={16} className="text-slate-400" />}
            radius="md"
            styles={{
              input: {
                transition: "all 0.2s ease",
                "&:focus": { borderColor: "var(--mantine-color-brandBlue-6)" },
              },
            }}
          />

          <PasswordInput
            label="Kata Sandi"
            placeholder="Masukkan kata sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            leftSection={<Lock size={16} className="text-slate-400" />}
            radius="md"
            styles={{
              input: {
                transition: "all 0.2s ease",
                "&:focus-within": { borderColor: "var(--mantine-color-brandBlue-6)" },
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
            radius="md"
            size="md"
            className="mt-6 font-bold shadow-md transition-all duration-200"
            styles={{
              root: {
                background: "linear-gradient(135deg, #0A96E6 0%, #0780c7 100%)",
                border: 0,
                color: "#fff",
                "&:hover": {
                  background: "linear-gradient(135deg, #0780c7 0%, #056fae 100%)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(10, 150, 230, 0.3)",
                },
              },
            }}
          >
            Masuk ke Akun
          </Button>
        </form>

        <Divider label="atau masuk dengan" labelPosition="center" className="my-6 text-slate-400 text-xs" />

        <Button
          variant="outline"
          color="gray"
          fullWidth
          onClick={handleGoogleLogin}
          disabled={isLoading}
          radius="md"
          size="md"
          className="font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          leftSection={<GoogleIcon />}
        >
          Masuk dengan Google
        </Button>

        <div className="text-center mt-8 pt-4 border-t border-slate-100">
          <Text size="sm" className="text-slate-600">
            Belum memiliki akun?{" "}
            <Link
              href={redirectTo !== "/" ? `/register?redirectTo=${encodeURIComponent(redirectTo)}` : "/register"}
              className="font-bold text-brand-blue hover:text-brand-blue/80 transition-colors inline-flex items-center gap-0.5 hover:underline"
            >
              Daftar Sekarang <ArrowRight size={14} />
            </Link>
          </Text>
        </div>
      </Paper>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-tr from-[#F8F1E9] via-[#F0E3D3]/40 to-[#F8F1E9] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <Suspense
        fallback={
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md border border-slate-100 flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-sm text-slate-500 font-medium animate-pulse-soft">Memuat halaman...</p>
          </div>
        }
      >
        <LoginFormContent />
      </Suspense>
    </main>
  );
}