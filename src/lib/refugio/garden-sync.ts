import { useEffect, useRef } from "react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { loadUserGarden, saveUserGarden } from "@/lib/refugio/garden.server";
import { sessionSlice, useRefugioStore } from "@/lib/refugio/store";

function payloadOf() {
  const slice = sessionSlice(useRefugioStore.getState());
  delete slice.loggedIn;
  delete slice.isAnonymous;
  return slice as Record<string, unknown>;
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
        if (remote?.payload && Number(remote.stamp) >= localStamp) {
          useRefugioStore.getState().hydrateFromCloud(remote.payload, Number(remote.stamp));
          lastSent.current = JSON.stringify(remote.payload);
        } else {
          const payload = payloadOf();
          const stamp = Date.now();
          useRefugioStore.setState({ cloudStamp: stamp });
          lastSent.current = JSON.stringify(payload);
          void saveUserGarden({ data: { payload, stamp } }).catch(() => undefined);
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
        const payload = payloadOf();
        const encoded = JSON.stringify(payload);
        if (encoded === lastSent.current) return;
        lastSent.current = encoded;
        const stamp = Date.now();
        useRefugioStore.setState({ cloudStamp: stamp });
        void saveUserGarden({ data: { payload, stamp } }).catch(() => undefined);
      }, 1500);
    });
    return () => {
      window.clearTimeout(timer);
      unsub();
    };
  }, [user?.id]);
}
