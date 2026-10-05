import { NextRequest, NextResponse } from "next/server";
import { getAllRequests, createRequest, RequestType } from "@/server/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") || undefined;
    const mobile = searchParams.get("mobile") || undefined;
    const status = searchParams.get("status") || undefined;
    const type = searchParams.get("type") || undefined;

    const list = getAllRequests({ role, mobile, status, type });
    return NextResponse.json({ success: true, count: list.length, data: list });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch requests." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      type,
      applicantName,
      mobile,
      aadhaar,
      rationCardNo,
      familyMembersCount,
      annualIncome,
      address,
      subDistrict,
      documents,
    } = body;

    // Validation
    if (!type || !applicantName || !mobile || !aadhaar) {
      return NextResponse.json({ error: "Missing required core application fields." }, { status: 400 });
    }
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return NextResponse.json({ error: "Invalid mobile number format." }, { status: 400 });
    }
    const members = Number(familyMembersCount);
    if (isNaN(members) || members < 1 || members > 15) {
      return NextResponse.json({ error: "Family members count must be between 1 and 15 (BVA Boundary)." }, { status: 400 });
    }
    const income = Number(annualIncome);
    if (isNaN(income) || income < 0 || income > 1000000) {
      return NextResponse.json({ error: "Annual income must be between ₹0 and ₹10,00,000." }, { status: 400 });
    }
    if (type !== "NEW_CARD" && (!rationCardNo || rationCardNo === "—")) {
      return NextResponse.json({ error: "Existing ration card number is required for modifications." }, { status: 400 });
    }

    const created = createRequest({
      type: type as RequestType,
      applicantName,
      mobile,
      aadhaar,
      rationCardNo,
      familyMembersCount: members,
      annualIncome: income,
      address: address || "Not Provided",
      subDistrict: subDistrict || "Pune City",
      documents: Array.isArray(documents) ? documents : [],
    });

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully.",
      data: created,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create application." }, { status: 500 });
  }
}
