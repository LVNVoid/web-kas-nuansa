"use server";

import { revalidatePath } from "next/cache";
import {
  getCreateExpenseUseCase,
  getUpdateExpenseUseCase,
  getDeleteExpenseUseCase,
} from "@/di/container";
import { DomainError } from "@/core/errors/domain.errors";

export interface ExpenseActionResult {
  success: boolean;
  error?: string;
}

export async function createExpenseAction(formData: FormData): Promise<ExpenseActionResult> {
  const periodId = formData.get("periodId")?.toString() || null;
  const dateStr = formData.get("date")?.toString();
  const category = formData.get("category")?.toString().trim() || "Operasional";
  const title = formData.get("title")?.toString().trim() || "";
  const amount = parseFloat(formData.get("amount")?.toString() || "0") || 0;
  const notes = formData.get("notes")?.toString().trim() || null;
  const date = dateStr ? new Date(dateStr) : new Date();

  try {
    const createExpense = getCreateExpenseUseCase();
    await createExpense.execute({
      periodId,
      date,
      category,
      title,
      amount,
      notes,
    });

    revalidatePath("/admin/expenses");
    revalidatePath("/admin/broadcast");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message };
    }
    console.error("createExpenseAction error:", error);
    return { success: false, error: "Gagal menyimpan pengeluaran." };
  }
}

export async function updateExpenseAction(
  id: string,
  formData: FormData
): Promise<ExpenseActionResult> {
  const periodId = formData.get("periodId")?.toString() || null;
  const dateStr = formData.get("date")?.toString();
  const category = formData.get("category")?.toString().trim() || "Operasional";
  const title = formData.get("title")?.toString().trim() || "";
  const amount = parseFloat(formData.get("amount")?.toString() || "0") || 0;
  const notes = formData.get("notes")?.toString().trim() || null;
  const date = dateStr ? new Date(dateStr) : new Date();

  try {
    const updateExpense = getUpdateExpenseUseCase();
    await updateExpense.execute(id, {
      periodId,
      date,
      category,
      title,
      amount,
      notes,
    });

    revalidatePath("/admin/expenses");
    revalidatePath("/admin/broadcast");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message };
    }
    console.error("updateExpenseAction error:", error);
    return { success: false, error: "Gagal memperbarui pengeluaran." };
  }
}

export async function deleteExpenseAction(id: string): Promise<ExpenseActionResult> {
  try {
    const deleteExpense = getDeleteExpenseUseCase();
    await deleteExpense.execute(id);

    revalidatePath("/admin/expenses");
    revalidatePath("/admin/broadcast");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message };
    }
    console.error("deleteExpenseAction error:", error);
    return { success: false, error: "Gagal menghapus pengeluaran." };
  }
}
