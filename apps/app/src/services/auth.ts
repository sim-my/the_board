import { api } from "./api";

export type SendOtpResponse = { error: boolean; message: string };
export type VerifyOtpResponse = { error: boolean; token: string; isNewUser: boolean };

export const authService = {
  sendOtp: (email: string) =>
    api.post<SendOtpResponse>("/auth/sendOtp", { email }),

  verifyOtp: (email: string, otp: string) =>
    api.post<VerifyOtpResponse>("/auth/verifyOtp", { email, otp }),

  logout: () =>
    api.post<{ error: boolean; message: string }>("/auth/logout"),
};
