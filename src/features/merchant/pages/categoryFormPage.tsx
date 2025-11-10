import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Tag } from "lucide-react";
import { api } from "../../../api/fetch";
import AdminLayout from "../components/managementLayout";
import { AdminModal } from "../components/adminModal";

interface Category {
  id?: number;
  name: string;
}

export function CategoryFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<Category>({ name: "" });
  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
    type: "success" as "success" | "error" | "confirm",
    onConfirm: () => {},
  });

  function openModal(
    title: string,
    message: string,
    type: "success" | "error" | "confirm" = "success",
    onConfirm?: () => void
  ) {
    setModal({
      open: true,
      title,
      message,
      type,
      onConfirm: onConfirm || (() => setModal((m) => ({ ...m, open: false }))),
    });
  }

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          setLoading(true);
          const res = await api.get(`/categories/${id}`);
          setForm(res as Category);
        } catch (err) {
          console.error(err);
          openModal("Error", "Failed to load category", "error");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      if (id) {
        await api.patch(`/categories/${id}`, { name: form.name });
        openModal("Success", "Category updated successfully", "success", () =>
          navigate("/category-listing")
        );
      } else {
        await api.post("/categories", form);
        openModal("Success", "Category created successfully", "success", () =>
          navigate("/category-listing")
        );
      }
    } catch (err) {
      console.error(err);
      openModal("Error", "Failed to save category", "error");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

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

      <AdminModal
        open={modal.open}
        title={modal.title}
        message={modal.message}
        type={modal.type as any}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
        onConfirm={modal.onConfirm}
      />
    </AdminLayout>
  );
}
