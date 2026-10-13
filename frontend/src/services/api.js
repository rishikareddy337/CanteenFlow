const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api").trim().replace(/\/+$/, "");
const API_BASE_URL = rawBaseUrl.endsWith("/api") ? rawBaseUrl : `${rawBaseUrl}/api`;

async function request(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 204) {
      return null;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.message || data?.error || `HTTP error! status: ${response.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // Test connection
  getTest: async () => {
    const res = await fetch(`${API_BASE_URL}/test`);
    return res.text();
  },

  // Food Items
  getFoodItems: (category, search) => {
    const params = new URLSearchParams();
    if (category && category !== "All") params.append("category", category);
    if (search && search.trim()) params.append("search", search.trim());
    const query = params.toString() ? `?${params.toString()}` : "";
    return request(`/food-items${query}`);
  },

  getFoodItemById: (id) => request(`/food-items/${id}`),

  createFoodItem: (item) =>
    request("/food-items", {
      method: "POST",
      body: JSON.stringify(item),
    }),

  updateFoodItem: (id, item) =>
    request(`/food-items/${id}`, {
      method: "PUT",
      body: JSON.stringify(item),
    }),

  deleteFoodItem: (id) =>
    request(`/food-items/${id}`, {
      method: "DELETE",
    }),

  toggleFoodItemAvailability: (id) =>
    request(`/food-items/${id}/availability`, {
      method: "PATCH",
    }),

  // Orders
  createOrder: (orderData) =>
    request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    }),

  getOrderById: (id) => request(`/orders/${id}`),

  getOrderByNumber: (orderNumber) => request(`/orders/track/${encodeURIComponent(orderNumber)}`),

  getAllOrders: (status) => {
    const query = status && status !== "ALL" ? `?status=${encodeURIComponent(status)}` : "";
    return request(`/orders${query}`);
  },

  updateOrderStatus: (id, status) =>
    request(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  getOrderStats: () => request("/orders/stats"),

  // Authentication
  adminLogin: (email, password) =>
    request("/auth/admin-login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  customerLogin: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  customerRegister: (userData) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
};

export default api;
