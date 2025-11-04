import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  CreditCard,
  MapPin,
  Lock,
  Truck,
  ArrowLeft,
  Plus,
  Minus,
  X
} from 'lucide-react';
import { Header } from '../../../pages/header';
import { cartService, type CartItemResponseDto, type CartResponseDto } from '../../../api/cart';
import { paymentService } from '../../../api/payment';
import { OrderCompleteScreen } from '../components/orderCompleteScreen';
import { orderService } from '../api/orderApi';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
}

interface PaymentMethod {
  type: 'credit' | 'debit' | 'qr';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  holderName?: string;
}



export const CheckoutPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();

  const selectedItemsFromCart =
    (location.state as { selectedItems?: CartItemResponseDto[] })?.selectedItems || [];

  const [cart, setCart] = useState<CartResponseDto | null>(null);
  const [items, setItems] = useState<CartItemResponseDto[]>(selectedItemsFromCart);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    address: '',
    city: '',
    zipCode: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({ type: 'credit' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const fetchCart = async () => {
    const cartData = await cartService.getCart();
    setCart(cartData);
    if (selectedItemsFromCart.length > 0) {
      const filtered = cartData.items.filter((i) =>
        selectedItemsFromCart.some((s) => s.cartItem_id === i.cartItem_id)
      );
      setItems(filtered);
    } else {
      setItems(cartData.items);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const updateQuantity = async (itemId: number, change: number) => {
    try {
      const item = items.find((i) => i.cartItem_id === itemId);
      if (!item) return;

      if (change > 0) {
        await cartService.incrementQuantity(itemId, change);
      } else if (change < 0 && item.quantity + change >= 1) {
        await cartService.decrementQuantity(itemId, -change);
      }
      await fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await cartService.removeItem(itemId);
      await fetchCart();
    } catch (err) {
      console.error(err);
    }
  };


  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const orderItems = items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      }));

      const createdOrder = await orderService.createOrder({
        items: orderItems,
      });

      let paymentResult: any;
      if (paymentMethod.type === "qr") {
        paymentResult = await paymentService.createQrPayment(Number(total.toFixed(0)), "thb", {
          orderIds: createdOrder.id,
        });

        navigate("/qr-payment", {
          state: {
            paymentId: paymentResult.paymentId,
            qrUrl: paymentResult.qrUrl,
            total,
            orderId: createdOrder.id,
          },
        });
      } else {
        paymentResult = await paymentService.createCardPayment(Number(total.toFixed(0)), "thb", {
          orderIds: createdOrder.id,
        });
        console.log("11111111");
        // console.log("payment result", paymentResult);

        if (!stripe || !elements) throw new Error("Stripe not loaded");
        console.log("2222222");
        // console.log("Card elemetn 123", CardElement);

        const cardElement = elements.getElement(CardElement);
        console.log("33333333");
        // console.log("card element", cardElement);

        if (!cardElement) throw new Error("CardElement not found");
        console.log("card element", cardElement);

        const { error, paymentIntent } = await stripe.confirmCardPayment(
          paymentResult.clientSecret,
          {
            payment_method: {
              card: cardElement,
              billing_details: { name: shippingAddress.fullName, email: "user@example.com" }
            },
          }
        );
        // console.log("error 222", error);
        console.log("payment intent 333", paymentIntent);

        if (error) {
          console.error("Payment failed:", error);
          alert(`Payment failed: ${error.message}`);
        } else if (paymentIntent?.status === "succeeded") {
          await removePurchasedItems();
          setOrderComplete(true);
        }
      }
    } catch (err) {
      console.error("Checkout failed", err);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 🧹 ฟังก์ชันลบเฉพาะสินค้าที่ซื้อออกจาก cart
  const removePurchasedItems = async () => {
    try {
      const cartData = await cartService.getCart();
      if (!cartData || cartData.items.length === 0) return;

      const purchasedIds = items.map((i) => i.cartItem_id);

      // ลบเฉพาะสินค้าที่อยู่ใน purchasedIds
      await Promise.all(
        purchasedIds.map((id) => cartService.removeItem(id))
      );

      console.log("🧹 Removed purchased items:", purchasedIds);
    } catch (err) {
      console.error("Failed to remove purchased items:", err);
    }
  };

  const handleContinueShopping = () => {
    setOrderComplete(false);
    navigate('/productList');
  };

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 15.0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  if (orderComplete) {
    return <OrderCompleteScreen total={total} onContinueShopping={handleContinueShopping} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-600 mb-6">
          <a href="/cart" className="text-green-800 hover:underline flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Cart
          </a>{' '}
          / <span>Checkout</span>
        </nav>

        <h1 className="text-3xl font-bold text-green-800 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ShoppingCart size={20} /> Order Items ({items.length})
              </h3>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.cartItem_id}
                    className="flex items-center p-4 border border-gray-100 rounded-lg"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mr-4">
                      <ShoppingCart className="text-white" size={20} />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{item.productName}</h4>
                      <p className="text-green-600 font-semibold">
                        ${item.product.price.toFixed(2)} each
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mx-4">
                      <button
                        onClick={() => updateQuantity(item.cartItem_id, -1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center transition-colors disabled:opacity-50"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-semibold min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItem_id, 1)}
                        className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="text-lg font-bold text-green-800 mr-4">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>

                    <button
                      onClick={() => removeItem(item.cartItem_id)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin size={20} /> Shipping Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={shippingAddress.fullName}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={shippingAddress.phone}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={shippingAddress.address}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({ ...prev, address: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 md:col-span-2"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({ ...prev, city: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={shippingAddress.zipCode}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({ ...prev, zipCode: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard size={20} /> Payment Method
              </h3>
              <div className="flex gap-4 mb-4">
                <label>
                  <input
                    type="radio"
                    name="paymentType"
                    value="credit"
                    checked={paymentMethod.type === 'credit'}
                    onChange={(e) =>
                      setPaymentMethod((prev) => ({ ...prev, type: e.target.value as any }))
                    }
                    className="mr-2"
                  />
                  Credit Card
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentType"
                    value="debit"
                    checked={paymentMethod.type === 'debit'}
                    onChange={(e) =>
                      setPaymentMethod((prev) => ({ ...prev, type: e.target.value as any }))
                    }
                    className="mr-2"
                  />
                  Debit Card
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentType"
                    value="qr"
                    checked={paymentMethod.type === 'qr'}
                    onChange={(e) =>
                      setPaymentMethod((prev) => ({ ...prev, type: e.target.value as any }))
                    }
                    className="mr-2"
                  />
                  QR Payment
                </label>
              </div>

              {paymentMethod.type !== 'qr' && (
                <div className="mb-4">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#32325d',
                          '::placeholder': { color: '#a0aec0' },
                        },
                      },
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-6">
              <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-2">
                    <Truck size={16} /> Shipping
                  </span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${tax.toFixed(0)}</span>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(0)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing || items.length === 0}
                className="w-full bg-green-800 text-white py-3 px-4 rounded-lg hover:bg-green-900 transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock size={16} /> Place Order
                  </>
                )}
              </button>

              <div className="text-center mt-4 text-sm text-gray-500">
                <Lock className="inline mr-1" size={14} />
                Your payment information is secure and encrypted
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
