import { describe, expect, it } from "vitest";
import {
  computeBalanceFromMovements,
  computeBalanceFromRows,
  parseAmountString,
} from "@/src/lib/finance/balance";

describe("computeBalanceFromMovements", () => {
  it("sums income and subtracts expense", () => {
    expect(
      computeBalanceFromMovements([
        { type: "income", amount: 100 },
        { type: "expense", amount: 30 },
        { type: "income", amount: 5.5 },
      ]),
    ).toBe(75.5);
  });

  it("returns 0 for empty list", () => {
    expect(computeBalanceFromMovements([])).toBe(0);
  });

  it("ignores non-positive amounts", () => {
    expect(
      computeBalanceFromMovements([
        { type: "income", amount: 0 },
        { type: "expense", amount: -1 },
        { type: "income", amount: 10 },
      ]),
    ).toBe(10);
  });
});

describe("computeBalanceFromRows", () => {
  it("parses string amounts from DB", () => {
    expect(
      computeBalanceFromRows([
        { type: "income", amount: "100.00" },
        { type: "expense", amount: "25.50" },
      ]),
    ).toBe(74.5);
  });
});

describe("parseAmountString", () => {
  it("parses postgres numeric strings", () => {
    expect(parseAmountString("12.34")).toBe(12.34);
  });
});
