import React from "react";
import { render, screen } from "@testing-library/react";
import {
  ExpenseManager,
  ExpenseRecordData,
} from "@/components/admin/ExpenseManager";
import { PeriodData } from "@/components/admin/PaymentManager";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@/app/actions/expenses", () => ({
  createExpenseAction: jest.fn(),
  updateExpenseAction: jest.fn(),
  deleteExpenseAction: jest.fn(),
}));

describe("Admin - ExpenseManager Component", () => {
  const mockPeriods: PeriodData[] = [
    {
      id: "p1",
      month: 9,
      year: 2026,
      name: "September 2026",
      hasThr: false,
    },
  ];

  const mockExpenses: ExpenseRecordData[] = [
    {
      id: "exp1",
      periodId: "p1",
      date: new Date("2026-09-03"),
      category: "Kebersihan",
      title: "Gaji Petugas Sampah",
      amount: 1200000,
      notes: "Bulan September",
    },
  ];

  it("renders expense list and summary accurately", () => {
    render(
      <ExpenseManager
        periods={mockPeriods}
        selectedPeriod={mockPeriods[0]}
        expenses={mockExpenses}
      />
    );

    expect(screen.getByText("Pencatatan Pengeluaran Kas")).toBeInTheDocument();
    expect(screen.getByText("Total Pengeluaran Bulan Ini")).toBeInTheDocument();
    expect(screen.getByText("Gaji Petugas Sampah")).toBeInTheDocument();
    expect(screen.getAllByText("Kebersihan").length).toBeGreaterThan(0);
  });
});
