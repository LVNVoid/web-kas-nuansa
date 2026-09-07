"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export interface BlockActionResult {
  success: boolean;
  error?: string;
}

export async function createBlockAction(formData: FormData): Promise<BlockActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const blockName = formData.get("blockName")?.toString().trim().toUpperCase();
  const ownerName = formData.get("ownerName")?.toString().trim() || null;
  const phone = formData.get("phone")?.toString().trim() || null;
  const isOccupied = formData.get("isOccupied") === "true";
  const notes = formData.get("notes")?.toString().trim() || null;

  if (!blockName) {
    return { success: false, error: "Nama blok wajib diisi." };
  }

  try {
    const existing = await prisma.residentBlock.findUnique({
      where: { blockName },
    });
    if (existing) {
      return { success: false, error: `Blok ${blockName} sudah terdaftar.` };
    }

    await prisma.residentBlock.create({
      data: {
        blockName,
        ownerName,
        phone,
        isOccupied,
        notes,
      },
    });

    revalidatePath("/admin/blocks");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error creating block:", error);
    return { success: false, error: "Gagal menambahkan blok." };
  }
}

export async function updateBlockAction(
  id: string,
  formData: FormData
): Promise<BlockActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  const blockName = formData.get("blockName")?.toString().trim().toUpperCase();
  const ownerName = formData.get("ownerName")?.toString().trim() || null;
  const phone = formData.get("phone")?.toString().trim() || null;
  const isOccupied = formData.get("isOccupied") === "true";
  const notes = formData.get("notes")?.toString().trim() || null;

  if (!blockName) {
    return { success: false, error: "Nama blok wajib diisi." };
  }

  try {
    const existing = await prisma.residentBlock.findFirst({
      where: {
        blockName,
        NOT: { id },
      },
    });
    if (existing) {
      return { success: false, error: `Nama Blok ${blockName} sudah digunakan oleh data lain.` };
    }

    await prisma.residentBlock.update({
      where: { id },
      data: {
        blockName,
        ownerName,
        phone,
        isOccupied,
        notes,
      },
    });

    revalidatePath("/admin/blocks");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating block:", error);
    return { success: false, error: "Gagal memperbarui blok." };
  }
}

export async function deleteBlockAction(id: string): Promise<BlockActionResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    await prisma.residentBlock.delete({
      where: { id },
    });

    revalidatePath("/admin/blocks");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting block:", error);
    return { success: false, error: "Gagal menghapus blok." };
  }
}
