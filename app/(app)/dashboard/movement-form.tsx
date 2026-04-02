import Link from "next/link";
import type { CategoryRow, MovementRow } from "@/src/lib/finance/types";
import { saveMovement } from "./actions";

type MovementFormProps = {
  categories: CategoryRow[];
  editing: MovementRow | null;
  error?: string | undefined;
};

export function MovementForm({
  categories,
  editing,
  error,
}: MovementFormProps) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-900">
          {editing ? "Editar movimiento" : "Nuevo movimiento"}
        </h2>
        {editing ? (
          <Link
            href="/dashboard"
            className="text-sm font-medium text-slate-600 underline hover:text-slate-900"
          >
            Cancelar edición
          </Link>
        ) : null}
      </div>
      <form action={saveMovement} className="space-y-4">
        {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="m-type"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Tipo
            </label>
            <select
              id="m-type"
              name="type"
              required
              defaultValue={editing?.type ?? "expense"}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-slate-300 focus:ring-2"
            >
              <option value="income">Ingreso</option>
              <option value="expense">Gasto</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="m-amount"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Importe (€)
            </label>
            <input
              id="m-amount"
              name="amount"
              type="text"
              inputMode="decimal"
              required
              placeholder="0,00"
              defaultValue={
                editing ? String(editing.amount).replace(".", ",") : ""
              }
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-slate-300 focus:ring-2"
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="m-date"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Fecha
            </label>
            <input
              id="m-date"
              name="occurred_on"
              type="date"
              required
              defaultValue={editing?.occurred_on?.slice(0, 10) ?? today}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-slate-300 focus:ring-2"
            />
          </div>
          <div>
            <label
              htmlFor="m-cat"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Categoría
            </label>
            <select
              id="m-cat"
              name="category_id"
              required
              defaultValue={editing?.category_id ?? categories[0]?.id}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-slate-300 focus:ring-2"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label
            htmlFor="m-desc"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Descripción (opcional)
          </label>
          <input
            id="m-desc"
            name="description"
            type="text"
            maxLength={500}
            defaultValue={editing?.description ?? ""}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-slate-300 focus:ring-2"
          />
        </div>
        {error ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700"
        >
          {editing ? "Guardar cambios" : "Añadir movimiento"}
        </button>
      </form>
    </section>
  );
}
