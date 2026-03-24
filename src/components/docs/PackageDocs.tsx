import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export interface PkgInfo {
  name: string;
  license: string;
}

function CodeBlock({ children, className }: { children: string; className?: string }) {
  return (
    <pre
      className={cn(
        "mb-[12px] overflow-x-auto rounded-[8px] border border-border bg-muted/50 p-[12px] text-[13px] leading-snug shadow-sm",
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

  const codeListIds = `import { FLAG_CODES, type FlagCode } from "${n}";

// readonly tuple of ids (e.g. "us", "gb", "es-ct", "un", …)
console.log(FLAG_CODES.length);`;

  const codeIsFlag = `import { isFlagCode } from "${n}";

if (isFlagCode(code)) {
  // code is FlagCode
}`;

  const codeFlagAsset = `import { flagAssetUrl } from "${n}";

const srcDefault = flagAssetUrl("us", "default");
const srcSquare = flagAssetUrl("us", "square");
const srcRound = flagAssetUrl("us", "round");`;

  const codeReadFile = `import { readFile } from "node:fs/promises";
import { getFlagPath } from "${n}";

const svg = await readFile(getFlagPath("de", "default"), "utf8");`;

  const codeImportSvg = `import usFlag from "${n}/svg/default/us.svg";`;
  const codeImportUrl = `import usUrl from "${n}/svg/default/us.svg?url";`;
  const codeResolve = `import.meta.resolve("${n}/svg/default/us.svg");`;

  const codeClassIcons = `<!-- Default wide -->
<i class="flag us" role="img" aria-label="United States"></i>

<!-- Square -->
<i class="flag square us" role="img" aria-label="United States"></i>

<!-- Round (circle asset) -->
<i class="flag round us" role="img" aria-label="United States"></i>`;

  return (
    <section className="px-[16px] py-[24px] sm:px-[24px]" aria-labelledby="docs-title">
      <h2 id="docs-title" className="mt-0 text-[18px] font-semibold tracking-tight">
        Install
      </h2>
      <p className="mb-[12px] max-w-[768px] text-[14px] leading-relaxed text-muted-foreground">
        Add the package with your preferred client.
      </p>
      <CodeBlock>{`npm install ${n}`}</CodeBlock>
      <CodeBlock>{`yarn add ${n}`}</CodeBlock>
      <CodeBlock>{`pnpm add ${n}`}</CodeBlock>

      <Separator className="my-[24px]" />

      <h2 className="mt-[32px] text-[18px] font-semibold tracking-tight first:mt-0">Quick start</h2>

      <h3 className="mt-[20px] text-[15px] font-semibold text-foreground">List all flag ids</h3>
      <CodeBlock>{codeListIds}</CodeBlock>

      <h3 className="mt-[20px] text-[15px] font-semibold text-foreground">Check if a string is a known id</h3>
      <CodeBlock>{codeIsFlag}</CodeBlock>

      <h3 className="mt-[20px] text-[15px] font-semibold text-foreground">
        Resolve a file URL (Vite, Astro, Webpack 5, …)
      </h3>
      <p className="mb-[12px] max-w-[768px] text-[14px] leading-relaxed text-muted-foreground">
        Uses <InlineCode>import.meta.url</InlineCode> so the SVG resolves next to the published package.
      </p>
      <CodeBlock>{codeFlagAsset}</CodeBlock>
      <p className="mb-[12px] max-w-[768px] text-[14px] leading-relaxed text-muted-foreground">
        Use <InlineCode>srcDefault</InlineCode> in <InlineCode>&lt;img src=&#123;…&#125; /&gt;</InlineCode> or CSS{" "}
        <InlineCode>url(…)</InlineCode>.
      </p>

      <h3 className="mt-[20px] text-[15px] font-semibold text-foreground">Absolute path on disk (Node)</h3>
      <CodeBlock>{codeReadFile}</CodeBlock>

      <h3 className="mt-[20px] text-[15px] font-semibold text-foreground">Import SVG files directly</h3>
      <p className="mb-[12px] max-w-[768px] text-[14px] leading-relaxed text-muted-foreground">
        Subpath exports map to files under <InlineCode>flags/</InlineCode>.
      </p>
      <CodeBlock>{codeImportSvg}</CodeBlock>
      <p className="mb-[12px] max-w-[768px] text-[14px] leading-relaxed text-muted-foreground">With Vite-style asset URLs:</p>
      <CodeBlock>{codeImportUrl}</CodeBlock>
      <p className="mb-[12px] max-w-[768px] text-[14px] leading-relaxed text-muted-foreground">Resolve check:</p>
      <CodeBlock>{codeResolve}</CodeBlock>

      <Separator className="my-[24px]" />

      <h2 className="text-[18px] font-semibold tracking-tight">Aspect ratios</h2>
      <div className="my-[8px] overflow-x-auto rounded-[8px] border border-border bg-muted/30">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              <th className="border-b border-border px-[12px] py-[8px] text-left font-semibold text-muted-foreground">
                <InlineCode>FlagRatio</InlineCode>
              </th>
              <th className="border-b border-border px-[12px] py-[8px] text-left font-semibold text-muted-foreground">Folder</th>
              <th className="border-b border-border px-[12px] py-[8px] text-left font-semibold text-muted-foreground">Use case</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b border-border px-[12px] py-[8px] align-top">
                <InlineCode>&quot;default&quot;</InlineCode>
              </td>
              <td className="border-b border-border px-[12px] py-[8px] align-top">
                <InlineCode>svg/default/</InlineCode>
              </td>
              <td className="border-b border-border px-[12px] py-[8px] align-top">Default wide flag</td>
            </tr>
            <tr>
              <td className="border-b border-border px-[12px] py-[8px] align-top">
                <InlineCode>&quot;square&quot;</InlineCode>
              </td>
              <td className="border-b border-border px-[12px] py-[8px] align-top">
                <InlineCode>svg/square/</InlineCode>
              </td>
              <td className="border-b border-border px-[12px] py-[8px] align-top">Square</td>
            </tr>
            <tr>
              <td className="px-[12px] py-[8px] align-top">
                <InlineCode>&quot;round&quot;</InlineCode>
              </td>
              <td className="px-[12px] py-[8px] align-top">
                <InlineCode>svg/round/</InlineCode>
              </td>
              <td className="px-[12px] py-[8px] align-top">Circular mask in SVG</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Separator className="my-[24px]" />

      <h2 className="text-[18px] font-semibold tracking-tight">CSS class icons (this site)</h2>
      <p className="mb-[12px] max-w-[768px] text-[14px] leading-relaxed text-muted-foreground">
        Use <InlineCode>flag</InlineCode> plus the id (default wide). Add <InlineCode>square</InlineCode> for the square
        asset or <InlineCode>round</InlineCode> for the round asset. Icons scale with <InlineCode>font-size</InlineCode>{" "}
        on ancestors.
      </p>
      <CodeBlock>{codeClassIcons}</CodeBlock>
      <p className="mb-[12px] max-w-[768px] text-[14px] leading-relaxed text-muted-foreground">
        Styles are emitted at build time from the SVG assets. For accessibility, add <InlineCode>role=&quot;img&quot;</InlineCode>{" "}
        and a short <InlineCode>aria-label</InlineCode>.
      </p>

      <details className="mt-[24px] rounded-[8px] border border-border bg-muted/40 p-[12px] sm:p-[16px]">
        <summary className="cursor-pointer text-[14px] font-semibold text-foreground">Publishing (maintainers)</summary>
        <p className="mb-[12px] mt-[12px] max-w-[768px] text-[14px] leading-relaxed text-muted-foreground">
          Library output is built with <InlineCode>npm run build:flags</InlineCode>. To publish <InlineCode>{n}</InlineCode>{" "}
          to npm again, add a package manifest under <InlineCode>flags/</InlineCode> (see{" "}
          <InlineCode>flags/README.md</InlineCode>).
        </p>
        <CodeBlock>{`npm run build:flags`}</CodeBlock>
        <CodeBlock>{`npm login`}</CodeBlock>
        <CodeBlock>{`npm publish --access public`}</CodeBlock>
        <CodeBlock>{`npm pack --dry-run`}</CodeBlock>
      </details>

      <p className="mt-[32px] text-[13px] leading-relaxed text-muted-foreground">
        License: <strong className="font-semibold text-foreground">{pkg.license}</strong> · Full readme in the repo under{" "}
        <InlineCode>flags/README.md</InlineCode>
      </p>
    </section>
  );
}
