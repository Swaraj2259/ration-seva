"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SmsToast from "@/components/SmsToast";

function LoginForm() {
  const params = useSearchParams();
  const router = useRouter();

  const [role, setRole] = useState(params.get("role") || "citizen");
  const [mobile, setMobile] = useState(params.get("mobile") || "9876543210");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [smsNotification, setSmsNotification] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", mobile, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP.");

      setOtpSent(true);
      setDemoCode(data.demoOtp);
      setSmsNotification(`RationSeva: Your verification code is ${data.demoOtp}. Valid for 5 minutes.`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must be exactly 6 digits.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", mobile, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed.");

      localStorage.setItem("rs_role", role);
      localStorage.setItem("rs_mobile", mobile);

      if (role === "officer") router.push("/officer");
      else if (role === "admin") router.push("/admin/rules");
      else router.push("/citizen");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "480px", margin: "40px auto" }}>
      <div className="panel" style={{ padding: "36px 30px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "2.4rem", marginBottom: "6px" }}>🌾</div>
          <h2 style={{ margin: 0 }}>Secure Portal Login</h2>
          <span className="form-help">Two-Factor Mobile Authentication (SRS FR-01, NFR-06)</span>
        </div>

        {error && (
          <div className="badge badge-danger" style={{ display: "block", padding: "10px 14px", marginBottom: "18px", fontSize: "0.85rem" }}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={!otpSent ? handleSendOtp : handleVerifyOtp}>
          <div className="form-group">
            <label className="form-label">User Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={otpSent}
              className="form-select"
            >
              <option value="citizen">Citizen Beneficiary</option>
              <option value="officer">Supply Inspection Officer</option>
              <option value="admin">District Policy Administrator</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Registered Mobile Number</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <span
                style={{
                  padding: "10px 12px",
                  background: "var(--muted)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  fontSize: "0.95rem",
                  color: "var(--muted-foreground)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                placeholder="9876543210"
                disabled={otpSent}
                className="form-input"
                style={{ fontFamily: "var(--font-mono)" }}
              />
            </div>
            <span className="form-help">Pre-filled with test beneficiary number</span>
          </div>

          {otpSent && (
            <div className="form-group" style={{ animation: "slideIn 0.25s ease" }}>
              <label className="form-label">6-Digit One-Time Password (OTP)</label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="form-input"
                style={{ fontFamily: "var(--font-mono)", fontSize: "1.2rem", letterSpacing: "0.2em", textAlign: "center" }}
              />

              {demoCode && (
                <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="form-help">
                    Demo Code: <strong style={{ color: "var(--primary)" }}>{demoCode}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setOtp(demoCode)}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: "0.75rem", padding: "2px 8px" }}
                  >
                    Auto-Fill
                  </button>
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: "24px" }}>
            {!otpSent ? (
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%" }}>
                {loading ? "Sending OTP..." : "Generate One-Time Password →"}
              </button>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%" }}>
                  {loading ? "Verifying..." : "Verify OTP &amp; Proceed →"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                  }}
                  className="btn btn-outline btn-sm"
                  style={{ width: "100%" }}
                >
                  Change Mobile Number
                </button>
              </div>
            )}
          </div>
        </form>

        <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid var(--border)", fontSize: "0.82rem", color: "var(--muted-foreground)" }}>
          <strong>Notice:</strong> As per Government of Maharashtra cybersecurity circular, OTPs expire in 300 seconds (5 minutes). Access is logged for audit purposes under Section 43 of the IT Act.
        </div>
      </div>

      <SmsToast message={smsNotification || undefined} onClose={() => setSmsNotification(null)} />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="panel">Loading authentication...</div>}>
      <LoginForm />
    </Suspense>
  );
}
