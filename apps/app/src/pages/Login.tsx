// OtpLogin.tsx
import React, { useMemo, useState } from "react";

type Step = "email" | "otp";
type LoginProps = {
    onSuccess: () => void;
};

export default function Login({ onSuccess }: LoginProps) {
    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState<string>("");
    const [otp, setOtp] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const canSend = useMemo(() => email.trim().includes("@"), [email]);
    const canVerify = useMemo(() => otp.trim().length === 4, [otp]);

    const handleSend = async () => {
        setError("");
        setLoading(true);
        try {
            // UI-only: pretend we sent an email
            await new Promise((r) => setTimeout(r, 700));
            setStep("otp");
        } catch {
            setError("Could not send code. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        setError("");
        setLoading(true);
        try {
            await new Promise((r) => setTimeout(r, 700));
            onSuccess(); // <-- notify parent (App)
        } catch {
            setError("Invalid code. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const resend = async () => {
        setError("");
        setLoading(true);
        try {
            await new Promise((r) => setTimeout(r, 600));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[var(--page-bg)] px-6 py-10 flex items-center justify-center">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm border border-stone-200">
                <h1 className="font-[var(--font-heading)] text-3xl text-stone-900">
                    Login
                </h1>
                <p className="mt-3 text-sm text-stone-500">
                    {step === "email"
                        ? "We will send 4 digit code to your email."
                        : `Enter the 4 digit code we sent to `}
                    {step === "otp" ? (
                        <span className="font-medium text-stone-700">{email}</span>
                    ) : null}
                </p>

                <div className="mt-2 space-y-4">
                    {step === "email" ? (
                        <>
                            <div>
                                <label className="text-sm font-medium text-stone-800">
                                    Email
                                </label>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    type="email"
                                    className="mt-1 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-300"
                                />
                            </div>

                            {error ? <p className="text-sm text-red-600">{error}</p> : null}

                            <button
                                type="button"
                                onClick={handleSend}
                                disabled={!canSend || loading}
                                className={[
                                    "w-full rounded-xl px-4 py-3 text-sm font-semibold transition",
                                    loading ? "opacity-70" : "",
                                    !canSend || loading
                                        ? "bg-stone-200 text-stone-500 cursor-not-allowed"
                                        : "bg-(--accent) text-white hover:bg-(--accent) cursor-pointer",
                                ].join(" ")}
                            >
                                {loading ? "Sending..." : "Send code"}
                            </button>
                        </>
                    ) : (
                        <>
                            <div>
                                <label className="text-sm font-medium text-stone-800">
                                    One time code
                                </label>
                                <input
                                    value={otp}
                                    onChange={(e) =>
                                        setOtp(e.target.value)
                                    }
                                    placeholder="1234"
                                    inputMode="numeric"
                                    className="mt-1 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm tracking-widest outline-none focus:border-stone-300"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep("email");
                                        setOtp("");
                                        setError("");
                                    }}
                                    className="text-sm font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
                                >
                                    Change email
                                </button>

                                <button
                                    type="button"
                                    onClick={resend}
                                    disabled={loading}
                                    className={[
                                        "text-sm font-semibold",
                                        loading
                                            ? "text-stone-400 cursor-not-allowed"
                                            : "text-(--accent) hover:text-(--accent) cursor-pointer",
                                    ].join(" ")}
                                >
                                    Resend code
                                </button>
                            </div>

                            {error ? <p className="text-sm text-red-600">{error}</p> : null}

                            <button
                                type="button"
                                onClick={handleVerify}
                                disabled={!canVerify || loading}
                                className={[
                                    "w-full rounded-xl px-4 py-3 text-sm font-semibold transition",
                                    loading ? "opacity-70" : "",
                                    !canVerify || loading
                                        ? "bg-stone-200 text-stone-500 cursor-not-allowed"
                                        : "bg-(--accent) text-white hover:bg-(--accent) cursor-pointer",
                                ].join(" ")}
                            >
                                {loading ? "Verifying..." : "Verify and login"}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}