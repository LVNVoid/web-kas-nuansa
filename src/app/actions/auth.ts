"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AUTH_COOKIE_NAME, hashPassword, signSessionToken } from "@/lib/auth";

export interface AuthState {
  error?: string;
  success?: boolean;
}

export async function loginAction(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const username = formData.get("username")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!username || !password) {
    return { error: "Username dan password wajib diisi." };
  }

  try {
    const admin = await prisma.adminUser.findUnique({
      where: { username },
    });

    if (!admin) {
      return { error: "Kredensial username atau password salah." };
    }

    const hashedPassword = hashPassword(password);
    if (admin.passwordHash !== hashedPassword) {
      return { error: "Kredensial username atau password salah." };
    }

    const token = await signSessionToken({
      userId: admin.id,
      username: admin.username,
      name: admin.name,
    });

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });
  } catch (error) {
    console.error("Login action error:", error);
    return { error: "Terjadi kesalahan saat memproses login." };
  }

  redirect("/admin/blocks");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  redirect("/login");
}
