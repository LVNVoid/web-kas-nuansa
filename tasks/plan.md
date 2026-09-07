# Implementation Plan: Kas App (Rekap Keuangan Lingkungan)

## Overview
Membangun aplikasi web manajemen Kas & Keuangan lingkungan berbasis Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, PostgreSQL (Neon), Prisma ORM, dan Notion Design System. Aplikasi menyediakan Dashboard Publik transparan untuk warga (saldo kas dan matriks pembayaran) serta Panel Admin terproteksi untuk pencatatan transaksi, pengelolaan master data blok, dan generator laporan WhatsApp.

## Architecture Decisions
- **Next.js 16 App Router**: Struktur halaman terbagi menjadi Public (`/`) dan Protected Admin (`/admin/*`).
- **Design System**: Notion Design System dari `DESIGN.md` (`#f6f5f4` canvas-soft, `#0075de` notion-blue, clean hairlines, micro-shadows, dan pill controls).
- **Database & Prisma 7**: PostgreSQL Neon dengan Prisma Client singleton di `src/lib/prisma.ts`.
- **Vertical Slicing**: Pengerjaan bertahap dari foundation + public view, auth + master data, form transaksi, hingga broadcast engine.

## Task List

### Phase 1: Foundation & Public View
- [ ] **Task 1**: Database Seeding & Data Access Utilities
- [ ] **Task 2**: Public Dashboard UI (Rekap Saldo & Matriks Iuran Blok)

### Checkpoint: Foundation & Public View
- [ ] Dashboard publik dapat diakses tanpa login, menampilkan saldo dan matriks lunas/belum lunas dengan responsif di mobile.

### Phase 2: Authentication & Master Data
- [ ] **Task 3**: Admin Auth & Protected Route Middleware
- [ ] **Task 4**: Admin Master Data Blok (CRUD Blok Hunian Dinamis)

### Checkpoint: Auth & Master Data
- [ ] Pengurus dapat login, mengakses area `/admin`, dan mengelola data blok hunian yang langsung merefleksikan perubahan pada matriks publik.

### Phase 3: Transaction Management
- [ ] **Task 5**: Admin Input & Edit Pemasukan (Iuran, Kas, Infaq, THR)
- [ ] **Task 6**: Admin Pencatatan Pengeluaran Kas & Mutasi

### Checkpoint: Transaction Management
- [ ] Transaksi masuk dan keluar dapat dicatat dan otomatis mengupdate saldo berjalan secara real-time.

### Phase 4: The Broadcast Engine & Polish
- [ ] **Task 7**: WhatsApp Broadcast Generator ("Copy to Clipboard")
- [ ] **Task 8**: End-to-End Polish, Quality Checks, and Vault Sync

### Checkpoint: Complete
- [ ] Seluruh kriteria penerimaan terpenuhi, tes dan linter lolos 100%, dokumentasi vault tersinkronisasi.

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Matriks blok terlalu lebar di layar mobile | High | Desain tata letak berbasis CSS Grid adaptif dengan pill status yang nyaman di-tap |
| Koneksi database serverless Neon timeout pada cold start | Medium | Gunakan connection pooling dan fallback UI/loading skeleton |
| Format broadcast WA berantakan | Low | Gunakan string template berbasis baris terstruktur dengan penanganan null yang aman |
