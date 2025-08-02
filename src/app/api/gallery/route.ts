import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import * as jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

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

// GET /api/gallery - Fetch all gallery items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");

    const supabase = createAdminClient();

    let query = supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    // Filter by published status if specified
    if (published !== null) {
      query = query.eq("is_published", published === "true");
    }

    const { data, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch gallery items" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Gallery fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/gallery - Create new gallery item
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, image_url, image_key, is_published } = body;

    // Validate required fields
    if (!title || !image_url || !image_key) {
      return NextResponse.json(
        { error: "Title, image_url, and image_key are required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("gallery")
      .insert({
        title,
        image_url,
        image_key,
        is_published: is_published !== undefined ? is_published : true,
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create gallery item" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("Gallery creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
