import { api } from "./fetch";

export const paymentService = {

    /**
    * 💳 สร้าง PaymentIntent สำหรับชำระเงินผ่าน Stripe
    */
    createQrPayment: async (amount: number, currency = "thb", metadata?: any) => {
        console.log("amoun† ", amount);

        const body = { amount, currency, metadata };
        const res = await api.post("/payment/stripe/create-payment-promptpay", body, true);
        return res;
    },

    createCardPayment: async (amount: number, currency = "thb", metadata?: any) => {
        const body =  { amount, currency, metadata}
        const res = await api.post("/payment/stripe/create-payment-card", body, true)
        return res;
    },

    /**
     * 🧾 Webhook (ไม่ต้องเรียกตรงจาก frontend — backend ใช้เอง)
     * แต่เผื่อไว้ในกรณีต้อง trigger test webhook
     */
    sendStripeWebhookEvent: async (payload: any) => {
        const res = await api.post("/payment/stripe/webhook", payload, false);
        return res.data;
    },



    checkQrStatus: async (id: string) => {
        try {
            const status = await api.get(`/payment/qr/status/${id}`)
            return status
        } catch (error) {
            console.error("Payment failed:", error);
            return { success: false };
        }
    },



    /**
     * ✅ checkout จริง (หลังจ่ายเงิน)
     */
    checkout: async (payload: {
        items: { productId: number; quantity: number }[];
        total: number;
        paymentType: "credit" | "debit" | "qr";
        shippingAddress?: any;
    }) => {
        const res = await api.post("/user-orders", payload, true);
        return res.data;
    },

    changeStatusToCompleted: async (orderId: number) => {
        const res = await api.patch(`/user-orders/${orderId}`)
        return res
    }
}