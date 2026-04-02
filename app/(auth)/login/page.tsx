import { AuthForm } from "../auth-form";
import { login } from "../actions";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-10">
      <AuthForm
        title="Inicia sesión en PocketFlow"
        submitText="Entrar"
        footerText="¿No tienes cuenta?"
        footerHref="/signup"
        footerLinkText="Regístrate"
        action={login}
        error={params.error}
      />
    </main>
  );
}
