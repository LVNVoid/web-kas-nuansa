import React from "react";
import { render, screen } from "@testing-library/react";
import { SummaryCards } from "@/presentation/components/public/SummaryCards";
import { DashboardSummary } from "@/core/entities/dashboard.entity";

describe("Public UI - SummaryCards Component", () => {
  const mockSummary: DashboardSummary = {
    period: {
      id: "p1",
      month: 9,
      year: 2026,
      name: "September 2026",
      hasThr: false,
    },
    totalBalance: 5000000,
    periodIncome: 2000000,
    periodExpense: 500000,
    paidCount: 20,
    unpaidCount: 10,
    totalBlocks: 30,
    blocks: [],
    expenses: [],
  };

  it("renders total balance, income, expense, and compliance stats properly", () => {
    render(<SummaryCards summary={mockSummary} />);

    expect(screen.getByText("Total Saldo Kas")).toBeInTheDocument();
    expect(screen.getByText("Pemasukan Bulan Ini")).toBeInTheDocument();
    expect(screen.getByText("Pengeluaran Bulan Ini")).toBeInTheDocument();
    expect(screen.getByText("Status Lunas")).toBeInTheDocument();
    expect(screen.getByText("67%")).toBeInTheDocument();
  });
});
