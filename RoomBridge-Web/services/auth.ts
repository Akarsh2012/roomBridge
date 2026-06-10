import api from "./api";

export type LoginPayload = { email: string; password: string };
export type RegisterPayload = { name: string; email: string; password: string };

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified?: boolean;
  avatar?: string;
  phone?: string;
  bio?: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post("/auth/login", payload);
  return data.data;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await api.post("/auth/register", payload);
  return data.data;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get("/auth/me");
  return data.data.user;
}

export async function logout(refreshToken: string): Promise<void> {
  await api.post("/auth/logout", { refreshToken });
}

export async function sendOtp(): Promise<{ expiresIn: number; cooldown: number }> {
  const { data } = await api.post("/auth/send-otp");
  return data.data;
}

export async function verifyOtp(otp: string): Promise<void> {
  await api.post("/auth/verify-otp", { otp });
}
