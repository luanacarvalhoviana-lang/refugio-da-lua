import { createFileRoute } from "@tanstack/react-router";
import { readPublicTrack } from "@/lib/refugio/track-cloud";

export const Route = createFileRoute("/trilha/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { getSessionUser } = await import("@/lib/auth/verify.server");
        const user = await getSessionUser();
        const track = await readPublicTrack(params.id, user?.id);
        if (!track) return new Response(null, { status: 404 });
        const bytes = Buffer.from(track.audio, "base64");
        return new Response(bytes, {
          headers: {
            "content-type": track.mime,
            "cache-control": "private, max-age=3600",
            "content-length": String(bytes.length),
          },
        });
      },
    },
  },
});
