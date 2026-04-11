/**
 * Section entrance animations (fade-up when blocks enter the viewport).
 * Use `1` or `true` to enable site-wide, `0` or `false` to disable (content visible immediately).
 * The fixed header/nav always keeps its scroll-down transition (background, links, logo) in Layout.astro.
 */
export const ENABLE_ENTRANCE_ANIMATIONS: 0 | 1 | boolean = false;

export function entranceAnimationsEnabled(): boolean {
  const v = ENABLE_ENTRANCE_ANIMATIONS;
  return v === true || v === 1;
}
