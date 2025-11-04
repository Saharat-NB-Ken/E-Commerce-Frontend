import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Package, User, CreditCard, ArrowLeft } from "lucide-react";
import { api } from "../../../api/fetch";
import AdminLayout from "../components/managementLayout";
import type { Order, OrderStatus } from "../../../types/product.types";

export const MerchantOrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/admin-order-management/${id}`);
        setOrder(res as Order);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleStatusChange = async (status: OrderStatus) => {
    if (!order) return;
    try {
      const updated = await api.patch(`/admin-order-management/${order.id}/status`, { status });
      setOrder(updated as Order);
      alert(`Order status updated to ${status}`);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Failed to update order status");
    }
  };

  if (loading)
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="animate-spin h-10 w-10 text-green-800" />
        </div>
      </AdminLayout>
    );

  if (!order) return <AdminLayout>Order not found</AdminLayout>;

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6">
          {/* Back Button */}
          <button
            onClick={() => navigate("/merchant-orders")}
            className="mb-4 inline-flex items-center gap-2 px-2 py-1 rounded bg-gray-300 hover:bg-gray-200 text-gray-800"
          >
            <ArrowLeft size={16} /> Back to Orders
          </button>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-green-800 flex items-center gap-2">
              <Package size={24} /> Order #{order.id}
            </h1>

            {/* Status select */}
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                order.status === "COMPLETED"
                  ? "bg-green-100 text-green-800"
                  : order.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <option value="PENDING">PENDING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELED">CANCELED</option>
            </select>
          </div>

          {/* Customer Info */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <User size={18} /> Customer Info
            </h2>
            <p className="text-gray-600 ml-6">Name: {order.user?.name}</p>
            <p className="text-gray-600 ml-6">Email: {order.user?.email}</p>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Package size={18} /> Items
            </h2>
            <div className="mt-2 border rounded-md divide-y divide-gray-200">
              {order.items?.map((item) => {
                const mainImage = item.product?.images?.find((img) => img.isMain) || item.product?.images?.[0];
                return (
                  <div key={item.id} className="flex justify-between items-center p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded overflow-hidden">
                        {mainImage ? (
                          <img src={mainImage.url} alt={item.product?.name || "product"} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400 text-lg">🎧</div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{item.product?.name}</p>
                        <p className="text-gray-600 text-sm">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                        {item.product?.description && <p className="text-gray-500 text-sm">{item.product.description}</p>}
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900">${(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment */}
          {order.payment ? (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <CreditCard size={18} /> Payment
              </h2>
              <p className="text-gray-600 ml-6">Method: {order.payment.method}</p>
              <p className="text-gray-600 ml-6">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    order.payment.status === "PAID"
                      ? "text-green-800"
                      : order.payment.status === "PENDING"
                      ? "text-yellow-800"
                      : "text-red-800"
                  }`}
                >
                  {order.payment.status}
                </span>
              </p>
              {order.payment.paidAt && <p className="text-gray-600 ml-6">Paid at: {new Date(order.payment.paidAt).toLocaleString()}</p>}
              <p className="text-gray-600 ml-6">Amount: ${order.payment.amount.toFixed(2)}</p>
            </div>
          ) : (
            <p className="text-gray-600 mb-6">Payment not made yet</p>
          )}

          {/* Order Summary */}
          <div className="border-t pt-4 flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Total:</span>
            <span className="text-green-800 font-bold text-lg">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
