import { create } from "zustand";
import { cartService, type CartResponseDto } from "../api/cart";

type CartState = {
  cart: CartResponseDto | null;
  fetchCartItems: () => Promise<void>;
  setCart: (cart: CartResponseDto) => void;
};

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  fetchCartItems: async () => {
    const data = await cartService.getCart();
    set({ cart: data });
  },
  setCart: (cart) => set({ cart }),
}));

