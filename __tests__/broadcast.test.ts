import { generateWhatsAppReportText } from "@/lib/broadcast";
import { DashboardSummary } from "@/lib/data";

describe("WhatsApp Broadcast Generator", () => {
  const mockSummary: DashboardSummary = {
    period: {
      id: "p1",
      month: 9,
      year: 2026,
      name: "September 2026",
      hasThr: false,
    },
    totalBalance: 7500000,
    periodIncome: 2500000,
    periodExpense: 1200000,
    paidCount: 2,
    unpaidCount: 1,
    totalBlocks: 3,
    blocks: [
      {
        id: "b1",
        blockName: "B1",
        ownerName: "Warga B1",
        isOccupied: true,
        isPaid: true,
        paidAt: new Date("2026-09-02"),
        iuranAmount: 50000,
        kasAmount: 25000,
        infaqAmount: 0,
        thrAmount: 0,
        totalAmount: 75000,
      },
      {
        id: "b2",
        blockName: "B2",
        ownerName: "Warga B2",
        isOccupied: true,
        isPaid: true,
        paidAt: new Date("2026-09-02"),
        iuranAmount: 50000,
        kasAmount: 25000,
        infaqAmount: 0,
        thrAmount: 0,
        totalAmount: 75000,
      },
      {
        id: "b3",
        blockName: "B3",
        ownerName: "Warga B3",
        isOccupied: true,
        isPaid: false,
        paidAt: null,
        iuranAmount: 0,
        kasAmount: 0,
        infaqAmount: 0,
        thrAmount: 0,
        totalAmount: 0,
      },
    ],
    expenses: [
      {
        id: "exp1",
        date: new Date("2026-09-03"),
        category: "Kebersihan",
        title: "Honor Petugas Sampah",
        amount: 1200000,
        notes: null,
      },
    ],
  };

  it("generates structured WhatsApp message with summary, expenses, and unpaid blocks", () => {
    const text = generateWhatsAppReportText(mockSummary, "https://kas-app.com");

    expect(text).toContain("*LAPORAN KAS & IURAN WARGA RT*");
    expect(text).toContain("Periode: September 2026");
    expect(text).toContain("Total Saldo Kas: Rp");
    expect(text).toContain("Honor Petugas Sampah (Kebersihan)");
    expect(text).toContain("DAFTAR BLOK BELUM SETOR (1 BLOK)");
    expect(text).toContain("B3");
    expect(text).toContain("🔗 https://kas-app.com");
  });
});
