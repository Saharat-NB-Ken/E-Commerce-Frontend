import { useLocation, useNavigate } from "react-router-dom";
import { QRPaymentScreen } from "../components/qrPaymentScreen"; // import จากที่คุณสร้างไว้

export const QRPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as {
    paymentId: string;
    qrUrl: string;
    total: number;
    orderId: number;
} | null;
  console.log("state", state);
  
  // ถ้าเข้าหน้านี้โดยตรง (ไม่มี state จาก CheckoutPage)
  if (!state) {
    navigate("/checkout");
    return null;
  }

  const handleSuccess = () => {
    navigate("/order/complete", { state: { total: state.total } });
  };

  return (
    <QRPaymentScreen
      paymentId={state.paymentId}
      qrUrl={state.qrUrl}
      onSuccess={handleSuccess}
      orderId={state.orderId}
    />
  );
};
