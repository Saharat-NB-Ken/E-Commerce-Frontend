import { useLocation, useNavigate } from "react-router-dom";
import { OrderCompleteScreen } from "../components/orderCompleteScreen";

export const OrderCompletePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as { total: number } | null;

  if (!state) {
    navigate("/");
    return null;
  }

  const handleContinue = () => {
    navigate("/productList");
  };

  return (
    <OrderCompleteScreen total={state.total} onContinueShopping={handleContinue} />
  );
};
