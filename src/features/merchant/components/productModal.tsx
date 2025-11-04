import { useState } from "react";
import type { Category, Product } from "../../../types/product.types";
import ImageUploader from "./imageUploader";

type Props = {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onOpenCategoryModal: () => void;
};

export const ProductModal = ({
  product,
  categories,
  onClose,
  onOpenCategoryModal,
}: Props) => {
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    stock: product?.stock || 0,
    categoryId: product?.categoryId || categories[0]?.id || 0,
  });

  // ImageUploader state
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Submit form
  const handleSubmit = async () => {
    const method = product ? "PATCH" : "POST";
    const url = product
      ? `/api/admin-product-management/products/${product.id}`
      : "/api/admin-product-management/products";

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", String(form.price));
    formData.append("stock", String(form.stock));
    formData.append("categoryId", String(form.categoryId));
    images.forEach((img) => formData.append("images", img));

    await fetch(url, {
      method,
      headers: {
        Authorization: "Bearer token",
      },
      body: formData,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto shadow-lg">
        <h2 className="text-lg font-semibold mb-4">
          {product ? "Edit Product" : "Add Product"}
        </h2>

        {/* Product Form */}
        <input
          className="w-full border mb-2 p-2 rounded"
          placeholder="Product Name asdadwadczvesdada"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <textarea
          className="w-full border mb-2 p-2 rounded"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="Price"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: parseFloat(e.target.value) })
            }
          />
          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) =>
              setForm({ ...form, stock: parseInt(e.target.value) })
            }
          />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <select
            className="flex-1 border p-2 rounded"
            value={form.categoryId}
            onChange={(e) =>
              setForm({ ...form, categoryId: parseInt(e.target.value) })
            }
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            className="bg-gray-200 px-3 py-1 rounded"
            onClick={onOpenCategoryModal}
          >
            + New
          </button>
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
        <div className="flex justify-end mt-4 gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
