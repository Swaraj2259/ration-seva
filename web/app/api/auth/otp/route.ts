import { NextRequest, NextResponse } from "next/server";
import { requestOtp, verifyOtp } from "@/server/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, mobile, role, otp } = body;

    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
      return NextResponse.json({ error: "Please enter a valid 10-digit Indian mobile number." }, { status: 400 });
    }

    if (action === "send") {
      const res = requestOtp(mobile, role || "citizen");
      return NextResponse.json({
        success: true,
        message: `OTP sent successfully to ${mobile}.`,
        // Exposed in demo mode for instant testing convenience
        demoOtp: res.otp,
        expiresAt: res.expiresAt,
      });
    }

    if (action === "verify") {
      if (!otp || !/^\d{6}$/.test(otp)) {
        return NextResponse.json({ error: "OTP must be exactly 6 digits." }, { status: 400 });
      }
      const result = verifyOtp(mobile, otp);
      if (!result.valid) {
        return NextResponse.json({ error: result.error || "Invalid OTP code." }, { status: 401 });
      }
      return NextResponse.json({
        success: true,
        role: result.role,
        mobile,
        token: `session_${Buffer.from(`${mobile}:${result.role}:${Date.now()}`).toString("base64")}`,
      });
    }

    return NextResponse.json({ error: "Invalid action. Supported: 'send' or 'verify'." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Authentication error." }, { status: 500 });
  }
}
