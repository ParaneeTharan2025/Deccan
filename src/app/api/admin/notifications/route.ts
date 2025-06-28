import { NextRequest, NextResponse } from "next/server";
import { supabase, createAdminClient } from "@/lib/supabase";
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

// GET - Fetch all notifications with documents
export async function GET(request: NextRequest) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from("notifications")
      .select(
        `
        *,
        notification_documents (
          documents (
            id,
            title,
            file_name,
            file_path,
            file_type,
            mime_type,
            file_size,
            category
          )
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform the data to flatten documents array
    const transformedData = data.map((notification) => ({
      ...notification,
      documents: notification.notification_documents.map(
        (nd: any) => nd.documents
      ),
    }));

    // Remove the notification_documents property
    transformedData.forEach((notification) => {
      delete notification.notification_documents;
    });

    return NextResponse.json(transformedData);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST - Create new notification with optional documents
export async function POST(request: NextRequest) {
  const user = verifyToken(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, content, category, is_published, document_ids } =
      await request.json();

    // Create notification
    const { data: notification, error: notificationError } = await supabase
      .from("notifications")
      .insert({
        title,
        content,
        category,
        is_published,
        created_by: user.userId,
      })
      .select()
      .single();

    if (notificationError) {
      return NextResponse.json(
        { error: notificationError.message },
        { status: 500 }
      );
    }

    // Link documents if provided
    if (document_ids && document_ids.length > 0) {
      const documentLinks = document_ids.map((docId: string) => ({
        notification_id: notification.id,
        document_id: docId,
      }));

      const { error: linkError } = await supabase
        .from("notification_documents")
        .insert(documentLinks);

      if (linkError) {
        console.error("Error linking documents:", linkError);
        // Don't fail the notification creation if document linking fails
      }
    }

    // Fetch the complete notification with documents
    const { data: completeNotification, error: fetchError } = await supabase
      .from("notifications")
      .select(
        `
        *,
        notification_documents (
          documents (
            id,
            title,
            file_name,
            file_path,
            file_type,
            mime_type,
            file_size,
            category
          )
        )
      `
      )
      .eq("id", notification.id)
      .single();

    if (fetchError) {
      return NextResponse.json(notification); // Return basic notification if fetch fails
    }

    // Transform the data
    const transformedNotification = {
      ...completeNotification,
      documents: completeNotification.notification_documents.map(
        (nd: any) => nd.documents
      ),
    };
    delete transformedNotification.notification_documents;

    return NextResponse.json(transformedNotification);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
