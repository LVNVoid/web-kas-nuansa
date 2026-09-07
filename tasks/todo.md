# Tasks: Vault-Compliant Strict Clean Architecture

## Phase 1: Core Domain Layer

### Task 1: Domain Entities & Custom Domain Errors
**Description:** Membangun entitas murni TypeScript dan custom error classes di dalam layer `src/core/` tanpa dependensi eksternal.
- [x] Acceptance criteria:
  - `src/core/errors/domain.errors.ts` berisi `DomainError`, `NotFoundError`, `ConflictError`, `UnauthorizedError`, `ValidationError`.
  - `src/core/entities/block.entity.ts` mendefinisikan `ResidentBlockEntity` dan `ResidentBlock`.
  - `src/core/entities/period.entity.ts` mendefinisikan `PeriodEntity` dan `Period`.
  - `src/core/entities/payment.entity.ts` mendefinisikan `PaymentRecordEntity`, `PaymentRecord`, dan `BlockPaymentRow`.
  - `src/core/entities/expense.entity.ts` mendefinisikan `ExpenseRecordEntity` dan `ExpenseRecord`.
  - `src/core/entities/dashboard.entity.ts` mendefinisikan `DashboardSummary`, `DashboardBlockItem`, dan `DashboardExpenseItem`.
  - `src/core/entities/user.entity.ts` mendefinisikan `AdminUserEntity`, `AdminUser`, dan `SessionPayload`.
  - Barrel export di `src/core/entities/index.ts` dan `src/core/errors/index.ts`.
- [x] Verification: `npx tsc --noEmit`
- [x] Dependencies: None
- [x] Files: `src/core/errors/*`, `src/core/entities/*`

### Task 2: Repository Interfaces & Service Abstractions
**Description:** Mendefinisikan interface repository murni di `src/core/repositories/` dan interface service eksternal di `src/core/services/`.
- [x] Acceptance criteria:
  - `src/core/repositories/block.repository.ts` mendefinisikan `IBlockRepository`.
  - `src/core/repositories/period.repository.ts` mendefinisikan `IPeriodRepository`.
  - `src/core/repositories/payment.repository.ts` mendefinisikan `IPaymentRepository`.
  - `src/core/repositories/expense.repository.ts` mendefinisikan `IExpenseRepository`.
  - `src/core/repositories/admin.repository.ts` mendefinisikan `IAdminRepository`.
  - `src/core/services/auth.service.interface.ts` mendefinisikan `IAuthService`.
  - `src/core/services/broadcast.service.interface.ts` mendefinisikan `IBroadcastService`.
- [x] Verification: `npx tsc --noEmit`
- [x] Dependencies: Task 1
- [x] Files: `src/core/repositories/*`, `src/core/services/*`

### Task 3: Class-based Use Cases with Constructor Injection
**Description:** Mengimplementasikan class Use Case di `src/core/use-cases/` yang menerima interface repository via constructor dan memiliki method `execute()`.
- [x] Acceptance criteria:
  - Format penamaan `{action}-{entity}.use-case.ts`.
  - `src/core/use-cases/auth/`: `LoginUseCase`, `LogoutUseCase`, `GetSessionUseCase`.
  - `src/core/use-cases/block/`: `GetBlocksUseCase`, `CreateBlockUseCase`, `UpdateBlockUseCase`, `DeleteBlockUseCase`.
  - `src/core/use-cases/period/`: `GetPeriodsUseCase`, `CreatePeriodUseCase`.
  - `src/core/use-cases/payment/`: `GetPaymentsByPeriodUseCase`, `QuickTogglePaymentUseCase`, `SavePaymentDetailUseCase`.
  - `src/core/use-cases/expense/`: `GetExpensesUseCase`, `CreateExpenseUseCase`, `UpdateExpenseUseCase`, `DeleteExpenseUseCase`.
  - `src/core/use-cases/dashboard/`: `GetDashboardSummaryUseCase`.
  - `src/core/use-cases/broadcast/`: `GenerateBroadcastReportUseCase`.
- [x] Verification: `npx tsc --noEmit`
- [x] Dependencies: Task 2
- [x] Files: `src/core/use-cases/**/*`

## Checkpoint: Phase 1
- [x] Seluruh file di `src/core/` bersifat murni tanpa ketergantungan pada Prisma atau Next.js.

---

## Phase 2: Infrastructure Layer & DI Container

### Task 4: Repository Implementations & External Services
**Description:** Mengimplementasikan interface repository menggunakan Prisma ORM dan layanan eksternal di `src/infrastructure/`.
- [x] Acceptance criteria:
  - `src/infrastructure/database/db.ts` / `prisma.ts`: Prisma Client connection pool.
  - `src/infrastructure/repositories/block.repository.impl.ts` mengimplementasikan `IBlockRepository`.
  - `src/infrastructure/repositories/period.repository.impl.ts` mengimplementasikan `IPeriodRepository`.
  - `src/infrastructure/repositories/payment.repository.impl.ts` mengimplementasikan `IPaymentRepository`.
  - `src/infrastructure/repositories/expense.repository.impl.ts` mengimplementasikan `IExpenseRepository`.
  - `src/infrastructure/repositories/admin.repository.impl.ts` mengimplementasikan `IAdminRepository`.
  - `src/infrastructure/services/auth.service.impl.ts` mengimplementasikan `IAuthService`.
  - `src/infrastructure/services/broadcast.service.impl.ts` mengimplementasikan `IBroadcastService`.
- [x] Verification: `npx tsc --noEmit`
- [x] Dependencies: Task 2, Task 3
- [x] Files: `src/infrastructure/**/*`

### Task 5: DI Container Setup
**Description:** Membangun dependency injection container dan factory functions di `src/di/`.
- [x] Acceptance criteria:
  - `src/di/tokens.ts` mendefinisikan string constant tokens.
  - `src/di/container.ts` merakit singleton repository/services dan mengekspor helper functions untuk mendapatkan instance use cases (misal `getLoginUseCase()`, `getGetBlocksUseCase()`, `getGetDashboardSummaryUseCase()`, dll).
- [x] Verification: `npx tsc --noEmit`
- [x] Dependencies: Task 3, Task 4
- [x] Files: `src/di/tokens.ts`, `src/di/container.ts`

## Checkpoint: Phase 2
- [x] DI Container berhasil merakit instance use cases dengan dependency repository konkret.

---

## Phase 3: Presentation Layer & Server Actions Migration

### Task 6: Move UI Components to `src/presentation/`
**Description:** Memindahkan dan menyusun komponen UI ke `src/presentation/components/` sesuai arsitektur vault.
- [x] Acceptance criteria:
  - Komponen admin di `src/presentation/components/admin/`.
  - Komponen publik di `src/presentation/components/public/`.
  - Provider di `src/presentation/components/providers/`.
  - Path `@/components/*` diarahkan atau diperbarui ke `@/presentation/components/*`.
- [x] Verification: `npx tsc --noEmit`
- [x] Dependencies: Task 1
- [x] Files: `src/presentation/**/*`, `src/components/**/*`

### Task 7: Update Server Actions & RSC Pages via DI Container
**Description:** Memperbarui Server Actions di `src/app/actions/` dan halaman React Server Components (`src/app/page.tsx`, `src/app/admin/**/page.tsx`) agar mengambil Use Case dari `src/di/container.ts`.
- [x] Acceptance criteria:
  - Seluruh Server Actions memanggil `useCase.execute(input)` via DI Container dan menangani `DomainError`.
  - RSC `page.tsx` memanggil use cases via DI Container.
  - Middleware menggunakan `IAuthService` atau helper auth dari infrastructure.
- [x] Verification: `npm run lint; if ($?) { npx tsc --noEmit; if ($?) { npm run build } }`
- [x] Dependencies: Task 5, Task 6
- [x] Files: `src/app/actions/*`, `src/app/**/*.tsx`, `src/middleware.ts`

## Checkpoint: Phase 3
- [x] Web application berjalan normal, build produksi sukses, dan seluruh interaksi UI bekerja tanpa error.

---

## Phase 4: Unit Test Overhaul, Cleanup, and Vault Sync

### Task 8: Refactor Unit Tests with Mock Repositories
**Description:** Menyesuaikan unit test di `__tests__/` untuk menguji class use cases dengan constructor injection mock dan memperbarui test komponen.
- [x] Acceptance criteria:
  - `__tests__/use-cases/*`: Unit tests class use cases dengan mock repository instances.
  - `__tests__/infrastructure/*`: Test auth service dan broadcast service.
  - `__tests__/components/*`: Test komponen UI dengan mock Server Actions.
  - 100% tes lolos (`npm test`).
- [x] Verification: `npm test`
- [x] Dependencies: Task 7
- [x] Files: `__tests__/**/*`

### Task 9: Cleanup Deprecated Folders & Obsidian Vault Sync
**Description:** Menghapus folder lama `src/domain/`, `src/use-cases/`, menjalankan quality check menyeluruh, dan memperbarui catatan sesi di Obsidian Vault.
- [x] Acceptance criteria:
  - Hapus folder `src/domain/` dan `src/use-cases/`.
  - Verifikasi: `npm run lint; if ($?) { npx tsc --noEmit; if ($?) { npm test; if ($?) { npm run build } } }`.
  - Update session log di Obsidian Vault dan jalankan git commit & push pada vault.
- [x] Verification: Quality check command
- [x] Dependencies: Task 8
- [x] Files: `src/domain/`, `src/use-cases/`, Obsidian Vault

## Checkpoint: Complete
- [x] Seluruh kriteria penerimaan terpenuhi, Clean Architecture sesuai aturan vault 100%, linter & test lulus, dan dokumentasi vault tersinkronisasi.
