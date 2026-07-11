import { hasPendingReloadLoading, setPendingReloadLoading } from './level-session.js';

/**
 * Activates the persistent loading overlay and reloads the page.
 *
 * @returns {void}
 */
export function reloadWithLoadingOverlay() {
  const overlay = document.getElementById('transitionOverlay');

  setPendingReloadLoading(true);
  document.documentElement.classList.add('page-loading');
  document.body?.classList.add('page-loading');
  overlay?.style.removeProperty('opacity');
  overlay?.setAttribute('aria-hidden', 'false');
  window.location.reload();
}

/**
 * Mirrors the persisted reload-loading state into the current DOM.
 *
 * @returns {void}
 */
export function syncReloadLoadingOverlay() {
  const isLoading = hasPendingReloadLoading();
  const overlay = document.getElementById('transitionOverlay');

  document.documentElement.classList.toggle('page-loading', isLoading);
  document.body?.classList.toggle('page-loading', isLoading);
  overlay?.style.removeProperty('opacity');
  overlay?.setAttribute('aria-hidden', isLoading ? 'false' : 'true');
}

/**
 * Hides the loading overlay and clears its persisted reload state.
 *
 * @returns {void}
 */
export function clearReloadLoadingOverlay() {
  const overlay = document.getElementById('transitionOverlay');

  setPendingReloadLoading(false);
  document.documentElement.classList.remove('page-loading');
  document.body?.classList.remove('page-loading');
  overlay?.style.removeProperty('opacity');
  overlay?.setAttribute('aria-hidden', 'true');
}

/**
 * Indicates whether the page-loading overlay should stay visually locked.
 *
 * @returns {boolean} True when the loading overlay is currently active.
 */
export function shouldHoldLoadingOverlay() {
  return document.documentElement.classList.contains('page-loading');
}
