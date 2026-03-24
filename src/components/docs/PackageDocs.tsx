import type { ReactNode } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export interface PkgInfo {
  name: string;
  license: string;
}

function CodeBlock({ children, className }: { children: string; className?: string }) {
  return (
    <pre
      className={cn(
        "overflow-x-auto rounded-[8px] border border-border bg-muted/50 p-[12px] text-[13px] leading-snug shadow-sm",
        className,
      )}
    >
      <code className="font-mono">{children}</code>
    </pre>
  );
}

function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded border border-border bg-muted px-[6px] py-[2px] font-mono text-[12px] text-foreground">
      {children}
    </code>
  );
}

export function PackageDocs({ pkg }: { pkg: PkgInfo }) {
  const n = pkg.name;

  const codeNamed = `import { ad, ae, af, us, es_ct, _as } from "${n}";

<img src={us} alt="" width={120} height={80} />`;

  const codeHelpers = `import { flagAssetUrl, getFlagPath, FLAG_CODES, isFlagCode } from "${n}";

flagAssetUrl("us", "square");
getFlagPath("de", "round");`;

  const codeImport = `import url from "${n}/svg/default/us.svg?url";`;

  const codeCss = `<i class="flag us" role="img" aria-label="United States"></i>
<i class="flag square us" role="img" aria-label="United States"></i>
<i class="flag round us" role="img" aria-label="United States"></i>`;

  return (
    <section className="px-[16px] py-[20px] sm:px-[20px]" aria-labelledby="docs-title">
      <h2 id="docs-title" className="mt-0 text-[17px] font-semibold tracking-tight">
        Install
      </h2>
      <p className="mb-[10px] text-[13px] leading-relaxed text-muted-foreground">
        Pick your package manager:
      </p>
      <Tabs defaultValue="npm" className="mb-[20px] w-full">
        <TabsList className="h-auto w-full flex-wrap justify-start gap-[4px] sm:w-fit">
          <TabsTrigger value="npm" className="px-[12px] text-[13px]">
            npm
          </TabsTrigger>
          <TabsTrigger value="yarn" className="px-[12px] text-[13px]">
            yarn
          </TabsTrigger>
          <TabsTrigger value="pnpm" className="px-[12px] text-[13px]">
            pnpm
          </TabsTrigger>
        </TabsList>
        <TabsContent value="npm" className="mt-[10px]">
          <CodeBlock className="mb-0">{`npm install ${n}`}</CodeBlock>
        </TabsContent>
        <TabsContent value="yarn" className="mt-[10px]">
          <CodeBlock className="mb-0">{`yarn add ${n}`}</CodeBlock>
        </TabsContent>
        <TabsContent value="pnpm" className="mt-[10px]">
          <CodeBlock className="mb-0">{`pnpm add ${n}`}</CodeBlock>
        </TabsContent>
      </Tabs>

      <h2 className="mb-[8px] text-[17px] font-semibold tracking-tight">Usage</h2>
      <p className="mb-[10px] text-[13px] text-muted-foreground">
        Flag ids follow <strong className="font-medium text-foreground">ISO 3166-1 alpha-2</strong> (two-letter codes, with extra segments for subdivisions and special entries). Each id is a named export (default wide SVG URL). Hyphens become underscores (
        <InlineCode>es-ct</InlineCode> → <InlineCode>es_ct</InlineCode>). Reserved words get a leading underscore (
        <InlineCode>as</InlineCode> → <InlineCode>_as</InlineCode>).
      </p>
      <CodeBlock className="mb-[16px]">{codeNamed}</CodeBlock>

      <p className="mb-[8px] text-[13px] font-medium text-foreground">Other ratios &amp; Node paths</p>
      <CodeBlock className="mb-[16px]">{codeHelpers}</CodeBlock>

      <p className="mb-[8px] text-[13px] font-medium text-foreground">Bundler import</p>
      <CodeBlock className="mb-[16px]">{codeImport}</CodeBlock>

      <h2 className="mb-[8px] text-[17px] font-semibold tracking-tight">Ratios</h2>
      <ul className="mb-[16px] list-inside list-disc space-y-[6px] text-[13px] text-muted-foreground">
        <li>
          <InlineCode>default</InlineCode> → <InlineCode>svg/default/</InlineCode> (wide) — also exposed as named exports
        </li>
        <li>
          <InlineCode>square</InlineCode> → <InlineCode>svg/square/</InlineCode>
        </li>
        <li>
          <InlineCode>round</InlineCode> → <InlineCode>svg/round/</InlineCode>
        </li>
      </ul>

      <h2 className="mb-[8px] text-[17px] font-semibold tracking-tight">CSS icons (this site)</h2>
      <p className="mb-[10px] text-[13px] text-muted-foreground">
        <InlineCode>flag</InlineCode> + id; add <InlineCode>square</InlineCode> or <InlineCode>round</InlineCode> for other assets.
        Scales with <InlineCode>font-size</InlineCode>.
      </p>
      <CodeBlock className="mb-[16px]">{codeCss}</CodeBlock>

      <p className="text-[12px] leading-relaxed text-muted-foreground">
        License: <strong className="text-foreground">{pkg.license}</strong> · More detail in{" "}
        <InlineCode>flags/README.md</InlineCode>
      </p>
    </section>
  );
}
