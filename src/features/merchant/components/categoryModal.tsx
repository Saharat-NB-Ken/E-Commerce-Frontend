import { useState } from "react";
import type { Category } from "../../../types/admin";

type Props = {
  onClose: () => void;
  onCategoryCreated: (category: Category) => void;
};

export default function CategoryModal({ onClose, onCategoryCreated }: Props) {
  const [name, setName] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token",
      },
      body: JSON.stringify({ name }),
    });
    const newCategory = await res.json();
    onCategoryCreated(newCategory);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Create Category</h2>
        <input
          className="w-full border mb-2 p-2 rounded"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
