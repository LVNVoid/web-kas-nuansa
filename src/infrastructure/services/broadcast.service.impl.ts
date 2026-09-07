import { IBroadcastService } from "@/core/services/broadcast.service.interface";
import { DashboardSummary } from "@/core/entities/dashboard.entity";
import { formatRupiah } from "@/lib/format";

export class BroadcastServiceImpl implements IBroadcastService {
  generateWhatsAppReportText(
    summary: DashboardSummary,
    siteUrl = "http://localhost:3000"
  ): string {
    const periodName = summary.period?.name || "Bulan Ini";
    const complianceRate =
      summary.totalBlocks > 0
        ? Math.round((summary.paidCount / summary.totalBlocks) * 100)
        : 0;

    const unpaidBlocks = summary.blocks
      .filter((b) => !b.isPaid)
      .map((b) => b.blockName);

    let expenseSection = "• Belum ada pengeluaran tercatat.";
    if (summary.expenses.length > 0) {
      expenseSection = summary.expenses
        .map(
          (e, idx) =>
            `${idx + 1}. ${e.title} (${e.category}): ${formatRupiah(e.amount)}`
        )
        .join("\n");
    }

    const unpaidListText =
      unpaidBlocks.length > 0
        ? unpaidBlocks.join(", ")
        : "Alhamdulillah seluruh warga telah lunas.";

    return `*LAPORAN KAS & IURAN WARGA RT*
Periode: ${periodName}

━━━━━━━━━━━━━━━━━━━━
*1. RINGKASAN KEUANGAN*
• Total Saldo Kas: ${formatRupiah(summary.totalBalance)}
• Pemasukan Bulan Ini: ${formatRupiah(summary.periodIncome)}
• Pengeluaran Bulan Ini: ${formatRupiah(summary.periodExpense)}
• Status Setoran: ${summary.paidCount} dari ${summary.totalBlocks} Blok (${complianceRate}% Lunas)

━━━━━━━━━━━━━━━━━━━━
*2. RINCIAN PENGELUARAN*
${expenseSection}

━━━━━━━━━━━━━━━━━━━━
*3. DAFTAR BLOK BELUM SETOR (${summary.unpaidCount} BLOK)*
${unpaidListText}

━━━━━━━━━━━━━━━━━━━━
_Untuk melihat rincian setoran per blok & laporan kas real-time, silakan kunjungi website:_
🔗 ${siteUrl}

Terima kasih atas partisipasi dan kerjasamanya.
_Pengurus Kas & Keuangan RT_`;
  }
}
