"use client";

import { useState } from "react";
import { DashboardBlockItem } from "@/core/entities/dashboard.entity";
import { formatRupiah, formatDateIndo } from "@/lib/format";

interface BlockGridProps {
  blocks: DashboardBlockItem[];
  periodName?: string;
}

export function BlockGrid({ blocks, periodName }: BlockGridProps) {
  const [filter, setFilter] = useState<"ALL" | "PAID" | "UNPAID">("ALL");
  const [search, setSearch] = useState("");
  const [selectedBlock, setSelectedBlock] = useState<DashboardBlockItem | null>(null);

  const filteredBlocks = blocks.filter((b) => {
    const matchSearch =
      b.blockName.toLowerCase().includes(search.toLowerCase()) ||
      (b.ownerName && b.ownerName.toLowerCase().includes(search.toLowerCase()));
    if (!matchSearch) return false;

    if (filter === "PAID") return b.isPaid;
    if (filter === "UNPAID") return !b.isPaid;
    return true;
  });

  return (
    <div className="notion-card p-4 sm:p-5">
      {/* Header & Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#eae9e5] pb-3.5">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#191919]">
            Matriks Status Iuran Warga
          </h3>
          <p className="mt-0.5 text-xs text-[#787774]">
            {periodName ? `Status periode ${periodName}. ` : ""}Klik blok untuk melihat rincian setoran
          </p>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Cari Blok..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-28 sm:w-36 rounded-lg border border-[#eae9e5] bg-[#fbfbfa] px-2.5 py-1 text-xs text-[#191919] placeholder-[#9b9a97] outline-none transition focus:border-[#0075de] focus:bg-[#ffffff] focus:ring-1 focus:ring-[#0075de]"
          />

          <div className="inline-flex rounded-lg border border-[#eae9e5] bg-[#fbfbfa] p-0.5 text-xs">
            <button
              onClick={() => setFilter("ALL")}
              className={`rounded-md px-2.5 py-1 font-medium transition ${
                filter === "ALL"
                  ? "bg-[#ffffff] text-[#191919] shadow-xs font-semibold"
                  : "text-[#787774] hover:text-[#191919]"
              }`}
            >
              Semua ({blocks.length})
            </button>
            <button
              onClick={() => setFilter("PAID")}
              className={`rounded-md px-2.5 py-1 font-medium transition ${
                filter === "PAID"
                  ? "bg-[#ffffff] text-[#0f7b34] shadow-xs font-semibold"
                  : "text-[#787774] hover:text-[#191919]"
              }`}
            >
              Lunas
            </button>
            <button
              onClick={() => setFilter("UNPAID")}
              className={`rounded-md px-2.5 py-1 font-medium transition ${
                filter === "UNPAID"
                  ? "bg-[#ffffff] text-[#d95700] shadow-xs font-semibold"
                  : "text-[#787774] hover:text-[#191919]"
              }`}
            >
              Belum
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Blocks */}
      <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        {filteredBlocks.map((block) => (
          <button
            key={block.id}
            onClick={() => setSelectedBlock(block)}
            className={`group relative flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all duration-150 hover:scale-[1.02] active:scale-[0.96] ${
              block.isPaid
                ? "border-[#0f7b34]/25 bg-[#edf7ed]/30 hover:border-[#0f7b34] hover:bg-[#ffffff]"
                : "border-[#eae9e5] bg-[#ffffff] opacity-80 hover:opacity-100 hover:border-[#9b9a97]"
            }`}
          >
            {/* Status dot */}
            <span
              className={`absolute top-2 right-2 h-1.5 w-1.5 rounded-full ${
                block.isPaid ? "bg-[#0f7b34]" : "bg-[#9b9a97]"
              }`}
            />

            <span className="text-sm font-bold tracking-tight text-[#191919]">
              {block.blockName}
            </span>
            <span className="mt-0.5 truncate text-[10px] text-[#787774] max-w-[70px]">
              {block.ownerName || "Warga"}
            </span>
            <span
              className={`mt-1.5 inline-block rounded-md px-2 py-0.5 text-[9px] font-semibold ${
                block.isPaid
                  ? "bg-[#edf7ed] text-[#0f7b34] border border-[#0f7b34]/20"
                  : "bg-[#f1f0ec] text-[#787774] border border-[#eae9e5]"
              }`}
            >
              {block.isPaid ? "LUNAS" : "BELUM"}
            </span>
          </button>
        ))}

        {filteredBlocks.length === 0 && (
          <div className="col-span-full py-10 text-center text-xs text-[#9b9a97]">
            Tidak ada blok hunian yang sesuai filter.
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedBlock && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4"
          onClick={() => setSelectedBlock(null)}
        >
          <div
            className="w-full max-w-sm rounded-xl border border-[#eae9e5] bg-[#ffffff] p-5 shadow-lg transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#eae9e5] pb-3">
              <div>
                <h4 className="text-base font-bold text-[#191919]">
                  Rincian {selectedBlock.blockName}
                </h4>
                <p className="text-xs text-[#787774]">
                  {selectedBlock.ownerName || "Data Penghuni Belum Diisi"}
                </p>
              </div>
              <button
                onClick={() => setSelectedBlock(null)}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fbfbfa] text-xs font-semibold text-[#787774] hover:bg-[#eae9e5] transition"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1">
                <span className="text-[#787774]">Status Pembayaran:</span>
                <span
                  className={`rounded-md px-2.5 py-0.5 font-bold ${
                    selectedBlock.isPaid
                      ? "bg-[#edf7ed] text-[#0f7b34] border border-[#0f7b34]/20"
                      : "bg-[#f1f0ec] text-[#787774] border border-[#eae9e5]"
                  }`}
                >
                  {selectedBlock.isPaid ? "LUNAS" : "BELUM LUNAS"}
                </span>
              </div>

              {selectedBlock.isPaid && selectedBlock.paidAt && (
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#787774]">Tanggal Bayar:</span>
                  <span className="font-medium text-[#191919]">
                    {formatDateIndo(selectedBlock.paidAt)}
                  </span>
                </div>
              )}

              <div className="border-t border-dashed border-[#eae9e5] pt-2 space-y-1.5">
                <div className="flex justify-between text-[#787774]">
                  <span>Iuran Lingkungan:</span>
                  <span className="font-medium tabular-money text-[#191919]">
                    {formatRupiah(selectedBlock.iuranAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-[#787774]">
                  <span>Kas Warga:</span>
                  <span className="font-medium tabular-money text-[#191919]">
                    {formatRupiah(selectedBlock.kasAmount)}
                  </span>
                </div>
                {selectedBlock.infaqAmount > 0 && (
                  <div className="flex justify-between text-[#787774]">
                    <span>Infaq / Sosial:</span>
                    <span className="font-medium tabular-money text-[#191919]">
                      {formatRupiah(selectedBlock.infaqAmount)}
                    </span>
                  </div>
                )}
                {selectedBlock.thrAmount > 0 && (
                  <div className="flex justify-between text-[#787774]">
                    <span>Pungutan THR:</span>
                    <span className="font-medium tabular-money text-[#191919]">
                      {formatRupiah(selectedBlock.thrAmount)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-[#eae9e5] pt-3 text-sm font-bold">
                <span className="text-[#191919]">Total Setoran:</span>
                <span className="text-[#0075de] tabular-money">
                  {formatRupiah(selectedBlock.totalAmount)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedBlock(null)}
              className="mt-5 w-full rounded-lg bg-[#0075de] py-2 text-xs font-semibold text-white transition hover:bg-[#005bab] active:scale-[0.98]"
            >
              Tutup Rincian
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
