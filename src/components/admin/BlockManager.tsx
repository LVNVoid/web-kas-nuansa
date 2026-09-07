"use client";

import { useState, useTransition } from "react";
import {
  createBlockAction,
  updateBlockAction,
  deleteBlockAction,
} from "@/app/actions/blocks";

export interface ResidentBlockData {
  id: string;
  blockName: string;
  ownerName: string | null;
  phone: string | null;
  isOccupied: boolean;
  notes: string | null;
}

interface BlockManagerProps {
  initialBlocks: ResidentBlockData[];
}

export function BlockManager({ initialBlocks }: BlockManagerProps) {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ResidentBlockData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Filter blocks
  const filteredBlocks = initialBlocks.filter((b) => {
    const term = search.toLowerCase();
    return (
      b.blockName.toLowerCase().includes(term) ||
      (b.ownerName && b.ownerName.toLowerCase().includes(term)) ||
      (b.phone && b.phone.includes(term))
    );
  });

  const occupiedCount = initialBlocks.filter((b) => b.isOccupied).length;
  const vacantCount = initialBlocks.length - occupiedCount;

  const handleOpenAdd = () => {
    setEditingBlock(null);
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (block: ResidentBlockData) => {
    setEditingBlock(block);
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      let res;
      if (editingBlock) {
        res = await updateBlockAction(editingBlock.id, formData);
      } else {
        res = await createBlockAction(formData);
      }

      if (!res.success) {
        setErrorMsg(res.error || "Gagal menyimpan data.");
      } else {
        setModalOpen(false);
      }
    });
  };

  const handleDelete = (id: string, blockName: string) => {
    if (!confirm(`Yakin ingin menghapus ${blockName}? Seluruh riwayat transaksi blok ini juga akan terhapus.`)) {
      return;
    }

    startTransition(async () => {
      const res = await deleteBlockAction(id);
      if (!res.success) {
        alert(res.error || "Gagal menghapus blok.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Action */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#191919] sm:text-2xl">
            Master Data Blok Hunian
          </h1>
          <p className="mt-0.5 text-xs text-[#787774]">
            Total {initialBlocks.length} unit ({occupiedCount} dihuni, {vacantCount} kosong)
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#0075de] px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#005bab] active:scale-[0.98]"
        >
          <span>+</span>
          <span>Tambah Blok Baru</span>
        </button>
      </div>

      {/* Main Card with Filter & Table */}
      <div className="notion-card overflow-hidden">
        {/* Search & Counter Bar */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#eae9e5] p-3.5 sm:p-4 bg-[#ffffff]">
          <input
            type="text"
            placeholder="Cari nama blok, penghuni, no WA..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:max-w-xs rounded-lg border border-[#eae9e5] bg-[#fbfbfa] px-3 py-1.5 text-xs text-[#191919] placeholder-[#9b9a97] outline-none transition focus:border-[#0075de] focus:bg-[#ffffff] focus:ring-1 focus:ring-[#0075de]"
          />
          <span className="text-[11px] font-medium text-[#787774] self-end sm:self-center">
            Menampilkan {filteredBlocks.length} dari {initialBlocks.length} blok
          </span>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#eae9e5] bg-[#fbfbfa] text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Blok</th>
                <th className="py-2.5 px-4 font-semibold">Penghuni</th>
                <th className="py-2.5 px-4 font-semibold">Kontak WA</th>
                <th className="py-2.5 px-4 font-semibold">Status</th>
                <th className="py-2.5 px-4 font-semibold hidden md:table-cell">Catatan</th>
                <th className="py-2.5 px-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f0ec]">
              {filteredBlocks.map((block) => (
                <tr
                  key={block.id}
                  className="hover:bg-[#f7f6f3] transition-colors"
                >
                  <td className="py-3 px-4 font-bold text-[#191919]">
                    {block.blockName}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#37352f]">
                    {block.ownerName || "-"}
                  </td>
                  <td className="py-3 px-4 text-[#787774] font-mono text-[11px]">
                    {block.phone || "-"}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium ${
                        block.isOccupied
                          ? "bg-[#edf7ed] text-[#0f7b34] border border-[#0f7b34]/20"
                          : "bg-[#f1f0ec] text-[#787774] border border-[#eae9e5]"
                      }`}
                    >
                      {block.isOccupied ? "Dihuni" : "Kosong"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[11px] text-[#9b9a97] hidden md:table-cell max-w-xs truncate">
                    {block.notes || "-"}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(block)}
                      className="text-xs font-medium text-[#0075de] hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(block.id, block.blockName)}
                      className="text-xs font-medium text-[#d95700] hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}

              {filteredBlocks.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-xs text-[#9b9a97]"
                  >
                    Tidak ada blok hunian yang sesuai kriteria pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add / Edit Block */}
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
                {editingBlock ? `Edit ${editingBlock.blockName}` : "Tambah Blok Hunian"}
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
              <div>
                <label
                  htmlFor="blockName"
                  className="block text-xs font-semibold text-[#37352f] mb-1"
                >
                  Nama Blok <span className="text-[#d95700]">*</span>
                </label>
                <input
                  id="blockName"
                  name="blockName"
                  type="text"
                  required
                  defaultValue={editingBlock?.blockName || ""}
                  placeholder="misal: B29 atau C21"
                  className="w-full rounded-lg border border-[#eae9e5] bg-[#ffffff] px-3 py-2 text-xs text-[#191919] uppercase outline-none focus:border-[#0075de] focus:ring-1 focus:ring-[#0075de]"
                />
              </div>

              <div>
                <label
                  htmlFor="ownerName"
                  className="block text-xs font-semibold text-[#37352f] mb-1"
                >
                  Nama Pemilik / Penghuni
                </label>
                <input
                  id="ownerName"
                  name="ownerName"
                  type="text"
                  defaultValue={editingBlock?.ownerName || ""}
                  placeholder="Nama warga"
                  className="w-full rounded-lg border border-[#eae9e5] bg-[#ffffff] px-3 py-2 text-xs text-[#191919] outline-none focus:border-[#0075de] focus:ring-1 focus:ring-[#0075de]"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-semibold text-[#37352f] mb-1"
                >
                  No. WhatsApp
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  defaultValue={editingBlock?.phone || ""}
                  placeholder="misal: 081234567890"
                  className="w-full rounded-lg border border-[#eae9e5] bg-[#ffffff] px-3 py-2 text-xs text-[#191919] outline-none focus:border-[#0075de] focus:ring-1 focus:ring-[#0075de]"
                />
              </div>

              <div>
                <label
                  htmlFor="isOccupied"
                  className="block text-xs font-semibold text-[#37352f] mb-1"
                >
                  Status Hunian
                </label>
                <select
                  id="isOccupied"
                  name="isOccupied"
                  defaultValue={editingBlock?.isOccupied ? "true" : "false"}
                  className="w-full rounded-lg border border-[#eae9e5] bg-[#ffffff] px-3 py-2 text-xs text-[#191919] outline-none focus:border-[#0075de] focus:ring-1 focus:ring-[#0075de]"
                >
                  <option value="true">Dihuni</option>
                  <option value="false">Kosong</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-xs font-semibold text-[#37352f] mb-1"
                >
                  Catatan Tambahan
                </label>
                <input
                  id="notes"
                  name="notes"
                  type="text"
                  defaultValue={editingBlock?.notes || ""}
                  placeholder="Keterangan opsional"
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
                  {isPending ? "Menyimpan..." : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
