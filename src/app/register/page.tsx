"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Alert,
} from "@mantine/core";
import { Mail, Lock, User, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Redirect target
  const redirectTo = searchParams.get("redirectTo") ?? "/";

  // State
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Client-side validation
  const validateForm = (): boolean => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("Semua kolom wajib diisi.");
      return false;
    }

    // Username validation: alphanumeric + underscores, 3-20 chars
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      setError("Nama pengguna harus 3-20 karakter dan hanya boleh berisi huruf, angka, atau garis bawah (_).");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Format email tidak valid.");
      return false;
    }

    // Password validation
    if (password.length < 6) {
      setError("Kata sandi harus minimal 6 karakter.");
      return false;
    }

    // Confirm password
    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Sign up user with metadata so public.profiles trigger captures it
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
          data: {
            username: username.trim().toLowerCase(),
            full_name: username.trim(),
          },
        },
      });

      if (signUpError) throw signUpError;

      // Check if session is created immediately (meaning email confirmation is disabled)
      if (data.session) {
        setSuccess("Registrasi berhasil! Masuk ke sistem...");
        setTimeout(() => {
          router.push(redirectTo);
          router.refresh();
        }, 1500);
      } else {
        setSuccess(
          "Registrasi berhasil! Tautan konfirmasi telah dikirim ke email Anda. Silakan periksa email Anda untuk memverifikasi akun."
        );
        // Clear fields
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setIsLoading(false);
      }
    } catch (err: unknown) {
      console.error("Registration error:", err);
      const message = err instanceof Error ? err.message : "Terjadi kesalahan saat mendaftar. Silakan coba lagi.";
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
            Daftar Akun Baru
          </Title>
          <Text size="sm" className="text-slate-500 mt-2">
            Mulai jelajahi jutaan rekomendasi buku bersama Booki
          </Text>
        </div>

        {error && (
          <Alert
            icon={<AlertCircle size={16} />}
            title="Gagal Mendaftar"
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
            icon={<CheckCircle size={16} />}
            title="Pendaftaran Berhasil"
            color="teal"
            variant="light"
            radius="md"
            className="mb-6 font-medium"
          >
            {success}
          </Alert>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <TextInput
            label="Nama Pengguna (Username)"
            placeholder="contoh: budi_sanjaya"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            required
            leftSection={<User size={16} className="text-slate-400" />}
            radius="md"
            styles={{
              input: {
                transition: "all 0.2s ease",
                "&:focus": { borderColor: "var(--mantine-color-brandBlue-6)" },
              },
            }}
          />

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
            placeholder="Minimal 6 karakter"
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

          <PasswordInput
            label="Konfirmasi Kata Sandi"
            placeholder="Ulangi kata sandi"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            Daftar Sekarang
          </Button>
        </form>

        <div className="text-center mt-8 pt-4 border-t border-slate-100">
          <Text size="sm" className="text-slate-600">
            Sudah memiliki akun?{" "}
            <Link
              href={redirectTo !== "/" ? `/login?redirectTo=${encodeURIComponent(redirectTo)}` : "/login"}
              className="font-bold text-brand-blue hover:text-brand-blue/80 transition-colors inline-flex items-center gap-0.5 hover:underline"
            >
              Masuk di sini <ArrowRight size={14} />
            </Link>
          </Text>
        </div>
      </Paper>
    </div>
  );
}

export default function RegisterPage() {
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
        <RegisterFormContent />
      </Suspense>
    </main>
  );
}
