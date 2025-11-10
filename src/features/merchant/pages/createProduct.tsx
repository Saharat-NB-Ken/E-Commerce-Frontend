import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/fetch";
import AdminLayout from "../components/managementLayout";
import ImageUploader from "../components/imageUploader";
import { AdminModal } from "../components/adminModal";

interface Category {
  id: number;
  name: string;
}

export const CreateProductPage = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    categoryId: 0,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
    type: "success" as "success" | "error" | "confirm",
    onConfirm: undefined as (() => void) | undefined,
  });

  useEffect(() => {
    api.get("/categories", true).then((res: Category[]) => setCategories(res));
  }, []);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  /** ✅ แยก logic ส่งข้อมูลจริงออกมา */
  const submitProduct = async () => {
    setLoading(true);
    try {
      const imagesData = await Promise.all(
        images.map(async (file, index) => ({
          name: `image-${index}`,
          url: await fileToBase64(file),
        }))
      );

      const payload = { ...form, ownerId: 102, images: imagesData };
      await api.post("/admin-product-management/products", payload, true);

      setModal({
        open: true,
        title: "Product Created",
        message: "Your product has been created successfully!",
        type: "success",
        onConfirm: () => {
          setModal({ ...modal, open: false });
          navigate("/merchant-listing");
        },
      });
    } catch (err: any) {
      setModal({
        open: true,
        title: "Error",
        message: err.message || "Failed to create product",
        type: "error",
        onConfirm: () => setModal({ ...modal, open: false }),
      });
    } finally {
      setLoading(false);
    }
  };

  /** 🟨 ฟังก์ชันกด Save (เปิด confirm modal ก่อนจริง) */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || form.price <= 0 || form.stock < 0 || form.categoryId <= 0) {
      setModal({
        open: true,
        title: "Invalid Data",
        message: "Please fill all required fields before saving.",
        type: "error",
        onConfirm: () => setModal({ ...modal, open: false }),
      });
      return;
    }

    // เปิด modal confirm ก่อน submit
    setModal({
      open: true,
      title: "Confirm Product Creation",
      message: "Are you sure you want to create this product?",
      type: "confirm",
      onConfirm: () => {
        setModal({ ...modal, open: false });
        submitProduct();
      },
    });
  };

  return (
    <AdminLayout>
      <div className="bg-gray-50 min-h-screen p-6">
        <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow p-6 max-w-2xl mx-auto"
        >
          {/* Name */}
          <input
            type="text"
            className="w-full border px-3 py-2 rounded-lg mb-4"
            placeholder="Enter product name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          {/* Description */}
          <textarea
            className="w-full border px-3 py-2 rounded-lg mb-4"
            rows={4}
            placeholder="Enter description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="number"
              className="w-full border px-3 py-2 rounded-lg"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
              required
            />
            <input
              type="number"
              className="w-full border px-3 py-2 rounded-lg"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })}
              required
            />
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              className="flex-1 border p-2 rounded"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
              required
            >
              <option value={0}>-- Select Category --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <ImageUploader
            images={images}
            previewUrls={previewUrls}
            setImages={setImages}
            setPreviewUrls={setPreviewUrls}
            maxImages={8}
          />

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>

        {/* ✅ Modal */}
        <AdminModal
          open={modal.open}
          title={modal.title}
          message={modal.message}
          type={modal.type}
          onClose={() => setModal({ ...modal, open: false })}
          onConfirm={modal.onConfirm}
        />
      </div>
    </AdminLayout>
  );
};
