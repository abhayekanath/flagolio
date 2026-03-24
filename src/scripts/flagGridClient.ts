import gsap from "gsap";

import "./lenis";

type Tab = "default" | "square" | "rounded";

const grid = document.getElementById("grid");
const form = document.getElementById("flag-toolbar");
const filter = document.getElementById("filter");
const tabRadios = Array.from(
  document.querySelectorAll<HTMLInputElement>('input[name="aspect"]'),
);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
  .matches;

function tabFromUrl(): Tab {
  const p = new URLSearchParams(window.location.search).get("tab");
  if (p === "square" || p === "1x1") return "square";
  if (p === "rounded" || p === "round") return "rounded";
  if (p === "default" || p === "4x3") return "default";
  return "default";
}

function escapeHtmlAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

/** Matches PackageDocs / `flagIconCss`: default, `flag square`, or `flag round` + code. */
function buildFlagIconMarkup(code: string, label: string, tab: Tab): string {
  const classes =
    tab === "default"
      ? `flag ${code}`
      : tab === "square"
        ? `flag square ${code}`
        : `flag round ${code}`;
  return `<i class="${classes}" role="img" aria-label="${escapeHtmlAttr(label)}"></i>`;
}

function setUrl(tab: Tab) {
  const path = window.location.pathname || "/";
  const next =
    tab === "default" ? path : `${path}?tab=${encodeURIComponent(tab)}`;
  window.history.replaceState(null, "", next);
}

function applyThumb(
  thumb: HTMLElement,
  img: HTMLImageElement,
  tab: Tab,
  srcDefault: string,
  srcSquare: string,
  srcRound: string,
) {
  thumb.className = "thumb";
  if (tab === "default") {
    thumb.classList.add("thumb--default");
    img.src = srcDefault;
  } else if (tab === "square") {
    thumb.classList.add("thumb--square");
    img.src = srcSquare;
  } else {
    thumb.classList.add("thumb--round");
    img.src = srcRound;
  }
}

function applyAllThumbs(tab: Tab) {
  document.querySelectorAll(".card").forEach((card) => {
    const el = card as HTMLElement;
    const srcDefault = el.getAttribute("data-href-default");
    const srcSquare = el.getAttribute("data-href-square");
    const srcRound = el.getAttribute("data-href-round");
    const thumb = el.querySelector(".thumb");
    const img = el.querySelector("img");
    if (
      !(thumb instanceof HTMLElement) ||
      !(img instanceof HTMLImageElement) ||
      !srcDefault ||
      !srcSquare ||
      !srcRound
    )
      return;
    applyThumb(thumb, img, tab, srcDefault, srcSquare, srcRound);
  });
}

function updateTabUI(tab: Tab) {
  for (const r of tabRadios) {
    r.checked = r.value === tab;
  }
  const labelId =
    tab === "default"
      ? "tab-default"
      : tab === "square"
        ? "tab-square"
        : "tab-rounded";
  grid?.setAttribute("aria-labelledby", labelId);
}

let firstTabApply = true;
let activeTab: Tab | null = null;

/** When set, the code float is showing this flag — markup updates if aspect tab changes. */
let floatCtx: { code: string; label: string } | null = null;
let floatCode = "";

let activeCardEl: HTMLElement | null = null;

function setActiveCard(card: HTMLElement) {
  if (activeCardEl && activeCardEl !== card) {
    activeCardEl.classList.remove("card--active");
    activeCardEl.removeAttribute("aria-current");
  }
  activeCardEl = card;
  card.classList.add("card--active");
  card.setAttribute("aria-current", "true");
}

function setTab(tab: Tab, animate: boolean) {
  if (activeTab === tab && !firstTabApply) {
    return;
  }
  activeTab = tab;

  updateTabUI(tab);
  setUrl(tab);

  const runApply = () => {
    applyAllThumbs(tab);
  };

  if (!grid || firstTabApply || reduceMotion || !animate) {
    runApply();
    firstTabApply = false;
    return;
  }

  gsap.to(grid, {
    opacity: 0,
    y: 6,
    duration: 0.22,
    ease: "power2.in",
    onComplete: () => {
      runApply();
      gsap.fromTo(
        grid,
        { opacity: 0, y: 6 },
        {
          opacity: 1,
          y: 0,
          duration: 0.34,
          ease: "power2.out",
        },
      );
    },
  });
}

const cards = grid ? Array.from(grid.querySelectorAll(".card")) : [];

function applyFilter() {
  if (!(form instanceof HTMLFormElement)) return;
  const fd = new FormData(form);
  const q = String(fd.get("q") ?? "")
    .trim()
    .toLowerCase();
  const cont = String(fd.get("continent") ?? "ALL");
  for (const card of cards) {
    const el = card as HTMLElement;
    const code = (el.dataset.code ?? "").toLowerCase();
    const name = (el.dataset.name ?? "").toLowerCase();
    const cCont = el.dataset.continent ?? "";
    const searchOk = !q || code.includes(q) || name.includes(q);
    const continentOk = cont === "ALL" || cCont === cont;
    const show = searchOk && continentOk;
    el.hidden = !show;
  }
  if (activeCardEl?.hidden) {
    activeCardEl.classList.remove("card--active");
    activeCardEl.removeAttribute("aria-current");
    activeCardEl = null;
  }
}

form?.addEventListener("submit", (e) => {
  e.preventDefault();
});

form?.addEventListener("change", (e) => {
  const t = e.target;
  if (t instanceof HTMLInputElement && t.name === "aspect") {
    const v = t.value;
    if (v === "default" || v === "square" || v === "rounded") {
      setTab(v, true);
      const ff = document.getElementById("flag-code-float");
      const fv = document.getElementById("flag-code-float-value");
      if (floatCtx && ff && !ff.classList.contains("hidden")) {
        const tabNow = activeTab ?? "default";
        floatCode = buildFlagIconMarkup(floatCtx.code, floatCtx.label, tabNow);
        if (fv) fv.textContent = floatCode;
      }
    }
    return;
  }
  if (t instanceof HTMLSelectElement && t.name === "continent") {
    applyFilter();
  }
});

filter?.addEventListener("input", applyFilter);

setTab(tabFromUrl(), false);
applyFilter();

/* Flag card click → bottom-center floating code + copy */
const flagFloat = document.getElementById("flag-code-float");
const flagFloatValue = document.getElementById("flag-code-float-value");
const flagFloatCopy = document.getElementById("flag-code-float-copy");
const flagFloatDismiss = document.getElementById("flag-code-float-dismiss");

function showFlagFloat(code: string, label: string, tab: Tab) {
  floatCtx = { code, label };
  floatCode = buildFlagIconMarkup(code, label, tab);
  if (flagFloatValue) flagFloatValue.textContent = floatCode;
  flagFloat?.classList.remove("hidden");
  flagFloat?.setAttribute("aria-hidden", "false");
  flagFloat?.classList.remove("is-copied");
}

function hideFlagFloat() {
  floatCtx = null;
  flagFloat?.classList.add("hidden");
  flagFloat?.setAttribute("aria-hidden", "true");
  floatCode = "";
  flagFloat?.classList.remove("is-copied");
}

function openCard(card: HTMLElement) {
  if (card.hidden) return;
  const code = card.dataset.code;
  if (!code) return;
  const label = card.dataset.label ?? code;
  setActiveCard(card);
  const tab = activeTab ?? tabFromUrl();
  showFlagFloat(code, label, tab);
}

grid?.addEventListener("click", (e) => {
  const card = (e.target as Element).closest(".card");
  if (!card || !(card instanceof HTMLElement)) return;
  e.preventDefault();
  openCard(card);
});

grid?.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const card = (e.target as Element).closest(".card");
  if (!card || !(card instanceof HTMLElement)) return;
  e.preventDefault();
  openCard(card);
});

flagFloatCopy?.addEventListener("click", async (e) => {
  e.stopPropagation();
  if (!floatCode) return;
  try {
    await navigator.clipboard.writeText(floatCode);
    flagFloat?.classList.add("is-copied");
    window.setTimeout(() => flagFloat?.classList.remove("is-copied"), 1600);
  } catch {
    /* ignore */
  }
});

flagFloatDismiss?.addEventListener("click", (e) => {
  e.stopPropagation();
  hideFlagFloat();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && flagFloat && !flagFloat.classList.contains("hidden")) {
    hideFlagFloat();
  }
});
