import { useEffect, useState } from "react";
import { Package, Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/fetch";
import AdminLayout from "../components/managementLayout";

interface Category {
  id: number;
  name: string;
}

export const CategoryListPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<{ page: number; totalPages: number; total: number; limit: number } | null>(null);

  const navigate = useNavigate();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      

      const res = await api.get(`/categories`);
      console.log("res",res);
      
      setCategories(res as Category[]);
    } catch (err) {
      console.error(err);
      alert("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      alert("Category deleted successfully");
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Failed to delete category");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page]);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-green-800 flex items-center gap-2">
              <Package size={24} />
              Categories
            </h1>
            <button
              onClick={() => navigate("/create-category")}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus size={16} /> Create Category
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin h-8 w-8 text-green-800 mr-2" />
                <span className="text-gray-600">Loading categories...</span>
              </div>
            ) : (
              <>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{cat.id}</td>
                        <td className="px-6 py-4">{cat.name}</td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => navigate(`/category-update/${cat.id}`)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Page {meta?.page ?? 1} of {meta?.totalPages ?? 1} — Total {meta?.total ?? 0} categories
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(meta?.totalPages ?? 1, p + 1))}
                      disabled={page === meta?.totalPages}
                      className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
