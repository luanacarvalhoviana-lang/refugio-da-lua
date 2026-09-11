import { useEffect } from "react";
import { authEnabled, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useRefugioStore } from "@/lib/refugio/store";

export function useAuth() {
  const { user, isPending } = useCurrentUserState();
  const loggedIn = useRefugioStore((s) => s.loggedIn);
  const userName = useRefugioStore((s) => s.userName);
  const email = useRefugioStore((s) => s.email);
  const loginStore = useRefugioStore((s) => s.login);
  const logoutStore = useRefugioStore((s) => s.logout);
  const googleUser = user && !user.isDevFallback ? user : null;

  useEffect(() => {
    if (!googleUser) return;
    loginStore({
      email: googleUser.primaryEmail || email || "",
    });
  }, [googleUser?.id, googleUser?.displayName, googleUser?.primaryEmail, loginStore, userName, email]);

  return {
    user: googleUser
      ? { name: userName, email: googleUser.primaryEmail || email }
      : loggedIn
        ? { name: userName, email }
        : null,
    pending: isPending,
    logout: async () => {
      logoutStore();
      if (authEnabled) {
        try {
          await signOut();
        } catch {
          /* preview may reject; local session already cleared */
        }
      }
    },
  };
}

export function startLogin() {
  useRefugioStore.getState().login();
}
