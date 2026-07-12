/**
 * @typedef {Object} FlyingPickupFrame
 * @property {number} progress
 * @property {number} drawX
 * @property {number} drawY
 */

/**
 * HUD pickup animation rendering methods.
 */
export const worldPickupRenderingMethods = {
  /**
   * Draws and advances coin pickups that fly toward the HUD counter.
   *
   * @returns {void}
   */
  drawFlyingCoinPickups() {
    this.flyingCoinPickups = this.drawFlyingPickups(
      this.flyingCoinPickups,
      this.coinsBar.x + this.coinsBar.width / 2,
      this.coinsBar.y + this.coinsBar.height / 2,
      () => this.coinsBar.addCoin(1)
    );
  },

  /**
   * Draws and advances bone pickups that fly toward the throwable HUD counter.
   *
   * @returns {void}
   */
  drawFlyingBonePickups() {
    this.flyingBonePickups = this.drawFlyingPickups(
      this.flyingBonePickups,
      this.throwableObjects.x + this.throwableObjects.width / 2,
      this.throwableObjects.y + this.throwableObjects.height / 2,
      () => this.throwableObjects.addBone(1)
    );
  },

  /**
   * Animates and draws pickups flying toward a HUD target.
   *
   * @param {Array<*>} pickups
   * @param {number} targetCenterX
   * @param {number} targetCenterY
   * @param {() => void} onPickupComplete
   * @returns {Array<*>}
   */
  drawFlyingPickups(pickups, targetCenterX, targetCenterY, onPickupComplete) {
    if (pickups.length === 0) return pickups;

    const now = Date.now();

    return pickups.filter((pickup) => {
      const { progress, drawX, drawY } = this.getFlyingPickupFrame(
        pickup,
        targetCenterX,
        targetCenterY,
        now
      );

      this.ctx.drawImage(pickup.img, drawX, drawY, pickup.width, pickup.height);

      if (progress < 1) return true;

      onPickupComplete();
      return false;
    });
  },

  /**
   * Computes the draw position and progress for a flying pickup frame.
   *
   * @param {{ startX: number, startY: number, startedAt: number, duration: number }} pickup
   * @param {number} targetCenterX
   * @param {number} targetCenterY
   * @param {number} now
   * @returns {FlyingPickupFrame}
   */
  getFlyingPickupFrame(pickup, targetCenterX, targetCenterY, now) {
    const progress = Math.min((now - pickup.startedAt) / pickup.duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    return {
      progress,
      drawX: pickup.startX + (targetCenterX - pickup.startX) * easedProgress,
      drawY: pickup.startY + (targetCenterY - pickup.startY) * easedProgress,
    };
  },

  /**
   * Queues a bone pickup for HUD flight animation.
   *
   * @param {{ img: CanvasImageSource, x: number, y: number, width: number, height: number }} bone
   * @returns {void}
   */
  queueFlyingBonePickup(bone) {
    this.flyingBonePickups.push(this.createFlyingPickup(bone));
  },

  /**
   * Queues a coin pickup for HUD flight animation.
   *
   * @param {{ img: CanvasImageSource, x: number, y: number, width: number, height: number }} coin
   * @returns {void}
   */
  queueFlyingCoinPickup(coin) {
    this.flyingCoinPickups.push(this.createFlyingPickup(coin));
  },

  /**
   * Creates the animation payload for a pickup flying into the HUD.
   *
   * @param {{ img: CanvasImageSource, x: number, y: number, width: number, height: number }} object
   * @returns {{ img: CanvasImageSource, startX: number, startY: number, width: number, height: number, startedAt: number, duration: number }}
   */
  createFlyingPickup(object) {
    return {
      img: object.img,
      startX: object.x + this.camera_x,
      startY: object.y,
      width: object.width,
      height: object.height,
      startedAt: Date.now(),
      duration: 350,
    };
  },
};