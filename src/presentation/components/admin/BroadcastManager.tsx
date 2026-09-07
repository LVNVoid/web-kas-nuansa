"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { PeriodData } from "@/core/entities/period.entity";
import { DashboardSummary } from "@/core/entities/dashboard.entity";
import { BroadcastServiceImpl } from "@/infrastructure/services/broadcast.service.impl";

const broadcastService = new BroadcastServiceImpl();

interface BroadcastManagerProps {
  periods: PeriodData[];
  selectedPeriod: PeriodData | null;
  summary: DashboardSummary;
}

export function BroadcastManager({
  periods,
  selectedPeriod,
  summary,
}: BroadcastManagerProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [customText, setCustomText] = useState<string | null>(null);

  const defaultText = broadcastService.generateWhatsAppReportText(
    summary,
    typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"
  );

  const textToDisplay = customText !== null ? customText : defaultText;

  const handlePeriodChange = (periodId: string) => {
    setCustomText(null);
    router.push(`/admin/broadcast?period=${periodId}`);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToDisplay);
      setCopied(true);
      toast.success("Teks laporan berhasil disalin ke clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Gagal menyalin teks ke clipboard.");
    }
  };

  const handleReset = () => {
    setCustomText(null);
    toast("Teks dikembalikan ke format awal", { icon: "↺" });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#191919] sm:text-2xl">
            WhatsApp Broadcast Generator
          </h1>
          <p className="mt-0.5 text-xs text-[#787774]">
            Format rekap otomatis siap kirim ke Grup WhatsApp warga
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
            onClick={handleCopy}
            className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white shadow-xs transition active:scale-[0.98] ${
              copied
                ? "bg-[#0f7b34]"
                : "bg-[#0075de] hover:bg-[#005bab]"
            }`}
          >
            {copied ? "✓ Tersalin ke Clipboard!" : "📋 Salin Teks WhatsApp"}
          </button>
        </div>
      </div>

      {/* Main Grid: Editor & Live Preview */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Text Area Editor */}
        <div className="notion-card p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#eae9e5] pb-2.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
              Teks Laporan (Dapat Diedit)
            </span>
            {customText !== null && (
              <button
                onClick={handleReset}
                className="text-[11px] font-medium text-[#0075de] hover:underline"
              >
                Reset ke Teks Awal
              </button>
            )}
          </div>

          <textarea
            value={textToDisplay}
            onChange={(e) => setCustomText(e.target.value)}
            rows={18}
            className="w-full rounded-lg border border-[#eae9e5] bg-[#fbfbfa] p-3.5 text-xs font-mono text-[#191919] leading-relaxed outline-none transition focus:border-[#0075de] focus:bg-[#ffffff] focus:ring-1 focus:ring-[#0075de]"
          />

          <p className="text-[11px] text-[#9b9a97]">
            Tips: Anda dapat mengedit atau menambahkan catatan khusus pada kotak teks di atas sebelum menyalinnya.
          </p>
        </div>

        {/* WhatsApp Message Preview Bubble */}
        <div className="notion-card p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#eae9e5] pb-2.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
              Pratinjau Pesan WhatsApp
            </span>
            <span className="inline-flex items-center rounded-md bg-[#edf7ed] px-2 py-0.5 text-[10px] font-medium text-[#0f7b34] border border-[#0f7b34]/20">
              ● Live Preview
            </span>
          </div>

          {/* Chat Mockup Background */}
          <div className="rounded-xl border border-[#eae9e5] bg-[#efeae2]/60 p-3 sm:p-4 min-h-[380px] flex items-start">
            <div className="w-full max-w-md rounded-2xl bg-[#ffffff] border border-[#eae9e5] p-4 shadow-xs text-xs leading-relaxed text-[#191919] whitespace-pre-wrap font-sans">
              {textToDisplay}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
