import axios from "axios";
import { env } from "@/config/env";

/**
 * Single preconfigured API client reused across the app (bulletproof-react).
 * Cross-cutting concerns (auth, error normalisation) belong in interceptors.
 */
export const apiClient = axios.create({
  baseURL: env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
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
