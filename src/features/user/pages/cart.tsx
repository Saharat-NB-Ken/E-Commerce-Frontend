import { useState, useEffect } from 'react';
import { ShoppingCart, Minus, Plus, X, Trash2, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../../../pages/header';
import type { CartItemResponseDto, CartResponseDto } from '../../../api/cart';
import { cartService } from '../../../api/cart';
import { SelectItemsModal } from '../components/selectItemModal';
import { useCartStore } from '../../../store/cartStore';

export const ShoppingCartPage = () => {
    const [cart, setCart] = useState<CartResponseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [promoCode, setPromoCode] = useState<string>('');
    const [updating, setUpdating] = useState<{ [key: number]: boolean }>({});
    const [selectedItems, setSelectedItems] = useState<{ [key: number]: boolean }>({});
    const [modalOpen, setModalOpen] = useState(false);
    const { fetchCartItems } = useCartStore.getState();

    const navigate = useNavigate();

    const fetchCart = async () => {
        try {
            setLoading(true);
            setError(null);
            const cartData = await cartService.getCart();
            console.log("Fetched cart data:", cartData);

            setCart(cartData);


        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const increaseQuantity = async (cartItem: CartItemResponseDto) => {
        if (!cart) return;

        console.log("cartItem id", cartItem.cartItem_id);

        await cartService.incrementQuantity(cartItem.cartItem_id, 1);
        await fetchCart();
    };

    const decreaseQuantity = async (cartItem: CartItemResponseDto) => {
        if (!cart) return;
        await cartService.decrementQuantity(cartItem.cartItem_id, 1);
        await fetchCart();
    };

    const removeItem = async (cartItemId: number) => {
        try {
            setUpdating(prev => ({ ...prev, [cartItemId]: true }));
            await cartService.removeItem(cartItemId);
            await fetchCart();
            setSelectedItems(prev => {
                const copy = { ...prev };
                delete copy[cartItemId];
                return copy;
            });
            await fetchCartItems();

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to remove item');
        } finally {
            setUpdating(prev => ({ ...prev, [cartItemId]: false }));
        }
    };

    const clearCart = async () => {
        await cartService.clearCart();
        await fetchCart();
        await fetchCartItems();

    };

    const calculateTotals = () => {
        if (!cart) return { subtotal: 0, itemCount: 0, shipping: 0, tax: 0, total: 0 };
        const itemsToBuy = cart.items.filter(item => selectedItems[item.cartItem_id]);
        const subtotal = itemsToBuy.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        const itemCount = itemsToBuy.reduce((sum, item) => sum + item.quantity, 0);
        const shipping = subtotal > 500 ? 0 : 15.0;
        const tax = subtotal * 0.1;
        const total = subtotal + shipping + tax;
        return { subtotal, itemCount, shipping, tax, total };
    };

    const { subtotal, itemCount, shipping, tax, total } = calculateTotals();

    const LoadingSpinner = () => (
        <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin h-8 w-8 text-green-800" />
            <span className="ml-2 text-gray-600">Loading cart...</span>
        </div>
    );

    const ErrorMessage = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <div className="flex-1"><p className="text-red-800">{message}</p></div>
                <button onClick={onRetry} className="text-red-600 hover:text-red-800 font-medium text-sm">Retry</button>
            </div>
        </div>
    );

    const EmptyCart = () => (
        <div className="text-center py-16">
            <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Start shopping to add items to your cart</p>
            <button className="bg-green-800 text-white px-6 py-3 rounded-lg hover:bg-green-900 transition-colors" onClick={() => navigate('/productList')}>Continue Shopping</button>
        </div>
    );

    if (loading) return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-7xl mx-auto px-4 py-8"><LoadingSpinner /></div>
        </div>
    );

    const hasSelected = Object.values(selectedItems).some(Boolean);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <SelectItemsModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {error && <ErrorMessage message={error} onRetry={fetchCart} />}
                {cart && cart.items.length === 0 ? <EmptyCart /> : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Cart Items */}
                        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={cart?.items.every(item => selectedItems[item.cartItem_id])}
                                        onChange={(e) => {
                                            const newSelected: { [key: number]: boolean } = {};
                                            cart?.items.forEach(item => newSelected[item.cartItem_id] = e.target.checked);
                                            setSelectedItems(newSelected);
                                        }}
                                        className="h-4 w-4 accent-green-800"
                                    />
                                    Select All
                                </label>
                                <button onClick={clearCart} className="text-gray-500 hover:text-red-500 flex items-center gap-2 transition-colors" disabled={loading}>
                                    <Trash2 size={16} /> Clear All
                                </button>
                            </div>
                            <div className="space-y-6">
                                {cart?.items.map(item => (
                                    <div key={item.cartItem_id} className="flex items-center p-4 border border-gray-100 rounded-lg">
                                        <input
                                            type="checkbox"
                                            checked={!!selectedItems[item.cartItem_id]}
                                            onChange={(e) =>
                                                setSelectedItems(prev => ({ ...prev, [item.cartItem_id]: e.target.checked }))
                                            }
                                            className="mr-4 h-4 w-4 accent-green-800"
                                        />
                                        <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center mr-4">
                                            {item.product.images[0] ? (
                                                <img
                                                    src={item.product.images[0].url}
                                                    alt={`Product ${item.productId}`}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <ShoppingCart className="text-gray-400" size={24} />
                                            )}                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800">{item.product.name}</h4>
                                            <p className="text-gray-500 text-sm">Product ID: {item.productId}</p>
                                        </div>
                                        <div className="flex items-center gap-3 mx-6">
                                            <button
                                                onClick={() => decreaseQuantity(item)}
                                                disabled={updating[item.cartItem_id] || item.quantity <= 1}
                                                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center transition-colors disabled:opacity-50"
                                            >
                                                <Minus size={16} />
                                            </button>

                                            <span className="font-semibold min-w-[2rem] text-center">
                                                {updating[item.cartItem_id] ? <Loader2 className="animate-spin h-4 w-4" /> : item.quantity}
                                            </span>

                                            <button
                                                onClick={() => increaseQuantity(item)}
                                                disabled={updating[item.cartItem_id]}
                                                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center transition-colors disabled:opacity-50"
                                            >
                                                <Plus size={16} />
                                            </button></div>
                                        <div className="text-xl font-bold text-green-800 mr-4">${(item.product.price * item.quantity).toFixed(2)}</div>
                                        <button onClick={() => removeItem(item.cartItem_id)} disabled={updating[item.cartItem_id]} className="text-red-500 hover:text-red-700 p-2 transition-colors disabled:opacity-50">{updating[item.cartItem_id] ? <Loader2 className="animate-spin h-4 w-4" /> : <X size={20} />}</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1 bg-white rounded-xl p-6 shadow-sm sticky top-6">
                            <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600"><span>Subtotal ({itemCount} items)</span><span>${subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
                                <div className="flex justify-between text-gray-600"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
                                <hr className="my-4" />
                                <div className="flex justify-between text-xl font-bold"><span>Total</span><span>${total.toFixed(2)}</span></div>
                            </div>

                            <button
                                onClick={() => {
                                    if (!hasSelected) {
                                        setModalOpen(true);
                                        return;
                                    } else {
                                        // ส่ง selectedItems ไปหน้า /buy
                                        navigate('/buy', {
                                            state: {
                                                selectedItems: cart?.items.filter(item => selectedItems[item.cartItem_id])
                                            }
                                        });
                                    }
                                }}
                                className="w-full bg-green-800 text-white py-3 px-4 rounded-lg hover:bg-green-900 transition-colors flex items-center justify-center gap-2 font-semibold"
                            >
                                <Lock size={16} /> Proceed to Checkout
                            </button>

                            <div className="text-center mt-4">
                                <button
                                    onClick={() => navigate('/productList')}
                                    className="text-green-800 hover:underline"
                                >
                                    ← Continue Shopping
                                </button>
                            </div>
                            <div className="mt-6 pt-6 border-t">
                                <label className="block font-semibold mb-2">Promo Code</label>
                                <div className="flex gap-2">
                                    <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Enter promo code" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500" />
                                    <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors">Apply</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShoppingCartPage;
