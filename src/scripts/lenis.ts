import Lenis from "lenis";

export const lenis = new Lenis({
  autoRaf: true,
  smoothWheel: true,
  lerp: 0.085,
  allowNestedScroll: true,
});
