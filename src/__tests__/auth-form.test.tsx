import { render, screen } from "@testing-library/react";
import { AuthForm } from "@/app/(auth)/auth-form";

describe("AuthForm", () => {
  it("renders required fields and submit button", () => {
    render(
      <AuthForm
        title="Inicia sesión"
        submitText="Entrar"
        footerText="No tienes cuenta?"
        footerHref="/signup"
        footerLinkText="Regístrate"
        action={async () => {}}
      />,
    );

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
  });
});
