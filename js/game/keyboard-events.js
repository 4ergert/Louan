import { gameState } from './state.js';

/**
 * @typedef {object} KeyboardEventActions
 * @property {ReturnType<import('../dialog.js').createDialogController>} dialogController - Dialog API used to block shortcuts while dialogs are open.
 * @property {() => void | Promise<void>} toggleGameCanvasFullscreen - Toggles fullscreen mode for the game canvas.
 * @property {() => void} restartGame - Restarts the current game session.
 * @property {(levelId: string) => void} startLevel - Starts the requested level.
 * @property {() => void} showStartScreen - Transitions from the intro prompt to the start screen.
 * @property {() => void} startGameTransition - Starts the transition from the start screen into gameplay.
 */

// Maps browser key values to the internal keyboard state properties.
const keyboardStateByKey = {
  ArrowLeft: 'LEFT',
  ArrowUp: 'UP',
  ArrowRight: 'RIGHT',
  ArrowDown: 'DOWN',
  d: 'D',
  D: 'D',
  ' ': 'SPACE',
  Control: 'CTRL',
  a: 'A',
  A: 'A',
  f: 'F',
  F: 'F',
};

/**
 * Registers global keyboard listeners for menu shortcuts, transitions, and gameplay input state.
 *
 * @param {KeyboardEventActions} actions - External actions invoked by keyboard shortcuts.
 * @returns {void}
 */
export function initKeyboardEvents({
  dialogController,
  toggleGameCanvasFullscreen,
  restartGame,
  startLevel,
  showStartScreen,
  startGameTransition,
}) {
  window.addEventListener('keydown', (event) => {
    handleKeyDown(event, {
      dialogController,
      toggleGameCanvasFullscreen,
      restartGame,
      startLevel,
      showStartScreen,
      startGameTransition,
    });
  });

  window.addEventListener('keyup', handleKeyUp);
}

/**
 * Handles keydown events by processing shortcuts before updating gameplay input state.
 *
 * @param {KeyboardEvent} event - The browser keyboard event.
 * @param {KeyboardEventActions} actions - External actions invoked by keyboard shortcuts.
 * @returns {void}
 */
function handleKeyDown(event, actions) {
  if (handleGlobalShortcuts(event, actions)) return;
  if (handleGameFlowShortcuts(event, actions)) return;

  setMovementKeyState(event.key, true);
}

/**
 * Handles keyup events by clearing the matching gameplay input state.
 *
 * @param {KeyboardEvent} event - The browser keyboard event.
 * @returns {void}
 */
function handleKeyUp(event) {
  setMovementKeyState(event.key, false);
}

/**
 * Handles shortcuts that are available regardless of the current game flow state.
 *
 * @param {KeyboardEvent} event - The browser keyboard event.
 * @param {KeyboardEventActions} actions - External actions invoked by keyboard shortcuts.
 * @returns {boolean} True when the event was fully handled.
 */
function handleGlobalShortcuts(event, { toggleGameCanvasFullscreen, dialogController }) {
  if (event.key === 'F11') {
    event.preventDefault();
    toggleGameCanvasFullscreen();
    return true;
  }

  return dialogController.isMetaDialogOpen();
}

/**
 * Handles flow-specific shortcuts like intro progression, retry, and level advancement.
 *
 * @param {KeyboardEvent} event - The browser keyboard event.
 * @param {KeyboardEventActions} actions - External actions invoked by keyboard shortcuts.
 * @returns {boolean} True when the event was fully handled.
 */
function handleGameFlowShortcuts(event, { restartGame, startLevel, showStartScreen, startGameTransition }) {
  if (handleGameOverShortcut(restartGame)) return true;

  if (handleVictoryShortcut(startLevel)) return true;

  if (handleIntroShortcut(showStartScreen)) return true;

  if (handleStartScreenShortcut(event, startGameTransition)) return true;

  return false;
}

/**
 * Handles the retry shortcut after a game over once the retry prompt is available.
 *
 * @param {() => void} restartGame - Restarts the current game session.
 * @returns {boolean} True when the shortcut was handled.
 */
function handleGameOverShortcut(restartGame) {
  if (!(gameState.world?.character?.isDead && gameState.world.isGameOverRetryReady?.())) return false;

  restartGame();
  return true;
}

/**
 * Handles the shortcut that advances to the next level after the victory prompt appears.
 *
 * @param {(levelId: string) => void} startLevel - Starts the requested level.
 * @returns {boolean} True when the shortcut was handled.
 */
function handleVictoryShortcut(startLevel) {
  if (!(gameState.world?.victoryOverlayVisible && gameState.world.isVictoryPromptReady?.())) return false;

  startLevel('lvl_2');
  return true;
}

/**
 * Handles the shortcut that dismisses the intro prompt and opens the start screen.
 *
 * @param {() => void} showStartScreen - Transitions from the intro prompt to the start screen.
 * @returns {boolean} True when the shortcut was handled.
 */
function handleIntroShortcut(showStartScreen) {
  if (!gameState.isIntroVisible) return false;

  showStartScreen();
  return true;
}

/**
 * Handles the spacebar shortcut that starts the transition from the start screen into gameplay.
 *
 * @param {KeyboardEvent} event - The browser keyboard event.
 * @param {() => void} startGameTransition - Starts the transition into gameplay.
 * @returns {boolean} True when the shortcut was handled.
 */
function handleStartScreenShortcut(event, startGameTransition) {
  if (!(gameState.isStartScreenVisible && event.key === ' ')) return false;

  event.preventDefault();
  gameState.keyboard.SPACE = true;
  startGameTransition();
  return true;
}

/**
 * Maps a browser key value onto the internal keyboard state object.
 *
 * @param {string} key - The `KeyboardEvent.key` value to map.
 * @param {boolean} isPressed - Whether the key should be marked as pressed.
 * @returns {void}
 */
function setMovementKeyState(key, isPressed) {
  const keyboardProperty = keyboardStateByKey[key];

  if (!keyboardProperty) return;

  gameState.keyboard[keyboardProperty] = isPressed;
}