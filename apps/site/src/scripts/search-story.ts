/**
 * Home problem section: plays the illustrated search story once when it scrolls into view.
 * The server renders the finished scene (`data-step="done"`), so without JavaScript or with
 * reduced motion the visitor sees every beat at once. Steps: 1 search → 2 doubt → 3 leave.
 */
const BEATS: ReadonlyArray<readonly [step: string, at: number]> = [
  ['1', 0],
  ['2', 2100],
  ['3', 3900],
  ['done', 6000],
];

const story = document.querySelector<HTMLElement>('[data-search-story]');
const figure = story?.querySelector<HTMLElement>('.search-story');
const reduced =
  document.documentElement.dataset.motion === 'off' ||
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (story && figure && !reduced && 'IntersectionObserver' in window) {
  story.dataset.step = '0';

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      for (const [step, at] of BEATS) {
        window.setTimeout(() => {
          story.dataset.step = step;
        }, at);
      }
    },
    { threshold: 0.5 },
  );

  observer.observe(figure);
}
