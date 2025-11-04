import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/fetch";
import type { Category, Meta, Product, ProductResponse } from "../../../types/product.types";
import AdminLayout from "../components/managementLayout";
import { FilterSection } from "../../../components/filterSection";

export const MerchantListPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // 🆕 Filter states
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | number>("");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc");
  const [priceRange, setPriceRange] = useState<{ min: number | ""; max: number | "" }>({ min: "", max: "" });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 100);
    return () => clearTimeout(handler);
  }, [search]);

  // โหลด Products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryObj: any = {
        page: page.toString(),
        limit: limit.toString(),
        orderBy,
        orderDirection,
      };
      if (selectedCategory) queryObj.category = selectedCategory;
      if (priceRange.min !== "") queryObj.minPrice = priceRange.min.toString();
      if (priceRange.max !== "") queryObj.maxPrice = priceRange.max.toString();
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

  // โหลด Categories
  const fetchCategories = async () => {
    try {
      const data: Category[] = await api.get("/categories", true);
      console.log("data cate", data);

      setCategories(data);
    } catch (err: any) {
      console.error("Failed to fetch categories:", err.message);
    }
  };
  // 🆕 ฟังก์ชันลบสินค้า
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.delete(`/admin-product-management/products/${id}`, true);
      alert(`Deleted "${name}" successfully`);
      fetchProducts(); // refresh list
    } catch (err: any) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchProducts();
    }, [page, orderBy, orderDirection, selectedCategory, debouncedSearch]);

  useEffect(() => {
    fetchCategories();
  }, []);

  
  return (
    <AdminLayout>
      <div className="bg-gray-50 min-h-screen p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manage Products</h2>
          <button
            onClick={() => navigate("/create-product")}
            className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg shadow"
          >
            + Add Product
          </button>
        </div>

        {/* 🆕 Filter Section */}
        <FilterSection
          orderBy={orderBy}
          orderDirection={orderDirection}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={(val) => { setSelectedCategory(val); setPage(1); }}
          onOrderByChange={setOrderBy}
          onOrderDirectionChange={setOrderDirection}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          onApplyPriceFilter={() => { setPage(1); fetchProducts(); }}
          search={search}
          onSearchChange={setSearch}
        />

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">
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
                    <td className="p-4 text-gray-600">{product.category?.name ?? "-"}</td>
                    <td className="p-4 text-green-700 font-semibold">฿{product.price.toLocaleString()}</td>
                    <td className="p-4">{product.stock}</td>
                    <td className="p-4">
                      {product.stock > 0 ? (
                        <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">Active</span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-600">Out of Stock</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => navigate(`/update-product/${product.id}`)}
                        className="text-green-600 hover:underline mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">
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
