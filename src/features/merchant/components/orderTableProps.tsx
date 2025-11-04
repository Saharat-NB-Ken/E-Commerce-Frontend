import type { Order, OrderStatus } from "../../../types/product.types";

interface OrdersTableProps {
  data: Order[];
  onStatusClick?: (order: Order) => void;
  onStatusChange?: (orderId: number, status: OrderStatus) => void; // <-- เพิ่มตรงนี้
}


export const OrdersTable = ({ data, onStatusChange, onStatusClick }: OrdersTableProps) => {
  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">Order ID</th>
          <th className="p-2 border">Products</th>
          <th className="p-2 border">Status</th>
          <th className="p-2 border">Total</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
  {data.map((order) => (
    <tr key={order.id} className="border-b">
      <td className="p-2">{order.id}</td>
      <td className="p-2">{order.items.map(i => i.product.name).join(", ")}</td>
      <td className="p-2">
        {onStatusChange ? (
          <select
            value={order.status}
            onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
            className="border rounded px-2 py-1"
          >
            <option value="PENDING">PENDING</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELED">CANCELED</option>
          </select>
        ) : (
          order.status
        )}
      </td>
      <td className="p-2">${order.total}</td>
      <td className="p-2">
        {onStatusClick && (
          <button onClick={() => onStatusClick(order)} className="text-blue-500 hover:underline">
            View
          </button>
        )}
      </td>
    </tr>
  ))}
</tbody>

    </table>
  );
};