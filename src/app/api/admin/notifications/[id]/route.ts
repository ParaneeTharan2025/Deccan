import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import * as jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

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

// PUT - Update notification
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, content, category, is_published } = await request.json();

    // Create admin client
    const supabaseAdmin = createAdminClient();

    const { data, error } = await supabaseAdmin
      .from("notifications")
      .update({
        title,
        content,
        category,
        is_published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE notification and associated documents
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const notificationId = params.id;

    // Create admin client
    const supabaseAdmin = createAdminClient();

    // Get associated documents before deletion
    const { data: documentRelations, error: docRelError } = await supabaseAdmin
      .from("notification_documents")
      .select(
        `
        documents (
          id,
          file_path
        )
      `
      )
      .eq("notification_id", notificationId);

    if (docRelError) {
      console.error("Error fetching document relations:", docRelError);
    }

    // Delete the notification (this will cascade delete notification_documents)
    const { error: deleteError } = await supabaseAdmin
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // Clean up associated documents from storage and database
    if (documentRelations && documentRelations.length > 0) {
      const documents = documentRelations
        .map((rel: any) => rel.documents)
        .filter(Boolean);

      for (const doc of documents) {
        // Delete from storage
        const { error: storageError } = await supabaseAdmin.storage
          .from("documents")
          .remove([doc.file_path]);

        if (storageError) {
          console.error(`Error deleting file ${doc.file_path}:`, storageError);
        }

        // Delete from database
        const { error: dbError } = await supabaseAdmin
          .from("documents")
          .delete()
          .eq("id", doc.id);

        if (dbError) {
          console.error(`Error deleting document ${doc.id}:`, dbError);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete notification error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
