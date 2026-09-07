<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

- **Dev Server**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Typecheck**: `npx tsc --noEmit`
- **Test**: `npm test`
- **Quality Check**: `npm run lint; if ($?) { npx tsc --noEmit; if ($?) { npm test } }`

## Architecture & Stack

- **Framework**: Next.js 16 (App Router) & React 19
- **Database & ORM**: PostgreSQL (Serverless via Neon) & Prisma ORM (`prisma/schema.prisma`)
- **Testing**: Jest (`jest.config.ts`, `npm test`)
- **Paths**: `@/*` points to `src/*`
- **Styling**: Tailwind CSS v4 configured via `@theme inline` in `src/app/globals.css`. Do not add a `tailwind.config.js`.
- **Design System**: Follow design tokens and styling guidelines defined in `DESIGN.md`.

## Coding Standards & Architecture (Next.js Clean Architecture)

Master rule terdokumentasi di Obsidian:
`C:\Users\Elvien\Obsidian\LVN\02 - Prompts & Rules\Rules - Clean Architecture Nextjs.md`

## Execution Rules & Guidelines

- **Working Directory**: Always set `workdir` to the specific project subdirectory before running builds, tests, or package management commands. Do not install dependencies or initialize global packages in the user root (`~`).
- **Git Operations**: Run git commands strictly within project subdirectories containing `.git`.
- **File System Safety**: Do not modify system-level user folders (`AppData`, `Searches`, `Saved Games`, registry hives `NTUSER.DAT*`, etc.).

## Obsidian Knowledge Base & Session Protocol

- **Vault Path**: `C:\Users\Elvien\Obsidian\LVN`
- **Remote Repo**: `https://github.com/LVNVoid/obsidian-vault.git`
- **Project Folder**: `01 - Projects\Kas-App\`
- **Session Initialization (Awal Sesi)**:
  1. Jalankan `git -C "C:\Users\Elvien\Obsidian\LVN" pull` untuk sinkronisasi catatan dan memori terbaru dari Cloud Worker (VPS).
  2. Baca catatan relevan dari vault terlebih dahulu:
     - `00 - Dashboards\Home.md` untuk overview dan indeks catatan.
     - `01 - Projects\Kas-App\` untuk project spec, backlog, atau requirements aktif (`Kas-App Overview.md`).
     - `02 - Prompts & Rules\` untuk panduan & aturan prompt kustom.
     - `03 - Knowledge Base\Debugging Log.md` untuk referensi solusi error/bug yang pernah dialami sebelumnya.
- **Automatic Knowledge & Progress Sync (Mandatory - Akhir Sesi)**:
  - Setiap kali menyelesaikan pekerjaan substantif/fitur/debugging, lakukan update dan push otomatis:
    1. **Bug / Error Fix**: Buat catatan baru di `03 - Knowledge Base/` menggunakan format `05 - Templates/Template - Debugging.md`, lalu cantumkan link wikilink-nya ke dalam `03 - Knowledge Base/Debugging Log.md`.
    2. **Fitur Baru / Perubahan Arsitektur**: Perbarui atau buat file spesifikasi modular di `01 - Projects\Kas-App\` (misal: `05 - Templates/Template - Feature Spec.md`) dan sinkronkan statusnya di `01 - Projects/Active Projects.md` serta MOC project terkait.
    3. **Session Log**: Buat file atomic log baru per sesi di `01 - Projects\Kas-App\Logs\<subsystem>\YYYY-MM-DD - <Judul Sesi>.md` dan cantumkan link wikilink-nya ke dalam `01 - Projects\Kas-App\Logs\Logs Index.md`.
    4. **Konsep / Trik Baru**: Tambahkan poin catatan ringkas ke `03 - Knowledge Base/TIL - Today I Learned.md`.
    5. **Git Push**: Jalankan `git -C "C:\Users\Elvien\Obsidian\LVN" add .`, `git -C "C:\Users\Elvien\Obsidian\LVN" commit -m "docs(vault): <ringkasan log>"`, dan `git -C "C:\Users\Elvien\Obsidian\LVN" push` ke GitHub repo `LVNVoid/obsidian-vault.git`.
  - Gunakan format Obsidian Wikilinks `[[folder/nama_file|Label]]` dan pastikan format konsisten.
