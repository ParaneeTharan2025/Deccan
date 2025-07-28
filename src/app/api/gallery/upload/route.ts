import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
import * as jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const utapi = new UTApi();

// Verify admin token (matching existing pattern)
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (8MB limit)
    const maxSize = 8 * 1024 * 1024; // 8MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size must be less than 8MB" },
        { status: 400 }
      );
    }

    // Upload to UploadThing
    const response = await utapi.uploadFiles([file]);

    if (!response || response.length === 0 || response[0].error) {
      console.error("UploadThing error:", response?.[0]?.error);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    const uploadedFile = response[0].data;

    if (!uploadedFile) {
      return NextResponse.json(
        { error: "Upload failed - no data returned" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: uploadedFile.url,
      key: uploadedFile.key,
      size: uploadedFile.size,
      name: uploadedFile.name,
    });
  } catch (error: any) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
