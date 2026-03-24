"use client";

import * as React from "react";

function formatStarCount(n: number): string {
  if (n >= 10_000) return `${Math.round(n / 1000)}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

export default function GitHubStarsLink({
  repoFullName,
  repoUrl,
}: {
  repoFullName: string;
  repoUrl: string;
}) {
  const [count, setCount] = React.useState<number | null>(null);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    const ac = new AbortController();
    void (async () => {
      try {
        const res = await fetch(`https://api.github.com/repos/${repoFullName}`, {
          signal: ac.signal,
          headers: { Accept: "application/vnd.github+json" },
        });
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as { stargazers_count?: number };
        if (typeof data.stargazers_count === "number") {
          setCount(data.stargazers_count);
        }
      } catch {
        if (!ac.signal.aborted) setFailed(true);
      }
    })();
    return () => ac.abort();
  }, [repoFullName]);

  const stargazersUrl = `${repoUrl.replace(/\/$/, "")}/stargazers`;
  const label =
    count != null
      ? `${formatStarCount(count)} GitHub stars`
      : failed
        ? "GitHub stars unavailable"
        : "Loading GitHub stars";

  return (
    <a
      href={stargazersUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-[6px] rounded-full border border-white/15 bg-white/6 px-[10px] py-[5px] text-[12px] font-medium tabular-nums text-zinc-300 transition hover:border-white/25 hover:bg-white/9 hover:text-white"
      aria-label={label}
    >
      <i className="bx bx-star text-[15px] leading-none text-amber-400" aria-hidden="true" />
      <span>{count != null ? formatStarCount(count) : failed ? "—" : "…"}</span>
    </a>
  );
}
