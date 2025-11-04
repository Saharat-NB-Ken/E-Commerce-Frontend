import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  BarChart3,
  Tags,
  Boxes,
} from "lucide-react";

type Props = { children: ReactNode };

export default function AdminLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-green-900 text-white flex flex-col">
        <div className="px-6 py-4 text-2xl font-bold border-b border-green-700">
          Admin Panel
        </div>
        <nav className="flex-1 px-4 py-6 space-y-3">
          <NavLink
            to="/merchant-dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded hover:bg-green-800 ${
                isActive ? "bg-green-800 font-semibold" : ""
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </NavLink>
          <NavLink
            to="/merchant-listing"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded hover:bg-green-800 ${
                isActive ? "bg-green-800 font-semibold" : ""
              }`
            }
          >
            <Package className="w-5 h-5" /> Products
          </NavLink>
          <NavLink
            to="/merchant-orders"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded hover:bg-green-800 ${
                isActive ? "bg-green-800 font-semibold" : ""
              }`
            }
          >
            <BarChart3 className="w-5 h-5" /> Orders
          </NavLink>
          <NavLink
            to="/category-listing"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded hover:bg-green-800 ${
                isActive ? "bg-green-800 font-semibold" : ""
              }`
            }
          >
            <Tags className="w-5 h-5" /> Category
          </NavLink>
          <NavLink
            to="/stock-management"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded hover:bg-green-800 ${
                isActive ? "bg-green-800 font-semibold" : ""
              }`
            }
          >
            <Boxes className="w-5 h-5" /> Stock
          </NavLink>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
