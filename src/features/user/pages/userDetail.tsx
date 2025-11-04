import { useState, useEffect } from "react";
import type { User, Order, CartItem, NotificationShow } from "../../../types/product.types";
import { api } from "../../../api/fetch";
import { Header } from "../../../pages/header";
import { useNavigate } from "react-router-dom";
import { cartService, type CartResponseDto } from "../../../api/cart";

export const AccountDetail = () => {
    const [user, setUser] = useState<User | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [cart, setCart] = useState<CartResponseDto | null>(null);
    const [notifications, setNotifications] = useState<NotificationShow[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalOrders, setTotalOrders] = useState(0);

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"overview" | "orders history" | "cart" | "notifications" | "settings">("overview");

    // Fetch user info, cart, notifications, and initial orders
    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const decoded: any = JSON.parse(atob(token.split(".")[1]));
            setUserId(decoded.id);

            // Fetch user info
            const userRes = await api.get(`/users/${decoded.id}`, true);
            setUser(userRes);

            // Fetch cart
            const cartRes = await cartService.getCart();
            console.log("Fetched cart:", cartRes);
            setCart(cartRes); // ✅ ไม่ใช่ cartRes.items


            // Fetch notifications (optional)
            // const notiRes = await api.get<NotificationShow[]>(`/notifications/user/${decoded.id}`, true);
            // setNotifications(notiRes);

        } catch (err) {
            console.error("Error fetching account data:", err);
        }
    };

    // Fetch orders for a page
    const fetchOrders = async (page: number) => {
        if (!userId) return;
        try {
            const ordersRes = await api.get(`/user-orders/${userId}?page=${page}&pageSize=${pageSize}`, true);

            setOrders(ordersRes.data);
            setTotalOrders(ordersRes.total);
            setCurrentPage(page);
        } catch (err) {
            console.error("Error fetching orders:", err);
        }
    };

    // Fetch user data on mount
    useEffect(() => {
        fetchUserData();
    }, []);

    // Fetch orders when page changes or userId is ready
    useEffect(() => {
        if (userId) fetchOrders(currentPage);
    }, [currentPage, userId]);

    const onLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    if (!user) return <p>Loading...</p>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <Header />

            {/* Header */}
            <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-md mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                        👤
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                        <p className="text-gray-600">{user.email}</p>
                        <p className="text-sm text-gray-500">Role: {user.role}</p>
                    </div>
                </div>
                <div className="flex gap-3 ">
                    <a href="/update-account" >
                        <button className="px-4 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800 cursor-pointer">
                            Edit Profile
                        </button>
                    </a>
                    <button
                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                        onClick={onLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="bg-white rounded-xl shadow-md p-4">
                    <nav className="flex flex-col gap-2">
                        {["overview", "orders history", "cart", "notifications", "settings"].map((tab) => (
                            <button
                                key={tab}
                                className={`text-left px-3 py-2 rounded-lg transition-colors ${activeTab === tab
                                    ? "bg-green-100 text-green-800 font-semibold"
                                    : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                onClick={() => setActiveTab(tab as any)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="col-span-3">
                    {/* Overview Tab */}
                    {activeTab === "overview" && (
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Overview</h3>
                            <p>Email: {user.email}</p>
                            <p>Registered: {new Date(user.createdAt).toLocaleDateString()}</p>
                            <p>Orders: {totalOrders}</p>
                            <p>Cart Items: {cart?.items.length || 0}</p>
                            <p>Notifications: {notifications.filter((n) => !n.read).length} unread</p>
                        </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === "orders history" && (
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Orders history</h3>
                            <ul className="divide-y divide-gray-200">
                                {orders.map((o) => (
                                    <li key={o.id} className="py-3 flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold">Order #{o.id}</p>
                                            <p className="text-sm text-gray-500">{o.status}</p>
                                            <div className="flex gap-2 mt-1 flex-wrap">
                                                {o.items.map((i) => (
                                                    <div key={i.id} className="flex items-center gap-2">
                                                        {i.product.images && i.product.images.length > 0 && (
                                                            <img src={i.product.images[0].url} alt={i.product.name} className="w-8 h-8 object-cover rounded" />
                                                        )}
                                                        <span className="text-sm">{i.product.name} x{i.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">฿{o.total.toFixed(2)}</p>
                                            <p className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* Pagination Controls */}
                            <div className="flex justify-between mt-4">
                                <button
                                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                <span className="text-gray-600">
                                    Page {currentPage} of {Math.ceil(totalOrders / pageSize)}
                                </span>
                                <button
                                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage >= Math.ceil(totalOrders / pageSize)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Cart Tab */}
                    {activeTab === "cart" && (
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Cart</h3>
                            {!cart || cart.items.length === 0 ? (
                                <p className="text-gray-500 text-sm">Your cart is empty.</p>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {cart.items.map((c) => (
                                        <li key={c.cartItem_id} className="py-3 flex justify-between items-center">
                                            <div>
                                                <div className="flex gap-2 items-center">
                                                    {c.product.images?.length ? (
                                                        <img
                                                            src={c.product.images[0].url}
                                                            alt={c.product.name}
                                                            className="w-8 h-8 object-cover rounded"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                                                            🖼️
                                                        </div>
                                                    )}
                                                    <span className="font-semibold text-gray-800">{c.product.name}</span>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Quantity: {c.quantity} × ฿{c.product.price.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="text-right font-semibold text-gray-800">
                                                ฿{(c.quantity * c.product.price).toFixed(2)}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}


                    {/* Notifications Tab */}
                    {activeTab === "notifications" && (
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Notifications</h3>
                            <ul className="divide-y divide-gray-200">
                                {notifications.map((n) => (
                                    <li key={n.id} className={`py-3 ${!n.read ? "font-semibold text-gray-800" : "text-gray-600"}`}>
                                        {n.message}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === "settings" && (
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Settings</h3>
                            <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                                onClick={() => navigate("/forgot-password")}
                            >
                                Change Password
                            </button>
                            <div className="mt-6">
                                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
