import { getAvailablePeriods, getDashboardData } from "@/lib/data";

describe("Data Access Layer Utilities", () => {
  it("should export functions getAvailablePeriods and getDashboardData", () => {
    expect(typeof getAvailablePeriods).toBe("function");
    expect(typeof getDashboardData).toBe("function");
  });

  it("should return empty summary structure if database is not connected or empty", async () => {
    const data = await getDashboardData();
    expect(data).toHaveProperty("totalBalance");
    expect(data).toHaveProperty("blocks");
    expect(data).toHaveProperty("expenses");
    expect(Array.isArray(data.blocks)).toBe(true);
    expect(Array.isArray(data.expenses)).toBe(true);
  });
});
