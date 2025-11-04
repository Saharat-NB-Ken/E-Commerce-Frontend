import { useEffect, useState } from "react";
import { Package, Loader2 } from "lucide-react";
import { api } from "../../../api/fetch";
import AdminLayout from "../components/managementLayout";
import { useNavigate } from "react-router-dom";
import { OrdersTable } from "../components/orderTable";
import type { Order, OrderStatus } from "../../../types/product.types";
import { OrderFilterSection } from "../components/orderFilter";

type OrdersResponse = {
  data: Order[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    orderBy: string;
    orderDirection: "asc" | "desc";
    status: string | null;
    isDeleted?: boolean;
  };
};

export const MerchantOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [meta, setMeta] = useState<OrdersResponse["meta"] | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string | "">("");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc");
  const [orderBy, setOrderBy] = useState<string>("createdAt");

  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const q = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        orderBy,
        orderDirection,
      });
      if (statusFilter) q.set("status", statusFilter);

      const res = await api.get(`/admin-order-management?${q.toString()}`);
      console.log("Fetched orders:", res);
      setOrders(Array.isArray(res.data) ? res.data : []);
      setMeta(res.meta);

    } catch (err) {
      console.error(err);
      setOrders([]);
      setMeta(null);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleStatusChange = async (orderId: number, status: OrderStatus) => {
    try {
      const updated = await api.patch(`/admin-order-management/${orderId}/status`, { status });

      if (updated?.data) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, ...updated.data } : order
          )
        );
      } else {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          )
        );
      }

      console.log(`Order ${orderId} status updated to ${status}`);
    } catch (err: any) {
      console.error("Failed to update order status:", err);
      alert(err?.message || "Failed to update order status");
    }
  };

  const handleSoftDelete = async (orderId: number) => {
    try {
      await api.patch(`/admin-order-management/${orderId}/delete`);
      alert(`Order ${orderId} soft deleted`);
      fetchOrders();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Failed to delete order");
    }
  };

  const handleRestore = async (orderId: number) => {
    try {
      await api.patch(`/admin-order-management/${orderId}/restore`);
      alert(`Order ${orderId} restored`);
      fetchOrders();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Failed to restore order");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, orderBy, orderDirection, statusFilter]);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-green-800 mb-8">Orders Management</h1>

          <OrderFilterSection
            orderBy={orderBy}
            orderDirection={orderDirection}
            status={statusFilter}
            onStatusChange={setStatusFilter}
            onOrderByChange={setOrderBy}
            onOrderDirectionChange={setOrderDirection}
          />

          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Package size={20} /> Orders Management
              </h3>
            </div>

            {loadingOrders ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin h-8 w-8 text-green-800 mr-2" />
                <span className="text-gray-600">Loading orders...</span>
              </div>
            ) : (
              <>
                <OrdersTable
                  data={orders || []}
                  onStatusChange={handleStatusChange}
                  onStatusClick={(o) => navigate(`/merchant-orders/${o.id}`)}
                  onSoftDelete={handleSoftDelete}
                  onRestore={handleRestore}
                />

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Page {meta?.page ?? 1} of {meta?.totalPages ?? 1} — Total {meta?.total ?? 0} orders
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(meta?.totalPages ?? 1, p + 1))}
                      disabled={page === meta?.totalPages}
                      className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
