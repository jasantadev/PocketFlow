import { redirect } from "next/navigation";
import { logout } from "@/app/(auth)/actions";
import { computeBalanceFromRows } from "@/src/lib/finance/balance";
import type {
  CategoryRow,
  MovementRow,
  MovementType,
  MovementWithCategory,
} from "@/src/lib/finance/types";
import { isMovementType } from "@/src/lib/finance/validation";
import { createClient } from "@/src/lib/supabase/server";
import { ensureDefaultCategory } from "./actions";
import { BalanceCard } from "./balance-card";
import { CategorySection } from "./category-section";
import { MovementForm } from "./movement-form";
import { MovementList } from "./movement-list";

export const dynamic = "force-dynamic";

type DashboardPageProps = {
  searchParams: Promise<{
    editMovement?: string | undefined;
    movementError?: string | undefined;
    categoryError?: string | undefined;
  }>;
};

type MovementDbRow = MovementRow & {
  categories: { title: string } | null;
};

function mapMovement(row: MovementDbRow): MovementWithCategory {
  const { categories: cat, ...rest } = row;
  const type: MovementType = isMovementType(rest.type) ? rest.type : "expense";
  return {
    ...rest,
    type,
    category_title: cat?.title ?? "(Sin categoría)",
  };
}

function decodeParam(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const sp = await searchParams;
  const editId =
    typeof sp.editMovement === "string" ? sp.editMovement : undefined;
  const movementError = decodeParam(sp.movementError);
  const categoryError = decodeParam(sp.categoryError);

  let loadError: string | null = null;
  let categories: CategoryRow[] = [];
  let movements: MovementWithCategory[] = [];

  try {
    await ensureDefaultCategory();

    const { data: catRows, error: catErr } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", user.id)
      .order("title", { ascending: true });

    if (catErr) {
      throw new Error(catErr.message);
    }
    categories = (catRows ?? []) as CategoryRow[];

    const { data: movRows, error: movErr } = await supabase
      .from("movements")
      .select(
        `
        id,
        user_id,
        category_id,
        type,
        amount,
        occurred_on,
        description,
        created_at,
        categories ( title )
      `,
      )
      .eq("user_id", user.id)
      .order("occurred_on", { ascending: false });

    if (movErr) {
      throw new Error(movErr.message);
    }

    movements = (movRows ?? []).map((row) =>
      mapMovement(row as unknown as MovementDbRow),
    );
  } catch (e) {
    loadError =
      e instanceof Error
        ? e.message
        : "No se pudieron cargar los datos. ¿Has aplicado la migración SQL en Supabase?";
  }

  const balance = computeBalanceFromRows(
    movements.map((m) => ({ type: m.type, amount: m.amount })),
  );

  const editingMovement =
    editId && movements.length > 0
      ? movements.find((m) => m.id === editId) ?? null
      : null;

  const editingRow: MovementRow | null = editingMovement
    ? {
        id: editingMovement.id,
        user_id: editingMovement.user_id,
        category_id: editingMovement.category_id,
        type: editingMovement.type,
        amount: editingMovement.amount,
        occurred_on: editingMovement.occurred_on,
        description: editingMovement.description,
        created_at: editingMovement.created_at,
      }
    : null;

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Dashboard financiero
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Hola,{" "}
            <span className="font-medium text-slate-800">{user.email}</span>
          </p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Cerrar sesión
          </button>
        </form>
      </header>

      {loadError ? (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-medium">Error al cargar datos</p>
          <p className="mt-1">{loadError}</p>
          <p className="mt-2 text-xs text-amber-800">
            Ejecuta el SQL en{" "}
            <code className="rounded bg-amber-100 px-1">
              supabase/migrations/001_categories_movements.sql
            </code>{" "}
            desde el SQL Editor de tu proyecto Supabase.
          </p>
        </div>
      ) : null}

      <div className="flex flex-col gap-8">
        <BalanceCard balance={balance} />

        {!loadError ? (
          <>
            <MovementForm
              categories={categories}
              editing={editingRow}
              error={movementError}
            />
            <MovementList movements={movements} />
            <CategorySection
              categories={categories}
              error={categoryError}
            />
          </>
        ) : null}
      </div>
    </main>
  );
}
