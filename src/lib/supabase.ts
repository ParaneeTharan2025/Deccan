import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
}

if (!supabaseKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Admin client - only available on server-side
export const createAdminClient = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseServiceKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY environment variable. Admin client only available on server-side."
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// For backward compatibility - will only work on server-side
export const supabaseAdmin =
  typeof window === "undefined" ? createAdminClient() : null;

export type Notification = {
  id: string;
  title: string;
  content: string;
  category: "general" | "important" | "events";
  is_published: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  image_key: string;
  category: string;
  alt_text?: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
};

export type AdminUser = {
  id: string;
  username: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
};
