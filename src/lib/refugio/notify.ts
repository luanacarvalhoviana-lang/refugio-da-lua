export async function askNoticePermission() {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function showLiveNotice(title: string, body: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  const icon = "/icons/brand-v3-192.png";
  const options: NotificationOptions = { body, icon, badge: icon, tag: "refugio-lua", lang: "pt-BR" };
  if (navigator.serviceWorker?.controller) {
    void navigator.serviceWorker.ready
      .then((reg) => reg.showNotification(title, options))
      .catch(() => {
        try {
          new Notification(title, options);
        } catch {
          /* Safari private */
        }
      });
    return;
  }
  try {
    new Notification(title, options);
  } catch {
    /* ignore */
  }
}
