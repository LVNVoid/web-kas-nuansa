import { prisma } from "@/lib/prisma";
import {
  PaymentManager,
  BlockPaymentRow,
  PeriodData,
} from "@/components/admin/PaymentManager";

interface AdminPaymentsPageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function AdminPaymentsPage({
  searchParams,
}: AdminPaymentsPageProps) {
  const { period: periodParam } = await searchParams;

  // 1. Ambil semua periode
  const periods = await prisma.period.findMany({
    orderBy: [{ year: "desc" }, { month: "desc" }],
  });

  // 2. Tentukan periode terpilih
  let selectedPeriod = null;
  if (periodParam) {
    selectedPeriod = periods.find((p) => p.id === periodParam) || null;
  }
  if (!selectedPeriod && periods.length > 0) {
    selectedPeriod = periods[0];
  }

  // 3. Ambil semua blok
  const blocks = await prisma.residentBlock.findMany({
    orderBy: { blockName: "asc" },
  });

  // 4. Ambil payment records untuk periode terpilih
  let paymentRecords: Array<{
    id: string;
    blockId: string;
    isPaid: boolean;
    paidAt: Date | null;
    iuranAmount: number;
    kasAmount: number;
    infaqAmount: number;
    thrAmount: number;
    totalAmount: number;
    notes: string | null;
  }> = [];

  if (selectedPeriod) {
    paymentRecords = await prisma.paymentRecord.findMany({
      where: { periodId: selectedPeriod.id },
    });
  }

  const paymentMap = new Map(paymentRecords.map((p) => [p.blockId, p]));

  const rows: BlockPaymentRow[] = blocks.map((b) => {
    const p = paymentMap.get(b.id);
    const iuran = p?.iuranAmount ?? 0;
    const kas = p?.kasAmount ?? 0;
    const infaq = p?.infaqAmount ?? 0;
    const thr = p?.thrAmount ?? 0;
    const total = p?.totalAmount ?? (iuran + kas + infaq + thr);

    return {
      blockId: b.id,
      blockName: b.blockName,
      ownerName: b.ownerName,
      phone: b.phone,
      paymentId: p?.id ?? null,
      isPaid: p?.isPaid ?? false,
      paidAt: p?.paidAt ?? null,
      iuranAmount: iuran,
      kasAmount: kas,
      infaqAmount: infaq,
      thrAmount: thr,
      totalAmount: total,
      notes: p?.notes ?? null,
    };
  });

  const periodDataList: PeriodData[] = periods.map((p) => ({
    id: p.id,
    month: p.month,
    year: p.year,
    name: p.name,
    hasThr: p.hasThr,
  }));

  const selectedPeriodData: PeriodData | null = selectedPeriod
    ? {
        id: selectedPeriod.id,
        month: selectedPeriod.month,
        year: selectedPeriod.year,
        name: selectedPeriod.name,
        hasThr: selectedPeriod.hasThr,
      }
    : null;

  return (
    <div>
      <PaymentManager
        periods={periodDataList}
        selectedPeriod={selectedPeriodData}
        payments={rows}
      />
    </div>
  );
}
