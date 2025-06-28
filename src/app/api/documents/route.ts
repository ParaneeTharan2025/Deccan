import { createAdminClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// GET all documents
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const fileType = searchParams.get("fileType");
    const published = searchParams.get("published");

    // Create admin client
    const supabaseAdmin = createAdminClient();

    let query = supabaseAdmin
      .from("documents")
      .select(
        `
        *,
        admin_users!uploaded_by(username)
      `
      )
      .order("created_at", { ascending: false });

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    if (fileType && fileType !== "all") {
      query = query.eq("file_type", fileType);
    }

    if (published !== null && published !== undefined) {
      query = query.eq("is_published", published === "true");
    }

    const { data: documents, error } = await query;

    if (error) {
      console.error("Error fetching documents:", error);
      return NextResponse.json(
        { error: "Failed to fetch documents" },
        { status: 500 }
      );
    }

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Documents API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE document
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get("id");

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID required" },
        { status: 400 }
      );
    }

    // Create admin client
    const supabaseAdmin = createAdminClient();

    // Get document details before deletion
    const { data: document, error: fetchError } = await supabaseAdmin
      .from("documents")
      .select("file_path")
      .eq("id", documentId)
      .single();

    if (fetchError || !document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Delete from storage
    const { error: storageError } = await supabaseAdmin.storage
      .from("documents")
      .remove([document.file_path]);

    if (storageError) {
      console.error("Storage deletion error:", storageError);
    }

    // Delete from database
    const { error: dbError } = await supabaseAdmin
      .from("documents")
      .delete()
      .eq("id", documentId);

    if (dbError) {
      console.error("Database deletion error:", dbError);
      return NextResponse.json(
        { error: "Failed to delete document" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Document deletion error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
