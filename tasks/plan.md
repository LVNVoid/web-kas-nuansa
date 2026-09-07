# Implementation Plan: Vault-Compliant Strict Clean Architecture

## Overview
Melakukan refactoring menyeluruh pada proyek Kas-App agar 100% patuh terhadap aturan standar Clean Architecture yang tercatat di Obsidian Vault (`C:\Users\Elvien\Obsidian\LVN\02 - Prompts & Rules\Rules - Clean Architecture Nextjs.md`). Refaktor ini mencakup pengelompokan domain ke `src/core/` (entities, repository interfaces, domain errors, dan class-based use cases dengan constructor injection), implementasi repository konkret di `src/infrastructure/`, perakitan dependency melalui DI container di `src/di/`, pemindahan komponen ke `src/presentation/`, dan pemanggilan use case melalui DI container di layer Server Actions dan RSC.

## Architecture Decisions
- **Core Domain Layer (`src/core/`)**:
  - `entities/`: Class entity & type shape murni TypeScript (tanpa dependensi ORM/eksternal).
  - `repositories/`: Interface kontrak repository (hanya method signatures dan return entity).
  - `errors/`: Custom domain error classes (`DomainError`, `NotFoundError`, `ConflictError`, `UnauthorizedError`, `ValidationError`).
  - `use-cases/`: Class use case dengan single method `execute(input)` dan constructor dependency injection.
- **Infrastructure Layer (`src/infrastructure/`)**:
  - `database/`: Konfigurasi Prisma singleton (`db.ts` / `prisma.ts`).
  - `repositories/`: Class implementasi repository konkret (`*.repository.impl.ts`).
  - `services/`: Service eksternal (Auth JWT/Cookies, Broadcast WhatsApp).
- **Dependency Injection Container (`src/di/`)**:
  - `tokens.ts`: Identifier string tokens.
  - `container.ts`: Factory functions untuk perakitan dependencies dan instansiasi Use Cases.
- **Presentation Layer (`src/presentation/`)**:
  - `components/admin/`, `components/public/`, `components/providers/`.
- **Controllers & Pages (`src/app/`)**:
  - Server Actions (`src/app/actions/`): Mengambil use case dari `src/di/container.ts`, memvalidasi input, menjalankan `execute()`, menangani error domain, dan melakukan `revalidatePath`.
  - Server Components / RSC (`src/app/page.tsx`, `src/app/admin/**/page.tsx`): Memanggil use case dari `src/di/container.ts`.
- **Testing**:
  - Unit tests use case menguji class use case langsung dengan menyuntikkan mock repository objects (Loose Coupling murni).

## Task List

### Phase 1: Core Domain Layer (Entities, Repositories, Errors, Use Cases)
- [ ] **Task 1**: Domain Entities & Custom Domain Errors (`src/core/entities/`, `src/core/errors/`)
- [ ] **Task 2**: Repository Interfaces & Service Abstractions (`src/core/repositories/`, `src/core/services/`)
- [ ] **Task 3**: Class-based Use Cases with Constructor Injection (`src/core/use-cases/`)

### Checkpoint: Core Domain
- [ ] Seluruh entity, interface, error, dan use case terisolasi 100% tanpa dependensi framework atau database.

### Phase 2: Infrastructure Layer & Dependency Injection Container
- [ ] **Task 4**: Repository Implementations & External Services (`src/infrastructure/repositories/*.repository.impl.ts`, `src/infrastructure/services/`)
- [ ] **Task 5**: DI Container Setup (`src/di/tokens.ts`, `src/di/container.ts`)

### Checkpoint: Infrastructure & DI
- [ ] DI container mampu merakit repository dan menghasilkan instance use case yang valid.

### Phase 3: Presentation Layer & Server Actions Migration
- [ ] **Task 6**: Move & Reorganize UI Components to `src/presentation/`
- [ ] **Task 7**: Update Server Actions & RSC Pages to consume Use Cases via DI Container (`src/app/actions/`, `src/app/`)

### Checkpoint: Presentation & Actions
- [ ] Aplikasi berjalan tanpa ada pemanggilan database ORM langsung di presentation layer dan lolos routing.

### Phase 4: Unit Test Overhaul, Cleanup, and Vault Sync
- [ ] **Task 8**: Refactor Unit Tests to test Use Cases with Injected Mock Repositories
- [ ] **Task 9**: Delete Deprecated Folders (`src/domain/`), Run Full Quality Check, and Sync Obsidian Vault

### Checkpoint: Complete
- [ ] Linter, TypeScript compiler, Jest unit tests, dan build Next.js sukses 100% serta terdokumentasi di Vault.

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Perubahan path import merusak UI components | High | Lakukan refactoring bertahap per slice dan validasi via `npx tsc --noEmit` di setiap checkpoint |
| Server actions error saat serialization data class entity | Medium | Kembalikan DTO plain object dari use cases atau serializable plain entities |
| Next.js server/client component boundary issues pada DI | Medium | Pastikan DI container hanya dipanggil pada server-side (Server Components dan Server Actions) |
