import type { MovementType } from "./types";

const MOVEMENT_TYPES = new Set<MovementType>(["income", "expense"]);

export function isMovementType(value: string): value is MovementType {
  return MOVEMENT_TYPES.has(value as MovementType);
}

/** Accepts "12.34" or "12,34" (common ES input). */
export function parseAmountInput(raw: string): number | null {
  const trimmed = raw.trim().replace(",", ".");
  if (trimmed === "") {
    return null;
  }
  const n = Number.parseFloat(trimmed);
  if (!Number.isFinite(n)) {
    return null;
  }
  if (n <= 0) {
    return null;
  }
  return Math.round(n * 100) / 100;
}

export function formatCurrencyEur(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}
