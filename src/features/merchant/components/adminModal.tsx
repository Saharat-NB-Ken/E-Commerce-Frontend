import { X } from "lucide-react";

type ModalType = "success" | "error" | "confirm";

interface AdminModalProps {
  open: boolean;
  title?: string;
  message?: string;
  type?: ModalType;
  onClose: () => void;
  onConfirm?: () => void;
}

export function AdminModal({
  open,
  title = "Notification",
  message,
  type = "success",
  onClose,
  onConfirm,
}: AdminModalProps) {
  if (!open) return null;

  const color =
    type === "error"
      ? "text-red-600"
      : type === "confirm"
      ? "text-yellow-600"
      : "text-green-600";

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md relative animate-fadeIn">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h2 className={`text-xl font-semibold mb-3 ${color}`}>{title}</h2>
        {message && <p className="text-gray-600 mb-6">{message}</p>}

        <div className="flex justify-end gap-3">
          {type === "confirm" && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
          )}
          <button
            onClick={onConfirm || onClose}
            className={`px-4 py-2 rounded-lg text-white font-semibold ${
              type === "error"
                ? "bg-red-600 hover:bg-red-700"
                : type === "confirm"
                ? "bg-yellow-600 hover:bg-yellow-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
