import axios from "axios";
import { env } from "@/config/env";

export const apiClient = axios.create({
  baseURL: env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  adapter: "fetch",
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error?.message ??
      error.message ??
      "Something went wrong";
    return Promise.reject(new Error(message));
  },
);
