import { formatCurrencyEur } from "@/src/lib/finance/validation";

type BalanceCardProps = {
  balance: number;
};

export function BalanceCard({ balance }: BalanceCardProps) {
  const positive = balance >= 0;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-medium uppercase tracking-wide text-slate-500">
        Balance total
      </h2>
      <p
        className={`mt-2 text-3xl font-semibold tabular-nums ${
          positive ? "text-emerald-700" : "text-rose-700"
        }`}
      >
        {formatCurrencyEur(balance)}
      </p>
      <p className="mt-2 text-sm text-slate-600">
        Suma de ingresos menos gastos (derivado de tus movimientos).
      </p>
    </section>
  );
}
