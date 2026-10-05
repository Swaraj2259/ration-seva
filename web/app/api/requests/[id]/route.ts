import { NextRequest, NextResponse } from "next/server";
import { getRequestById, updateRequestStatus, RequestStatus } from "@/server/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = getRequestById(id);
    if (!item) {
      return NextResponse.json({ error: `Request with ID "${id}" not found.` }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch request." }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, actor, actorRole, remarks } = body;

    if (!status) {
      return NextResponse.json({ error: "New status is required." }, { status: 400 });
    }

    // Business rule: remarks are mandatory for rejection or clarification return
    if (["Rejected", "Clarification Required"].includes(status) && (!remarks || !remarks.trim())) {
      return NextResponse.json({
        error: `Officer remarks are strictly mandatory when marking an application as "${status}".`,
      }, { status: 400 });
    }

    const updated = updateRequestStatus(
      id,
      status as RequestStatus,
      actor || "Supply Officer",
      actorRole || "Supply Officer",
      remarks
    );

    if (!updated) {
      return NextResponse.json({ error: `Request with ID "${id}" not found.` }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Status updated to "${status}".`,
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update status." }, { status: 500 });
  }
}
