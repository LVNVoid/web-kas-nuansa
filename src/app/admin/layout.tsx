import { getGetSessionUseCase } from "@/di/container";
import { AdminHeader } from "@/presentation/components/admin/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const getSession = getGetSessionUseCase();
  const session = await getSession.execute();

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-[#191919]">
      <AdminHeader userName={session?.name} />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
