import './App.css'
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import SampleEcommerceUI2 from './pages/merchant'
import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { ProductDetailPage } from './features/user/pages/productDetail';
import ShoppingCartPage from './features/user/pages/cart';
import { ProductListPage } from './features/user/pages/productList';
import { MerchantDashboardPage } from './features/merchant/pages/merchantDashboard';
import { CheckoutPage } from './features/user/pages/checkout';
import { MerchantListPage } from './features/merchant/pages/merchantListing';
import { CreateProductPage } from './features/merchant/pages/createProduct';
import { UpdateProductPage } from './features/merchant/pages/updateProduct';
import { MerchantOrdersPage } from './features/merchant/pages/orderManagement';
import { MerchantOrderDetailPage } from './features/merchant/pages/orderDetail';
import { AccountDetail } from './features/user/pages/userDetail';
import ForgotPasswordPage from './features/auth/pages/forgotPassword';
import ResetPasswordPage from './features/auth/pages/resetPassword';
import { MerchantLoginPage } from './features/merchant/pages/merchantLogin';
import { CategoryFormPage } from './features/merchant/pages/categoryFormPage';
import { CategoryListPage } from './features/merchant/pages/categoryListingPage';
import { StockManagementPage } from './features/merchant/pages/stockMangementPage';
import EditProfilePage from './features/user/pages/editProfile';
import ChangePasswordPage from './features/user/pages/changePassword';
import { QRPaymentPage } from './features/user/pages/qrPaymentPage';
import { OrderCompletePage } from './features/user/pages/orderComplete';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/merchant-login" element={<MerchantLoginPage />} />
        <Route path="/about" element={<SampleEcommerceUI2 />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/productList" element={<ProductListPage />} />
        <Route path="/cart" element={<ShoppingCartPage />} />
        <Route path="/merchant-dashboard" element={<MerchantDashboardPage />} />
        <Route path="/buy" element={
          <Elements stripe={stripePromise}>
            <CheckoutPage />
          </Elements>
        } />
        <Route path="/merchant-listing" element={<MerchantListPage />} />
        <Route path="/create-product" element={<CreateProductPage />} />
        <Route path="/update-product/:id" element={<UpdateProductPage />} />
        <Route path="/merchant-orders" element={<MerchantOrdersPage />} />
        <Route path="/merchant-orders/:id" element={<MerchantOrderDetailPage />} />
        <Route path="/account-detail" element={<AccountDetail />} />
        <Route path="/update-account" element={<EditProfilePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/create-category" element={<CategoryFormPage />} />
        <Route path="/category-update/:id" element={<CategoryFormPage />} />
        <Route path="/category-listing" element={<CategoryListPage />} />
        <Route path="/stock-management" element={<StockManagementPage />} />
        <Route path="/qr-payment" element={<QRPaymentPage />} />
        <Route path="/order/complete" element={<OrderCompletePage />} />
      </Routes>
    </Router>
  )
}

export default App

