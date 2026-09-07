"use server";

import { revalidatePath } from "next/cache";
import {
  getCreateBlockUseCase,
  getUpdateBlockUseCase,
  getDeleteBlockUseCase,
} from "@/di/container";
import { DomainError } from "@/core/errors/domain.errors";

export interface BlockActionResult {
  success: boolean;
  error?: string;
}

export async function createBlockAction(formData: FormData): Promise<BlockActionResult> {
  const blockName = formData.get("blockName")?.toString();
  const ownerName = formData.get("ownerName")?.toString().trim() || null;
  const phone = formData.get("phone")?.toString().trim() || null;
  const isOccupied = formData.get("isOccupied") === "true";
  const notes = formData.get("notes")?.toString().trim() || null;

  try {
    const createBlock = getCreateBlockUseCase();
    await createBlock.execute({
      blockName: blockName || "",
      ownerName,
      phone,
      isOccupied,
      notes,
    });

    revalidatePath("/admin/blocks");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message };
    }
    console.error("createBlockAction error:", error);
    return { success: false, error: "Gagal menambahkan blok." };
  }
}

export async function updateBlockAction(
  id: string,
  formData: FormData
): Promise<BlockActionResult> {
  const blockName = formData.get("blockName")?.toString();
  const ownerName = formData.get("ownerName")?.toString().trim() || null;
  const phone = formData.get("phone")?.toString().trim() || null;
  const isOccupied = formData.get("isOccupied") === "true";
  const notes = formData.get("notes")?.toString().trim() || null;

  try {
    const updateBlock = getUpdateBlockUseCase();
    await updateBlock.execute(id, {
      blockName: blockName || "",
      ownerName,
      phone,
      isOccupied,
      notes,
    });

    revalidatePath("/admin/blocks");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message };
    }
    console.error("updateBlockAction error:", error);
    return { success: false, error: "Gagal memperbarui blok." };
  }
}

export async function deleteBlockAction(id: string): Promise<BlockActionResult> {
  try {
    const deleteBlock = getDeleteBlockUseCase();
    await deleteBlock.execute(id);

    revalidatePath("/admin/blocks");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message };
    }
    console.error("deleteBlockAction error:", error);
    return { success: false, error: "Gagal menghapus blok." };
  }
}
