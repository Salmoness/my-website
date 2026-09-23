import { afterEach, describe, expect, it, vi } from 'vitest';
import { initDisclosureHash, openDisclosureForHash } from '../src/scripts/disclosure-hash';

class ElementStub {
  open = false;
  parentElement: ElementStub | null = null;
  closest = vi.fn<(selector: string) => ElementStub | null>().mockReturnValue(null);
  querySelector = vi.fn<(selector: string) => ElementStub | null>().mockReturnValue(null);
  scrollIntoView = vi.fn();
  href = '/work#story';
  target = '';
  hasAttribute = vi.fn<(name: string) => boolean>().mockReturnValue(false);
  getBoundingClientRect = vi.fn(() => ({ top: -20, bottom: 40 }));
}

function details() {
  const element = new ElementStub();
  element.closest.mockReturnValue(element);
  return element;
}

function fixture(target = new ElementStub()) {
  const media = { matches: false };
  const browser = Object.assign(new EventTarget(), {
    location: new URL('https://portfolio.example/work#story'),
    matchMedia: vi.fn(() => media),
  });
  const documentStub = {
    readyState: 'complete',
    documentElement: { dataset: { motion: 'on' }, clientHeight: 900 },
    getElementById: vi.fn<(id: string) => ElementStub | null>().mockReturnValue(target),
    addEventListener: vi.fn<(type: string, listener: (event: MouseEvent) => void) => void>(),
    removeEventListener: vi.fn(),
  };
  vi.stubGlobal('window', browser);
  vi.stubGlobal('document', documentStub);
  vi.stubGlobal('Element', ElementStub);
  return { target, media, browser, documentStub };
}

afterEach(() => vi.unstubAllGlobals());

describe('disclosure hash enhancement', () => {
  it('opens a directly linked disclosure and all enclosing disclosures', () => {
    const target = new ElementStub();
    const inner = details();
    const outer = details();
    target.closest.mockReturnValue(inner);
    inner.parentElement = outer;
    const { documentStub } = fixture(target);

    expect(openDisclosureForHash('#r%C3%A9sum%C3%A9%20%5B2026%5D')).toBe(true);
    expect(documentStub.getElementById).toHaveBeenCalledWith('résumé [2026]');
    expect(inner.open).toBe(true);
    expect(outer.open).toBe(true);
    expect(target.scrollIntoView).toHaveBeenCalledOnce();
  });

  it('ignores malformed, missing, and ordinary section targets', () => {
    const { target, documentStub } = fixture();
    for (const hash of ['', '#', '#%E0%A4%A', '#%ZZ'])
      expect(openDisclosureForHash(hash)).toBe(false);
    expect(documentStub.getElementById).not.toHaveBeenCalled();
    expect(openDisclosureForHash('#section')).toBe(false);
    documentStub.getElementById.mockReturnValue(null);
    expect(openDisclosureForHash('#missing')).toBe(false);
    expect(target.scrollIntoView).not.toHaveBeenCalled();
  });

  it('honors system and owner motion preferences', () => {
    const { target, media, documentStub } = fixture(details());
    openDisclosureForHash('#story');
    expect(target.scrollIntoView).toHaveBeenLastCalledWith({
      behavior: 'smooth',
      block: 'nearest',
    });
    media.matches = true;
    openDisclosureForHash('#story');
    expect(target.scrollIntoView).toHaveBeenLastCalledWith({
      behavior: 'auto',
      block: 'nearest',
    });
    media.matches = false;
    documentStub.documentElement.dataset.motion = 'off';
    openDisclosureForHash('#story');
    expect(target.scrollIntoView).toHaveBeenLastCalledWith({
      behavior: 'auto',
      block: 'nearest',
    });
  });

  it('preserves an already visible reading position', () => {
    const target = details();
    target.getBoundingClientRect.mockReturnValue({ top: 120, bottom: 420 });
    fixture(target);

    expect(openDisclosureForHash('#story')).toBe(true);
    expect(target.open).toBe(true);
    expect(target.scrollIntoView).not.toHaveBeenCalled();

    openDisclosureForHash('#story', false);
    expect(target.scrollIntoView).toHaveBeenCalledOnce();
  });

  it('handles initial and changed hashes and removes its listeners', () => {
    const { target, browser, documentStub } = fixture(details());
    const cleanup = initDisclosureHash();
    expect(target.open).toBe(true);
    target.open = false;
    browser.location.hash = '#another-story';
    browser.dispatchEvent(new Event('hashchange'));
    expect(documentStub.getElementById).toHaveBeenLastCalledWith('another-story');
    expect(target.open).toBe(true);
    target.open = false;
    browser.dispatchEvent(new Event('pageshow'));
    expect(target.open).toBe(true);
    cleanup();
    target.open = false;
    browser.dispatchEvent(new Event('hashchange'));
    expect(target.open).toBe(false);
    expect(documentStub.removeEventListener).toHaveBeenCalledWith('click', expect.any(Function));
  });
});
