"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { formatRupiah, formatDateIndo } from "@/lib/format";
import { PeriodData } from "@/core/entities/period.entity";
import { ExpenseRecordData } from "@/core/entities/expense.entity";
import {
  createExpenseAction,
  updateExpenseAction,
  deleteExpenseAction,
} from "@/app/actions/expenses";

export type { ExpenseRecordData };

interface ExpenseManagerProps {
  periods: PeriodData[];
  selectedPeriod: PeriodData | null;
  expenses: ExpenseRecordData[];
}

const CATEGORIES = [
  "Kebersihan",
  "Fasum",
  "Keamanan",
  "Sosial",
  "Operasional",
  "Konsumsi",
  "Lainnya",
];

export function ExpenseManager({
  periods,
  selectedPeriod,
  expenses,
}: ExpenseManagerProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseRecordData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handlePeriodChange = (periodId: string) => {
    router.push(`/admin/expenses?period=${periodId}`);
  };

  const filteredExpenses = expenses.filter((e) => {
    const term = search.toLowerCase();
    const matchSearch =
      e.title.toLowerCase().includes(term) ||
      (e.notes && e.notes.toLowerCase().includes(term)) ||
      e.category.toLowerCase().includes(term);
    if (!matchSearch) return false;

    if (categoryFilter !== "ALL" && e.category !== categoryFilter) {
      return false;
    }

    return true;
  });

  const totalPeriodExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleOpenAdd = () => {
    setEditingExpense(null);
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (expense: ExpenseRecordData) => {
    setEditingExpense(expense);
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      let res;
      if (editingExpense) {
        res = await updateExpenseAction(editingExpense.id, formData);
      } else {
        res = await createExpenseAction(formData);
      }

      if (!res.success) {
        const err = res.error || "Gagal menyimpan pengeluaran.";
        setErrorMsg(err);
        toast.error(err);
      } else {
        toast.success(
          editingExpense
            ? "Pengeluaran kas berhasil diperbarui"
            : "Pengeluaran baru berhasil dicatat"
        );
        setModalOpen(false);
      }
    });
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Yakin ingin menghapus pengeluaran "${title}"?`)) return;

    startTransition(async () => {
      const res = await deleteExpenseAction(id);
      if (!res.success) {
        toast.error(res.error || "Gagal menghapus pengeluaran.");
      } else {
        toast.success(`Pengeluaran "${title}" berhasil dihapus`);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#191919] sm:text-2xl">
            Pencatatan Pengeluaran Kas
          </h1>
          <p className="mt-0.5 text-xs text-[#787774]">
            Kelola mutasi pengeluaran dana operasional, fasum, dan sosial RT
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {periods.length > 0 && (
            <div className="relative">
              <select
                value={selectedPeriod?.id || ""}
                onChange={(e) => handlePeriodChange(e.target.value)}
                className="rounded-lg border border-[#eae9e5] bg-[#ffffff] px-3 py-2 text-xs font-semibold text-[#191919] shadow-xs outline-none focus:border-[#0075de] focus:ring-1 focus:ring-[#0075de]"
              >
                {periods.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleOpenAdd}
            className="rounded-lg bg-[#0075de] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#005bab] active:scale-[0.98]"
          >
            + Catat Pengeluaran
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      {selectedPeriod && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="notion-card p-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
              Total Pengeluaran Bulan Ini
            </span>
            <div className="mt-1 text-2xl font-bold tabular-money text-[#d95700]">
              {formatRupiah(totalPeriodExpense)}
            </div>
            <p className="mt-0.5 text-[11px] text-[#9b9a97]">
              Periode {selectedPeriod.name}
            </p>
          </div>
          <div className="notion-card p-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
              Jumlah Transaksi Keluar
            </span>
            <div className="mt-1 text-2xl font-bold tabular-money text-[#191919]">
              {expenses.length} <span className="text-xs font-normal text-[#787774]">item</span>
            </div>
            <p className="mt-0.5 text-[11px] text-[#9b9a97]">
              Tercatat dalam pembukuan
            </p>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="notion-card overflow-hidden">
        {/* Search & Category Filter */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#eae9e5] p-3.5 sm:p-4 bg-[#ffffff]">
          <input
            type="text"
            placeholder="Cari uraian pengeluaran / catatan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:max-w-xs rounded-lg border border-[#eae9e5] bg-[#fbfbfa] px-3 py-1.5 text-xs text-[#191919] placeholder-[#9b9a97] outline-none transition focus:border-[#0075de] focus:bg-[#ffffff] focus:ring-1 focus:ring-[#0075de]"
          />

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#787774]">Kategori:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-[#eae9e5] bg-[#fbfbfa] px-2.5 py-1 text-xs text-[#191919] outline-none focus:border-[#0075de]"
            >
              <option value="ALL">Semua Kategori</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#eae9e5] bg-[#fbfbfa] text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Tanggal</th>
                <th className="py-2.5 px-4 font-semibold">Kategori</th>
                <th className="py-2.5 px-4 font-semibold">Uraian Pengeluaran</th>
                <th className="py-2.5 px-4 font-semibold hidden md:table-cell">Catatan</th>
                <th className="py-2.5 px-4 font-semibold">Nominal</th>
                <th className="py-2.5 px-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f0ec]">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-[#f7f6f3] transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap text-[#787774]">
                    {formatDateIndo(expense.date)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block rounded-md bg-[#f1f0ec] border border-[#eae9e5] px-2 py-0.5 text-[10px] font-medium text-[#37352f]">
                      {expense.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-[#191919]">
                    {expense.title}
                  </td>
                  <td className="py-3 px-4 text-[#787774] max-w-xs truncate hidden md:table-cell">
                    {expense.notes || "-"}
                  </td>
                  <td className="py-3 px-4 font-bold tabular-money text-[#d95700] whitespace-nowrap">
                    - {formatRupiah(expense.amount)}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleOpenEdit(expense)}
                      className="text-xs font-medium text-[#0075de] hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id, expense.title)}
                      className="text-xs font-medium text-[#d95700] hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}

              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-xs text-[#9b9a97]">
                    Belum ada pengeluaran tercatat untuk filter ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add / Edit Expense */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-[#eae9e5] bg-[#ffffff] p-6 shadow-lg transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#eae9e5] pb-3">
              <h3 className="text-base font-bold text-[#191919]">
                {editingExpense ? "Edit Pengeluaran Kas" : "Catat Pengeluaran Baru"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fbfbfa] text-xs font-semibold text-[#787774] hover:bg-[#eae9e5] transition"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="mt-3 rounded-lg bg-[#fbf0e8] border border-[#d95700]/20 p-2.5 text-xs text-[#d95700] font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              <input
                type="hidden"
                name="periodId"
                value={selectedPeriod?.id || ""}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="date"
                    className="block text-xs font-semibold text-[#37352f] mb-1"
                  >
                    Tanggal Transaksi <span className="text-[#d95700]">*</span>
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    required
                    defaultValue={
                      editingExpense?.date
                        ? new Date(editingExpense.date).toISOString().split("T")[0]
                        : new Date().toISOString().split("T")[0]
                    }
                    className="w-full rounded-lg border border-[#eae9e5] bg-[#ffffff] px-3 py-2 text-xs text-[#191919] outline-none focus:border-[#0075de] focus:ring-1 focus:ring-[#0075de]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block text-xs font-semibold text-[#37352f] mb-1"
                  >
                    Kategori Pengeluaran
                  </label>
                  <select
                    id="category"
                    name="category"
                    defaultValue={editingExpense?.category || "Kebersihan"}
                    className="w-full rounded-lg border border-[#eae9e5] bg-[#ffffff] px-3 py-2 text-xs text-[#191919] outline-none focus:border-[#0075de]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="title"
                  className="block text-xs font-semibold text-[#37352f] mb-1"
                >
                  Uraian / Nama Pengeluaran <span className="text-[#d95700]">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  defaultValue={editingExpense?.title || ""}
                  placeholder="misal: Honor Petugas Sampah & Kebersihan"
                  className="w-full rounded-lg border border-[#eae9e5] bg-[#ffffff] px-3 py-2 text-xs text-[#191919] outline-none focus:border-[#0075de] focus:ring-1 focus:ring-[#0075de]"
                />
              </div>

              <div>
                <label
                  htmlFor="amount"
                  className="block text-xs font-semibold text-[#37352f] mb-1"
                >
                  Nominal Pengeluaran (Rp) <span className="text-[#d95700]">*</span>
                </label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  required
                  min="1"
                  defaultValue={editingExpense?.amount || ""}
                  placeholder="misal: 500000"
                  className="w-full rounded-lg border border-[#eae9e5] bg-[#ffffff] px-3 py-2 text-xs text-[#191919] tabular-money outline-none focus:border-[#0075de] focus:ring-1 focus:ring-[#0075de]"
                />
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-xs font-semibold text-[#37352f] mb-1"
                >
                  Catatan / Keterangan
                </label>
                <input
                  id="notes"
                  name="notes"
                  type="text"
                  defaultValue={editingExpense?.notes || ""}
                  placeholder="misal: Kwitansi No. 12, beli di toko listrik"
                  className="w-full rounded-lg border border-[#eae9e5] bg-[#ffffff] px-3 py-2 text-xs text-[#191919] outline-none focus:border-[#0075de] focus:ring-1 focus:ring-[#0075de]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-[#eae9e5] pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-[#eae9e5] bg-[#ffffff] px-3.5 py-2 text-xs font-semibold text-[#787774] hover:bg-[#fbfbfa] transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-lg bg-[#0075de] px-4 py-2 text-xs font-semibold text-white hover:bg-[#005bab] transition disabled:opacity-50"
                >
                  {isPending ? "Menyimpan..." : "Simpan Pengeluaran"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
