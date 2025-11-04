import { useEffect, useState } from "react";
import { api } from "../../../api/fetch";
import AdminLayout from "../components/managementLayout";
import type { Product, Meta, Category, ProductResponse } from "../../../types/product.types";
import { FilterSection } from "../../../components/filterSection";



export const StockManagementPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const limit = 10;

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | number>("");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [adjustStock, setAdjustStock] = useState<Record<number, number>>({});
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 100);
        return () => clearTimeout(handler);
    }, [search]);

    // โหลด Categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data: Category[] = await api.get("/categories", true);
                setCategories(data);
            } catch (err: any) {
                console.error("Failed to load categories:", err.message);
            }
        };

        fetchCategories();
    }, []);

    // โหลด Products
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const queryObj: any = {
                page: page.toString(),
                limit: limit.toString()
            };
            if (selectedCategory) queryObj.category = selectedCategory;
            if (debouncedSearch.trim() !== "") queryObj.search = debouncedSearch.trim();

            const query = new URLSearchParams(queryObj).toString();
            const data: ProductResponse = await api.get(`/products?${query}`, true);
            setProducts(data.data);
            setMeta(data.meta);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    // โหลดใหม่เมื่อเปลี่ยน page / category / search
    useEffect(() => {
        fetchProducts();
    }, [page, selectedCategory, search, debouncedSearch]);

    // อัพเดต stock
    const handleUpdateStock = async (productId: number, newStock: number) => {
        if (newStock < 0) return alert("Stock cannot be negative");
        try {
            await api.patch(
                `/admin-product-management/products/${productId}`,
                { stock: newStock },
                true
            );
            setProducts((prev) =>
                prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
            );
            setAdjustStock((prev) => ({ ...prev, [productId]: 0 }));
        } catch (err: any) {
            alert(`Failed to update stock: ${err.message}`);
        }
    };

    return (
        <AdminLayout>
            <div className="bg-gray-50 min-h-screen p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Stock Management</h2>

                {/* FilterSection ใช้เฉพาะ Category + Search */}
                <FilterSection
                    showCategory={true}
                    showSearch={true}
                    showPriceFilter={false}
                    showSorting={false}
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    search={search}
                    onSearchChange={setSearch}
                />

                <div className="bg-white rounded-xl shadow overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="p-4">Image</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Current Stock</th>
                                <th className="p-4 text-right">Adjust Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-6 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : products.length > 0 ? (
                                products.map((product) => (
                                    <tr key={product.id} className="border-t hover:bg-gray-50">
                                        <td className="p-4">
                                            <img
                                                src={
                                                    product.images?.find((img) => img.isMain)?.url ||
                                                    product.images?.[0]?.url ||
                                                    "https://via.placeholder.com/50"
                                                }
                                                alt={product.name}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                        </td>
                                        <td className="p-4 font-medium text-gray-800">{product.name}</td>
                                        <td className="p-4">{product.stock}</td>
                                        <td className="p-4 text-right flex gap-2 justify-end items-center">
                                            <input
                                                type="number"
                                                min={0}
                                                value={adjustStock[product.id] ?? 0}
                                                onChange={(e) =>
                                                    setAdjustStock((prev) => ({
                                                        ...prev,
                                                        [product.id]: Number(e.target.value),
                                                    }))
                                                }
                                                className="w-20 p-1 border rounded text-right"
                                            />
                                            <button
                                                onClick={() =>
                                                    handleUpdateStock(product.id, adjustStock[product.id] ?? 0)
                                                }
                                                className="text-blue-600 hover:text-blue-800 font-semibold text-sm px-2 py-1 border rounded"
                                            >
                                                Update
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-6 text-center text-gray-500">
                                        No products found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {meta && (
                    <div className="flex justify-between items-center mt-6">
                        <p className="text-sm text-gray-600">
                            Page {meta.page} of {meta.totalPages} ({meta.total} products)
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >
                                ← Prev
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                                disabled={page === meta.totalPages}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};
