import { MovableObject } from '../objects/movable-object.class.js';
import { LVL_2_BOSS_SPRITES } from '../../sprites-path/lvl-2-boss-sprites.js';

export class LVL_2_Boss extends MovableObject {
  height = 500;
  width = 500;
  y = -10;
  x = 4200;
  speed = 0.15;
  imgDirectionChange = true;
  isBoss = true;
  maxEnergy = 5;
  energy = 5;
  isDying = false;
  isDead = false;
  isSlashing = false;
  isSlashAnimationActive = false;
  slashHitTriggered = false;
  animationElapsed = 0;
  animationSpeed = 100;
  deathDuration = 1200;

  IDLE = LVL_2_BOSS_SPRITES.IDLE_ANIMATION;
  WALKING = LVL_2_BOSS_SPRITES.WALK_ANIMATION;
  SLASHING = LVL_2_BOSS_SPRITES.SLASHING_ANIMATION;

  constructor() {
    super();
    this.loadImage(this.IDLE[0]);
    this.loadImages(this.IDLE);
    this.loadImages(this.WALKING);
    this.loadImages(this.SLASHING);
    this.animationFrames = this.IDLE;
  }

  /**
   * @returns {string[]}
   */
  getDefaultAnimation() {
    return this.canWalkLeft() ? this.WALKING : this.IDLE;
  }

  /**
   * @returns {void}
   */
  updateStep() {
    if (this.isWorldPaused()) return;

    this.updateMovementStep();
    this.updateAnimationStep();
  }

  /**
   * @returns {void}
   */
  updateMovementStep() {
    if (!this.canWalkLeft()) return;

    this.x -= this.speed;
  }

  /**
   * @returns {boolean}
   */
  canWalkLeft() {
    if (!this.world || this.isWorldPaused()) return false;
    if (this.world.character?.isDying || this.world.character?.isDead) return false;
    if (!this.world.bossIntroTriggered || this.world.isBossIntroActive?.()) return false;
    if (this.isDying || this.isDead) return false;
    return !this.isSlashAnimationActive;
  }

  /**
   * @returns {void}
   */
  updateAnimationStep() {
    if (!this.shouldAdvanceTimedStep('animationElapsed', this.animationSpeed)) return;

    if (this.isDying) {
      this.showAnimationFrame(this.IDLE, false);
      return;
    }

    if (this.isSlashAnimationActive) {
      let frameIndex = this.showAnimationFrame(this.SLASHING, false);

      if (!this.slashHitTriggered && frameIndex >= 4) {
        this.slashHitTriggered = true;
        this.world?.handleBossSlashHit?.();
      }

      if (this.currentImage >= this.SLASHING.length - 1) this.finishSlashAnimation();
      return;
    }

    this.animationFrames = this.getDefaultAnimation();
    this.showAnimationFrame(this.animationFrames, true);
  }

  /**
   * @param {boolean} isSlashing
   * @returns {void}
   */
  setSlashingState(isSlashing) {
    if (this.isDying || this.isDead) return;

    if (isSlashing) {
      this.startSlashAnimation();
      return;
    }

    if (!this.isSlashing && !this.isSlashAnimationActive) return;

    this.isSlashing = false;
    this.isSlashAnimationActive = false;
    this.slashHitTriggered = false;
    this.animationFrames = this.getDefaultAnimation();
    this.currentImage = 0;
  }

  /**
   * @returns {void}
   */
  startSlashAnimation() {
    if (this.isSlashAnimationActive || this.isDying || this.isDead) return;

    this.isSlashing = true;
    this.isSlashAnimationActive = true;
    this.slashHitTriggered = false;
    this.animationFrames = this.SLASHING;
    this.currentImage = 0;
  }

  /**
   * @returns {void}
   */
  finishSlashAnimation() {
    if (this.isDying || this.isDead) return;

    let shouldKeepSlashing = this.world?.isCharacterWithinBossSlashRange?.() || false;
    this.isSlashing = shouldKeepSlashing;
    this.isSlashAnimationActive = shouldKeepSlashing;
    this.slashHitTriggered = false;
    this.animationFrames = shouldKeepSlashing ? this.SLASHING : this.getDefaultAnimation();
    this.currentImage = 0;
  }

  /**
   * @returns {void}
   */
  setIdleState() {
    if (this.isDying || this.isDead) return;

    this.isSlashing = false;
    this.isSlashAnimationActive = false;
    this.slashHitTriggered = false;
    this.animationFrames = this.IDLE;
    this.currentImage = 0;
  }

  /**
   * @returns {boolean}
   */
  hit() {
    if (this.isDying || this.isDead) return false;

    this.energy = Math.max(0, this.energy - 1);
    if (this.energy > 0) return false;

    this.die();
    return true;
  }

  /**
   * @returns {number}
   */
  die() {
    if (this.isDying || this.isDead) return this.deathDuration;

    this.isDying = true;
    this.isSlashing = false;
    this.isSlashAnimationActive = false;
    this.slashHitTriggered = false;
    this.currentImage = 0;
    setTimeout(() => this.isDead = true, this.deathDuration);
    return this.deathDuration;
  }

  /**
   * @returns {{ x: number, y: number, width: number, height: number, offsetY: number }}
   */
  getCollisionArea() {
    return {
      x: this.x + 180,
      y: this.y + 230,
      width: this.width - 350,
      height: this.height - 260,
      offsetY: 0,
    };
  }
}
