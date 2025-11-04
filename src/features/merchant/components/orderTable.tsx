import type { Order, OrderStatus } from "../../../types/admin";

interface Props {
  data: Order[];
  onStatusClick: (order: Order) => void;
  onStatusChange?: (orderId: number, status: OrderStatus) => Promise<void>;
  onSoftDelete?: (orderId: number) => void;
  onRestore?: (orderId: number) => void;
}

export function OrdersTable({ data = [], onStatusClick, onStatusChange, onSoftDelete, onRestore }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 shadow-sm rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data && data.length > 0 ? (
            data.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.user?.name || "—"}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {onStatusChange ? (
                    <select
                      value={order.status}
                      onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
                      className={`px-2 py-1 rounded text-sm font-semibold ${order.status === "COMPLETED"
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
                  ) : (
                    <span
                      className={`px-2 py-1 rounded text-sm font-semibold ${order.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : order.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                        }`}
                    >
                      {order.status}
                    </span>
                  )}
                </td>
                {/* PRICE */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.total ? `$${order.total.toFixed(2)}` : "—"}
                </td>

                {/* 🆕 CREATED AT */}
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    : "—"}
                </td>

                {/* ACTIONS */}
                <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                  <button
                    onClick={() => onStatusClick(order)}
                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm px-2 py-1 border rounded"
                  >
                    View
                  </button>

                  {!order.isDeleted && onSoftDelete && (
                    <button
                      onClick={() => onSoftDelete(order.id)}
                      className="text-red-600 hover:text-red-800 font-semibold text-sm px-2 py-1 border rounded"
                    >
                      Delete
                    </button>
                  )}

                  {order.isDeleted && onRestore && (
                    <button
                      onClick={() => onRestore(order.id)}
                      className="text-green-600 hover:text-green-800 font-semibold text-sm px-2 py-1 border rounded"
                    >
                      Restore
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}