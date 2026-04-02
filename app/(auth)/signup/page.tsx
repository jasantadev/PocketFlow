import { AuthForm } from "../auth-form";
import { signup } from "../actions";

type SignupPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-10">
      <AuthForm
        title="Crea tu cuenta en PocketFlow"
        submitText="Crear cuenta"
        footerText="¿Ya tienes cuenta?"
        footerHref="/login"
        footerLinkText="Inicia sesión"
        action={signup}
        error={params.error}
      />
    </main>
  );
}
