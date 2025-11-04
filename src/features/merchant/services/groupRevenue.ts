// groupRevenue.ts
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

export type RevenuePoint = {
  period: string;
  revenue: number;
};

export function groupRevenue(
  orders: { period: string; revenue: number; quantity: number }[],
  mode: "day" | "week" | "month"
): RevenuePoint[] {
  const grouped: Record<string, number> = {};

  orders.forEach((o) => {
    let key: string;

    if (mode === "day") {
      key = dayjs(o.period).format("YYYY-MM-DD");
    } else if (mode === "week") {
      // period จาก backend จะเป็น "2025-41" อยู่แล้ว → ใช้ตรง ๆ ได้เลย
      key = o.period;
    } else {
      // month → backend ส่งมาเป็น "2025-10"
      key = o.period;
    }

    grouped[key] = (grouped[key] || 0) + o.revenue;
  });

  return Object.entries(grouped).map(([period, revenue]) => ({ period, revenue }));
}
