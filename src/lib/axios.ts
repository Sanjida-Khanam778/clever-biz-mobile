// src/lib/axios.ts
import axios from "axios";
const TOKENS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER_INFO: "userInfo",
};

const axiosInstance = axios.create({
  baseURL: "https://abc.winaclaim.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKENS.ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(TOKENS.REFRESH_TOKEN);
        if (refreshToken) {
          const response = await axios.post(
            "http://10.10.13.26:9000/token/refresh/",
            {
              refresh: refreshToken,
            }
          );

          const { access } = response.data;
          localStorage.setItem("accessToken", access);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return axiosInstance(originalRequest);
        }
      } catch {
        // Refresh token failed, redirect to login
        localStorage.removeItem(TOKENS.ACCESS_TOKEN);
        localStorage.removeItem(TOKENS.REFRESH_TOKEN);
        localStorage.removeItem(TOKENS.USER_INFO);
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
