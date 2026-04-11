/**
 * Section entrance animations (fade-up on scroll).
 * Use `1` or `true` to enable, `0` or `false` to disable (content visible immediately).
 */
export const ENABLE_ENTRANCE_ANIMATIONS: 0 | 1 | boolean = false;

export function entranceAnimationsEnabled(): boolean {
  const v = ENABLE_ENTRANCE_ANIMATIONS;
  return v === true || v === 1;
}
