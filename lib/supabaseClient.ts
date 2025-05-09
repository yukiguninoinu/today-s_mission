// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// Supabase の URL と anon key を環境変数から取得
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, // SupabaseのURL
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // SupabaseのAnonキー
);
