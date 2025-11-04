import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import { useUserStore } from "../authSlice";
import Input from "../../../components/input";
import Button from "../../../components/button";
import ArrowIcon from "../../../images/arrow_14385892.png";

export const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassowrd] = useState("");
  const [error, setError] = useState("");
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await registerUser({
        name,
        email,
        password,
        confirmPassword,
      });
      console.log("user", user);
      
      setUser(user);
      localStorage.setItem("token", user.token);
      navigate("/login", {
        state: { message: "You register succesfully, Please login" },
      });
    } catch (err: any) {
      setError(err.message);
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
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-emerald-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 14a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0V6a4 4 0 10-8 0v8"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Create Account
        </h1>

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Email Address"
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
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassowrd(e.target.value)}
            required
          />

          <div className="flex justify-between mt-4 ">
            <Button type="button" onClick={() => navigate(-1)}>
              <img src={ArrowIcon} alt="Back" className="w-5 h-5 " />
            </Button>
            <Button type="submit">Register</Button>
          </div>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-2">
          <a
            href="/login"
            className="text-emerald-600 hover:text-emerald-800 text-sm font-medium block hover:underline"
          >
            Already have an account? Login
          </a>
        </div>

        {/* Support */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Need help?{" "}
          <a
            href="/contact"
            className="text-emerald-700 hover:text-emerald-800 font-medium"
          >
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};
