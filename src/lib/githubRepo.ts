/** `owner/repo` for api.github.com, or undefined if not a github.com URL. */
export function parseGitHubRepoFromUrl(githubWebUrl: string | undefined): string | undefined {
  if (!githubWebUrl) return undefined;
  const normalized = githubWebUrl.replace(/^git\+/, "").replace(/\.git$/i, "").split("#")[0] ?? "";
  const m = normalized.match(/github\.com\/([^/]+)\/([^/?#]+)/i);
  if (!m) return undefined;
  return `${m[1]}/${m[2]}`;
}
