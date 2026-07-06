import { isCharacterWithinBossSlashRange } from '../../colliding-objects.js';

/**
 * Main world loop and update orchestration methods.
 */
export const worldLoopMethods = {
  /**
   * Assigns the current world instance to all objects that need it.
   *
   * @returns {void}
   */
  setWorld() {
    this.assignWorld(this.character);
    this.assignWorld(this.throwableObjects);
    this.assignWorldToAll(this.lvl.enemies);
    this.assignWorldToAll(this.lvl.environmentObjects);
  },

  /**
   * @returns {boolean}
   */
  isCharacterWithinBossSlashRange() {
    return isCharacterWithinBossSlashRange.call(this);
  },

  /**
   * Assigns the world reference to a drawable object.
   *
   * @param {{ world?: * } | null | undefined} drawableObject
   * @returns {void}
   */
  assignWorld(drawableObject) {
    if (drawableObject) drawableObject.world = this;
  },

  /**
   * Assigns the world reference to each object in a collection.
   *
   * @param {Array<*>} drawableObjects
   * @returns {void}
   */
  assignWorldToAll(drawableObjects) {
    drawableObjects.forEach((drawableObject) => this.assignWorld(drawableObject));
  },

  /**
   * Starts the animation frame loop.
   *
   * @returns {void}
   */
  startLoop() {
    this.frameRequestId = requestAnimationFrame((timestamp) => this.runFrame(timestamp));
  },

  /**
   * Processes one animation frame.
   *
   * @param {number} timestamp
   * @returns {void}
   */
  runFrame(timestamp) {
    if (!this.lastFrameTime) this.lastFrameTime = timestamp;

    const delta = Math.min(timestamp - this.lastFrameTime, 100);
    this.lastFrameTime = timestamp;
    this.accumulatedTime += delta;
    this.updateFrameState();
    this.runFixedUpdates();
    this.draw();
    this.frameRequestId = requestAnimationFrame((nextTimestamp) => this.runFrame(nextTimestamp));
  },

  /**
   * Runs fixed-timestep updates until the accumulated time is consumed.
   *
   * @returns {void}
   */
  runFixedUpdates() {
    while (this.accumulatedTime >= this.updateStepMs) {
      this.updateStep();
      this.accumulatedTime -= this.updateStepMs;
    }
  },

  /**
   * Updates frame-scoped state before fixed updates run.
   *
   * @returns {void}
   */
  updateFrameState() {
    this.updateOpeningIntro();
    this.updateBossIntro();
    this.handleIntroSkip();
  },

  /**
   * Runs one fixed simulation step.
   *
   * @returns {void}
   */
  updateStep() {
    this.updateObjects();
    this.updateCollisions();
  },

  /**
   * Advances all step-based world objects.
   *
   * @returns {void}
   */
  updateObjects() {
    this.character.updateStep();
    this.alia?.updateStep();
    this.throwableObjects.updateStep();
    this.updateObjectGroup(this.lvl.enemies);
    this.updateObjectGroup(this.lvl.environmentObjects);
    this.updateObjectGroup(this.thrownBones);
    this.updateObjectGroup(this.bossThrownSwords);
  },

  /**
   * Advances each object in the provided group when it supports step updates.
   *
   * @param {Array<*>} objects
   * @returns {void}
   */
  updateObjectGroup(objects) {
    objects.forEach((object) => object.updateStep?.());
  },
};
