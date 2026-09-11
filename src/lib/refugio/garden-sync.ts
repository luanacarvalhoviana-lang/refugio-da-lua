import { useEffect, useRef } from "react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { loadUserGarden, saveUserGarden } from "@/lib/refugio/garden-cloud";
import { sessionSlice, useRefugioStore } from "@/lib/refugio/store";

function payloadJsonOf() {
  const slice = sessionSlice(useRefugioStore.getState()) as Record<string, unknown>;
  delete slice.loggedIn;
  delete slice.isAnonymous;
  return JSON.stringify(slice);
}

export function useGardenSync() {
  const { user, isPending } = useCurrentUserState();
  const ready = useRef(false);
  const hydrating = useRef(false);
  const lastSent = useRef("");

  useEffect(() => {
    if (isPending || !user || user.isDevFallback) return;
    let cancelled = false;
    hydrating.current = true;
    loadUserGarden()
      .then((remote) => {
        if (cancelled) return;
        const localStamp = useRefugioStore.getState().cloudStamp || 0;
        if (remote?.payloadJson && Number(remote.stamp) >= localStamp) {
          const parsed = JSON.parse(remote.payloadJson) as Record<string, unknown>;
          useRefugioStore.getState().hydrateFromCloud(parsed as never, Number(remote.stamp));
          lastSent.current = remote.payloadJson;
        } else {
          const payloadJson = payloadJsonOf();
          const stamp = Date.now();
          useRefugioStore.setState({ cloudStamp: stamp });
          lastSent.current = payloadJson;
          void saveUserGarden({ data: { payloadJson, stamp } }).catch(() => undefined);
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
  }, [user?.id, isPending]);

  useEffect(() => {
    if (!user || user.isDevFallback) return;
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
      }, 1500);
    });
    return () => {
      window.clearTimeout(timer);
      unsub();
    };
  }, [user?.id]);
}
