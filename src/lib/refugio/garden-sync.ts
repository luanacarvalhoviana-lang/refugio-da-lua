import { useEffect, useRef } from "react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { loadUserGarden, saveUserGarden } from "@/lib/refugio/garden-cloud";
import { gardenWeight, sessionSlice, useRefugioStore } from "@/lib/refugio/store";

function payloadJsonOf() {
  const slice = sessionSlice(useRefugioStore.getState()) as Record<string, unknown>;
  delete slice.loggedIn;
  delete slice.isAnonymous;
  return JSON.stringify(slice);
}

function pushGarden() {
  const state = useRefugioStore.getState();
  if (!state.loggedIn || !state.email) return;
  const payloadJson = payloadJsonOf();
  const stamp = Date.now();
  useRefugioStore.setState({ cloudStamp: stamp });
  void saveUserGarden({ data: { payloadJson, stamp } }).catch(() => undefined);
  return payloadJson;
}

export function useGardenSync() {
  const { user, isPending } = useCurrentUserState();
  const email = useRefugioStore((s) => s.email);
  const loggedIn = useRefugioStore((s) => s.loggedIn);
  const ready = useRef(false);
  const hydrating = useRef(false);
  const lastSent = useRef("");

  useEffect(() => {
    const googleEmail = (user?.primaryEmail || "").toLowerCase();
    if (isPending || !user || user.isDevFallback || !loggedIn) return;
    if (!googleEmail || googleEmail !== (email || "").toLowerCase()) return;
    let cancelled = false;
    hydrating.current = true;
    loadUserGarden()
      .then((remote) => {
        if (cancelled) return;
        const local = useRefugioStore.getState();
        const localScore = gardenWeight(local);
        let remoteScore = -1;
        let parsed: Record<string, unknown> | null = null;
        if (remote?.payloadJson) {
          parsed = JSON.parse(remote.payloadJson) as Record<string, unknown>;
          remoteScore = gardenWeight(parsed);
        }
        if (parsed && remoteScore > localScore) {
          useRefugioStore.getState().hydrateFromCloud(parsed as never, Number(remote?.stamp || Date.now()));
          lastSent.current = remote?.payloadJson || "";
        } else if (localScore >= 0) {
          lastSent.current = pushGarden() || "";
        }
      })
      .catch(() => undefined)
      .finally(() => {
        hydrating.current = false;
        ready.current = true;
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.primaryEmail, isPending, email, loggedIn]);

  useEffect(() => {
    if (!user || user.isDevFallback || !loggedIn) return;
    let timer = 0;
    const unsub = useRefugioStore.subscribe(() => {
      if (!ready.current || hydrating.current) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const state = useRefugioStore.getState();
        if (!state.loggedIn || !state.email) return;
        const payloadJson = payloadJsonOf();
        if (payloadJson === lastSent.current) return;
        lastSent.current = payloadJson;
        const stamp = Date.now();
        useRefugioStore.setState({ cloudStamp: stamp });
        void saveUserGarden({ data: { payloadJson, stamp } }).catch(() => undefined);
      }, 2000);
    });
    return () => {
      window.clearTimeout(timer);
      unsub();
    };
  }, [user?.id, loggedIn]);
}
