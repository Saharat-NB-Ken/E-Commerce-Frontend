import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserStore } from "../authSlice";
import { loginUser } from "../api/auth";
import Input from "../../../components/input";
import Button from "../../../components/button";
import ArrowIcon from "../../../images/arrow_14385892.png";

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const setUser = useUserStore((state) => state.setUser);
    const navigate = useNavigate();
    const location = useLocation();
    const successMessage = location.state?.message;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const user = await loginUser({ email, password });
            setUser(user);
            localStorage.setItem("token", user.token);
            navigate("/productList");
        } catch (err: any) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.message) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 bg-emerald-800 text-white py-3 px-4">
                <div className="max-w-7xl mx-auto flex items-center gap-2">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🛒</span>
                    </div>
                    <span className="text-xl font-bold">Shopcart</span>
                </div>
            </div>

            {/* Card */}
            <div className="w-full max-w-md mt-16 bg-white rounded-2xl shadow-xl p-8">
                {/* ✅ Success Message จาก Register */}
                {successMessage && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                        </svg>
                        {successMessage}
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <div className="flex justify-between mt-4 ">
                        <Button type="button" onClick={() => navigate(-1)}>
                            <img src={ArrowIcon} alt="Back" className="w-5 h-5 " />
                        </Button>
                        <Button type="submit">Login</Button>
                    </div>
                </form>

                {/* Footer Links */}
                <div className="mt-6 text-center space-y-2">
                    <a href="/register" className="text-emerald-600 hover:text-emerald-800 text-sm font-medium block hover:underline">
                        Don't have an account? Register
                    </a>
                    <a href="/forgot-password" className="text-gray-700 hover:text-blue-500 text-sm block w-full hover:underline">
                        Forgot password?
                    </a>
                </div>

                {/* Support */}
                <p className="text-center text-gray-600 text-sm mt-6">
                    Need help? <a href="/contact" className="text-emerald-700 hover:text-emerald-800 font-medium">Contact Support</a>
                </p>
            </div>
        </div>
    );
};
