import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, type PieLabelRenderProps } from "recharts";

type CategorySales = {
    category: string;
    sales: number; // ราคาจริง
    percentage: number; // สำหรับ label pie %
    quantity?: number;
    quantityPercentage?: number;
};

export default function CategorySalesChart({
    data,
    mode,
}: {
    data: CategorySales[];
    mode: "revenue" | "quantity";
}) {
    const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#f87171", "#a78bfa", "#34d399"];

    const chartData: { name: string; value: number; sales: number }[] =
        mode === "revenue"
            ? data.map((d) => ({ name: d.category, value: d.percentage, sales: d.sales }))
            : data.map((d) => ({
                name: d.category,
                value: d.quantityPercentage || 0,
                sales: d.quantity || 0,
            }));

    return (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }: PieLabelRenderProps) => `${name} (${(value as number).toFixed(1)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {chartData.map((_, i) => (
                        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    formatter={(value, name, props) => {
                        const { payload } = props;
                        if (mode === "revenue") {
                            return [`$${payload.sales.toFixed(2)}`, "Revenue"];
                        } else {
                            return [payload.sales, "Quantity"]; 
                        }
                    }}
                />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}
