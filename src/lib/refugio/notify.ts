import { dropPushSubscription, pushPublicKey, savePushSubscription } from "@/lib/refugio/push.server";

export async function askNoticePermission() {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

function keyBytes(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (value.length % 4)) % 4);
  const raw = atob(padded);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

export async function enablePushNotices(): Promise<{ ok: boolean; message: string }> {
  if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator)) {
    return { ok: false, message: "Este aparelho não aceita aviso na tela." };
  }
  const allowed = await askNoticePermission();
  if (!allowed) return { ok: false, message: "O celular bloqueou o aviso. Libere nas configurações do navegador." };
  const reg = await navigator.serviceWorker.ready;
  if (!reg.pushManager) return { ok: false, message: "Instale o Refúgio na tela inicial para o aviso chegar com o app fechado." };
  const { publicKey } = await pushPublicKey();
  if (!publicKey) return { ok: false, message: "O aviso ainda não ligou. Tente de novo em um minuto." };
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: keyBytes(publicKey),
  });
  const json = sub.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys.auth) {
    return { ok: false, message: "O celular não entregou o endereço do aviso." };
  }
  const saved = await savePushSubscription({ data: { endpoint: json.endpoint, p256dh: json.keys.p256dh, auth: json.keys.auth } });
  if (!saved.ok) return saved;
  return { ok: true, message: "Avisos ligados. Quando sua carta receber energia ou conselho, o celular avisa." };
}

export async function disablePushNotices() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager?.getSubscription();
  const endpoint = sub?.endpoint;
  await sub?.unsubscribe();
  if (endpoint) await dropPushSubscription({ data: { endpoint } });
}

export function showLiveNotice(title: string, body: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  const icon = "/icons/brand-v5-192.png";
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
