import { BlockRepositoryImpl } from "@/infrastructure/repositories/block.repository.impl";
import { PeriodRepositoryImpl } from "@/infrastructure/repositories/period.repository.impl";
import { PaymentRepositoryImpl } from "@/infrastructure/repositories/payment.repository.impl";
import { ExpenseRepositoryImpl } from "@/infrastructure/repositories/expense.repository.impl";
import { AdminRepositoryImpl } from "@/infrastructure/repositories/admin.repository.impl";
import { AuthServiceImpl } from "@/infrastructure/services/auth.service.impl";
import { BroadcastServiceImpl } from "@/infrastructure/services/broadcast.service.impl";

import { LoginUseCase } from "@/core/use-cases/auth/login.use-case";
import { LogoutUseCase } from "@/core/use-cases/auth/logout.use-case";
import { GetSessionUseCase } from "@/core/use-cases/auth/get-session.use-case";

import { GetBlocksUseCase } from "@/core/use-cases/block/get-blocks.use-case";
import { CreateBlockUseCase } from "@/core/use-cases/block/create-block.use-case";
import { UpdateBlockUseCase } from "@/core/use-cases/block/update-block.use-case";
import { DeleteBlockUseCase } from "@/core/use-cases/block/delete-block.use-case";

import { GetPeriodsUseCase } from "@/core/use-cases/period/get-periods.use-case";
import { CreatePeriodUseCase } from "@/core/use-cases/period/create-period.use-case";

import { GetPaymentsByPeriodUseCase } from "@/core/use-cases/payment/get-payments-by-period.use-case";
import { QuickTogglePaymentUseCase } from "@/core/use-cases/payment/quick-toggle-payment.use-case";
import { SavePaymentDetailUseCase } from "@/core/use-cases/payment/save-payment-detail.use-case";

import { GetExpensesUseCase } from "@/core/use-cases/expense/get-expenses.use-case";
import { CreateExpenseUseCase } from "@/core/use-cases/expense/create-expense.use-case";
import { UpdateExpenseUseCase } from "@/core/use-cases/expense/update-expense.use-case";
import { DeleteExpenseUseCase } from "@/core/use-cases/expense/delete-expense.use-case";

import { GetDashboardSummaryUseCase } from "@/core/use-cases/dashboard/get-dashboard-summary.use-case";
import { GenerateBroadcastReportUseCase } from "@/core/use-cases/broadcast/generate-broadcast-report.use-case";

// Singleton instances
let blockRepository: BlockRepositoryImpl | null = null;
let periodRepository: PeriodRepositoryImpl | null = null;
let paymentRepository: PaymentRepositoryImpl | null = null;
let expenseRepository: ExpenseRepositoryImpl | null = null;
let adminRepository: AdminRepositoryImpl | null = null;
let authService: AuthServiceImpl | null = null;
let broadcastService: BroadcastServiceImpl | null = null;

export function getBlockRepository(): BlockRepositoryImpl {
  if (!blockRepository) blockRepository = new BlockRepositoryImpl();
  return blockRepository;
}

export function getPeriodRepository(): PeriodRepositoryImpl {
  if (!periodRepository) periodRepository = new PeriodRepositoryImpl();
  return periodRepository;
}

export function getPaymentRepository(): PaymentRepositoryImpl {
  if (!paymentRepository) paymentRepository = new PaymentRepositoryImpl();
  return paymentRepository;
}

export function getExpenseRepository(): ExpenseRepositoryImpl {
  if (!expenseRepository) expenseRepository = new ExpenseRepositoryImpl();
  return expenseRepository;
}

export function getAdminRepository(): AdminRepositoryImpl {
  if (!adminRepository) adminRepository = new AdminRepositoryImpl();
  return adminRepository;
}

export function getAuthService(): AuthServiceImpl {
  if (!authService) authService = new AuthServiceImpl();
  return authService;
}

export function getBroadcastService(): BroadcastServiceImpl {
  if (!broadcastService) broadcastService = new BroadcastServiceImpl();
  return broadcastService;
}

// Factory Functions for Use Cases
export function getLoginUseCase(): LoginUseCase {
  return new LoginUseCase(getAdminRepository(), getAuthService());
}

export function getLogoutUseCase(): LogoutUseCase {
  return new LogoutUseCase(getAuthService());
}

export function getGetSessionUseCase(): GetSessionUseCase {
  return new GetSessionUseCase(getAuthService());
}

export function getGetBlocksUseCase(): GetBlocksUseCase {
  return new GetBlocksUseCase(getBlockRepository());
}

export function getCreateBlockUseCase(): CreateBlockUseCase {
  return new CreateBlockUseCase(getBlockRepository(), getAuthService());
}

export function getUpdateBlockUseCase(): UpdateBlockUseCase {
  return new UpdateBlockUseCase(getBlockRepository(), getAuthService());
}

export function getDeleteBlockUseCase(): DeleteBlockUseCase {
  return new DeleteBlockUseCase(getBlockRepository(), getAuthService());
}

export function getGetPeriodsUseCase(): GetPeriodsUseCase {
  return new GetPeriodsUseCase(getPeriodRepository());
}

export function getCreatePeriodUseCase(): CreatePeriodUseCase {
  return new CreatePeriodUseCase(getPeriodRepository(), getAuthService());
}

export function getGetPaymentsByPeriodUseCase(): GetPaymentsByPeriodUseCase {
  return new GetPaymentsByPeriodUseCase(getBlockRepository());
}

export function getQuickTogglePaymentUseCase(): QuickTogglePaymentUseCase {
  return new QuickTogglePaymentUseCase(getPaymentRepository(), getAuthService());
}

export function getSavePaymentDetailUseCase(): SavePaymentDetailUseCase {
  return new SavePaymentDetailUseCase(getPaymentRepository(), getAuthService());
}

export function getGetExpensesUseCase(): GetExpensesUseCase {
  return new GetExpensesUseCase(getExpenseRepository());
}

export function getCreateExpenseUseCase(): CreateExpenseUseCase {
  return new CreateExpenseUseCase(getExpenseRepository(), getAuthService());
}

export function getUpdateExpenseUseCase(): UpdateExpenseUseCase {
  return new UpdateExpenseUseCase(getExpenseRepository(), getAuthService());
}

export function getDeleteExpenseUseCase(): DeleteExpenseUseCase {
  return new DeleteExpenseUseCase(getExpenseRepository(), getAuthService());
}

export function getGetDashboardSummaryUseCase(): GetDashboardSummaryUseCase {
  return new GetDashboardSummaryUseCase(
    getBlockRepository(),
    getPeriodRepository(),
    getPaymentRepository(),
    getExpenseRepository()
  );
}

export function getGenerateBroadcastReportUseCase(): GenerateBroadcastReportUseCase {
  return new GenerateBroadcastReportUseCase(getBroadcastService());
}
