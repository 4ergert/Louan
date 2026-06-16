class LVL {
  enemies;
  platformObjects;
  environmentObjects;
  backgroundObjects;
  worldSettings;

  constructor(enemies, platformObjects, environmentObjects, backgroundObjects, worldSettings = {}) {
    this.enemies = enemies;
    this.platformObjects = platformObjects;
    this.environmentObjects = environmentObjects;
    this.backgroundObjects = backgroundObjects;
    this.worldSettings = worldSettings;
  }
}