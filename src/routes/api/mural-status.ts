import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/mural-status")({
  server: {
    handlers: {
      GET: async () => {
        const { getSql } = await import("@/lib/db");
        const sql = await getSql();
        const rows = await sql.query<{
          id: string;
          author_id: string;
          author_name: string;
          title: string;
          hidden: boolean;
          posted_at: string;
        }>(
          `select id, author_id, author_name, title, hidden, posted_at::text as posted_at
           from mural_letters
           order by posted_at desc
           limit 200`,
        );
        return Response.json({
          ok: true,
          total: rows.length,
          letters: rows.map((row) => ({
            id: row.id,
            author: row.author_name,
            seed: row.author_id === "seed",
            hidden: Boolean(row.hidden),
            postedAt: row.posted_at,
            title: row.title,
          })),
        });
      },
    },
  },
});
