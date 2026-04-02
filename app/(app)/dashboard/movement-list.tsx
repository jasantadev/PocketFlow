import Link from "next/link";
import { formatCurrencyEur } from "@/src/lib/finance/validation";
import type { MovementWithCategory } from "@/src/lib/finance/types";
import { deleteMovement } from "./actions";

type MovementListProps = {
  movements: MovementWithCategory[];
};

export function MovementList({ movements }: MovementListProps) {
  if (movements.length === 0) {
    return (
      <section className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-6 text-center text-sm text-slate-600">
        Aún no hay movimientos. Crea uno con el formulario de arriba.
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        Movimientos recientes
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="pb-2 font-medium">Fecha</th>
              <th className="pb-2 font-medium">Tipo</th>
              <th className="pb-2 font-medium">Categoría</th>
              <th className="pb-2 font-medium text-right">Importe</th>
              <th className="pb-2 font-medium">Nota</th>
              <th className="pb-2 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((m) => {
              const income = m.type === "income";
              return (
                <tr key={m.id} className="border-b border-slate-100">
                  <td className="py-2 tabular-nums text-slate-800">
                    {m.occurred_on}
                  </td>
                  <td className="py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        income
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-rose-50 text-rose-800"
                      }`}
                    >
                      {income ? "Ingreso" : "Gasto"}
                    </span>
                  </td>
                  <td className="py-2 text-slate-700">{m.category_title}</td>
                  <td
                    className={`py-2 text-right font-medium tabular-nums ${
                      income ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {income ? "+" : "−"}
                    {formatCurrencyEur(Number.parseFloat(m.amount))}
                  </td>
                  <td className="max-w-[12rem] truncate py-2 text-slate-600">
                    {m.description ?? "—"}
                  </td>
                  <td className="py-2 text-right">
                    <Link
                      href={`/dashboard?editMovement=${m.id}`}
                      className="mr-3 text-sm font-medium text-slate-700 underline hover:text-slate-900"
                    >
                      Editar
                    </Link>
                    <form action={deleteMovement} className="inline">
                      <input type="hidden" name="id" value={m.id} />
                      <button
                        type="submit"
                        className="text-sm font-medium text-rose-700 hover:text-rose-900"
                      >
                        Borrar
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
