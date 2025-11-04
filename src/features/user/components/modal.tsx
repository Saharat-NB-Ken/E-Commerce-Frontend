import { useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  success?: boolean; // true = success, false = error
  message: string;
  autoClose?: boolean; // เผื่อบาง modal ไม่อยาก auto close
};

export const CartModal = ({
  isOpen,
  onClose,
  success = true,
  message,
  autoClose = true,
}: Props) => {
  // Auto close after 2s
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => onClose(), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, autoClose]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* background โปร่งใส เห็นข้างหลัง */}
        <div className="fixed inset-0  bg-opacity-30 pointer-events-none" />

        <div
          className={`relative bg-white rounded-xl max-w-md w-full p-6 mx-auto shadow-lg z-50 border
          ${success ? "border-green-300" : "border-red-300"}`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center text-center gap-4">
            <div
              className={`flex items-center justify-center rounded-full w-8 h-8 ${
                success
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {success ? "✓" : "✕"}
            </div>

            <Dialog.Title
              className={`text-lg font-semibold ${
                success ? "text-green-800" : "text-red-800"
              }`}
            >
              {success ? "Success" : "Failed"}
            </Dialog.Title>

            <Dialog.Description className="text-gray-600">
              {message}
            </Dialog.Description>

            {/* กรณีไม่อยาก auto close ให้มีปุ่ม confirm */}
            {!autoClose && (
              <button
                onClick={onClose}
                className={`mt-4 px-6 py-2 rounded-lg font-semibold text-white transition-colors
                ${success ? "bg-green-800 hover:bg-green-900" : "bg-red-600 hover:bg-red-700"}`}
              >
                Okay
              </button>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};
