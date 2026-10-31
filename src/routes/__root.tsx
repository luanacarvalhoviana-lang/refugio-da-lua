import { createRootRoute, HeadContent, Outlet, Scripts, useRouterState } from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "@/lib/auth/provider";
import { ForgetLocalAccounts } from "@/components/refugio/forget-local-accounts";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const APP_NAME = "Refúgio da Lua";

const THEME_BOOT = `(function(){try{var r=localStorage.getItem("refugio-session");if(!r)return;var d=JSON.parse(r);var t=(d&&d.state&&d.state.theme)||(d&&d.theme);if(t==="night"||t==="day"){document.documentElement.setAttribute("data-theme",t);document.documentElement.style.colorScheme=t==="night"?"dark":"light";}}catch(e){}})();`;

function Visits() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return <Analytics path={path} route={path} />;
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Refúgio da Lua — romance e mistério" },
      { name: "theme-color", content: "#0c3442" },
      { name: "description", content: "Cinco histórias entre mulheres: Passageira, Correspondência, Jantar com a Minha Ex, Corredor e Depoimento. Romance e mistério. A escolha é de graça." },
      { name: "robots", content: "index, follow" },
      { property: "og:url", content: "https://www.refugiodalua.com.br/" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: APP_NAME },
      { name: "mobile-web-app-capable", content: "yes" },
    ],
    links: [
      { rel: "canonical", href: "https://www.refugiodalua.com.br/" },
      { rel: "alternate", hrefLang: "pt-BR", href: "https://www.refugiodalua.com.br/" },
      { rel: "alternate", hrefLang: "es-419", href: "https://www.refugiodalua.com.br/es" },
      { rel: "alternate", hrefLang: "en", href: "https://www.refugiodalua.com.br/en" },
      { rel: "alternate", hrefLang: "x-default", href: "https://www.refugiodalua.com.br/" },
      { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/icons/brand-v5-192.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/icons/brand-v5-180.png" },
      { rel: "preload", href: "/icons/brand-v5-512.png", as: "image", type: "image/png" },
    ],
  }),
  component: () => (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <ForgetLocalAccounts />
          <Outlet />
        </AuthProvider>
        <Scripts />
        <Visits />
      </body>
    </html>
  ),
});
