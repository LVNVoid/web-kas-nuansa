"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export interface ExpenseActionResult {
  success: boolean;
  error?: string;
}

export async function createExpenseAction(formData: FormData): Promise<ExpenseActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const periodId = formData.get("periodId")?.toString() || null;
  const dateStr = formData.get("date")?.toString();
  const category = formData.get("category")?.toString().trim() || "Operasional";
  const title = formData.get("title")?.toString().trim();
  const amount = parseFloat(formData.get("amount")?.toString() || "0") || 0;
  const notes = formData.get("notes")?.toString().trim() || null;

  if (!title || amount <= 0) {
    return { success: false, error: "Judul pengeluaran dan nominal (> 0) wajib diisi." };
  }

  const date = dateStr ? new Date(dateStr) : new Date();

  try {
    await prisma.expenseRecord.create({
      data: {
        periodId,
        date,
        category,
        title,
        amount,
        notes,
      },
    });

    revalidatePath("/admin/expenses");
    revalidatePath("/admin/broadcast");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error creating expense:", error);
    return { success: false, error: "Gagal menyimpan pengeluaran." };
  }
}

export async function updateExpenseAction(
  id: string,
  formData: FormData
): Promise<ExpenseActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const periodId = formData.get("periodId")?.toString() || null;
  const dateStr = formData.get("date")?.toString();
  const category = formData.get("category")?.toString().trim() || "Operasional";
  const title = formData.get("title")?.toString().trim();
  const amount = parseFloat(formData.get("amount")?.toString() || "0") || 0;
  const notes = formData.get("notes")?.toString().trim() || null;

  if (!title || amount <= 0) {
    return { success: false, error: "Judul pengeluaran dan nominal (> 0) wajib diisi." };
  }

  const date = dateStr ? new Date(dateStr) : new Date();

  try {
    await prisma.expenseRecord.update({
      where: { id },
      data: {
        periodId,
        date,
        category,
        title,
        amount,
        notes,
      },
    });

    revalidatePath("/admin/expenses");
    revalidatePath("/admin/broadcast");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating expense:", error);
    return { success: false, error: "Gagal memperbarui pengeluaran." };
  }
}

export async function deleteExpenseAction(id: string): Promise<ExpenseActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    await prisma.expenseRecord.delete({
      where: { id },
    });

    revalidatePath("/admin/expenses");
    revalidatePath("/admin/broadcast");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting expense:", error);
    return { success: false, error: "Gagal menghapus pengeluaran." };
  }
}
