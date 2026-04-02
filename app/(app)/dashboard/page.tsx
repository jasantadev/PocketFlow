import { redirect } from "next/navigation";
import { logout } from "@/app/(auth)/actions";
import { createClient } from "@/src/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">
          Dashboard financiero
        </h1>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Cerrar sesión
          </button>
        </form>
      </header>
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-slate-700">
          Bienvenido, <span className="font-semibold">{user.email}</span>.
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Esta base ya está lista para agregar CRUD de movimientos y categorías
          por usuario con aislamiento por owner.
        </p>
      </section>
    </main>
  );
}
