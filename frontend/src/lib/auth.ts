import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { User } from "@/types/user";

export const authKeys = {
  me: ["auth", "me"] as const,
};

export type Credentials = { email: string; password: string };
export type RegisterInput = { name: string } & Credentials;

export async function fetchMe(): Promise<User | null> {
  try {
    const { data } = await apiClient.get<{ user: User }>("/api/auth/me");
    return data.user;
  } catch {
    return null;
  }
}

export function useUser() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: fetchMe,
    staleTime: 60_000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Credentials): Promise<User> => {
      const { data } = await apiClient.post<{ user: User }>(
        "/api/auth/login",
        input,
      );
      return data.user;
    },
    onSuccess: (user) => queryClient.setQueryData(authKeys.me, user),
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: RegisterInput): Promise<User> => {
      const { data } = await apiClient.post<{ user: User }>(
        "/api/auth/register",
        input,
      );
      return data.user;
    },
    onSuccess: (user) => queryClient.setQueryData(authKeys.me, user),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<void> => {
      await apiClient.post("/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(authKeys.me, null);
      queryClient.removeQueries({ queryKey: ["notes"] });
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string): Promise<void> => {
      await apiClient.post("/api/auth/forgot-password", { email });
    },
  });
}
