import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import * as jwt from "jsonwebtoken";
import { UTApi } from "uploadthing/server";

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

// PUT /api/gallery/[id] - Update gallery item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, image_url, image_key, is_published } = body;
    const { id } = params;

    // Validate required fields
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const updateData: any = {
      title,
      is_published: is_published !== undefined ? is_published : true,
    };

    // Only update image fields if new image is provided
    if (image_url && image_key) {
      updateData.image_url = image_url;
      updateData.image_key = image_key;
    }

    const { data, error } = await supabase
      .from("gallery")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to update gallery item" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Gallery item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Gallery update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/gallery/[id] - Delete gallery item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const supabase = createAdminClient();

    // First, get the gallery item to get the image_key for deletion
    const { data: galleryItem, error: fetchError } = await supabase
      .from("gallery")
      .select("image_key")
      .eq("id", id)
      .single();

    if (fetchError || !galleryItem) {
      return NextResponse.json(
        { error: "Gallery item not found" },
        { status: 404 }
      );
    }

    // Delete the image from UploadThing
    try {
      await utapi.deleteFiles([galleryItem.image_key]);
    } catch (uploadError) {
      console.error("Failed to delete image from UploadThing:", uploadError);
      // Continue with database deletion even if image deletion fails
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from("gallery")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Database error:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete gallery item" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Gallery deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
