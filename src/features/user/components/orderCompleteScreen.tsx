import { CheckCircle } from "lucide-react";
import { Header } from "../../../pages/header";

export const OrderCompleteScreen = ({
  total,
  onContinueShopping,
}: {
  total: number;
  onContinueShopping: () => void;
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. You will receive an email confirmation shortly.
          </p>
          <div className="bg-white rounded-lg p-6 shadow-sm max-w-md mx-auto">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <p className="text-2xl font-bold text-green-800">${total.toFixed(2)}</p>
          </div>
          <button
            onClick={onContinueShopping}
            className="mt-8 bg-green-800 text-white px-6 py-3 rounded-lg hover:bg-green-900 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
