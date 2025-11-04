import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../../api/fetch";
import type { Product } from "../../../types/product.types";
import { TopBanner } from "../../../pages/topBanner";
import { Header } from "../../../pages/header";
import { cartService } from "../../../api/cart";
import { CartModal } from "../components/modal";
import { triggerCartUpdated } from "../../../utils/cartEvents";

export const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalSuccess, setModalSuccess] = useState(true);
    const [modalMessage, setModalMessage] = useState("");
    const [stock, setStock] = useState<number | null>(null);
    const [mainImage, setMainImage] = useState<string | undefined>(undefined);

    const thumbnailRef = useRef<HTMLDivElement>(null);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const data: Product = await api.get(`/products/${id}`, true);
            setProduct(data);
        } catch (err: any) {
            setError(err.message || "Failed to load product");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchProduct();
    }, [id]);

    useEffect(() => {
        if (product?.images?.length) {
            setMainImage(product.images[0].url);
        }
    }, [product]);

    const handleAddToCart = async (product: Product) => {
        try {
            if (stock !== null && quantity > stock) {
                setModalSuccess(false);
                setModalMessage(`Cannot add ${quantity} items. Only ${stock} left.`);
                setModalOpen(true);
                return;
            }
            await cartService.addOrUpdateItem({ productId: product.id, quantity });
            triggerCartUpdated();

            setModalSuccess(true);
            setModalMessage("Added product to cart successfully");
            setModalOpen(true);
        } catch (err: any) {
            console.log("Error adding to cart:", err.message);

            if (err.message.includes("Not enough stock. Available:")) {
                setModalSuccess(false);
                setModalMessage("Cannot add product: quantity exceeds available stock");
            } else {
                setModalSuccess(false);
                setModalMessage("Cannot add product to cart");
            }
            setModalOpen(true);
        }
    };

    const scrollThumbnails = (direction: "left" | "right") => {
        if (thumbnailRef.current) {
            const scrollAmount = 150;
            thumbnailRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-10 w-10 border-4 border-green-800 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (error) {
        return <p className="text-red-600 text-center">{error}</p>;
    }

    if (!product) {
        return <p className="text-center text-gray-600">No product found</p>;
    }

    return (
        <div>
            <TopBanner />
            <Header />

            {/* Product Detail Section */}
            <section className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Left: Images */}
                <div>
                    <img
                        src={mainImage || product.images[0]?.url}
                        alt={product.name}
                        className="rounded-xl shadow-md h-120 w-full object-cover"
                    />

                    {/* Thumbnails */}
                    {product.images.length > 1 && (
                        <div className="relative mt-4">
                            {/* Left Arrow */}
                            <button
                                onClick={() => scrollThumbnails("left")}
                                className="absolute left-[-40px] top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full hover:bg-gray-100 z-10"
                            >
                                ◀
                            </button>

                            <div
                                ref={thumbnailRef}
                                className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
                            >
                                {product.images.map((img, idx) => (
                                    <img
                                        key={img.id}
                                        src={img.url}
                                        alt={`${product.name}-${idx}`}
                                        className={`w-20 h-20 object-cover rounded cursor-pointer border flex-shrink-0 transition-all duration-150 ${
                                            mainImage === img.url
                                                ? "border-2 border-green-800"
                                                : "border border-transparent hover:border-gray-400"
                                        }`}
                                        onClick={() => setMainImage(img.url)}
                                    />
                                ))}
                            </div>

                            {/* Right Arrow */}
                            <button
                                onClick={() => scrollThumbnails("right")}
                                className="absolute right-[-40px] top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full hover:bg-gray-100 z-10"
                            >
                                ▶
                            </button>
                        </div>
                    )}
                </div>

                {/* Right: Info */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-3">{product.name}</h2>
                    <p className="text-gray-600 mb-4">{product.description}</p>

                    {/* ⭐ Rating */}
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-yellow-500">{"⭐".repeat(5)} (121)</span>
                    </div>

                    {/* Price */}
                    <div className="text-2xl font-semibold text-green-800 mb-2">
                        ฿{product.price.toLocaleString()}
                    </div>

                    {/* Quantity & Buttons */}
                    <div className="flex items-center gap-3 mb-6">
                        <button
                            className="px-3 py-1 border rounded"
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        >
                            -
                        </button>
                        <span>{quantity}</span>
                        <button
                            className="px-3 py-1 border rounded"
                            onClick={() => setQuantity((q) => q + 1)}
                        >
                            +
                        </button>
                        <p className="text-sm text-red-500 ml-4">
                            Only {stock !== null && stock > 0 ? `${stock} items left` : "Out of stock"}
                            <br />
                            Don't miss it
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-4 mb-6">
                        <button className="bg-green-800 text-white px-6 py-3 rounded-lg hover:bg-green-900">
                            Buy Now
                        </button>
                        <button
                            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300"
                            onClick={() => handleAddToCart(product)}
                        >
                            Add to Cart
                        </button>
                    </div>

                    {/* Free Delivery */}
                    <div className="border-t border-gray-200 pt-6">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl text-green-700">🚚</span>
                            <div>
                                <p className="font-semibold">Free Delivery</p>
                                <p className="text-sm underline cursor-pointer">
                                    Enter your Postal code for Delivery Availability
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Return Delivery */}
                    <div className="border-t border-gray-200 pt-6">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl text-green-700">📦</span>
                            <div>
                                <p className="font-semibold">Return Delivery</p>
                                <p className="text-sm text-gray-600">
                                    Free 30 days Delivery Returns.{" "}
                                    <span className="underline cursor-pointer">Details</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <CartModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                success={modalSuccess}
                message={modalMessage}
                autoClose={false}
            />
        </div>
    );
};
