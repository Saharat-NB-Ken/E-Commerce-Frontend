import type { Product } from "../types/product.types";
import { api } from "./fetch";

export interface CartItemResponseDto {
    cartItem_id: number;
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    product: Product;
}

export interface CartResponseDto {
    items: CartItemResponseDto[];
    totalItems: number;
    totalPrice: number;
    meta?: { page: number; limit: number; totalPages: number };
}

export interface AddCartItemDto {
    productId: number;
    quantity: number;
}

export interface UpdateCartItemDto {
    cartItemId: number;
    quantity: number;
}

export interface ChangeCartItemAmountDto {
    cartItemId: number;
    amount?: number;
}

export const cartService = {
    getCart: async (): Promise<CartResponseDto> => {
        return await api.get("/cart");
    },

    addItem: async (item: { productId: number; quantity: number; color?: string }) => {
        return await api.post("/cart", item, true);
    },

    // SET quantity
    setQuantity: async (item: { cartItemId: number; quantity: number }) => {
        return await api.patch("/cart/set", item, true);
    },

    // INCREMENT quantity
    incrementQuantity: async (cartItemId: number, amount = 1) => {
        return await api.patch(`/cart/${cartItemId}/increment`, { cartItemId, amount }, true);
    },

    // DECREMENT quantity
    decrementQuantity: async (cartItemId: number, amount = 1) => {
        return await api.patch(`/cart/${cartItemId}/decrement`, { cartItemId, amount }, true);
    },

    removeItem: async (cartItemId: number): Promise<void> => {
        await api.delete(`/cart/${cartItemId}`);
    },

    clearCart: async (): Promise<void> => {
        await api.delete("/cart");
    },

    //     checkout: async (payload: { items: { productId: number; quantity: number }[]}) => {
    //     const res = await api.post("/user-orders", payload);
    //     return res.data;
    //   },
    addOrUpdateItem: async (item: { productId: number; quantity: number; color?: string }) => {
        const cart = await cartService.getCart();
        console.log("quantity", item.quantity);

        const existing = cart.items.find((ci) => ci.productId === item.productId);
        if (item.quantity > 1) {
            console.log("3554454465");
            console.log("productid bbbbb", existing?.productId);

            return await cartService.addItem({ productId: Number(item.productId), quantity: item.quantity });
        }
        if (existing) {
            // ถ้ามีแล้ว → เพิ่มจำนวน
            console.log("1234567890");
            console.log("productid vvvv", existing?.productId);

            return await cartService.incrementQuantity(existing.cartItem_id, item.quantity);
        } else {
            // ถ้าไม่มี → สร้างใหม่
            return await cartService.addItem(item);
        }
    },
    
};
