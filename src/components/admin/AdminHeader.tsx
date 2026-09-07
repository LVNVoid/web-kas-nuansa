'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/app/actions/auth';

interface AdminHeaderProps {
  userName?: string;
}

const NAV_ITEMS = [
  { href: '/admin/blocks', label: 'Master Blok' },
  { href: '/admin/payments', label: 'Pemasukan' },
  { href: '/admin/expenses', label: 'Pengeluaran' },
  { href: '/admin/broadcast', label: 'Broadcast WA' },
];

export function AdminHeader({ userName }: AdminHeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#eae9e5] bg-[#ffffff]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-3">
          <Link href="/admin/blocks" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0075de] text-white font-bold text-xs shadow-sm transition group-hover:bg-[#005bab]">
              NA
            </div>
            <div>
              <span className="text-sm font-semibold tracking-tight text-[#191919] group-hover:text-[#0075de] transition">
                Nuansa Asri
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 rounded-lg border border-[#eae9e5] bg-[#fbfbfa] p-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#ffffff] text-[#0075de] shadow-xs font-semibold'
                    : 'text-[#787774] hover:text-[#191919] hover:bg-[#f1f0ec]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <span className="hidden lg:inline-block rounded-md bg-[#f1f0ec] px-2.5 py-1 text-[11px] font-medium text-[#37352f]">
            {userName || 'Pengurus'}
          </span>

          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-[#eae9e5] bg-[#ffffff] px-2.5 py-1 text-xs font-medium text-[#37352f] hover:bg-[#fbfbfa] hover:text-[#0075de] transition"
          >
            <span>Web Publik</span>
            <span className="text-[10px] text-[#9b9a97]">↗</span>
          </Link>

          <form action={logoutAction} className="hidden sm:block">
            <button
              type="submit"
              className="rounded-lg border border-[#eae9e5] bg-[#ffffff] px-2.5 py-1 text-xs font-medium text-[#d95700] hover:bg-[#fbf0e8] hover:border-[#fbf0e8] transition"
            >
              Keluar
            </button>
          </form>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#eae9e5] bg-[#fbfbfa] text-[#37352f] hover:bg-[#f1f0ec] md:hidden"
          >
            <span className="text-sm">{mobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="border-b border-[#eae9e5] bg-[#ffffff] px-4 py-3 md:hidden space-y-2">
          <div className="grid grid-cols-2 gap-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                    isActive
                      ? 'bg-[#ebf5ff] text-[#0075de] font-semibold'
                      : 'bg-[#fbfbfa] text-[#37352f] hover:bg-[#f1f0ec]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center justify-between border-t border-[#f1f0ec] pt-2.5 mt-2">
            <Link
              href="/"
              target="_blank"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-medium text-[#0075de] hover:underline"
            >
              Lihat Dashboard Publik ↗
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-xs font-semibold text-[#d95700] hover:underline"
              >
                Keluar
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
