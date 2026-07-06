import { baseCanvasHeight, baseCanvasWidth } from './config.js';
import { gameState } from './state.js';

/**
 * Returns the DOM container wrapping the in-game canvas and overlay controls.
 *
 * @returns {HTMLElement | null} The game canvas shell element when present.
 */
export function getGameCanvasShell() {
  return document.getElementById('gameCanvasShell');
}

/**
 * Toggles fullscreen mode for the visible game canvas shell.
 *
 * @returns {Promise<void>}
 */
export async function toggleGameCanvasFullscreen() {
  const gameCanvasShell = getGameCanvasShell();

  if (!document.fullscreenEnabled || !(gameCanvasShell instanceof HTMLElement) || !isGameCanvasVisible()) return;

  if (document.fullscreenElement === gameCanvasShell) {
    await document.exitFullscreen().catch(() => { });
    return;
  }

  await gameCanvasShell.requestFullscreen().catch(() => { });
}

/**
 * Synchronizes the canvas render size and CSS size with the current viewport state.
 *
 * Keeps the internal canvas resolution fixed and only scales the displayed size.
 * During the start transition the CSS size is left untouched so the animation can control it.
 *
 * @returns {void}
 */
export function syncGameCanvasSize() {
  if (!(gameState.canvas instanceof HTMLCanvasElement)) return;

  const isFullscreen = isGameCanvasFullscreen();

  gameState.canvas.width = baseCanvasWidth;
  gameState.canvas.height = baseCanvasHeight;

  if (gameState.isStartTransitionRunning) return;

  if (!isFullscreen) return clearCanvasInlineSize(gameState.canvas);

  applyFullscreenCanvasSize(gameState.canvas);
}

/**
 * Registers viewport listeners that keep the game canvas size in sync.
 *
 * @returns {void}
 */
export function initGameCanvasResizeHandling() {
  document.addEventListener('fullscreenchange', syncGameCanvasSize);
  window.addEventListener('resize', syncGameCanvasSize);
}

/**
 * Indicates whether the game canvas shell is currently shown.
 *
 * @returns {boolean} True when the game canvas shell is visible.
 */
export function isGameCanvasVisible() {
  const gameCanvasShell = getGameCanvasShell();
  return Boolean(gameCanvasShell && getComputedStyle(gameCanvasShell).display !== 'none');
}

function isGameCanvasFullscreen() {
  return document.fullscreenElement === getGameCanvasShell();
}

/**
 * Clears inline canvas sizing so CSS can control the non-fullscreen layout.
 *
 * @param {HTMLCanvasElement} canvas - Canvas element whose inline size should be removed.
 * @returns {void}
 */
function clearCanvasInlineSize(canvas) {
  canvas.style.removeProperty('width');
  canvas.style.removeProperty('height');
}

/**
 * Applies the computed fullscreen CSS size to the active gameplay canvas.
 *
 * @param {HTMLCanvasElement} canvas - Canvas element to resize in fullscreen.
 * @returns {void}
 */
function applyFullscreenCanvasSize(canvas) {
  const fullscreenDimensions = getFullscreenCanvasDimensions();

  canvas.style.setProperty('width', `${fullscreenDimensions.width}px`);
  canvas.style.setProperty('height', `${fullscreenDimensions.height}px`);
}

/**
 * Calculates the CSS dimensions for the fullscreen canvas while preserving aspect ratio.
 *
 * @returns {{ width: number, height: number }} The scaled fullscreen dimensions.
 */
function getFullscreenCanvasDimensions() {
  const scale = Math.min(window.innerWidth / baseCanvasWidth, window.innerHeight / baseCanvasHeight);

  return {
    width: Math.floor(baseCanvasWidth * scale),
    height: Math.floor(baseCanvasHeight * scale),
  };
}