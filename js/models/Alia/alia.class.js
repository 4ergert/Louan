import { MovableObject } from '../objects/movable-object.class.js';
import { ALIA_SPRITES } from './alia-sprites.js';

/**
 * Companion character that follows the player and switches between idle and run animations.
 */
export class Alia extends MovableObject {
  world;
  speed = 3;
  currentAnimation = null;
  maxDistanceToCharacter = 100;
  followTolerance = 8;
  hasLanded = false;
  animationElapsed = 0;
  animationIntervalMs = 60;

  IDLE = ALIA_SPRITES.IDLE_ANIMATION;
  WALK = ALIA_SPRITES.WALK_ANIMATION;
  RUN = ALIA_SPRITES.RUN_ANIMATION;

  /**
   * @param {number} x Initial horizontal position.
   * @param {number} y Initial vertical position.
   */
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.loadImage(ALIA_SPRITES.IDLE_ANIMATION[0]);
    this.loadImages(this.IDLE);
    this.loadImages(this.WALK);
    this.loadImages(this.RUN);

    this.applyGravity();
  }

  /**
   * Advances gravity, following behavior, and animation playback for one update step.
   */
  updateStep() {
    super.updateStep();
    this.tryJumpOverConfiguredGap();
    this.syncMovementSpeedWithCharacter();
    this.followCharacter();
    this.updateAnimationStep();
  }

  /**
   * Mirrors the character walk and run speed for Alia's follow movement.
   */
  syncMovementSpeedWithCharacter() {
    let character = this.world?.character;

    if (!character) return;

    if (character.currentAnimation === character.RUNNING) {
      this.speed = 3.9;
      return;
    }

    if (character.currentAnimation === character.WALKING) {
      this.speed = 0.9;
      return;
    }

    this.speed = 3;
  }

  /**
   * Starts a jump when Alia reaches a configured gap jump zone.
   */
  tryJumpOverConfiguredGap() {
    if (!this.world?.character) return;
    if (this.isWorldPaused()) return;
    if (this.isAboveGround()) return;

    let gapJumpZone = this.getActiveGapJumpZone();

    if (!gapJumpZone) return;

    this.vcY = gapJumpZone.jumpStrength ?? 6.75;
  }

  /**
   * @returns {{ jumpFromX: number, jumpToX: number, requiredCharacterX: number, jumpStrength?: number } | null}
   */
  getActiveGapJumpZone() {
    let gapJumpZones = this.world?.aliaGapJumpZones;

    if (!Array.isArray(gapJumpZones)) return null;

    return gapJumpZones.find((zone) => this.isInsideGapJumpZone(zone)) ?? null;
  }

  /**
   * @param {{ jumpFromX: number, jumpToX: number, requiredCharacterX: number }} zone
   * @returns {boolean}
   */
  isInsideGapJumpZone(zone) {
    let character = this.world?.character;

    if (!character) return false;
    if (character.x <= this.x) return false;
    if (character.x < zone.requiredCharacterX) return false;

    return this.x >= zone.jumpFromX && this.x <= zone.jumpToX;
  }

  /**
   * Advances the current animation on a timed cadence and updates the facing direction.
   */
  updateAnimationStep() {
    if (!this.shouldAdvanceTimedStep('animationElapsed', this.getAnimationIntervalMs())) return;

    this.lookAtCharacter();
    this.playAnimation(this.getAnimationForCharacterMovement());
  }

  /**
   * @returns {number}
   */
  getAnimationIntervalMs() {
    return this.world?.character?.animationIntervalMs ?? this.animationIntervalMs;
  }

  /**
   * @returns {string[]}
   */
  getAnimationForCharacterMovement() {
    let character = this.world?.character;

    if (!character) return this.IDLE;

    if (character.currentAnimation === character.RUNNING) return this.RUN;
    if (character.currentAnimation === character.WALKING) return this.WALK;

    return this.isRunningToCharacter() ? this.RUN : this.IDLE;
  }

  /**
   * Moves Alia toward the player until the preferred follow distance is restored.
   */
  followCharacter() {
    if (!this.world?.character) return;
    if (this.isWorldPaused()) return;

    let xDistance = this.world.character.x - this.x;

    if (Math.abs(xDistance) <= this.maxDistanceToCharacter) return;

    this.x += this.getFollowStep(xDistance);
  }

  /**
   * Computes the horizontal step Alia should take toward the player this frame.
   *
   * @param {number} xDistance Current horizontal distance to the player.
   * @returns {number} Signed horizontal step for this frame.
   */
  getFollowStep(xDistance) {
    let targetDistance = this.maxDistanceToCharacter - this.followTolerance;
    let direction = Math.sign(xDistance);
    let step = Math.min(Math.abs(xDistance) - targetDistance, this.speed);

    return direction * step;
  }

  /**
   * Checks whether Alia is still far enough from the player to use the running animation.
   *
   * @returns {boolean} `true` when Alia should be considered in a running follow state.
   */
  isRunningToCharacter() {
    if (!this.world?.character) return false;

    return Math.abs(this.world.character.x - this.x) > this.maxDistanceToCharacter;
  }

  /**
   * Reports whether Alia has settled into the intro idle pose on the ground.
   *
   * @returns {boolean} `true` when the intro logic should treat Alia as idle.
   */
  isIdleForIntro() {
    return this.hasLanded && !this.isAboveGround() && !this.isRunningToCharacter() && this.currentAnimation === this.IDLE;
  }

  /**
   * Flips Alia's sprite so she faces the player character.
   */
  lookAtCharacter() {
    if (!this.world?.character) return;

    this.imgDirectionChange = this.world.character.x < this.x;
  }

  /**
   * Resets the animation sequence when needed and displays the next frame.
   *
   * @param {string[]} images Animation frames to play.
   */
  playAnimation(images) {
    this.resetAnimationSequence(images);
    this.showAnimationFrame(images);
  }
}