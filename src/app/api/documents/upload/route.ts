import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = (formData.get("category") as string) || "general";
    const uploadedBy = formData.get("uploadedBy") as string;

    console.log("Upload request received:", {
      fileName: file?.name,
      fileType: file?.type,
      fileSize: file?.size,
      category,
      title,
    });

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type and size
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      console.error("Invalid file type:", file.type);
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const maxSize = file.type.startsWith("image/")
      ? 5 * 1024 * 1024
      : 10 * 1024 * 1024; // 5MB for images, 10MB for documents
    if (file.size > maxSize) {
      console.error("File too large:", file.size, "max:", maxSize);
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const uniqueFileName = `${timestamp}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExtension}`;

    const filePath = uniqueFileName;

    console.log("Generated file path:", filePath);

    // Convert File to ArrayBuffer then to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("Starting upload to Supabase...");
    console.log(
      "Service role key (first 20 chars):",
      process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20)
    );

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("documents")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error details:", {
        error: uploadError,
        message: uploadError.message,
        details: uploadError,
      });
      return NextResponse.json(
        {
          error: "Failed to upload file",
          details: uploadError.message,
        },
        { status: 500 }
      );
    }

    console.log("Upload successful:", uploadData);

    // Save document metadata to database
    const { data: document, error: dbError } = await supabaseAdmin
      .from("documents")
      .insert({
        title: title || file.name,
        description,
        file_name: file.name,
        file_path: uploadData.path,
        file_type: file.type.startsWith("image/") ? "image" : "document",
        mime_type: file.type,
        file_size: file.size,
        category,
        uploaded_by: uploadedBy,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      // Clean up uploaded file if database insert fails
      await supabaseAdmin.storage.from("documents").remove([uploadData.path]);
      return NextResponse.json(
        { error: "Failed to save document metadata" },
        { status: 500 }
      );
    }

    console.log("Document saved successfully:", document.id);

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        title: document.title,
        file_name: document.file_name,
        file_type: document.file_type,
        file_size: document.file_size,
      },
    });
  } catch (error) {
    console.error("Document upload error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
