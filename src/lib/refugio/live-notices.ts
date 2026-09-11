import { useEffect, useRef } from "react";
import { showLiveNotice } from "@/lib/refugio/notify";
import { useRefugioStore } from "@/lib/refugio/store";

export function useLiveNotices() {
  const latest = useRefugioStore((s) => s.notices[0]?.id);
  const enabled = useRefugioStore((s) => s.liveNotices);
  const skip = useRef(true);

  useEffect(() => {
    if (skip.current) {
      skip.current = false;
      return;
    }
    if (!enabled || !latest) return;
    const item = useRefugioStore.getState().notices[0];
    if (!item || item.read) return;
    showLiveNotice(item.title, item.text);
  }, [latest, enabled]);
}
