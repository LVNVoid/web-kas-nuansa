import React from "react";
import { render, screen } from "@testing-library/react";
import {
  PaymentManager,
  BlockPaymentRow,
  PeriodData,
} from "@/components/admin/PaymentManager";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@/app/actions/payments", () => ({
  quickTogglePaidAction: jest.fn(),
  savePaymentDetailAction: jest.fn(),
  createPeriodAction: jest.fn(),
}));

describe("Admin - PaymentManager Component", () => {
  const mockPeriods: PeriodData[] = [
    {
      id: "p1",
      month: 9,
      year: 2026,
      name: "September 2026",
      hasThr: false,
    },
  ];

  const mockPayments: BlockPaymentRow[] = [
    {
      blockId: "b1",
      blockName: "B1",
      ownerName: "Warga B1",
      phone: null,
      paymentId: "pay1",
      isPaid: true,
      paidAt: new Date("2026-09-02"),
      iuranAmount: 50000,
      kasAmount: 25000,
      infaqAmount: 0,
      thrAmount: 0,
      totalAmount: 75000,
      notes: null,
    },
    {
      blockId: "b2",
      blockName: "B2",
      ownerName: "Warga B2",
      phone: null,
      paymentId: null,
      isPaid: false,
      paidAt: null,
      iuranAmount: 0,
      kasAmount: 0,
      infaqAmount: 0,
      thrAmount: 0,
      totalAmount: 0,
      notes: null,
    },
  ];

  it("renders payment rows and summary cards properly", () => {
    render(
      <PaymentManager
        periods={mockPeriods}
        selectedPeriod={mockPeriods[0]}
        payments={mockPayments}
      />
    );

    expect(screen.getByText("Pencatatan Pemasukan Warga")).toBeInTheDocument();
    expect(screen.getByText("Total Pemasukan Periode Ini")).toBeInTheDocument();
    expect(screen.getByText("B1")).toBeInTheDocument();
    expect(screen.getByText("B2")).toBeInTheDocument();
    expect(screen.getByText("✓ LUNAS")).toBeInTheDocument();
    expect(screen.getByText("BELUM")).toBeInTheDocument();
  });
});
