import { DashboardSummary } from "../entities/dashboard.entity";

export interface IBroadcastService {
  generateWhatsAppReportText(summary: DashboardSummary, siteUrl?: string): string;
}
