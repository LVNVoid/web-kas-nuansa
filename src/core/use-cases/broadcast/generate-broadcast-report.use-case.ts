import { IBroadcastService } from "../../services/broadcast.service.interface";
import { DashboardSummary } from "../../entities/dashboard.entity";

export class GenerateBroadcastReportUseCase {
  constructor(private readonly broadcastService: IBroadcastService) {}

  execute(summary: DashboardSummary, siteUrl?: string): string {
    return this.broadcastService.generateWhatsAppReportText(summary, siteUrl);
  }
}
