import { describe, expect, it } from "vitest";
import {
  isMovementType,
  parseAmountInput,
} from "@/src/lib/finance/validation";

describe("isMovementType", () => {
  it("accepts income and expense", () => {
    expect(isMovementType("income")).toBe(true);
    expect(isMovementType("expense")).toBe(true);
    expect(isMovementType("other")).toBe(false);
  });
});

describe("parseAmountInput", () => {
  it("parses decimal comma and dot", () => {
    expect(parseAmountInput("10,5")).toBe(10.5);
    expect(parseAmountInput("10.5")).toBe(10.5);
  });

  it("returns null for invalid or non-positive", () => {
    expect(parseAmountInput("")).toBeNull();
    expect(parseAmountInput("0")).toBeNull();
    expect(parseAmountInput("-1")).toBeNull();
    expect(parseAmountInput("abc")).toBeNull();
  });
});
