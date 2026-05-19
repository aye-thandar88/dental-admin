import { supabase } from "./supabase";

/**
 * Wrapper for safe Supabase calls with proper error handling
 * Prevents automatic logout on API errors
 */
export async function makeSupabaseCall<T>(
  callFn: () => Promise<{ data: T | null; error: any }>,
  options = { throwOnError: false, logError: true }
): Promise<{ data: T | null; error: any | null }> {
  try {
    const { data, error } = await callFn();

    if (error) {
      if (options.logError) {
        console.error("Supabase call error:", error);
      }

      // Don't throw for permission errors - let the caller handle it
      if (options.throwOnError) {
        throw error;
      }

      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Supabase call exception:", err);
    return { data: null, error: err };
  }
}

/**
 * Get the current session without triggering auth state change
 * Safe to call from services
 */
export async function getSessionSafely() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

/**
 * Get current user without triggering auth state change
 */
export async function getUserSafely() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

/**
 * Check if user has valid session
 */
export async function hasValidSession(): Promise<boolean> {
  try {
    const session = await getSessionSafely();
    return !!session?.user;
  } catch {
    return false;
  }
}
