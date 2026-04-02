import type { MovementType } from "./types";

/**
 * Balance = sum(incomes) - sum(expenses). Amounts must be positive numbers.
 */
export function computeBalanceFromMovements(
  items: ReadonlyArray<{ type: MovementType; amount: number }>,
): number {
  let sum = 0;
  for (const m of items) {
    if (m.amount <= 0 || !Number.isFinite(m.amount)) {
      continue;
    }
    sum += m.type === "income" ? m.amount : -m.amount;
  }
  return Math.round(sum * 100) / 100;
}

/** Parse Postgres numeric string to number (2 decimal places expected). */
export function parseAmountString(amount: string): number {
  const n = Number.parseFloat(amount);
  if (!Number.isFinite(n)) {
    return Number.NaN;
  }
  return Math.round(n * 100) / 100;
}

export function computeBalanceFromRows(
  items: ReadonlyArray<{ type: MovementType; amount: string }>,
): number {
  const normalized: { type: MovementType; amount: number }[] = [];
  for (const m of items) {
    const a = parseAmountString(m.amount);
    if (Number.isNaN(a) || a <= 0) {
      continue;
    }
    normalized.push({ type: m.type, amount: a });
  }
  return computeBalanceFromMovements(normalized);
}
