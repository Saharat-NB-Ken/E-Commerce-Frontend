import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/fetch";

export default function EditProfilePage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // โหลดข้อมูล user ตอนเข้า
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded: any = JSON.parse(atob(token.split(".")[1]));
        setUserId(decoded.id);

        // ✅ GET user ตาม route ใหม่
        const userRes = await api.get(`/users/${decoded.id}`, true);
        setName(userRes.name || "");
        setEmail(userRes.email || "");
      } catch (err: any) {
        setError(err.message);
      }
    })();
  }, []);

  const handleUpdate = async () => {
    if (!userId) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const payload: any = { name, email };

      const res = await api.patch(`/users/${userId}`, payload, true);
      setMessage(res.message || "Profile updated successfully!");
      setTimeout(() => navigate("/productList"), 1500);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md mt-10">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Edit Profile
          </h2>

          {/* ✅ Messages */}
          {message && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              ✅ {message}
            </div>
          )}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              ❌ {error}
            </div>
          )}

          {/* ✅ Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                placeholder="Enter your email"
              />
            </div>

            <button
              onClick={handleUpdate}
              disabled={loading}
              className="w-full bg-emerald-700 text-white py-3 rounded-lg font-semibold hover:bg-emerald-800 transition disabled:opacity-50"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>

          {/* ✅ Links */}
          <div className="mt-6 text-center space-y-2">
            <a
              href="/change-password"
              className="text-gray-600 hover:text-gray-800 text-sm block w-full"
            >
              Change password? Click here
            </a>
            <a
              href="/productList"
              className="text-emerald-700 hover:text-emerald-800 text-sm font-medium block"
            >
              ← Back to Shop
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
