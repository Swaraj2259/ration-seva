import { NextRequest, NextResponse } from "next/server";
import { getActiveRules, getAllRuleVersions, createNewRuleVersion } from "@/server/db";

export async function GET() {
  try {
    const active = getActiveRules();
    const versions = getAllRuleVersions();
    return NextResponse.json({
      success: true,
      activeVersion: active.version,
      activeRules: active,
      history: versions,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch rules." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { version, effectiveFrom, publishedBy, governmentOrderRef, summary, rules } = body;

    if (!version || !effectiveFrom || !governmentOrderRef || !rules || !Array.isArray(rules)) {
      return NextResponse.json({
        error: "Missing mandatory fields: version, effectiveFrom, governmentOrderRef, and rules array are required.",
      }, { status: 400 });
    }

    const created = createNewRuleVersion({
      version,
      effectiveFrom,
      publishedBy: publishedBy || "Admin / District Supply Office",
      governmentOrderRef,
      summary: summary || `Updated statutory eligibility parameters under ${governmentOrderRef}.`,
      rules,
    });

    return NextResponse.json({
      success: true,
      message: `Rule version ${created.version} successfully published and activated.`,
      data: created,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create rule version." }, { status: 500 });
  }
}
