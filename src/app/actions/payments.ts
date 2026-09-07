"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export interface PaymentActionResult {
  success: boolean;
  error?: string;
}

export async function createPeriodAction(formData: FormData): Promise<PaymentActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const month = parseInt(formData.get("month")?.toString() || "0", 10);
  const year = parseInt(formData.get("year")?.toString() || "0", 10);
  const name = formData.get("name")?.toString().trim();
  const hasThr = formData.get("hasThr") === "true";

  if (!month || !year || !name) {
    return { success: false, error: "Bulan, tahun, dan nama periode wajib diisi." };
  }

  try {
    const existing = await prisma.period.findUnique({
      where: {
        month_year: { month, year },
      },
    });

    if (existing) {
      return { success: false, error: `Periode ${name} sudah pernah dibuat.` };
    }

    await prisma.period.create({
      data: {
        month,
        year,
        name,
        hasThr,
      },
    });

    revalidatePath("/admin/payments");
    revalidatePath("/admin/broadcast");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error creating period:", error);
    return { success: false, error: "Gagal membuat periode baru." };
  }
}

export async function quickTogglePaidAction(
  blockId: string,
  periodId: string,
  newPaidStatus: boolean
): Promise<PaymentActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const existing = await prisma.paymentRecord.findUnique({
      where: {
        blockId_periodId: { blockId, periodId },
      },
    });

    if (existing) {
      const iuran = newPaidStatus ? (existing.iuranAmount || 50000) : 0;
      const kas = newPaidStatus ? (existing.kasAmount || 25000) : 0;
      const infaq = newPaidStatus ? existing.infaqAmount : 0;
      const thr = newPaidStatus ? existing.thrAmount : 0;
      const total = iuran + kas + infaq + thr;

      await prisma.paymentRecord.update({
        where: { id: existing.id },
        data: {
          isPaid: newPaidStatus,
          paidAt: newPaidStatus ? new Date() : null,
          iuranAmount: iuran,
          kasAmount: kas,
          infaqAmount: infaq,
          thrAmount: thr,
          totalAmount: total,
        },
      });
    } else {
      const iuran = newPaidStatus ? 50000 : 0;
      const kas = newPaidStatus ? 25000 : 0;
      const total = iuran + kas;

      await prisma.paymentRecord.create({
        data: {
          blockId,
          periodId,
          isPaid: newPaidStatus,
          paidAt: newPaidStatus ? new Date() : null,
          iuranAmount: iuran,
          kasAmount: kas,
          infaqAmount: 0,
          thrAmount: 0,
          totalAmount: total,
        },
      });
    }

    revalidatePath("/admin/payments");
    revalidatePath("/admin/broadcast");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error quick toggling payment:", error);
    return { success: false, error: "Gagal mengubah status pembayaran." };
  }
}

export async function savePaymentDetailAction(formData: FormData): Promise<PaymentActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const blockId = formData.get("blockId")?.toString();
  const periodId = formData.get("periodId")?.toString();
  const isPaid = formData.get("isPaid") === "true";
  const iuranAmount = parseFloat(formData.get("iuranAmount")?.toString() || "0") || 0;
  const kasAmount = parseFloat(formData.get("kasAmount")?.toString() || "0") || 0;
  const infaqAmount = parseFloat(formData.get("infaqAmount")?.toString() || "0") || 0;
  const thrAmount = parseFloat(formData.get("thrAmount")?.toString() || "0") || 0;
  const notes = formData.get("notes")?.toString().trim() || null;
  const paidAtStr = formData.get("paidAt")?.toString();

  if (!blockId || !periodId) {
    return { success: false, error: "Block ID dan Period ID wajib ada." };
  }

  const totalAmount = iuranAmount + kasAmount + infaqAmount + thrAmount;
  const paidAt = isPaid ? (paidAtStr ? new Date(paidAtStr) : new Date()) : null;

  try {
    await prisma.paymentRecord.upsert({
      where: {
        blockId_periodId: { blockId, periodId },
      },
      update: {
        isPaid,
        paidAt,
        iuranAmount,
        kasAmount,
        infaqAmount,
        thrAmount,
        totalAmount,
        notes,
      },
      create: {
        blockId,
        periodId,
        isPaid,
        paidAt,
        iuranAmount,
        kasAmount,
        infaqAmount,
        thrAmount,
        totalAmount,
        notes,
      },
    });

    revalidatePath("/admin/payments");
    revalidatePath("/admin/broadcast");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error saving payment detail:", error);
    return { success: false, error: "Gagal menyimpan rincian pembayaran." };
  }
}
