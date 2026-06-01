import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/authStore";
import { profileService } from "../services/profileService";

export const useAuth = () => {
  const store = useAuthStore();

  useEffect(() => {
    let isMounted = true;

    const getInitialSession = async () => {
      try {
        store.setLoading(true);

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (error) {
          console.error("Session fetch error:", error.message);
          store.clearAuth();
          return;
        }

        if (session?.user) {
          store.setAuth(session, session.user);

          // Load profile independently — a profile failure must not
          // prevent the user from being considered authenticated
          try {
            const profile = await profileService.getMyProfile();
            if (isMounted && profile) {
              store.setProfile(profile);
            }
          } catch (profileErr) {
            console.error("Profile load error on boot:", profileErr);
          }
        } else {
          store.clearAuth();
        }
      } catch (err) {
        console.error("Session initialization failed:", err);
        if (isMounted) store.clearAuth();
      } finally {
        // Always mark as done, even on error
        if (isMounted) {
          store.setLoading(false);
          store.setInitialized(true);
        }
      }
    };

    getInitialSession();

    // Register listener separately. It must NOT duplicate the boot
    // check — skip SIGNED_IN events until initialized is true, because
    // Supabase fires SIGNED_IN on session restore (same event as login).
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Wait until boot check is done before reacting
      if (!useAuthStore.getState().initialized) return;

      if (event === "SIGNED_OUT" || !session) {
        store.clearAuth();
        return;
      }

      if (
        event === "SIGNED_IN" ||
        event === "TOKEN_REFRESHED" ||
        event === "USER_UPDATED"
      ) {
        store.setAuth(session, session.user);

        try {
          const profile = await profileService.getMyProfile();
          if (profile) store.setProfile(profile);
        } catch (err) {
          console.error("Profile load error on auth state change:", err);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []); // Empty — runs exactly once on mount

  return {
    session: store.session,
    user: store.user,
    profile: store.profile,
    loading: store.loading,
    initialized: store.initialized,
    isAuthenticated: !!store.user && !!store.session,
  };
};