import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

interface PaymentSectionProps {
  total: number;
  onPaymentSuccess: () => void;
  onError?: (error: string) => void;
}

// -----------  Inner Component ------------
const CheckoutForm = ({
  clientSecret,
  onPaymentSuccess,
  onError,
}: {
  clientSecret: string;
  onPaymentSuccess: () => void;
  onError?: (error: string) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout-success`,
      },
    });

    if (error) {
      console.error(error);
      onError?.(error.message || "Payment failed");
      setIsLoading(false);
    } else {
      onPaymentSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition"
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

// -----------  Main Export ------------
export const PaymentSection = ({ total, onPaymentSuccess, onError }: PaymentSectionProps) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<"card" | "promptpay">("card");

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const res = await fetch("/api/payments/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.round(total * 100),
            currency: "thb",
            payment_method_types: [paymentType],
          }),
        });

        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error("Error creating payment intent:", err);
        onError?.("Cannot create payment intent");
      }
    };

    if (total > 0) createPaymentIntent();
  }, [total, paymentType]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-xl font-semibold mb-4">Payment Method</h3>

      <div className="flex gap-6 mb-6">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="paymentType"
            value="card"
            checked={paymentType === "card"}
            onChange={() => setPaymentType("card")}
          />
          Credit / Debit Card
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="paymentType"
            value="promptpay"
            checked={paymentType === "promptpay"}
            onChange={() => setPaymentType("promptpay")}
          />
          PromptPay (QR Code)
        </label>
      </div>

      {clientSecret ? (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "stripe",
              variables: { colorPrimary: "#166534" },
            },
          }}
        >
          <CheckoutForm
            clientSecret={clientSecret}
            onPaymentSuccess={onPaymentSuccess}
            onError={onError}
          />
        </Elements>
      ) : (
        <p className="text-gray-500">Loading payment form...</p>
      )}
    </div>
  );
};
