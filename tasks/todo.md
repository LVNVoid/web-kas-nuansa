# Tasks: Kas App Implementation

## Phase 1: Foundation & Public View

### Task 1: Database Seeding & Data Access Utilities
**Description:** Menyiapkan helper query database dan script seeding awal untuk master data blok (Blok B & C) dan periode aktif agar pengembangan UI dapat langsung diverifikasi.
- [x] Acceptance criteria:
  - Helper query untuk agregasi saldo kas, total pemasukan, total pengeluaran, dan status pembayaran per periode.
  - Script seed Prisma (`prisma/seed.ts`) yang dapat dijalankan untuk mengisi data awal jika diperlukan.
- [x] Verification: `npm run lint; if ($?) { npx tsc --noEmit; if ($?) { npm test } }`
- [x] Files: `src/lib/data.ts`, `prisma/seed.ts`, `package.json`

### Task 2: Public Dashboard UI (Rekap Saldo & Matriks Iuran)
**Description:** Membangun tampilan utama `/` publik bergaya Notion Design System (`DESIGN.md`) yang memuat Saldo Kas, ringkasan mutasi, dan visualisasi matriks status lunas/belum lunas per blok.
- [x] Acceptance criteria:
  - Komponen Hero/Header ringkas dengan warna warm paper canvas (`#f6f5f4`) dan aksen Notion blue (`#0075de`).
  - Kartu ringkasan Saldo Berjalan, Total Pemasukan, dan Total Pengeluaran bulan aktif.
  - Grid matriks blok hunian yang menampilkan status lunas (hijau/biru) dan belum lunas (abu-abu/muted) secara mobile-friendly.
  - Filter pemilihan periode (Bulan & Tahun).
- [x] Verification: `npm run build; if ($?) { npm test }`
- [x] Files: `src/app/page.tsx`, `src/components/public/*`

## Checkpoint: Phase 1
- [x] Dashboard publik render tanpa error dan responsif di mobile.

---

## Phase 2: Authentication & Master Data

### Task 3: Admin Auth & Protected Route Middleware
**Description:** Membangun sistem login khusus pengurus (username/password hash) dan middleware proteksi untuk seluruh rute di bawah `/admin`.
- [x] Acceptance criteria:
  - Halaman login admin `/login` dengan gaya Notion.
  - Session cookie berbasis server-side JWT / secure cookie.
  - Middleware me-redirect pengunjung tanpa auth saat mengakses `/admin/*`.
- [x] Verification: `npm run lint; if ($?) { npx tsc --noEmit; if ($?) { npm test } }`
- [x] Files: `src/app/login/page.tsx`, `src/middleware.ts`, `src/lib/auth.ts`

### Task 4: Admin Master Data Blok (CRUD)
**Description:** Membangun antarmuka pengelolaan data master blok hunian dinamis (Tambah, Edit, Hapus) di `/admin/blocks`.
- [x] Acceptance criteria:
  - Tabel daftar blok dengan nama blok, pemilik, nomor kontak, dan status hunian.
  - Modal / Form untuk menambah dan mengedit blok.
  - Server actions untuk memproses mutasi data secara type-safe.
- [x] Verification: `npm run build; if ($?) { npm test }`
- [x] Files: `src/app/admin/blocks/*`, `src/app/actions/blocks.ts`

## Checkpoint: Phase 2
- [x] Admin dapat login dan mengelola master blok hunian secara dinamis.

---

## Phase 3: Transaction Management

### Task 5: Admin Input & Edit Pemasukan (Iuran, Kas, Infaq, THR)
**Description:** Antarmuka pencatatan pembayaran warga per blok dan per periode di `/admin/payments`.
- [x] Acceptance criteria:
  - Form/tabel pencatatan dengan kolom terpisah: Iuran, Kas, Infaq, dan kolom khusus THR jika bulan aktif memiliki opsi THR.
  - Fitur toggle status lunas cepat (*quick toggle*).
- [x] Verification: `npm run build; if ($?) { npm test }`
- [x] Files: `src/app/admin/payments/*`, `src/app/actions/payments.ts`

### Task 6: Admin Pencatatan Pengeluaran Kas & Mutasi
**Description:** Antarmuka pencatatan mutasi pengeluaran kas di `/admin/expenses`.
- [x] Acceptance criteria:
  - Form tambah pengeluaran (Tanggal, Kategori, Judul/Uraian, Nominal, Catatan).
  - Tabel riwayat pengeluaran dengan filter periode.
- [x] Verification: `npm run build; if ($?) { npm test }`
- [x] Files: `src/app/admin/expenses/*`, `src/app/actions/expenses.ts`

## Checkpoint: Phase 3
- [x] Transaksi masuk & keluar tersimpan ke database dan mengupdate saldo kas secara real-time.

---

## Phase 4: The Broadcast Engine & Polish

### Task 7: WhatsApp Broadcast Generator
**Description:** Halaman `/admin/broadcast` yang otomatis merangkum data bulan berjalan ke format teks WhatsApp siap kirim.
- [x] Acceptance criteria:
  - Generator teks terstruktur: Header RT, Saldo Awal, Rincian Pemasukan, Rincian Pengeluaran, Saldo Akhir, dan Daftar Blok yang belum bayar.
  - Tombol "Copy to Clipboard" dengan notifikasi sukses.
- [x] Verification: `npm run build; if ($?) { npm test }`
- [x] Files: `src/app/admin/broadcast/*`, `src/lib/broadcast.ts`

### Task 8: End-to-End Polish, Quality Checks, and Vault Sync
**Description:** Review kualitas akhir, unit test tambahan, validasi linting & typecheck, serta dokumentasi sesi di Obsidian Vault.
- [x] Acceptance criteria:
  - All quality checks green (`npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`).
  - Session log & Obsidian Vault tersinkronisasi via git commit & push.
- [x] Verification: `npm run lint; if ($?) { npx tsc --noEmit; if ($?) { npm test; if ($?) { npm run build } } }`
- [x] Files: `__tests__/*`, Obsidian Vault Notes

## Checkpoint: Complete
- [x] Seluruh kriteria penerimaan terpenuhi, tes dan linter lolos 100%, dokumentasi vault tersinkronisasi.
