import { drawBossLifeBar } from '../../world-render-effects.js';

/**
 * Rendering-related world mixin methods.
 */
export const worldRenderingMethods = {
  /**
   * Renders one full world frame in layer order.
   *
   * @returns {void}
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBackgrounds();
    this.drawWorldLayer();
    this.drawFireflies();
    this.drawHudLayer();
    this.drawOverlayLayer();
    this.drawBloodSplatter();
  },

  /**
   * Draws all world-space gameplay objects using the active camera offset.
   *
   * @returns {void}
   */
  drawWorldLayer() {
    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.lvl.platformObjects);
    this.addObjectsToMap(this.lvl.environmentObjects);
    this.addObjectsToMap(this.lvl.enemies);
    this.addObjectsToMap(this.thrownBones);
    this.addObjectsToMap(this.bossThrownSwords);
    this.addToMap(this.character);
    if (this.alia) this.addToMap(this.alia);
    if (this.liam) this.addToMap(this.liam);

    this.ctx.translate(-this.camera_x, 0);
  },

  /**
   * Draws HUD elements and animated pickups in screen space.
   *
   * @returns {void}
   */
  drawHudLayer() {
    this.addToMap(this.lifeBar);
    if (this.shouldShowBossLifeBar()) drawBossLifeBar(this.ctx, this.camera_x, this.bossLVL1, this.canvas);
    this.addToMap(this.coinsBar);
    this.addToMap(this.throwableObjects);
    this.drawFlyingCoinPickups();
    this.drawFlyingBonePickups();
  },

  /**
   * Determines whether the boss life bar should be visible.
   *
   * @returns {boolean}
   */
  shouldShowBossLifeBar() {
    return this.bossIntroTriggered && !this.isBossIntroActive() && this.bossLVL1 && !this.bossLVL1.isDead;
  },

  /**
   * Draws parallax background objects for the current frame.
   *
   * @returns {void}
   */
  drawBackgrounds() {
    this.lvl.backgroundObjects.forEach((background) => {
      const offsetX = this.camera_x * background.parallaxFactor;

      this.ctx.save();
      this.ctx.translate(offsetX, 0);
      this.addToMap(background);
      this.ctx.restore();
    });
  },
};
