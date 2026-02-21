import { api } from "./api";

export type RequestOtpResponse = { ok: true };
export type VerifyOtpResponse = {
  token: string;
  user: { id: string; email: string };
};

export const authService = {
  requestOtp: (email: string) =>
    api.post<RequestOtpResponse>("/auth/request-otp", { email }),

  verifyOtp: (email: string, otp: string) =>
    api.post<VerifyOtpResponse>("/auth/verify-otp", { email, otp }),

  logout: () => api.post<{ ok: true }>("/auth/logout"),
};
