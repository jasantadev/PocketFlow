export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-10">
      <section className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">PocketFlow</h1>
        <p className="mt-3 text-slate-600">
          Tu agenda virtual para controlar gastos e ingresos diarios.
        </p>
        <div className="mt-6 flex gap-3">
          <a
            href="/login"
            className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700"
          >
            Iniciar sesión
          </a>
          <a
            href="/signup"
            className="rounded-md border border-slate-300 px-4 py-2 font-medium text-slate-800 hover:bg-slate-100"
          >
            Crear cuenta
          </a>
        </div>
      </section>
    </main>
  );
}
