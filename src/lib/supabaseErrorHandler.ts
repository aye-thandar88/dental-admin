import { supabase } from "./supabase";
import { useAuthStore } from "../store/authStore";

export const setupSupabaseErrorHandler = () => {
  supabase.auth.onAuthStateChange((event) => {
    console.log("Supabase auth event:", event);

    if (event === "SIGNED_OUT") {
      const { clearAuth } = useAuthStore.getState();
      clearAuth();
    } else if (event === "TOKEN_REFRESHED") {
      console.log("Token refreshed, session active");
    }
  });
};

export const handleSupabaseError = (error: any) => {
  if (!error) return null;

  const status = error.status || error.statusCode;
  const message = error.message || "Unknown error";

  const isAuthError = 
    status === 401 || 
    status === 403 || 
    message.includes("JWT") ||
    message.includes("unauthorized") ||
    message.includes("permission");

  return {
    isAuthError,
    status,
    message,
    isNetworkError: !status || status >= 500,
    shouldRetry: !isAuthError,
  };
};

export async function safeSupabaseCall<T>(
  promise: Promise<{ data: T | null; error: any }>,
  context: string = "API call"
): Promise<{ data: T | null; error: any; isAuthError: boolean }> {
  try {
    const { data, error } = await promise;

    if (error) {
      const errorInfo = handleSupabaseError(error);
      console.error(`${context} failed:`, error);

      if (errorInfo?.isAuthError) {
        console.warn(`Auth error in ${context}, but keeping session active`);
      }

      return {
        data: null,
        error,
        isAuthError: errorInfo?.isAuthError || false,
      };
    }

    return { data, error: null, isAuthError: false };
  } catch (err) {
    console.error(`${context} exception:`, err);
    return {
      data: null,
      error: err,
      isAuthError: false,
    };
  }
}
