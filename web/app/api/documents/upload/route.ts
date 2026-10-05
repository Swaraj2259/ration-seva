import { NextRequest, NextResponse } from "next/server";

const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB limit (SRS FR-03, NFR-05)

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files received for upload." }, { status: 400 });
    }

    const processedFiles: Array<{ name: string; sizeKb: number; type: string; status: string }> = [];

    for (const file of files) {
      // Validate size
      if (file.size > MAX_SIZE_BYTES) {
        return NextResponse.json({
          error: `File "${file.name}" exceeds the maximum allowed limit of 2 MB (${(file.size / (1024 * 1024)).toFixed(2)} MB).`,
        }, { status: 400 });
      }

      // Validate MIME type
      const isAllowed =
        file.type === "application/pdf" ||
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        /\.(pdf|jpe?g|png)$/i.test(file.name);

      if (!isAllowed) {
        return NextResponse.json({
          error: `File "${file.name}" is not a valid format. Only PDF and JPG/PNG documents are accepted.`,
        }, { status: 400 });
      }

      processedFiles.push({
        name: file.name,
        sizeKb: Math.round(file.size / 1024),
        type: file.type || "application/pdf",
        status: "Verified",
      });
    }

    return NextResponse.json({
      success: true,
      message: `${processedFiles.length} document(s) validated and uploaded successfully.`,
      files: processedFiles,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Document upload processing error." }, { status: 500 });
  }
}
