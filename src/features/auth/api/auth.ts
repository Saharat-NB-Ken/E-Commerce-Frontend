import { api } from "../../../api/fetch";

interface RegisterInput {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface LoginInput {
    email: string;
    password: string;
}


// 🔹 Register (ไม่ต้องใช้ token)
export const registerUser = (data: RegisterInput) => {
    return api.post("/auth/register", data, false);
};

// 🔹 Login (ไม่ต้องใช้ token)
export const loginUser = (data: LoginInput) => {
    return api.post("/auth/login", data, false); 
};

// 🔹 Profile (ต้องใช้ token)
export const getProfile = () => {
    return api.get("/user/profile", true); 
};
