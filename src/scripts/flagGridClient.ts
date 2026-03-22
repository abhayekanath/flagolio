import gsap from "gsap";
import Lenis from "lenis";

import { initThemeUi } from "./theme";

new Lenis({
  autoRaf: true,
  smoothWheel: true,
  lerp: 0.085,
});

type Tab = "4x3" | "1x1" | "rounded";

const grid = document.getElementById("grid");
const filter = document.getElementById("filter");
const continent = document.getElementById("continent");
const countEl = document.getElementById("count");
const tabButtons = Array.from(
  document.querySelectorAll<HTMLButtonElement>('.tabs [role="tab"]'),
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
  for (const btn of tabButtons) {
    const t = btn.dataset.tab as Tab | undefined;
    const sel = t === tab;
    btn.setAttribute("aria-selected", sel ? "true" : "false");
    btn.tabIndex = sel ? 0 : -1;
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
  const q = (filter instanceof HTMLInputElement ? filter.value : "")
    .trim()
    .toLowerCase();
  const cont =
    continent instanceof HTMLSelectElement ? continent.value : "ALL";
  let visible = 0;
  for (const card of cards) {
    const el = card as HTMLElement;
    const code = (el.dataset.code ?? "").toLowerCase();
    const name = (el.dataset.name ?? "").toLowerCase();
    const cCont = el.dataset.continent ?? "";
    const searchOk = !q || code.includes(q) || name.includes(q);
    const continentOk = cont === "ALL" || cCont === cont;
    const show = searchOk && continentOk;
    el.hidden = !show;
    if (show) visible++;
  }
  if (countEl) countEl.textContent = `${visible} shown`;
}

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const t = btn.dataset.tab;
    if (t === "4x3" || t === "1x1" || t === "rounded") {
      setTab(t, true);
    }
  });
});

filter?.addEventListener("input", applyFilter);
continent?.addEventListener("change", applyFilter);

setTab(tabFromUrl(), false);
applyFilter();
initThemeUi();
