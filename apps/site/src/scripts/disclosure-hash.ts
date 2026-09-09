/** Reveal a linked story, including details enclosing or contained by its target. */
export function openDisclosureForHash(hashId: string): boolean {
  if (!hashId || typeof document === 'undefined') return false;

  let id: string;
  try {
    id = decodeURIComponent(hashId.startsWith('#') ? hashId.slice(1) : hashId);
  } catch {
    return false;
  }
  if (!id) return false;

  const target = document.getElementById(id);
  const disclosure =
    target?.closest<HTMLDetailsElement>('details') ??
    target?.querySelector<HTMLDetailsElement>('details');
  if (!target || !disclosure) return false;

  // Nested stories must also reveal every enclosing disclosure to become readable.
  let current: HTMLDetailsElement | null = disclosure;
  while (current) {
    current.open = true;
    current = current.parentElement?.closest<HTMLDetailsElement>('details') ?? null;
  }

  const allowMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // "instant" overrides any CSS smooth scrolling when reduced motion is requested.
  target.scrollIntoView({ behavior: allowMotion ? 'smooth' : 'instant', block: 'nearest' });
  return true;
}

/** Native links and details work without this enhancement. Returns a listener cleanup. */
export function initDisclosureHash(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return () => {};

  function handleCurrentHash(): void {
    openDisclosureForHash(window.location.hash);
  }

  function handleSameHashClick(event: MouseEvent): void {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !(event.target instanceof Element)
    ) {
      return;
    }

    const anchor = event.target.closest<HTMLAnchorElement>('a[href]');
    if (
      !anchor ||
      anchor.hasAttribute('download') ||
      (anchor.target && anchor.target.toLowerCase() !== '_self')
    ) {
      return;
    }

    const destination = new URL(anchor.href, window.location.href);
    const current = window.location;
    if (
      destination.origin === current.origin &&
      destination.pathname === current.pathname &&
      destination.search === current.search &&
      destination.hash &&
      destination.hash === current.hash &&
      openDisclosureForHash(destination.hash)
    ) {
      // A repeated fragment does not fire hashchange; also avoid a second native scroll.
      event.preventDefault();
    }
  }

  window.addEventListener('hashchange', handleCurrentHash);
  document.addEventListener('click', handleSameHashClick);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleCurrentHash, { once: true });
  } else {
    handleCurrentHash();
  }

  return () => {
    window.removeEventListener('hashchange', handleCurrentHash);
    document.removeEventListener('click', handleSameHashClick);
    document.removeEventListener('DOMContentLoaded', handleCurrentHash);
  };
}

if (typeof window !== 'undefined') initDisclosureHash();
