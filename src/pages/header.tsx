import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useCartStore } from "../store/cartStore";

export const Header = () => {
    const { cart, fetchCartItems } = useCartStore();

    useEffect(() => {
        fetchCartItems();

        const handleCartUpdate = () => fetchCartItems();
        window.addEventListener("cartUpdated", handleCartUpdate);

        return () => {
            window.removeEventListener("cartUpdated", handleCartUpdate);
        };
    }, []);

    return (
        <header className="bg-white py-4 px-5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2 text-2xl font-bold text-gray-800">
                <div className="w-6 h-6 bg-orange-400 rounded flex items-center justify-center">🛒</div>
                <span>
                    <Link to="/productList" className="text-green-800 hover:text-green-1000">Shopcart</Link>
                </span>
            </div>

            <nav className="hidden md:flex">
                <ul className="flex gap-8">
                    <li><a href="#" className="text-gray-700 font-medium hover:text-green-800">Categories ▼</a></li>
                    <li><a href="#" className="text-gray-700 font-medium hover:text-green-800">Deals</a></li>
                    <li><a href="#" className="text-gray-700 font-medium hover:text-green-800">What's New</a></li>
                    <li><a href="#" className="text-gray-700 font-medium hover:text-green-800">Delivery</a></li>
                </ul>
            </nav>

            <div className="flex items-center gap-5">
                <a href="/account-detail" className="text-gray-700 font-medium hover:text-green-800">👤 Account</a>
                <Link
                    to="/cart"
                    className="relative text-gray-700 font-medium hover:text-green-800"
                >
                    🛒 Cart
                    {cart && cart.totalItems !== undefined && (
                        <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                            {cart.totalItems}
                        </span>
                    )}
                </Link>
            </div>
        </header>
    );
};
