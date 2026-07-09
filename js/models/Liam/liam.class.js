import { MovableObject } from '../objects/movable-object.class.js';
import { LIAM_SPRITES } from './liam.sprites.js';

/**
 * Companion NPC that can idle, speak during intros, and chase the heroes in the ending.
 */
export class Liam extends MovableObject {

  world;
  speed = 3;
  hasLanded = false;
  currentAnimation = null;
  animationElapsed = 0;
  animationIntervalMs = 50;

  IDLE = LIAM_SPRITES.IDLE_ANIMATION;
  WALK = LIAM_SPRITES.WALK_ANIMATION;

  /**
   * @param {number} x Initial horizontal position.
   * @param {number} y Initial vertical position.
   */
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.loadImage(LIAM_SPRITES.IDLE_ANIMATION[0]);
    this.loadImages(this.IDLE);
    this.loadImages(this.WALK);
    this.applyGravity();
  }

  /**
   * @returns {void}
   */
  updateStep() {
    super.updateStep();
    this.updateEndingChaseStep();
    this.lookAtCharacter();
    this.updateAnimationStep();
  }

  /**
   * @returns {void}
   */
  updateEndingChaseStep() {
    if (!this.world?.endingLiamChaseActive) return;
    if (this.isWorldPaused()) return;

    this.x += this.speed;
    this.imgDirectionChange = false;
  }

  /**
   * @returns {void}
   */
  updateAnimationStep() {
    if (!this.shouldAdvanceTimedStep('animationElapsed', this.animationIntervalMs)) return;

    this.playAnimation(this.world?.endingLiamChaseActive ? this.WALK : this.IDLE);
  }

  /**
   * Flips Liam's sprite so he always faces the player character.
   *
   * @returns {void}
   */
  lookAtCharacter() {
    if (this.world?.endingLiamChaseActive) {
      this.imgDirectionChange = false;
      return;
    }

    if (!this.world?.character) return;

    this.imgDirectionChange = this.world.character.x < this.x;
  }

  /**
   * Reports whether Liam has settled into his idle pose on the ground.
   *
   * @returns {boolean}
   */
  isIdleForIntro() {
    return this.hasLanded && !this.isAboveGround();
  }

  /**
   * @param {string[]} images
   * @returns {void}
   */
  playAnimation(images) {
    this.resetAnimationSequence(images);
    this.showAnimationFrame(images);
  }
}