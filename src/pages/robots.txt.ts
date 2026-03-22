import type { APIRoute } from "astro";

/** Dynamic robots.txt so the sitemap URL always matches `site` in astro.config. */
export const GET: APIRoute = ({ site }) => {
  const lines = ["User-agent: *", "Allow: /", ""];
  if (site) {
    const base = site.href.endsWith("/") ? site.href : `${site.href}/`;
    const sitemapUrl = new URL("sitemap-index.xml", base).href;
    lines.push(`Sitemap: ${sitemapUrl}`);
  }
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
