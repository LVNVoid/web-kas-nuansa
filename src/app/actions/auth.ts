"use server";

import { redirect } from "next/navigation";
import { AuthState } from "@/core/entities/user.entity";
import { getLoginUseCase, getLogoutUseCase } from "@/di/container";
import { DomainError } from "@/core/errors/domain.errors";

export type { AuthState };

export async function loginAction(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const username = formData.get("username")?.toString().trim();
  const password = formData.get("password")?.toString();

  try {
    const loginUseCase = getLoginUseCase();
    await loginUseCase.execute({ username, password });
  } catch (error) {
    if (error instanceof DomainError) {
      return { error: error.message };
    }
    console.error("LoginAction unexpected error:", error);
    return { error: "Terjadi kesalahan saat memproses login." };
  }

  redirect("/admin/blocks");
}

export async function logoutAction() {
  const logoutUseCase = getLogoutUseCase();
  await logoutUseCase.execute();
  redirect("/login");
}
