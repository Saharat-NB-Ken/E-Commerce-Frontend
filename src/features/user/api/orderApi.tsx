import { api } from "../../../api/fetch"

interface CreateOrderDto {
    items: {
        productId: number;
        quantity: number;
    }[];
}


export const orderService = {
    createOrder: async (data: CreateOrderDto) => {
        return await api.post(`/user-orders`, data, true)
    },
    changeStatusToCompleted: async (orderId: number) => {
        return await api.patch(`/user-orders/${orderId}`, null, true)
    }
}

