function motionIsAllowed(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    document.documentElement.dataset.motion !== 'off' &&
    (typeof window.matchMedia !== 'function' ||
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  );
}

function targetNeedsPositioning(target: HTMLElement): boolean {
  const bounds = target.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  return bounds.top < 0 || bounds.bottom > viewportHeight;
}

/** Reveal a linked story, including details enclosing or contained by its target. */
export function openDisclosureForHash(hashId: string, preserveVisiblePosition = true): boolean {
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

  if (!preserveVisiblePosition || targetNeedsPositioning(target)) {
    target.scrollIntoView({ behavior: motionIsAllowed() ? 'smooth' : 'auto', block: 'nearest' });
  }
  return true;
}

/** Native links and details work without this enhancement. Returns a listener cleanup. */
export function initDisclosureHash(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return () => {};

  function handleCurrentHash(): void {
    openDisclosureForHash(window.location.hash);
  }

  function handlePageShow(): void {
    // Let the browser keep a restored reading position when the target is already visible.
    openDisclosureForHash(window.location.hash, true);
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

    let destination: URL;
    try {
      destination = new URL(anchor.href, window.location.href);
    } catch {
      return;
    }
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
  window.addEventListener('pageshow', handlePageShow);
  document.addEventListener('click', handleSameHashClick);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleCurrentHash, { once: true });
  } else {
    handleCurrentHash();
  }

  return () => {
    window.removeEventListener('hashchange', handleCurrentHash);
    window.removeEventListener('pageshow', handlePageShow);
    document.removeEventListener('click', handleSameHashClick);
    document.removeEventListener('DOMContentLoaded', handleCurrentHash);
  };
}

if (typeof window !== 'undefined') initDisclosureHash();
