import { createDialogController } from './dialog.js';
import { gameMenuDialogIds } from './game/config.js';
import { initGameCanvasResizeHandling, isGameCanvasVisible, syncGameCanvasSize, toggleGameCanvasFullscreen } from './game/canvas.js';
import { initKeyboardEvents } from './game/keyboard-events.js';
import { initMusicToggle } from './game/music-toggle.js';
import { gameState } from './game/state.js';
import { restartGame, showStartScreen, startGameTransition, startLevel, startSavedLevelIfNeeded } from './game/start-flow.js';

/**
 * Shared dialog controller for the start screen and in-game menu flow.
 *
 * @type {ReturnType<typeof createDialogController>}
 */
const dialogController = createDialogController({
  gameMenuDialogIds,
  getWorld: () => gameState.world,
  isGameCanvasVisible,
});

/**
 * Bootstraps the game once the page has finished loading.
 *
 * Initializes the canvas, dialog behavior, music controls, resize handling,
 * and restores a previously selected level when needed.
 *
 * @returns {void}
 */
function init() {
  gameState.canvas = document.getElementById('gameCanvas');
  syncGameCanvasSize();
  dialogController.initDialogBackdropClose();
  dialogController.initGameMenu();
  dialogController.initStartScreenDialogs();
  initMusicToggle();
  initGameCanvasResizeHandling();
  startSavedLevelIfNeeded();
}

initKeyboardEvents({
  dialogController,
  toggleGameCanvasFullscreen,
  restartGame,
  startLevel,
  showStartScreen,
  startGameTransition,
});

window.addEventListener('load', init);