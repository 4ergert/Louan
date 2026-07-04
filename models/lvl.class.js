/**
 * @typedef {Object} LevelWorldSettings
 * @property {number} [bossTriggerX]
 * @property {number} [cameraOffsetX]
 * @property {number} [groundY]
 * @property {number} [levelEndX]
 */

/**
 * Holds all static object groups and world settings for a level.
 */
export class LVL {
  /** @type {Array<*>} */
  enemies;
  platformObjects;
  solidObjects;
  environmentObjects;
  backgroundObjects;
  /** @type {LevelWorldSettings} */
  worldSettings;

  /**
   * @param {Array<*>} enemies
   * @param {Array<*>} platformObjects
   * @param {Array<*>} solidObjects
   * @param {Array<*>} environmentObjects
   * @param {Array<*>} backgroundObjects
   * @param {LevelWorldSettings} [worldSettings={}]
   */
  constructor(enemies, platformObjects, solidObjects, environmentObjects, backgroundObjects, worldSettings = {}) {
    this.enemies = enemies;
    this.platformObjects = platformObjects;
    this.solidObjects = solidObjects;
    this.environmentObjects = environmentObjects;
    this.backgroundObjects = backgroundObjects;
    this.worldSettings = worldSettings;
  }
}