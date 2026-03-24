"use client";

import * as React from "react";

import { PackageDocs, type PkgInfo } from "@/components/docs/PackageDocs";
import { cn } from "@/lib/utils";

import CopyNpmCta from "./CopyNpmCta";

type Tab = "home" | "docs";

function TabBtn({
  id,
  selected,
  onSelect,
  children,
  ariaLabel,
}: {
  id: Tab;
  selected: boolean;
  onSelect: (t: Tab) => void;
  children: React.ReactNode;
  /** Accessible name when the visible label is abbreviated (e.g. “Docs”). */
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      id={`left-tab-${id}`}
      aria-selected={selected}
      aria-controls={`left-panel-${id}`}
      aria-label={ariaLabel}
      tabIndex={selected ? 0 : -1}
      onClick={() => onSelect(id)}
      className={cn(
        "tabs__tab rounded-[7px] border-none",
        selected &&
          "bg-muted font-semibold text-foreground shadow-sm hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export default function HomeLeftNavTabs({
  docPkg,
  installCmd,
  flagCount,
  pkgDescription,
}: {
  docPkg: PkgInfo;
  installCmd: string;
  flagCount: number;
  pkgDescription: string;
}) {
  const [tab, setTab] = React.useState<Tab>("home");

  React.useEffect(() => {
    let cancelled = false;
    void import("@/scripts/lenis").then(({ lenis }) => {
      if (cancelled) return;
      if (tab === "docs") lenis.stop();
      else lenis.start();
    });
    return () => {
      cancelled = true;
      void import("@/scripts/lenis").then(({ lenis }) => lenis.start());
    };
  }, [tab]);

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <header className="mb-[28px] w-full shrink-0 text-zinc-100" aria-label="Site">
        <div className="flex flex-col gap-[14px]">
          <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[10px]">
            <div className="flex shrink-0 items-center gap-[10px]">
              <a
                href="/"
                className="flex shrink-0 items-center gap-[8px] text-[18px] font-bold tracking-tight text-white"
                aria-label="flagolio home"
              >
                <img
                  src="/logo.svg"
                  alt=""
                  width={32}
                  height={32}
                  className="size-[32px] shrink-0 rounded-[8px]"
                  aria-hidden="true"
                />
              </a>
              <span
                className="inline-flex items-center rounded-full border border-amber-400/25 bg-amber-400/10 px-[9px] py-[4px] text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-300/95"
                title="Public beta — APIs and assets may change"
              >
                Beta
              </span>
            </div>

            <nav
              className="tabs ml-auto min-w-0 flex-1 sm:flex-initial"
              role="tablist"
              aria-label="Navigation"
            >
              <TabBtn id="home" selected={tab === "home"} onSelect={setTab}>
                Home
              </TabBtn>
              <TabBtn
                id="docs"
                selected={tab === "docs"}
                onSelect={setTab}
                ariaLabel="Documentation"
              >
                Documentation
              </TabBtn>
            </nav>
          </div>
        </div>
      </header>

      <div className="min-h-0 min-w-0 flex-1">
        <div
          id="left-panel-home"
          role="tabpanel"
          aria-labelledby="left-tab-home"
          hidden={tab !== "home"}
          className={tab !== "home" ? "hidden" : "min-w-0"}
        >
          <div className="min-w-0">
            <p className="mb-[16px] text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-400">
              ISO 3166-1 alpha-2 flags
            </p>
            <h1
              id="home-title"
              className="max-w-[18ch] text-[clamp(32px,5vw,48px)] font-bold leading-[1.08] tracking-[-0.03em] text-white"
            >
              Let&apos;s ship crisp flags everywhere - on every screen.
            </h1>
            <p className="mt-[20px] max-w-[42ch] text-[15px] leading-relaxed text-zinc-400">
              {pkgDescription}
            </p>

            <div className="mt-[28px]">
              <CopyNpmCta command={installCmd} />
            </div>

            <p className="mt-[20px] flex flex-wrap items-center gap-[8px] text-[13px] text-zinc-500">
              <span className="text-amber-400" aria-hidden="true">
                ★★★★★
              </span>
              <span>
                MIT · ESM · {flagCount}+ flags
              </span>
            </p>
          </div>
        </div>

        <div
          id="left-panel-docs"
          role="tabpanel"
          aria-labelledby="left-tab-docs"
          hidden={tab !== "docs"}
          data-lenis-prevent=""
          className={cn(
            tab !== "docs" && "hidden",
            tab === "docs" &&
              "docs-in-left-panel h-full overflow-y-auto overflow-x-hidden rounded-[12px] border border-white/10 bg-zinc-900/40 pb-4 [scrollbar-gutter:stable]",
          )}
        >
          <div className="[&_.text-muted-foreground]:text-zinc-500 [&_.text-foreground]:text-zinc-100 [&_.border-border]:border-white/10 [&_h2]:text-white [&_h3]:text-zinc-100">
            <PackageDocs pkg={docPkg} />
          </div>
        </div>
      </div>
    </div>
  );
}
