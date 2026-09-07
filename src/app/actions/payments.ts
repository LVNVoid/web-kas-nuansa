"use server";

import { revalidatePath } from "next/cache";
import {
  getCreatePeriodUseCase,
  getQuickTogglePaymentUseCase,
  getSavePaymentDetailUseCase,
} from "@/di/container";
import { DomainError } from "@/core/errors/domain.errors";

export interface PaymentActionResult {
  success: boolean;
  error?: string;
}

export async function createPeriodAction(formData: FormData): Promise<PaymentActionResult> {
  const month = parseInt(formData.get("month")?.toString() || "0", 10);
  const year = parseInt(formData.get("year")?.toString() || "0", 10);
  const name = formData.get("name")?.toString().trim() || "";
  const hasThr = formData.get("hasThr") === "true";

  try {
    const createPeriod = getCreatePeriodUseCase();
    await createPeriod.execute({
      month,
      year,
      name,
      hasThr,
    });

    revalidatePath("/admin/payments");
    revalidatePath("/admin/broadcast");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message };
    }
    console.error("createPeriodAction error:", error);
    return { success: false, error: "Gagal membuat periode baru." };
  }
}

export async function quickTogglePaidAction(
  blockId: string,
  periodId: string,
  newPaidStatus: boolean
): Promise<PaymentActionResult> {
  try {
    const quickToggle = getQuickTogglePaymentUseCase();
    await quickToggle.execute({
      blockId,
      periodId,
      newPaidStatus,
    });

    revalidatePath("/admin/payments");
    revalidatePath("/admin/broadcast");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message };
    }
    console.error("quickTogglePaidAction error:", error);
    return { success: false, error: "Gagal mengubah status pembayaran." };
  }
}

export async function savePaymentDetailAction(formData: FormData): Promise<PaymentActionResult> {
  const blockId = formData.get("blockId")?.toString() || "";
  const periodId = formData.get("periodId")?.toString() || "";
  const isPaid = formData.get("isPaid") === "true";
  const iuranAmount = parseFloat(formData.get("iuranAmount")?.toString() || "0") || 0;
  const kasAmount = parseFloat(formData.get("kasAmount")?.toString() || "0") || 0;
  const infaqAmount = parseFloat(formData.get("infaqAmount")?.toString() || "0") || 0;
  const thrAmount = parseFloat(formData.get("thrAmount")?.toString() || "0") || 0;
  const notes = formData.get("notes")?.toString().trim() || null;
  const paidAtStr = formData.get("paidAt")?.toString();
  const paidAt = isPaid ? (paidAtStr ? new Date(paidAtStr) : new Date()) : null;

  try {
    const saveDetail = getSavePaymentDetailUseCase();
    await saveDetail.execute({
      blockId,
      periodId,
      isPaid,
      paidAt,
      iuranAmount,
      kasAmount,
      infaqAmount,
      thrAmount,
      notes,
    });

    revalidatePath("/admin/payments");
    revalidatePath("/admin/broadcast");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message };
    }
    console.error("savePaymentDetailAction error:", error);
    return { success: false, error: "Gagal menyimpan rincian pembayaran." };
  }
}
