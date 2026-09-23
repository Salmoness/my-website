const TRIGGER_SELECTOR = '[data-image-inspection-trigger]';
const DIALOG_SELECTOR = '[data-image-inspection]';

interface InspectionState {
  trigger: HTMLAnchorElement | null;
  returnId: string;
  scrollX: number;
  scrollY: number;
}

function supportsModalDialog(dialog: Element | null): dialog is HTMLDialogElement {
  return (
    typeof HTMLDialogElement !== 'undefined' &&
    dialog instanceof HTMLDialogElement &&
    typeof dialog.showModal === 'function' &&
    typeof dialog.close === 'function'
  );
}

function focusReturnTarget(state: InspectionState): void {
  const fallback = state.returnId
    ? document.getElementById(state.returnId)?.querySelector<HTMLElement>('h2')
    : null;
  const target = state.trigger?.isConnected ? state.trigger : fallback;

  window.scrollTo(state.scrollX, state.scrollY);
  if (!target) return;

  const needsTemporaryTabIndex = !target.matches('a, button, input, select, textarea, [tabindex]');
  if (needsTemporaryTabIndex) target.tabIndex = -1;
  target.focus({ preventScroll: true });
  if (needsTemporaryTabIndex) {
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
  }
}

/** Enhance full-image links with one native dialog while preserving their normal href fallback. */
export function initImageInspection(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return () => {};

  const dialogCandidate = document.querySelector(DIALOG_SELECTOR);
  if (!supportsModalDialog(dialogCandidate)) return () => {};
  const dialog = dialogCandidate;

  const image = dialog.querySelector<HTMLImageElement>('[data-image-inspection-image]');
  const title = dialog.querySelector<HTMLElement>('[data-image-inspection-title]');
  const description = dialog.querySelector<HTMLElement>('[data-image-inspection-description]');
  const error = dialog.querySelector<HTMLElement>('[data-image-inspection-error]');
  const original = dialog.querySelector<HTMLAnchorElement>('[data-image-inspection-original]');
  if (!image || !title || !description || !error || !original) return () => {};
  const inspectionImage = image;
  const inspectionTitle = title;
  const inspectionDescription = description;
  const inspectionError = error;
  const originalLink = original;

  const state: InspectionState = {
    trigger: null,
    returnId: '',
    scrollX: 0,
    scrollY: 0,
  };

  function showLoadedImage(): void {
    inspectionImage.hidden = false;
    inspectionError.hidden = true;
  }

  function showLoadError(): void {
    inspectionImage.hidden = true;
    inspectionError.hidden = false;
  }

  function handleDocumentClick(event: MouseEvent): void {
    if (!(event.target instanceof Element)) return;

    if (event.target.closest('[data-image-inspection-close]')) {
      dialog.close();
      return;
    }

    const trigger = event.target.closest<HTMLAnchorElement>(TRIGGER_SELECTOR);
    if (!trigger || event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const source = trigger.href;
    if (!source) return;

    event.preventDefault();
    state.trigger = trigger;
    state.returnId = trigger.dataset.imageReturnId ?? '';
    state.scrollX = window.scrollX;
    state.scrollY = window.scrollY;

    const imageTitle = trigger.dataset.imageTitle?.trim() || 'Project image';
    const imageDescription =
      trigger.dataset.imageDescription?.trim() || trigger.textContent?.trim();
    inspectionTitle.textContent = imageTitle;
    inspectionDescription.textContent = imageDescription || 'Larger project image.';
    inspectionImage.alt = trigger.dataset.imageAlt?.trim() || inspectionDescription.textContent;
    inspectionImage.hidden = true;
    inspectionError.hidden = true;
    originalLink.href = source;
    inspectionImage.src = source;
    if (inspectionImage.complete) {
      if (inspectionImage.naturalWidth > 0) showLoadedImage();
      else showLoadError();
    }

    document.documentElement.dataset.imageInspectionOpen = 'true';
    dialog.showModal();
  }

  function handleDialogClick(event: MouseEvent): void {
    if (event.target === dialog) dialog.close();
  }

  function handleClose(): void {
    document.documentElement.removeAttribute('data-image-inspection-open');
    focusReturnTarget(state);
  }

  inspectionImage.addEventListener('load', showLoadedImage);
  inspectionImage.addEventListener('error', showLoadError);
  document.addEventListener('click', handleDocumentClick);
  dialog.addEventListener('click', handleDialogClick);
  dialog.addEventListener('close', handleClose);

  return () => {
    inspectionImage.removeEventListener('load', showLoadedImage);
    inspectionImage.removeEventListener('error', showLoadError);
    document.removeEventListener('click', handleDocumentClick);
    dialog.removeEventListener('click', handleDialogClick);
    dialog.removeEventListener('close', handleClose);
    if (dialog.open) dialog.close();
    document.documentElement.removeAttribute('data-image-inspection-open');
  };
}

if (typeof window !== 'undefined') initImageInspection();
