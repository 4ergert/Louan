import { lvl_1 } from '../../lvl/lvl_1.js';
import { lvl_2 } from '../../lvl/lvl-2.js';

/** Session storage key for the currently selected level id. */
const currentLevelStorageKey = 'loco.currentLevel';

/** Session storage key controlling whether the intro/start screen should be skipped. */
const skipStartScreenStorageKey = 'loco.skipStartScreen';

/**
 * Returns the persisted level id for the current browser session.
 *
 * @returns {string} The selected level id, defaulting to `'lvl_1'`.
 */
export function getSelectedLevelId() {
  return sessionStorage.getItem(currentLevelStorageKey) ?? 'lvl_1';
}

/**
 * Persists the selected level id for the current browser session.
 *
 * @param {string} levelId - The level id that should be restored later.
 * @returns {void}
 */
export function setSelectedLevelId(levelId) {
  sessionStorage.setItem(currentLevelStorageKey, levelId);
}

/**
 * Resolves the selected level id to the corresponding level instance.
 *
 * @returns {import('../../models/lvl.class.js').LVL} The selected level configuration.
 */
export function getSelectedLevel() {
  return getSelectedLevelId() === 'lvl_2' ? lvl_2 : lvl_1;
}

/**
 * Indicates whether the current session should bypass the intro/start screen flow.
 *
 * @returns {boolean} True when the start screen should be skipped.
 */
export function shouldSkipStartScreen() {
  return sessionStorage.getItem(skipStartScreenStorageKey) === 'true';
}

/**
 * Persists whether the intro/start screen should be skipped for the current session.
 *
 * @param {boolean} shouldSkip - Whether to skip the intro/start screen on the next load.
 * @returns {void}
 */
export function setSkipStartScreen(shouldSkip) {
  if (shouldSkip) {
    sessionStorage.setItem(skipStartScreenStorageKey, 'true');
    return;
  }

  sessionStorage.removeItem(skipStartScreenStorageKey);
}