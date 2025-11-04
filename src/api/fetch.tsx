type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
  auth?: boolean;
}

const BASE_URL = import.meta.env.VITE_API_URL;
console.log("import.meta.env.BASE_URL", import.meta.env.VITE_API_URL);

console.log("BASE_URL:", BASE_URL);

async function request(endpoint: string, options: RequestOptions = {}) {

  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (options.auth && token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  console.log("res", res.status);
  
  if (res.status === 403 || res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
  }
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Network error");
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  get: (endpoint: string, auth = true) => request(endpoint, { method: "GET", auth }),
  post: (endpoint: string, body: any, auth = true) =>
    request(endpoint, { method: "POST", body, auth }),
  put: (endpoint: string, body: any, auth = true) =>
    request(endpoint, { method: "PUT", body, auth }),
  patch: (endpoint: string, body?: any, auth = true) =>
    request(endpoint, { method: "PATCH", body, auth }),
  delete: (endpoint: string, auth = true) =>
    request(endpoint, { method: "DELETE", auth }),
};
