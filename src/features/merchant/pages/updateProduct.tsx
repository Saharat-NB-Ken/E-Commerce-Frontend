import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../api/fetch";
import AdminLayout from "../components/managementLayout";
import ImageUploader from "../components/imageUploader";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  images: { id: number; url: string; name: string }[];
}

export const UpdateProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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
  const [existingImages, setExistingImages] = useState<Product["images"]>([]); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // โหลด categories
    api.get("/categories", true).then((res: Category[]) => setCategories(res));

    // โหลดข้อมูลสินค้าเดิม
    api.get(`/admin-product-management/products/${id}`, true).then((product: Product) => {
      setForm({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId,
      });
      console.log("Form data:", form);
      
      setExistingImages(product.images); // เก็บข้อมูลรูปเก่า
      setPreviewUrls(product.images.map(img => img.url)); // แสดง preview ของรูปเก่า
    });
  }, [id]);

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

      // แปลง images ใหม่เป็น base64
      const newImages = await Promise.all(
        images.map(async (file, index) => ({
          name: `image-${index}`,
          url: await fileToBase64(file),
        }))
      );

      // หารูปเก่าที่ถูกลบ
      const removedImageIds = existingImages
        .filter(img => !previewUrls.includes(img.url))
        .map(img => img.id);

      const payload = {
        ...form,
        addImages: newImages,     
        removeImageIds: removedImageIds,
      };

      await api.patch(`/admin-product-management/products/${id}`, payload, true);

      alert("Product updated successfully!");
      navigate("/merchant-listing");
    } catch (err: any) {
      alert(err.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-gray-50 min-h-screen p-6">
        <h2 className="text-2xl font-bold mb-6">Update Product</h2>

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
