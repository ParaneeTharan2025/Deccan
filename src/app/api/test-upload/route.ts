import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    console.log("Test upload endpoint called");

    // Test with a simple text file
    const testContent = "This is a test file upload";
    const testFileName = `test-${Date.now()}.txt`;

    console.log("Attempting to upload test file:", testFileName);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("documents")
      .upload(testFileName, testContent, {
        contentType: "text/plain",
        upsert: false,
      });

    if (uploadError) {
      console.error("Test upload error:", {
        error: uploadError,
        message: uploadError.message,
        details: uploadError,
      });
      return NextResponse.json(
        {
          error: "Test upload failed",
          details: uploadError.message,
          uploadError: uploadError,
        },
        { status: 500 }
      );
    }

    console.log("Test upload successful:", uploadData);

    return NextResponse.json({
      success: true,
      message: "Test upload completed successfully",
      uploadData: uploadData,
    });
  } catch (error) {
    console.error("Test upload catch error:", error);
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Test upload endpoint is working" });
}
