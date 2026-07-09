import { DrawableObject } from './drawable-objects.class.js';

/**
 * Ground-traveling slash effect projectile used by the level 2 boss.
 */
export class BossSlashFxObject extends DrawableObject {
  img = './assets/img/Enemies/PNG/Vector Parts/SlashFX.png';
  width = 140;
  height = 140;
  speed = 6.5;
  direction = -1;
  traveledDistance = 0;
  maxDistance = 1100;
  hasHitCharacter = false;

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} direction
   */
  constructor(x, y, direction) {
    super();
    this.loadImage(this.img);
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.imgDirectionChange = direction < 0;
  }

  /**
   * @returns {void}
   */
  updateStep() {
    let horizontalStep = this.speed * this.direction;

    this.x += horizontalStep;
    this.traveledDistance += Math.abs(horizontalStep);
  }

  /**
   * @returns {boolean}
   */
  hasReturned() {
    return this.hasHitCharacter || this.traveledDistance >= this.maxDistance;
  }

  /**
   * @returns {{ x: number, y: number, width: number, height: number, offsetY: number }}
   */
  getCollisionArea() {
    return {
      x: this.x + 24,
      y: this.y + 34,
      width: this.width - 48,
      height: this.height - 68,
      offsetY: 0,
    };
  }
}