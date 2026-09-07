"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, AuthState } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<AuthState | null, FormData>(
    loginAction,
    null
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fbfbfa] px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Brand Header */}
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0075de] text-white font-bold text-sm shadow-xs transition group-hover:bg-[#005bab]">
              RT
            </div>
            <span className="text-lg font-bold tracking-tight text-[#191919]">
              Nuansa Asri
            </span>
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-[#191919]">
            Login Pengurus RT.02 / RW.11
          </h1>
          <p className="mt-1 text-xs text-[#787774]">
            Masuk untuk mencatat setoran iuran dan mutasi kas warga
          </p>
        </div>

        {/* Card Form */}
        <div className="notion-card p-6">
          {state?.error && (
            <div className="mb-4 rounded-lg bg-[#fbf0e8] border border-[#d95700]/20 p-3 text-xs text-[#d95700] font-medium">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-semibold text-[#37352f] mb-1.5"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                placeholder="misal: admin"
                className="w-full rounded-lg border border-[#eae9e5] bg-[#ffffff] px-3 py-2 text-xs text-[#191919] placeholder-[#9b9a97] outline-none transition focus:border-[#0075de] focus:ring-1 focus:ring-[#0075de]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-[#37352f] mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-[#eae9e5] bg-[#ffffff] px-3 py-2 text-xs text-[#191919] placeholder-[#9b9a97] outline-none transition focus:border-[#0075de] focus:ring-1 focus:ring-[#0075de]"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="mt-2 w-full rounded-lg bg-[#0075de] py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#005bab] active:scale-[0.98] disabled:opacity-50"
            >
              {isPending ? "Memverifikasi..." : "Masuk ke Panel Admin"}
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-[#787774] hover:text-[#0075de] transition"
          >
            ← Kembali ke Dashboard Publik
          </Link>
        </div>
      </div>
    </div>
  );
}
