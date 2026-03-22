"use client";

import * as React from "react";

export default function CopyNpmCta({ command }: { command: string }) {
  const [copied, setCopied] = React.useState(false);

  const copy = () => {
    void navigator.clipboard.writeText(command).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex w-full max-w-[400px] flex-col gap-[12px] sm:flex-row sm:items-stretch">
      <label className="sr-only" htmlFor="npm-install-cmd">
        npm install command
      </label>
      <input
        id="npm-install-cmd"
        readOnly
        value={command}
        className="min-h-[48px] min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-[18px] font-mono text-[13px] text-zinc-100 outline-none ring-orange-500/30 focus-visible:ring-2"
      />
      <button
        type="button"
        onClick={copy}
        className="shrink-0 rounded-full bg-[#ff6a1a] px-[28px] py-[12px] text-[14px] font-semibold text-white shadow-[0_8px_24px_rgba(255,106,26,0.35)] transition hover:bg-[#ff8533] active:scale-[0.98]"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
