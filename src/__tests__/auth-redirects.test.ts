import { resolveAuthRedirect } from "@/src/lib/supabase/middleware";

describe("auth redirects", () => {
  it("redirects protected routes to login when user is missing", () => {
    expect(resolveAuthRedirect("/dashboard", false)).toBe("/login");
  });

  it("redirects auth routes to dashboard when user exists", () => {
    expect(resolveAuthRedirect("/login", true)).toBe("/dashboard");
    expect(resolveAuthRedirect("/signup", true)).toBe("/dashboard");
  });

  it("does not redirect public routes", () => {
    expect(resolveAuthRedirect("/", false)).toBeNull();
    expect(resolveAuthRedirect("/", true)).toBeNull();
  });
});
