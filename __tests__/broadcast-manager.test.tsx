import React from "react";
import { render, screen } from "@testing-library/react";
import { BroadcastManager } from "@/components/admin/BroadcastManager";
import { PeriodData } from "@/components/admin/PaymentManager";
import { DashboardSummary } from "@/lib/data";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Admin - BroadcastManager Component", () => {
  const mockPeriods: PeriodData[] = [
    {
      id: "p1",
      month: 9,
      year: 2026,
      name: "September 2026",
      hasThr: false,
    },
  ];

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
    paidCount: 30,
    unpaidCount: 18,
    totalBlocks: 48,
    blocks: [],
    expenses: [],
  };

  it("renders WhatsApp broadcast generator and preview accurately", () => {
    render(
      <BroadcastManager
        periods={mockPeriods}
        selectedPeriod={mockPeriods[0]}
        summary={mockSummary}
      />
    );

    expect(screen.getByText("WhatsApp Broadcast Generator")).toBeInTheDocument();
    expect(screen.getByText("📋 Salin Teks WhatsApp")).toBeInTheDocument();
    expect(screen.getByText("Pratinjau Pesan WhatsApp")).toBeInTheDocument();
  });
});
