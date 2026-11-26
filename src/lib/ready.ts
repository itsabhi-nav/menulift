/** Coordinates the page entrance: the preloader marks the page ready, sections wait for it. */
type W = Window & { __mlReady?: boolean };

export function markReady() {
  const w = window as W;
  if (w.__mlReady) return;
  w.__mlReady = true;
  window.dispatchEvent(new Event("ml:ready"));
}

export function onReady(cb: () => void) {
  const w = window as W;
  if (w.__mlReady) {
    cb();
    return () => {};
  }
  const h = () => cb();
  window.addEventListener("ml:ready", h, { once: true });
  return () => window.removeEventListener("ml:ready", h);
}
