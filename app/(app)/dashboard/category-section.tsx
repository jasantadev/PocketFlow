import type { CategoryRow } from "@/src/lib/finance/types";
import { formatCurrencyEur } from "@/src/lib/finance/validation";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "./actions";

type CategorySectionProps = {
  categories: CategoryRow[];
  error?: string | undefined;
};

export function CategorySection({ categories, error }: CategorySectionProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        Categorías
      </h2>
      <p className="mb-4 text-sm text-slate-600">
        Crea y edita categorías para clasificar movimientos. No podrás borrar una
        categoría si tiene movimientos asociados.
      </p>

      <form action={createCategory} className="mb-8 space-y-3 rounded-lg border border-slate-100 bg-slate-50/80 p-4">
        <h3 className="text-sm font-semibold text-slate-800">Nueva categoría</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <label htmlFor="new-cat-title" className="sr-only">
              Título
            </label>
            <input
              id="new-cat-title"
              name="title"
              required
              placeholder="Nombre"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
          <div className="sm:col-span-1">
            <label htmlFor="new-cat-desc" className="sr-only">
              Descripción
            </label>
            <input
              id="new-cat-desc"
              name="description"
              placeholder="Descripción (opcional)"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
          <div className="sm:col-span-1">
            <label htmlFor="new-cat-budget" className="sr-only">
              Presupuesto mensual
            </label>
            <input
              id="new-cat-budget"
              name="monthly_budget"
              placeholder="Presupuesto € (opcional)"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
        </div>
        <button
          type="submit"
          className="rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Añadir categoría
        </button>
      </form>

      {error ? (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <ul className="space-y-4">
        {categories.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-slate-100 p-4 shadow-sm"
          >
            <form action={updateCategory} className="space-y-3">
              <input type="hidden" name="id" value={c.id} />
              <div className="grid gap-3 sm:grid-cols-12 sm:items-end">
                <div className="sm:col-span-4">
                  <label
                    htmlFor={`title-${c.id}`}
                    className="mb-1 block text-xs font-medium text-slate-500"
                  >
                    Título
                  </label>
                  <input
                    id={`title-${c.id}`}
                    name="title"
                    required
                    defaultValue={c.title}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label
                    htmlFor={`desc-${c.id}`}
                    className="mb-1 block text-xs font-medium text-slate-500"
                  >
                    Descripción
                  </label>
                  <input
                    id={`desc-${c.id}`}
                    name="description"
                    defaultValue={c.description ?? ""}
                    placeholder="Opcional"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor={`budget-${c.id}`}
                    className="mb-1 block text-xs font-medium text-slate-500"
                  >
                    Presupuesto / mes
                  </label>
                  <input
                    id={`budget-${c.id}`}
                    name="monthly_budget"
                    defaultValue={
                      c.monthly_budget != null
                        ? String(c.monthly_budget).replace(".", ",")
                        : ""
                    }
                    placeholder="Opcional"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>
                <div className="flex gap-2 sm:col-span-1 sm:justify-end">
                  <button
                    type="submit"
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </form>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
              <span className="text-xs text-slate-500">
                {c.monthly_budget != null
                  ? `Presupuesto: ${formatCurrencyEur(Number.parseFloat(c.monthly_budget))}`
                  : "Sin presupuesto definido"}
              </span>
              <form action={deleteCategory}>
                <input type="hidden" name="id" value={c.id} />
                <button
                  type="submit"
                  className="text-sm font-medium text-rose-700 hover:text-rose-900"
                >
                  Eliminar
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
