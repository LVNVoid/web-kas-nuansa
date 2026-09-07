"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatRupiah } from "@/lib/format";
import {
  quickTogglePaidAction,
  savePaymentDetailAction,
  createPeriodAction,
} from "@/app/actions/payments";

export interface PeriodData {
  id: string;
  month: number;
  year: number;
  name: string;
  hasThr: boolean;
}

export interface BlockPaymentRow {
  blockId: string;
  blockName: string;
  ownerName: string | null;
  phone: string | null;
  paymentId: string | null;
  isPaid: boolean;
  paidAt: Date | null;
  iuranAmount: number;
  kasAmount: number;
  infaqAmount: number;
  thrAmount: number;
  totalAmount: number;
  notes: string | null;
}

interface PaymentManagerProps {
  periods: PeriodData[];
  selectedPeriod: PeriodData | null;
  payments: BlockPaymentRow[];
}

export function PaymentManager({
  periods,
  selectedPeriod,
  payments,
}: PaymentManagerProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "PAID" | "UNPAID">("ALL");
  const [editingRow, setEditingRow] = useState<BlockPaymentRow | null>(null);
  const [newPeriodModal, setNewPeriodModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filtered rows
  const filteredRows = payments.filter((row) => {
    const term = search.toLowerCase();
    const matchSearch =
      row.blockName.toLowerCase().includes(term) ||
      (row.ownerName && row.ownerName.toLowerCase().includes(term));
    if (!matchSearch) return false;

    if (filter === "PAID") return row.isPaid;
    if (filter === "UNPAID") return !row.isPaid;
    return true;
  });

  const paidCount = payments.filter((p) => p.isPaid).length;
  const unpaidCount = payments.length - paidCount;
  const totalIncome = payments
    .filter((p) => p.isPaid)
    .reduce((sum, p) => sum + p.totalAmount, 0);

  const handlePeriodChange = (periodId: string) => {
    router.push(`/admin/payments?period=${periodId}`);
  };

  const handleQuickToggle = (row: BlockPaymentRow) => {
    if (!selectedPeriod) return;
    startTransition(async () => {
      const res = await quickTogglePaidAction(
        row.blockId,
        selectedPeriod.id,
        !row.isPaid
      );
      if (!res.success) {
        alert(res.error || "Gagal mengubah status bayar.");
      }
    });
  };

  const handleSavePaymentDetail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await savePaymentDetailAction(formData);
      if (!res.success) {
        setErrorMsg(res.error || "Gagal menyimpan rincian pembayaran.");
      } else {
        setEditingRow(null);
      }
    });
  };

  const handleCreatePeriod = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await createPeriodAction(formData);
      if (!res.success) {
        setErrorMsg(res.error || "Gagal membuat periode.");
      } else {
        setNewPeriodModal(false);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Period Selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#191919] sm:text-2xl">
            Pencatatan Pemasukan Warga
          </h1>
          <p className="mt-0.5 text-xs text-[#787774]">
            Kelola setoran iuran, kas, infaq, dan THR per periode
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
                    {p.name} {p.hasThr ? "(+THR)" : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => {
              setErrorMsg(null);
              setNewPeriodModal(true);
            }}
            className="rounded-lg bg-[#0075de] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#005bab] shadow-xs transition active:scale-[0.98]"
          >
            + Buat Periode Baru
          </button>
        </div>
      </div>

      {/* Stats Cards for Active Period */}
      {selectedPeriod && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="notion-card p-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
              Total Pemasukan Periode Ini
            </span>
            <div className="mt-1 text-xl font-bold tabular-money text-[#0075de]">
              {formatRupiah(totalIncome)}
            </div>
          </div>
          <div className="notion-card p-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
              Sudah Lunas
            </span>
            <div className="mt-1 text-xl font-bold tabular-money text-[#0f7b34]">
              {paidCount} <span className="text-xs font-normal text-[#787774]">/ {payments.length} Blok</span>
            </div>
          </div>
          <div className="notion-card p-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
              Belum Lunas
            </span>
            <div className="mt-1 text-xl font-bold tabular-money text-[#d95700]">
              {unpaidCount} <span className="text-xs font-normal text-[#787774]">Blok</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Table Card */}
      <div className="notion-card overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#eae9e5] p-3.5 sm:p-4 bg-[#ffffff]">
          <input
            type="text"
            placeholder="Cari nama blok atau warga..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:max-w-xs rounded-lg border border-[#eae9e5] bg-[#fbfbfa] px-3 py-1.5 text-xs text-[#191919] placeholder-[#9b9a97] outline-none transition focus:border-[#0075de] focus:bg-[#ffffff] focus:ring-1 focus:ring-[#0075de]"
          />

          <div className="flex items-center gap-1.5 rounded-lg border border-[#eae9e5] bg-[#fbfbfa] p-1 text-xs self-start sm:self-auto">
            <button
              onClick={() => setFilter("ALL")}
              className={`rounded-md px-2.5 py-1 font-medium transition ${
                filter === "ALL"
                  ? "bg-[#ffffff] text-[#191919] shadow-xs font-semibold"
                  : "text-[#787774] hover:text-[#191919]"
              }`}
            >
              Semua ({payments.length})
            </button>
            <button
              onClick={() => setFilter("PAID")}
              className={`rounded-md px-2.5 py-1 font-medium transition ${
                filter === "PAID"
                  ? "bg-[#ffffff] text-[#0f7b34] shadow-xs font-semibold"
                  : "text-[#787774] hover:text-[#191919]"
              }`}
            >
              Lunas ({paidCount})
            </button>
            <button
              onClick={() => setFilter("UNPAID")}
              className={`rounded-md px-2.5 py-1 font-medium transition ${
                filter === "UNPAID"
                  ? "bg-[#ffffff] text-[#d95700] shadow-xs font-semibold"
                  : "text-[#787774] hover:text-[#191919]"
              }`}
            >
              Belum ({unpaidCount})
            </button>
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#eae9e5] bg-[#fbfbfa] text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Blok & Warga</th>
                <th className="py-2.5 px-4 font-semibold">Iuran</th>
                <th className="py-2.5 px-4 font-semibold">Kas</th>
                <th className="py-2.5 px-4 font-semibold">Infaq</th>
                {selectedPeriod?.hasThr && <th className="py-2.5 px-4 font-semibold">THR</th>}
                <th className="py-2.5 px-4 font-semibold">Total Setoran</th>
                <th className="py-2.5 px-4 font-semibold text-center">Status</th>
                <th className="py-2.5 px-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f0ec]">
              {filteredRows.map((row) => (
                <tr key={row.blockId} className="hover:bg-[#f7f6f3] transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#191919]">
                      {row.blockName}
                    </div>
                    <div className="text-[11px] text-[#787774]">
                      {row.ownerName || "Warga"}
                    </div>
                  </td>
                  <td className="py-3 px-4 tabular-money text-[#37352f]">
                    {formatRupiah(row.iuranAmount)}
                  </td>
                  <td className="py-3 px-4 tabular-money text-[#37352f]">
                    {formatRupiah(row.kasAmount)}
                  </td>
                  <td className="py-3 px-4 tabular-money text-[#37352f]">
                    {formatRupiah(row.infaqAmount)}
                  </td>
                  {selectedPeriod?.hasThr && (
                    <td className="py-3 px-4 tabular-money text-[#37352f]">
                      {formatRupiah(row.thrAmount)}
                    </td>
                  )}
                  <td className="py-3 px-4 font-bold tabular-money text-[#0075de]">
                    {formatRupiah(row.totalAmount)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleQuickToggle(row)}
                      disabled={isPending}
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-[10px] font-semibold transition active:scale-95 disabled:opacity-50 ${
                        row.isPaid
                          ? "bg-[#edf7ed] text-[#0f7b34] border border-[#0f7b34]/20 hover:bg-[#e0f2e0]"
                          : "bg-[#f1f0ec] text-[#787774] border border-[#eae9e5] hover:bg-[#eae9e5]"
                      }`}
                    >
                      {row.isPaid ? "✓ LUNAS" : "BELUM"}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setErrorMsg(null);
                        setEditingRow(row);
                      }}
                      className="text-xs font-medium text-[#0075de] hover:underline"
                    >
                      Edit Detail
                    </button>
                  </td>
                </tr>
              ))}

              {filteredRows.length === 0 && (
                <tr>
                  <td
                    colSpan={selectedPeriod?.hasThr ? 8 : 7}
                    className="py-10 text-center text-xs text-[#9b9a97]"
                  >
                    Tidak ada data pembayaran yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Edit Payment Detail */}
      {editingRow && selectedPeriod && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4"
          onClick={() => setEditingRow(null)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-[#eae9e5] bg-[#ffffff] p-6 shadow-lg transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#eae9e5] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#191919]">
                  Setoran {editingRow.blockName}
                </h3>
                <p className="text-xs text-[#787774]">
                  Periode {selectedPeriod.name}
                </p>
              </div>
              <button
                onClick={() => setEditingRow(null)}
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

            <form onSubmit={handleSavePaymentDetail} className="mt-4 space-y-3.5">
              <input type="hidden" name="blockId" value={editingRow.blockId} />
              <input type="hidden" name="periodId" value={selectedPeriod.id} />

              <div>
                <label
                  htmlFor="isPaid"
                  className="block text-xs font-semibold text-[#37352f] mb-1"
                >
                  Status Pembayaran
                </label>
                <select
                  id="isPaid"
                  name="isPaid"
                  defaultValue={editingRow.isPaid ? "true" : "false"}
                  className="w-full rounded-lg border border-[#eae9e5] bg-[#ffffff] px-3 py-2 text-xs text-[#191919] outline-none focus:border-[#0075de] focus:ring-1 focus:ring-[#0075de]"
                >
                  <option value="true">Lunas</option>
                  <option value="false">Belum Lunas</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="iuranAmount"
                    className="block text-xs font-semibold text-[#37352f] mb-1"
                  >
                    Iuran Lingkungan (Rp)
                  </label>
                  <input
                    id="iuranAmount"
                    name="iuranAmount"
                    type="number"
                    defaultValue={editingRow.iuranAmount || 50000}
                    className="w-full rounded-lg border border-[#eae9e5] bg-[#ffffff] px-3 py-2 text-xs text-[#191919] tabular-money outline-none focus:border-[#0075de] focus:ring-1 focus:ring-[#0075de]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="kasAmount"
                    className="block text-xs font-semibold text-[#37352f] mb-1"
                  >
                    Kas Warga (Rp)
                  </label>
                  <input
                    id="kasAmount"
                    name="kasAmount"
                    type="number"
                    defaultValue={editingRow.kasAmount || 25000}
                    className="w-full rounded-lg border border-[#eae9e5] bg-[#ffffff] px-3 py-2 text-xs text-[#191919] tabular-money outline-none focus:border-[#0075de] focus:ring-1 focus:ring-[#0075de]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="infaqAmount"
                    className="block text-xs font-semibold text-[#37352f] mb-1"
                  >
                    Infaq / Sosial (Rp)
                  </label>
                  <input
                    id="infaqAmount"
                    name="infaqAmount"
                    type="number"
                    defaultValue={editingRow.infaqAmount || 0}
                    className="w-full rounded-lg border border-[#eae9e5] bg-[#ffffff] px-3 py-2 text-xs text-[#191919] tabular-money outline-none focus:border-[#0075de] focus:ring-1 focus:ring-[#0075de]"
                  />
                </div>
                {selectedPeriod.hasThr ? (
                  <div>
                    <label
                      htmlFor="thrAmount"
                      className="block text-xs font-semibold text-[#37352f] mb-1"
                    >
                      Pungutan THR (Rp)
                    </label>
                    <input
                      id="thrAmount"
                      name="thrAmount"
                      type="number"
                      defaultValue={editingRow.thrAmount || 0}
                      className="w-full rounded-lg border border-[#eae9e5] bg-[#ffffff] px-3 py-2 text-xs text-[#191919] tabular-money outline-none focus:border-[#0075de] focus:ring-1 focus:ring-[#0075de]"
                    />
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="paidAt"
                      className="block text-xs font-semibold text-[#37352f] mb-1"
                    >
                      Tanggal Pembayaran
                    </label>
                    <input
                      id="paidAt"
                      name="paidAt"
                      type="date"
                      defaultValue={
                        editingRow.paidAt
                          ? new Date(editingRow.paidAt).toISOString().split("T")[0]
                          : ""
                      }
                      className="w-full rounded-lg border border-[#eae9e5] bg-[#ffffff] px-3 py-2 text-xs text-[#191919] outline-none focus:border-[#0075de] focus:ring-1 focus:ring-[#0075de]"
                    />
                  </div>
                )}
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
                  defaultValue={editingRow.notes || ""}
                  placeholder="misal: Transfer BCA, titip via Blok B2"
                  className="w-full rounded-lg border border-[#eae9e5] bg-[#ffffff] px-3 py-2 text-xs text-[#191919] outline-none focus:border-[#0075de] focus:ring-1 focus:ring-[#0075de]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-[#eae9e5] pt-4">
                <button
                  type="button"
                  onClick={() => setEditingRow(null)}
                  className="rounded-lg border border-[#eae9e5] bg-[#ffffff] px-3.5 py-2 text-xs font-semibold text-[#787774] hover:bg-[#fbfbfa] transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-lg bg-[#0075de] px-4 py-2 text-xs font-semibold text-white hover:bg-[#005bab] transition disabled:opacity-50"
                >
                  {isPending ? "Menyimpan..." : "Simpan Setoran"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create New Period */}
      {newPeriodModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4"
          onClick={() => setNewPeriodModal(false)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-[#eae9e5] bg-[#ffffff] p-6 shadow-lg transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#eae9e5] pb-3">
              <h3 className="text-base font-bold text-[#191919]">
                Buat Periode Pembukuan Baru
              </h3>
              <button
                onClick={() => setNewPeriodModal(false)}
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

            <form onSubmit={handleCreatePeriod} className="mt-4 space-y-3.5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold text-[#37352f] mb-1"
                >
                  Nama Periode <span className="text-[#d95700]">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="misal: Oktober 2026"
                  className="w-full rounded-lg border border-[#eae9e5] bg-[#ffffff] px-3 py-2 text-xs text-[#191919] outline-none focus:border-[#0075de] focus:ring-1 focus:ring-[#0075de]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="month"
                    className="block text-xs font-semibold text-[#37352f] mb-1"
                  >
                    Bulan (1 - 12)
                  </label>
                  <input
                    id="month"
                    name="month"
                    type="number"
                    min="1"
                    max="12"
                    defaultValue={new Date().getMonth() + 1}
                    required
                    className="w-full rounded-lg border border-[#eae9e5] bg-[#ffffff] px-3 py-2 text-xs text-[#191919] tabular-money outline-none focus:border-[#0075de] focus:ring-1 focus:ring-[#0075de]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="year"
                    className="block text-xs font-semibold text-[#37352f] mb-1"
                  >
                    Tahun
                  </label>
                  <input
                    id="year"
                    name="year"
                    type="number"
                    defaultValue={new Date().getFullYear()}
                    required
                    className="w-full rounded-lg border border-[#eae9e5] bg-[#ffffff] px-3 py-2 text-xs text-[#191919] tabular-money outline-none focus:border-[#0075de] focus:ring-1 focus:ring-[#0075de]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="hasThr"
                  className="block text-xs font-semibold text-[#37352f] mb-1"
                >
                  Ada Pungutan THR di Bulan Ini?
                </label>
                <select
                  id="hasThr"
                  name="hasThr"
                  defaultValue="false"
                  className="w-full rounded-lg border border-[#eae9e5] bg-[#ffffff] px-3 py-2 text-xs text-[#191919] outline-none focus:border-[#0075de] focus:ring-1 focus:ring-[#0075de]"
                >
                  <option value="false">Tidak Ada THR</option>
                  <option value="true">Ya, Ada Kolom THR</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-[#eae9e5] pt-4">
                <button
                  type="button"
                  onClick={() => setNewPeriodModal(false)}
                  className="rounded-lg border border-[#eae9e5] bg-[#ffffff] px-3.5 py-2 text-xs font-semibold text-[#787774] hover:bg-[#fbfbfa] transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-lg bg-[#0075de] px-4 py-2 text-xs font-semibold text-white hover:bg-[#005bab] transition disabled:opacity-50"
                >
                  {isPending ? "Membuat..." : "Buat Periode"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
