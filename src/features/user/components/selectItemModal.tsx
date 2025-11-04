import { Dialog } from '@headlessui/react';
import { AlertCircle, X } from 'lucide-react';

interface SelectItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SelectItemsModal = ({ isOpen, onClose }: SelectItemsModalProps) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-30" />

        <div className="relative bg-white rounded-xl max-w-md w-full p-6 mx-auto shadow-lg z-50">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center text-center gap-4">
            <div className="bg-green-100 text-green-800 rounded-full p-4">
              <AlertCircle size={36} />
            </div>
            <Dialog.Title className="text-xl font-bold text-gray-900">
              No Items Selected
            </Dialog.Title>
            <Dialog.Description className="text-gray-600">
              Please select at least one item from your cart before proceeding to checkout.
            </Dialog.Description>

            <button
              onClick={onClose}
              className="mt-4 bg-green-800 text-white px-6 py-2 rounded-lg hover:bg-green-900 transition-colors font-semibold"
            >
              Okay
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
