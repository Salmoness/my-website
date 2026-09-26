/**
 * Services menu: a link to one service (e.g. /services#crm) opens that service's details,
 * both on arrival and when an in-page link changes the hash. Section links are left alone.
 */
function openLinkedService(): void {
  let id = '';
  try {
    id = decodeURIComponent(window.location.hash.slice(1));
  } catch {
    return;
  }
  if (!id) return;
  const target = document.getElementById(id);
  if (!target?.matches('.svc-index__list > li')) return;
  const details = target.querySelector<HTMLDetailsElement>('details');
  if (details) details.open = true;
}

openLinkedService();
window.addEventListener('hashchange', openLinkedService);
