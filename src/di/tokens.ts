export const TOKENS = {
  // Repositories
  BlockRepository: "BlockRepository",
  PeriodRepository: "PeriodRepository",
  PaymentRepository: "PaymentRepository",
  ExpenseRepository: "ExpenseRepository",
  AdminRepository: "AdminRepository",

  // Services
  AuthService: "AuthService",
  BroadcastService: "BroadcastService",

  // Use Cases - Auth
  LoginUseCase: "LoginUseCase",
  LogoutUseCase: "LogoutUseCase",
  GetSessionUseCase: "GetSessionUseCase",

  // Use Cases - Block
  GetBlocksUseCase: "GetBlocksUseCase",
  CreateBlockUseCase: "CreateBlockUseCase",
  UpdateBlockUseCase: "UpdateBlockUseCase",
  DeleteBlockUseCase: "DeleteBlockUseCase",

  // Use Cases - Period
  GetPeriodsUseCase: "GetPeriodsUseCase",
  CreatePeriodUseCase: "CreatePeriodUseCase",

  // Use Cases - Payment
  GetPaymentsByPeriodUseCase: "GetPaymentsByPeriodUseCase",
  QuickTogglePaymentUseCase: "QuickTogglePaymentUseCase",
  SavePaymentDetailUseCase: "SavePaymentDetailUseCase",

  // Use Cases - Expense
  GetExpensesUseCase: "GetExpensesUseCase",
  CreateExpenseUseCase: "CreateExpenseUseCase",
  UpdateExpenseUseCase: "UpdateExpenseUseCase",
  DeleteExpenseUseCase: "DeleteExpenseUseCase",

  // Use Cases - Dashboard & Broadcast
  GetDashboardSummaryUseCase: "GetDashboardSummaryUseCase",
  GenerateBroadcastReportUseCase: "GenerateBroadcastReportUseCase",
} as const;
