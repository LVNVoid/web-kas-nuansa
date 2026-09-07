import { formatRupiah, formatDateIndo } from "@/lib/format";
import { DashboardExpenseItem } from "@/core/entities/dashboard.entity";

interface ExpenseListProps {
  expenses: DashboardExpenseItem[];
  totalExpense: number;
}

export function ExpenseList({ expenses, totalExpense }: ExpenseListProps) {
  return (
    <div className="notion-card p-4 sm:p-5">
      <div className="flex items-center justify-between border-b border-[#eae9e5] pb-3.5">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#191919]">
            Rincian Pengeluaran Kas
          </h3>
          <p className="mt-0.5 text-xs text-[#787774]">
            Transparansi penggunaan dana kas pada periode ini
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-[#787774]">
            Total Keluar
          </span>
          <div className="text-sm font-bold tabular-money text-[#d95700]">
            {formatRupiah(totalExpense)}
          </div>
        </div>
      </div>

      <div className="mt-3 divide-y divide-[#f1f0ec]">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="flex flex-col gap-1.5 py-3 sm:flex-row sm:items-center sm:justify-between hover:bg-[#f7f6f3]/50 transition rounded-lg px-1.5"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex items-center rounded-md bg-[#f1f0ec] border border-[#eae9e5] px-2 py-0.5 text-[10px] font-medium text-[#37352f]">
                {expense.category}
              </span>
              <div>
                <h4 className="text-xs font-semibold text-[#191919]">
                  {expense.title}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-[#9b9a97]">
                  <span>{formatDateIndo(expense.date)}</span>
                  {expense.notes && (
                    <>
                      <span>•</span>
                      <span className="italic">{expense.notes}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right sm:self-center">
              <span className="text-xs font-bold tabular-money text-[#d95700]">
                - {formatRupiah(expense.amount)}
              </span>
            </div>
          </div>
        ))}

        {expenses.length === 0 && (
          <div className="py-10 text-center text-xs text-[#9b9a97]">
            Belum ada catatan pengeluaran pada periode ini.
          </div>
        )}
      </div>
    </div>
  );
}
