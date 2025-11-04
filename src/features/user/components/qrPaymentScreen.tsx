import { useEffect, useState } from "react";
import { paymentService } from "../../../api/payment";
import { orderService } from "../api/orderApi";

interface QRPaymentProps {
  paymentId: string;
  qrUrl: string;
  onSuccess: () => void;
  orderId: number;
}

export const QRPaymentScreen = ({ paymentId, qrUrl, onSuccess, orderId }: QRPaymentProps) => {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 นาทีเป็นวินาที

  useEffect(() => {
    // นับถอยหลัง
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Polling เช็คสถานะการจ่ายทุก 5 วินาที
    const interval = setInterval(async () => {
      try {
        const res = await paymentService.checkQrStatus(paymentId);
        console.log("res status", res.status);
        
        if (res.status === "succeeded") {
            // paymentService.changeStatusToCompleted(orderId)
            console.log("orderId", orderId);
            
            await orderService.changeStatusToCompleted(orderId)
            clearInterval(interval);
            clearInterval(timer);
            onSuccess();
        }
      } catch (err) {
        console.error("QR status check error", err);
      }
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(interval);
    };
  }, [paymentId, onSuccess]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-green-800">Scan to Pay</h2>
        <p className="text-gray-600 mb-4">
          Please scan the QR code below with your PromptPay app. You have{" "}
          <span className="font-semibold text-red-500">{formatTime(timeLeft)}</span> to complete payment.
        </p>
        <img src={qrUrl} alt="PromptPay QR Code" className="mx-auto mb-4 w-64 h-64 object-contain" />
        <p className="text-gray-600 text-sm mb-2">Payment ID: {paymentId}</p>
        {timeLeft === 0 && (
          <p className="text-red-500 font-semibold">Time expired! Please try again.</p>
        )}
      </div>
    </div>
  );
};


