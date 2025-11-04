import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/fetch";
import AdminLayout from "../components/managementLayout";
import ImageUploader from "../components/imageUploader";

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

  // Load categories
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

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    if (!form.name || form.price <= 0 || form.stock < 0 || form.categoryId <= 0) {
      alert("Please fill all required fields");
      setLoading(false);
      return;
    }

    // แปลงไฟล์เป็น base64 แล้วใส่ name
    const imagesData = await Promise.all(
      images.map(async (file, index) => ({
        name: `image-${index}`,
        url: await fileToBase64(file),
      }))
    );

    const payload = {
      ...form,
      ownerId: 102,
      images: imagesData,
    };

    await api.post("/admin-product-management/products", payload, true);

    alert("Product created successfully!");
    navigate("/merchant-listing");
  } catch (err: any) {
    alert(err.message || "Failed to create product");
  } finally {
    setLoading(false);
  }
};



  return (
    <AdminLayout>
      <div className="bg-gray-50 min-h-screen p-6">
        <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow p-6 max-w-2xl mx-auto"
        >
          {/* Product Name */}
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

          {/* ImageUploader */}
          <ImageUploader
            images={images}
            previewUrls={previewUrls}
            setImages={setImages}
            setPreviewUrls={setPreviewUrls}
            maxImages={8}
          />

          {/* Actions */}
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
      </div>
    </AdminLayout>
  );
}
