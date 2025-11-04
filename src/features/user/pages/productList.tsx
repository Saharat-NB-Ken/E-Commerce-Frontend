import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/fetch";
import type { Category, Meta, Product, ProductResponse } from "../../../types/product.types";
import { TopBanner } from "../../../pages/topBanner";
import { Header } from "../../../pages/header";
import { HeroSection } from "../../../pages/heroSection";
import { FilterSection } from "../../../components/filterSection";
import { ProductCard } from "../../../components/productCard";
import { cartService } from "../../../api/cart";
import { CartModal } from "../components/modal";
import { triggerCartUpdated } from "../../../utils/cartEvents";

export const ProductListPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [wishlist, setWishlist] = useState<number[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [priceRange, setPriceRange] = useState<{ min: number | ""; max: number | "" }>({ min: "", max: "" });
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [modalSuccess, setModalSuccess] = useState(true);
    const [modalMessage, setModalMessage] = useState("");

    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [limit] = useState(8);
    const [orderBy, setOrderBy] = useState("createdAt");
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc");

    // --- Debounce search ---
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 100);
        return () => clearTimeout(handler);
    }, [search]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const queryObj: any = {
                page: page.toString(),
                limit: limit.toString(),
                orderBy,
                orderDirection,
            };
            if (selectedCategory) queryObj.category = selectedCategory;
            if (priceRange.min !== "") queryObj.minPrice = priceRange.min.toString();
            if (priceRange.max !== "") queryObj.maxPrice = priceRange.max.toString();
            if (debouncedSearch.trim() !== "") queryObj.search = debouncedSearch.trim();

            const query = new URLSearchParams(queryObj).toString();
            const data: ProductResponse = await api.get(`/products?${query}`, true);
            setProducts(data.data);
            setMeta(data.meta);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data: Category[] = await api.get(`/categories`, true);
            console.log("data", data);

            setCategories(data);
        } catch (err: any) {
            console.error("Failed to load categories:", err.message);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, orderBy, orderDirection, selectedCategory, debouncedSearch]);

    useEffect(() => {
        fetchCategories();
    }, []);


    const handleProductClick = (productId: number) => {
        navigate(`/products/${productId}`);
    };

    const handleAddToCart = async (product: Product) => {
        try {
            await cartService.addOrUpdateItem({ productId: product.id, quantity: 1 });
            triggerCartUpdated();

            setModalSuccess(true);
            setModalMessage("added product to cart successfully");
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

    const handleToggleWishlist = (productId: number) => {
        setWishlist((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    };

    const generatePageNumbers = () => {
        if (!meta) return [];
        const { totalPages, page } = meta;
        const pageNumbers = [];
        const maxVisiblePages = 7;
        let startPage;
        let endPage;

        if (totalPages <= maxVisiblePages) {
            startPage = 1;
            endPage = totalPages;
        } else {
            const middle = Math.ceil(maxVisiblePages / 2);
            if (page <= middle) {
                startPage = 1;
                endPage = maxVisiblePages;
            } else if (page + middle > totalPages) {
                startPage = totalPages - maxVisiblePages + 1;
                endPage = totalPages;
            } else {
                startPage = page - middle + 1;
                endPage = page + middle - 1;
            }
        }

        for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
        return pageNumbers;
    };

    const pagesToDisplay = generatePageNumbers();

    return (
        <div className="bg-gray-50 min-h-screen">
            <TopBanner />
            <Header />
            <HeroSection />
            <FilterSection
                orderBy={orderBy}
                orderDirection={orderDirection}
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={(val) => { setSelectedCategory(val); setPage(1); }}
                onOrderByChange={setOrderBy}
                onOrderDirectionChange={setOrderDirection}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                onApplyPriceFilter={() => { setPage(1); fetchProducts(); }}
                search={search}
                onSearchChange={setSearch}
            />

            <main className="max-w-6xl mx-auto pb-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Products For You!</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onProductClick={handleProductClick}
                            onAddToCart={handleAddToCart}
                            onToggleWishlist={handleToggleWishlist}
                            isWishlisted={wishlist.includes(product.id)}
                        />
                    ))}
                </div>

                {products.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🎧</div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                        <p className="text-gray-500">Try adjusting your filters or check back later.</p>
                    </div>
                )}

                {meta && products.length > 0 && (
                    <div className="flex justify-between items-center mt-8 bg-white p-6 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-600">
                            Page {meta.page} of {meta.totalPages} ({meta.total} products)
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-green-800 transition-colors"
                            >
                                ← Previous
                            </button>
                            {pagesToDisplay.map((p, index) => (
                                <button
                                    key={index}
                                    onClick={() => setPage(p)}
                                    className={`px-4 py-2 rounded-lg transition-colors ${p === page
                                        ? "bg-green-800 text-white"
                                        : "border border-gray-300 hover:border-green-800 text-gray-800"
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                                disabled={page === meta.totalPages}
                                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-green-800 transition-colors"
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                )}
            </main>
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
