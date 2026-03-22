import gsap from "gsap";

import "./lenis";

type Tab = "4x3" | "1x1" | "rounded";

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
  if (p === "1x1" || p === "rounded") return p;
  return "4x3";
}

function setUrl(tab: Tab) {
  const path = window.location.pathname || "/";
  const next =
    tab === "4x3" ? path : `${path}?tab=${encodeURIComponent(tab)}`;
  window.history.replaceState(null, "", next);
}

function applyThumb(
  thumb: HTMLElement,
  img: HTMLImageElement,
  tab: Tab,
  src4: string,
  src1: string,
  srcRound: string,
) {
  thumb.className = "thumb";
  if (tab === "4x3") {
    thumb.classList.add("thumb--4x3");
    img.src = src4;
  } else if (tab === "1x1") {
    thumb.classList.add("thumb--1x1");
    img.src = src1;
  } else {
    thumb.classList.add("thumb--round");
    img.src = srcRound;
  }
}

function applyAllThumbs(tab: Tab) {
  document.querySelectorAll(".card").forEach((card) => {
    const el = card as HTMLElement;
    const src4 = el.getAttribute("data-href-4x3");
    const src1 = el.getAttribute("data-href-1x1");
    const srcRound = el.getAttribute("data-href-round");
    const thumb = el.querySelector(".thumb");
    const img = el.querySelector("img");
    if (
      !(thumb instanceof HTMLElement) ||
      !(img instanceof HTMLImageElement) ||
      !src4 ||
      !src1 ||
      !srcRound
    )
      return;
    applyThumb(thumb, img, tab, src4, src1, srcRound);
  });
}

function updateTabUI(tab: Tab) {
  for (const r of tabRadios) {
    r.checked = r.value === tab;
  }
  const labelId =
    tab === "4x3" ? "tab-4x3" : tab === "1x1" ? "tab-1x1" : "tab-rounded";
  grid?.setAttribute("aria-labelledby", labelId);
}

let firstTabApply = true;
let activeTab: Tab | null = null;

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
}

form?.addEventListener("submit", (e) => {
  e.preventDefault();
});

form?.addEventListener("change", (e) => {
  const t = e.target;
  if (t instanceof HTMLInputElement && t.name === "aspect") {
    const v = t.value;
    if (v === "4x3" || v === "1x1" || v === "rounded") setTab(v, true);
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

let floatCode = "";

function showFlagFloat(code: string) {
  floatCode = code;
  if (flagFloatValue) flagFloatValue.textContent = code;
  flagFloat?.classList.remove("hidden");
  flagFloat?.setAttribute("aria-hidden", "false");
  flagFloat?.classList.remove("is-copied");
}

function hideFlagFloat() {
  flagFloat?.classList.add("hidden");
  flagFloat?.setAttribute("aria-hidden", "true");
  floatCode = "";
  flagFloat?.classList.remove("is-copied");
}

grid?.addEventListener("click", (e) => {
  const card = (e.target as Element).closest(".card");
  if (!card || !(card instanceof HTMLElement)) return;
  if (card.hidden) return;
  const code = card.dataset.code;
  if (!code) return;
  e.preventDefault();
  showFlagFloat(code);
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

