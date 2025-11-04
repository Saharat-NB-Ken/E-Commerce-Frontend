
interface OrderFilterProps {
  orderBy: string;
  orderDirection: "asc" | "desc";
  status: string | "";
  onStatusChange: (value: string) => void;
  onOrderByChange: (value: string) => void;
  onOrderDirectionChange: (value: "asc" | "desc") => void;
}

export function OrderFilterSection({
  orderBy,
  orderDirection,
  status,
  onStatusChange,
  onOrderByChange,
  onOrderDirectionChange,
}: OrderFilterProps) {
  return (
    <div className="flex flex-nowrap items-center gap-4 mb-6 w-full ">
      {/* Status Filter */}
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm hover:border-green-800"
      >
        <option value="">All Status</option>
        <option value="PENDING">Pending</option>
        <option value="COMPLETED">Completed</option>
        <option value="CANCELED">Canceled</option>
      </select>

      {/* Sorting */}
      <select
        value={orderBy}
        onChange={(e) => onOrderByChange(e.target.value)}
        className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm hover:border-green-800"
      >
        <option value="createdAt">Created At</option>
        <option value="status">Status</option>
        <option value="total">Total Amount</option>
      </select>

      <select
        value={orderDirection}
        onChange={(e) => onOrderDirectionChange(e.target.value as "asc" | "desc")}
        className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm hover:border-green-800"
      >
        <option value="desc">Desc</option>
        <option value="asc">Asc</option>
      </select>
    </div>
  );
}
