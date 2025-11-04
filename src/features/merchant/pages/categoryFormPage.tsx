import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Tag } from "lucide-react";
import { api } from "../../../api/fetch";
import AdminLayout from "../components/managementLayout";

interface Category {
  id?: number;
  name: string;
}

export const CategoryFormPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [form, setForm] = useState<Category>({ name: "" });
  const [loading, setLoading] = useState(false);

  // โหลดข้อมูลมาใส่ถ้าเป็น update
  useEffect(() => {
    if (id) {
      (async () => {
        try {
          setLoading(true);
          const res = await api.get(`/categories/${id}`);
          setForm(res as Category);
        } catch (err) {
          console.error(err);
          alert("Failed to load category");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id) {
        await api.patch(`/categories/${id}`, form);
        alert("Category updated successfully");
      } else {
        await api.post("/categories", form);
        alert("Category created successfully");
      }
      navigate("/category-listing");
    } catch (err) {
      console.error(err);
      alert("Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-green-800 mb-8 flex items-center gap-2">
            <Tag size={24} />
            {id ? "Update Category" : "Create Category"}
          </h1>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
                             focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/category-listing")}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 
                             disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {id ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
