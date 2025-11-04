import { useState } from "react";
import type { Product } from "../types/product.types";
import { triggerCartUpdated } from "../utils/cartEvents";

interface ProductCardProps {
  product: Product;
  onProductClick: (id: number) => void;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (productId: number) => void;
  isWishlisted?: boolean;
  mode?: "customer" | "merchant";
  onEditProduct?: (productId: number) => void;
}

export function ProductCard({
  product,
  onProductClick,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  mode = "customer",
  onEditProduct,
}: ProductCardProps) {
  const [stock, setStock] = useState(product.stock);

  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow relative group cursor-pointer flex flex-col">
      {/* Wishlist button แสดงเฉพาะลูกค้า */}
      {mode === "customer" && onToggleWishlist && (
        <button
          className={`absolute top-4 right-4 text-xl transition-colors ${isWishlisted
            ? "text-red-500"
            : "text-gray-300 hover:text-red-500"
            }`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
        >
          {isWishlisted ? "❤️" : "♡"}
        </button>
      )}

      <div
        className="h-48 mb-4 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden"
        onClick={() => onProductClick(product.id)}
      >
        {product.images && product.images.length > 0 ? (
          <img
            src={
              product.images.find((img) => img.isMain)?.url ||
              product.images[0].url
            }
            alt={product.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-4xl">
            🎧
          </div>
        )}
      </div>

      <div onClick={() => onProductClick(product.id)}>
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
          {product.name}
        </h3>
        <div className="text-xl font-bold text-green-800 mb-1">
          ฿{product.price.toLocaleString()}
        </div>
        <div className="text-sm text-gray-500 mb-2">
          {stock > 0 ? `${stock} items left` : "Out of stock"}
        </div>
        <div className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </div>

        {mode === "customer" && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-400 text-sm">★★★★★</span>
            <span className="text-gray-500 text-sm">(121)</span>
          </div>
        )}
      </div>

      {/* Footer button */}
      {mode === "customer" && onAddToCart ? (
        <button
          onClick={async (e) => {
            e.stopPropagation();
            if (stock > 0 && onAddToCart) {
              try {
                await onAddToCart(product);
                triggerCartUpdated(); 
              } catch (error) {
                console.error("Error adding to cart:", error);
              }
            }
          }}
          className={`w-full py-3 rounded-lg font-semibold transition-colors mt-auto
    ${stock > 0
              ? "bg-green-800 hover:bg-green-900 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          disabled={stock === 0}
        >
          {stock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      ) : mode === "merchant" && onEditProduct ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEditProduct(product.id);
          }}
          className="w-full py-3 rounded-lg font-semibold transition-colors mt-auto bg-green-600 hover:bg-green-700 text-white"
        >
          Edit Product
        </button>
      ) : null}
    </div>
  );
}
