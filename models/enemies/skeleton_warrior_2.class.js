import { playSoundEffect } from '../../js/audio.js';
import { startKnockback } from '../character/char-animation-actions.js';
import { SkeletonEnemyBase } from './skeleton-enemy-base.class.js';
import { SKELETON_WARRIOR_2_SPRITES } from '../../js/sprites-path/skeleton-warrior-2-sprite.js';

/**
 * Skeleton enemy variant with the shared patrol behavior plus a close-range slash attack.
 */
export class SkeletonWarrior2 extends SkeletonEnemyBase {
  x = 200;
  y = 0;
  speed = 0.6;
  defaultSpeed = 0.6;
  throwSpeed = 1.8;
  moveDirection = -1;
  animationFrames = [];
  isDying = false;
  isDead = false;
  isThrownByBoss = false;
  dyingAnimationSpeed = 50;
  slashAnimationSpeed = 50;
  animationElapsed = 0;
  directionChangeRemainingMs = 0;
  isSlashing = false;
  slashHitTriggered = false;

  IDLE = SKELETON_WARRIOR_2_SPRITES.IDLE_ANIMATION;
  WALKING = SKELETON_WARRIOR_2_SPRITES.WALKING_ANIMATION;
  DYING = SKELETON_WARRIOR_2_SPRITES.DYING_ANIMATION;
  SLASHING = SKELETON_WARRIOR_2_SPRITES.SLASHING_ANIMATION;

  /**
   * @param {number} x Initial horizontal position.
   * @param {number} y Initial vertical position.
   */
  constructor(x, y) {
    super();
    this.initializePatrolEnemy(
      x,
      y,
      './assets/img/Enemies/Skeleton_Warrior_2/PNG Sequences/Idle/0_Skeleton_Warrior_Idle_000.png',
      [this.IDLE, this.WALKING, this.DYING, this.SLASHING],
      this.WALKING,
    );
  }

  /**
   * Advances physics, slashing state, patrol movement, animation, and timed direction changes.
   */
  updateStep() {
    super.updateStep();
    if (this.isWorldPaused()) return;

    this.updateSlashingState();
    this.updatePatrolStep();
    this.updateAnimationStep();
    this.updateDirectionTimer();
  }

  /**
   * Advances the active animation and triggers slash hit windows and slash completion.
   */
  updateAnimationStep() {
    let animationSpeed = this.isSlashing ? this.slashAnimationSpeed : this.dyingAnimationSpeed;

    let frameIndex = this.updateTimedAnimationStep('animationElapsed', animationSpeed, this.animationFrames, !this.isDying);
    if (frameIndex === null) return;

    if (this.isSlashing && !this.slashHitTriggered && frameIndex >= 4) this.trySlashCharacterHit();

    if (this.isSlashing && this.currentImage >= this.SLASHING.length - 1) this.finishSlashAnimation();
  }

  /**
   * Decides whether the enemy should enter, keep, or leave the slash animation state.
   */
  updateSlashingState() {
    if (!this.world || this.isDying || this.isDead) return;

    let shouldSlash = this.isCharacterWithinSlashRange();

    if (shouldSlash) return this.startSlashAnimation();

    if (!this.isSlashing) return this.animationFrames = this.WALKING;

    this.animationFrames = this.SLASHING;
  }

  /**
   * Delegates patrol movement to the shared patrol base implementation.
   */
  updatePatrolStep() {
    super.updatePatrolStep();
  }

  /**
   * Delegates timed autonomous turning to the shared patrol base implementation.
   */
  updateDirectionTimer() {
    super.updateDirectionTimer();
  }

  /**
   * Prevents normal patrol movement while a slash animation is active.
   *
   * @returns {boolean} `true` when the shared patrol update may move the enemy.
   */
  canPatrol() {
    return !this.isSlashing;
  }

  /**
   * Prevents timer-based direction flips while a slash animation is active.
   *
   * @returns {boolean} `true` when the shared direction timer may advance.
   */
  canAutoChangeDirection() {
    return !this.isSlashing;
  }

  /**
   * Clears slash-specific state after a boss throw resets the shared patrol state.
   */
  onLaunchFromBoss() {
    this.isSlashing = false;
    this.slashHitTriggered = false;
    this.animationFrames = this.WALKING;
    this.currentImage = 0;
  }

  /**
   * Clears slash-specific state after the shared death-state setup has run.
   */
  onStartDyingState() {
    this.isSlashing = false;
    this.slashHitTriggered = false;
  }

  /**
   * Checks whether the player character is close enough for a slash attack.
   *
   * @returns {boolean} `true` when the character is within slash range.
   */
  isCharacterWithinSlashRange() {
    let character = this.world?.character;

    if (!character || character.isDead || character.isDying) return false;

    let ownArea = this.getCollisionArea();
    let characterArea = character.getCollisionArea();
    if (!this.hasVerticalOverlap(ownArea, characterArea)) return false;

    return this.getHorizontalGap(ownArea, characterArea) <= 70;
  }

  /**
   * Checks whether the enemy and character collision areas overlap on the vertical axis.
   *
   * @param {{x: number, y: number, width: number, height: number}} ownArea Enemy collision area.
   * @param {{x: number, y: number, width: number, height: number}} characterArea Character collision area.
   * @returns {boolean} `true` when both collision areas overlap vertically.
   */
  hasVerticalOverlap(ownArea, characterArea) {
    return characterArea.y < ownArea.y + ownArea.height
      && characterArea.y + characterArea.height > ownArea.y;
  }

  /**
   * Computes the horizontal gap between the enemy and character collision areas.
   *
   * @param {{x: number, y: number, width: number, height: number}} ownArea Enemy collision area.
   * @param {{x: number, y: number, width: number, height: number}} characterArea Character collision area.
   * @returns {number} Horizontal separation, or `0` when the areas overlap.
   */
  getHorizontalGap(ownArea, characterArea) {
    let characterRightEdge = characterArea.x + characterArea.width;
    let ownRightEdge = ownArea.x + ownArea.width;

    return Math.max(
      ownArea.x - characterRightEdge,
      characterArea.x - ownRightEdge,
      0
    );
  }

  /**
   * Starts a slash animation facing the player and plays the slashing sound effect.
   */
  startSlashAnimation() {
    if (this.isSlashing || this.isThrownByBoss) return;

    let characterCenterX = this.world.character.x + this.world.character.width / 2;
    let ownCenterX = this.x + this.width / 2;
    this.moveDirection = characterCenterX < ownCenterX ? -1 : 1;
    this.imgDirectionChange = this.moveDirection < 0;
    this.isSlashing = true;
    this.slashHitTriggered = false;
    this.animationFrames = this.SLASHING;
    this.currentImage = 0;
    playSoundEffect(this.world?.swordSlashingAudio);
  }

  /**
   * Applies slash damage and knockback once per slash when the character is still in range.
   */
  trySlashCharacterHit() {
    let character = this.world?.character;

    this.slashHitTriggered = true;
    if (!character || character.isDead || character.isDying || character.isHurt()) return;
    if (!this.isCharacterWithinSlashRange()) return;

    startKnockback(character, this.x + this.width / 2);
    character.hit();
  }

  /**
   * Ends the current slash animation and either chains another slash or returns to walking.
   */
  finishSlashAnimation() {
    if (this.isDying || this.isDead) return;

    let shouldKeepSlashing = this.isCharacterWithinSlashRange();

    this.isSlashing = shouldKeepSlashing;
    this.slashHitTriggered = false;
    this.animationFrames = shouldKeepSlashing ? this.SLASHING : this.WALKING;
    this.currentImage = 0;
  }
}