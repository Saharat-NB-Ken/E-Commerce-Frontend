import { useEffect, useState } from "react";
import { Package, DollarSign, Filter, Loader2, BarChart3 } from 'lucide-react';
import { api } from "../../../api/fetch";
import Card from "../components/card";
import CategorySalesChart from "../components/categorySalesChart";
import AdminLayout from "../components/managementLayout";
import type { Order, RevenuePoint } from "../../../types/product.types";
import { groupRevenue } from "../services/groupRevenue";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

type CategorySale = {
    category: string;
    sales: number;
    quantity: number;
    salesPercentage: number;
    quantityPercentage: number;
};

export const MerchantDashboardPage = () => {
    const [meta, setMeta] = useState<{ page: number; totalPages: number; total: number; limit: number } | null>(null);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [totalQuantity, setTotalQuantity] = useState<number>(0);

    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    const [revenue, setRevenue] = useState<number>(0);
    // const [revenue, setRevenue] = useState<number>(0);
    const [chartData, setChartData] = useState<RevenuePoint[]>([]);
    const [period, setPeriod] = useState<"day" | "month" | "year">("month");
    const [periodChart, setPeriodChart] = useState<"day" | "week" | "month">("month");
    const [categorySales, setCategorySales] = useState<CategorySale[]>([]);
    const [salesMode, setSalesMode] = useState<"revenue" | "quantity" | "sales">("revenue");
    const [loadingCategory, setLoadingCategory] = useState(false);

    // ------------------ fetch orders ------------------
    const fetchOrders = async (p: "day" | "month" | "year" = period) => {
        setLoadingOrders(true);
        try {
            const q = new URLSearchParams({
                page: String(page),
                limit: String(limit),
                period: p,
            });
            const res = await api.get(`/admin-order-management?${q.toString()}`);
            console.log("data cate", res);

            setMeta(res.meta);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingOrders(false);
        }
    };

    // ------------------ fetch revenue ------------------
    const fetchRevenueOfChart = async (p: "day" | "week" | "month" = "month") => {
        try {
            const res = await api.get(`/admin-dashboard/revenue?period=${p}`);

            const { summary, breakdown } = res.revenue;

            const grouped = groupRevenue(breakdown, p);
            console.log("grouped", grouped[0]);

            setChartData(grouped);

            setTotalQuantity(summary.totalQuantity);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchRevenue = async (p: "day" | "month" | "year" = period) => {
        try {
            const res = await api.get(`/admin-dashboard/category-sales?period=${p}`);
            console.log("res data", res.data);

            const totalRevenue = res.data.reduce((sum: number, item: any) => sum + item.sales, 0)
            setRevenue(totalRevenue);

        } catch (error) {

        }
    }

    // ------------------ fetch category sales ------------------
    const fetchCategorySales = async (p: "day" | "month" | "year" = period) => {
        setLoadingCategory(true);
        try {
            const res = await api.get(`/admin-dashboard/category-sales?period=${p}`);
            setCategorySales(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingCategory(false);
        }
    };

    useEffect(() => { fetchOrders(period); }, [page, period]);
    useEffect(() => { fetchRevenueOfChart(periodChart); }, [periodChart]);
    useEffect(() => { fetchRevenue(period); }, [period]);
    useEffect(() => { fetchCategorySales(period); }, [period]);

    // ------------------ render ------------------
    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Breadcrumb */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>

                        {/* period buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPeriod("day")}
                                className={`px-3 py-1 rounded-lg border ${period === "day"
                                    ? "bg-green-700 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                Day
                            </button>
                            <button
                                onClick={() => setPeriod("month")}
                                className={`px-3 py-1 rounded-lg border ${period === "month"
                                    ? "bg-green-700 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                Month
                            </button>
                            <button
                                onClick={() => setPeriod("year")}
                                className={`px-3 py-1 rounded-lg border ${period === "year"
                                    ? "bg-green-700 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                Year
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card title="Total Orders" value={meta?.total ?? 0} icon={<Package size={20} />} subtitle="This period" />
                        <Card title="Revenue" value={`${Number(revenue || 0).toFixed(2)}`} icon={<DollarSign size={20} />} subtitle={`${period}ly total`} />
                        <Card
                            title="Product Sold"
                            value={categorySales.reduce((sum, c) => sum + c.quantity, 0)}
                            icon={<Filter size={20} />}
                            subtitle="Total sold items"
                        />
                    </div>

                    {/* ----------------- Right Panel ----------------- */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Revenue Chart */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                    <BarChart3 size={20} /> Revenue Analytics
                                </h3>

                                {/* period buttons */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setPeriodChart("day")}
                                        className={`px-3 py-1 rounded-lg border text-sm ${periodChart === "day"
                                            ? "bg-green-600 text-white border-green-600"
                                            : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                                            }`}
                                    >
                                        Day
                                    </button>
                                    <button
                                        onClick={() => setPeriodChart("week")}
                                        className={`px-3 py-1 rounded-lg border text-sm ${periodChart === "week"
                                            ? "bg-green-600 text-white border-green-600"
                                            : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                                            }`}
                                    >
                                        Week
                                    </button>
                                    <button
                                        onClick={() => setPeriodChart("month")}
                                        className={`px-3 py-1 rounded-lg border text-sm ${periodChart === "month"
                                            ? "bg-green-600 text-white border-green-600"
                                            : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                                            }`}
                                    >
                                        Month
                                    </button>
                                </div>
                            </div>

                            {chartData.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    No revenue data available for this period.
                                </div>
                            ) : (
                                <div className="border rounded-lg p-4 shadow-sm overflow-auto">
                                    <LineChart width={1000} height={400} data={chartData}>
                                        <CartesianGrid stroke="#ddd" />
                                        <XAxis dataKey="period" /> {/* ใช้ period เป็น label แกน X */}
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"  // ใช้ revenue เป็นค่าที่ plot
                                            stroke="#4F46E5"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </LineChart>
                                </div>
                            )}

                            {/* Category Sales Pie Chart */}
                            <div className="bg-white rounded-xl p-6 shadow-sm mt-8">
                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                                    <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                        <BarChart3 size={20} /> Analytics Sales
                                    </h3>
                                </div>

                                <div className="flex gap-2 mb-4">
                                    {(["revenue", "quantity"] as const).map((mode) => (
                                        <button
                                            key={mode}
                                            onClick={() => setSalesMode(mode)}
                                            className={`px-3 py-1 rounded-lg border text-sm ${salesMode === mode
                                                ? "bg-green-600 text-white border-green-600"
                                                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                                                }`}
                                        >
                                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                        </button>
                                    ))}
                                </div>

                                {loadingCategory ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="animate-spin h-8 w-8 text-green-800 mr-2" />
                                        <span className="text-gray-600">Loading category sales...</span>
                                    </div>
                                ) : categorySales.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">No data available for this period.</div>
                                ) : (
                                    <CategorySalesChart
                                        data={categorySales.map((sale) => ({
                                            ...sale,
                                            percentage:
                                                (sale.sales / categorySales.reduce((sum, s) => sum + s.sales, 0)) * 100,
                                        }))}
                                        mode={salesMode === "sales" ? "revenue" : salesMode}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};