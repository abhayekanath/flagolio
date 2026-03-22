"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/lib/utils";
import { PackageDocs, type PkgInfo } from "./PackageDocs";

export default function DocumentationDialog({
  pkg,
  triggerClassName,
}: {
  pkg: PkgInfo;
  triggerClassName?: string;
}) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    void import("@/scripts/lenis").then(({ lenis }) => {
      if (cancelled) return;
      if (open) lenis.stop();
      else lenis.start();
    });
    return () => {
      cancelled = true;
      void import("@/scripts/lenis").then(({ lenis }) => lenis.start());
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          id="docs-modal-open"
          className={cn(
            "h-auto min-h-0 p-0 text-[14px] font-normal underline underline-offset-[4px]",
            triggerClassName,
          )}
          aria-haspopup="dialog"
        >
          Documentation
        </Button>
      </DialogTrigger>
      <DialogContent
        data-lenis-prevent=""
        className="flex h-[min(88vh,832px)] max-h-[min(88vh,832px)] w-[min(704px,calc(100vw-24px))] max-w-[min(704px,calc(100vw-24px))] flex-col gap-0 overflow-hidden border-border p-0 shadow-xl sm:max-w-[min(704px,calc(100vw-24px))]"
      >
        <DialogHeader className="shrink-0 space-y-0 border-b border-border bg-muted/50 px-[16px] py-[12px] text-left sm:px-[20px]">
          <DialogTitle className="text-[16px] font-semibold leading-none">Documentation</DialogTitle>
        </DialogHeader>
        <ScrollArea className="min-h-0 flex-1">
          <div data-lenis-prevent="">
            <PackageDocs pkg={pkg} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
