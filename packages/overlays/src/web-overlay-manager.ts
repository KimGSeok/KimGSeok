const stack: HTMLElement[] = [];
const original = new Map<HTMLElement, { inert: boolean; ariaHidden: string | null }>();
let originalOverflow = '';
let guarding = false;

const focusableSelector = 'button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

function remember(element: HTMLElement) {
  if (!original.has(element)) original.set(element, { inert: element.inert, ariaHidden: element.getAttribute('aria-hidden') });
}

function restore(element: HTMLElement) {
  const state = original.get(element); if (!state) return;
  element.inert = state.inert;
  if (state.ariaHidden === null) element.removeAttribute('aria-hidden'); else element.setAttribute('aria-hidden', state.ariaHidden);
}

function syncIsolation() {
  const top = stack.at(-1); const topBackdrop = top?.parentElement;
  for (const child of Array.from(document.body.children)) {
    if (!(child instanceof HTMLElement)) continue;
    remember(child);
    if (child === topBackdrop) restore(child);
    else { child.inert = true; child.setAttribute('aria-hidden', 'true'); }
  }
  document.dispatchEvent(new CustomEvent('kg-overlay-stack-change', { detail: { top } }));
}

function containFocus(event: FocusEvent) {
  if (guarding) return;
  const top = stack.at(-1); const target = event.target;
  if (!top || !(target instanceof Node) || top.contains(target)) return;
  guarding = true;
  (top.querySelector<HTMLElement>(focusableSelector) ?? top).focus();
  guarding = false;
}

export function registerOverlay(panel: HTMLElement) {
  if (stack.length === 0) { originalOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; document.addEventListener('focusin', containFocus); }
  stack.push(panel); syncIsolation();
  return () => {
    const index = stack.lastIndexOf(panel); const wasTop = index === stack.length - 1;
    if (index >= 0) stack.splice(index, 1);
    if (stack.length) syncIsolation();
    else {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('focusin', containFocus);
      original.forEach((_state, element) => restore(element));
      original.clear();
    }
    return wasTop;
  };
}

export function getOverlayCount() { return stack.length; }
