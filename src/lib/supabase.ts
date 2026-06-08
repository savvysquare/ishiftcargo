import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string || "").trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string || "").trim();

// Clean quotes if they were accidentally added in the environment configuration
const cleanUrl = supabaseUrl.replace(/^['"]|['"]$/g, "");
const cleanKey = supabaseAnonKey.replace(/^['"]|['"]$/g, "");

if (typeof window !== "undefined") {
  console.log("Supabase URL diagnostics:", {
    length: cleanUrl.length,
    configured: !!cleanUrl,
    hasQuotes: supabaseUrl !== cleanUrl,
  });
  console.log("Supabase Key diagnostics:", {
    length: cleanKey.length,
    configured: !!cleanKey,
    hasQuotes: supabaseAnonKey !== cleanKey,
    prefix: cleanKey.substring(0, 10),
  });
}

/**
 * Returns true if Supabase env vars are configured.
 * Falls back gracefully to localStorage when not set (e.g. local dev without .env).
 */
export const isSupabaseConfigured =
  Boolean(cleanUrl) &&
  cleanUrl !== "https://your-project-id.supabase.co" &&
  Boolean(cleanKey) &&
  cleanKey !== "your-anon-public-key-here";

export const supabase = isSupabaseConfigured
  ? createClient(cleanUrl, cleanKey)
  : null;

