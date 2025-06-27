import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://aqdvxffjxioilkspxgpm.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZHZ4ZmZqeGlvaWxrc3B4Z3BtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4Mjk4MjgsImV4cCI6MjA2NjQwNTgyOH0.1dYda2B_iOt5Kaq3AzDi1guCNSfr-tvOl4MeS3dVsOw";

// Service role key for admin operations (bypasses RLS)
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZHZ4ZmZqeGlvaWxrc3B4Z3BtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDgyOTgyOCwiZXhwIjoyMDY2NDA1ODI4fQ.VoL6fgRhHIcD_yzd-zKRl4fXWzJPUcSmRjhcv_-R3eI";

export const supabase = createClient(supabaseUrl, supabaseKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

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

export type AdminUser = {
  id: string;
  username: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
};
