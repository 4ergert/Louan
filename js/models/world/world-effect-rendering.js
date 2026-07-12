import { createBloodSplatterParticles, createFireflyParticle, createFireflyParticles } from '../../world-effects.js';
import { drawBloodSplatter, drawFireflies } from '../../world-render-effects.js';

/**
 * Ambient and combat effect rendering methods.
 */
export const worldEffectRenderingMethods = {
  /**
   * Updates and draws the active blood splatter particles.
   *
   * @returns {void}
   */
  drawBloodSplatter() {
    if (this.bloodSplatterParticles.length === 0) return;

    this.bloodSplatterParticles = drawBloodSplatter(
      this.ctx,
      this.camera_x,
      this.bloodSplatterParticles,
      Date.now()
    );
  },

  /**
   * Updates and draws ambient fireflies for the visible world area.
   *
   * @returns {void}
   */
  drawFireflies() {
    let fireflyBoundaryY = this.getFireflyBoundaryY();

    if (fireflyBoundaryY <= 32) return;

    this.ensureFireflyParticles(fireflyBoundaryY);
    this.updateFireflyParticles(fireflyBoundaryY);
  },

  /**
   * Lazily creates the ambient firefly particle collection for the visible area.
   *
   * @param {number} fireflyBoundaryY
   * @returns {void}
   */
  ensureFireflyParticles(fireflyBoundaryY) {
    if (this.fireflyParticles.length > 0) return;

    this.fireflyParticles = createFireflyParticles(
      this.camera_x,
      this.canvas.width,
      fireflyBoundaryY,
      22
    );
  },

  /**
   * Updates and redraws the active firefly particle collection.
   *
   * @param {number} fireflyBoundaryY
   * @returns {void}
   */
  updateFireflyParticles(fireflyBoundaryY) {
    this.fireflyParticles = drawFireflies(
      this.ctx,
      this.camera_x,
      this.fireflyParticles,
      Date.now(),
      this.canvas.width,
      fireflyBoundaryY,
      createFireflyParticle
    );
  },

  /**
   * Computes the lower vertical spawn and movement boundary for fireflies.
   *
   * @returns {number}
   */
  getFireflyBoundaryY() {
    let visiblePlatforms = this.lvl.platformObjects.filter((platform) =>
      this.isHorizontallyVisible(platform.x, platform.width, 220)
    );

    if (visiblePlatforms.length === 0) return Math.floor(this.canvas.height * 0.72);

    return Math.max(...visiblePlatforms.map((platform) => platform.y - 18));
  },

  /**
   * Spawns a burst of blood particles near the character toward the boss.
   *
   * @returns {void}
   */
  spawnBloodSplatter() {
    let characterArea = this.character.getCollisionArea();
    let originX = characterArea.x + characterArea.width / 2;
    let originY = characterArea.y + characterArea.height / 3;
    let direction = this.bossLVL1.x < this.character.x ? 1 : -1;
    let particles = createBloodSplatterParticles(originX, originY, direction, Date.now());

    this.bloodSplatterParticles.push(...particles);
  },
};