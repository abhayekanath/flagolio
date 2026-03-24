/**
 * Canonical URL for the current path, respecting `site` when it includes a subpath
 * (avoids `new URL("/", "https://host/repo")` resolving to `https://host/`).
 */
export function resolveCanonicalUrl(site: URL, pathname: string): URL {
  const base = site.href.endsWith("/") ? site.href : `${site.href}/`;
  const path = pathname === "/" ? "." : pathname.replace(/^\//, "");
  return new URL(path, base);
}

/** JSON-LD for the home / library landing page */
export function buildHomeJsonLd(opts: {
  siteUrl: string;
  name: string;
  description: string;
  version: string;
  license: string;
  codeRepository?: string;
}) {
  const { siteUrl, name, description, version, license, codeRepository } = opts;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name,
      description,
      inLanguage: "en",
    },
    {
      "@type": "SoftwareSourceCode",
      "@id": `${siteUrl}/#software`,
      name,
      description,
      url: siteUrl,
      version,
      license: `https://spdx.org/licenses/${license}.html`,
      programmingLanguage: ["TypeScript"],
      runtimePlatform: "Node.js",
      ...(codeRepository ? { codeRepository } : {}),
    },
  ];
  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
