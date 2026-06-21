import { CHARACTER_SPRITES } from '../../js/sprites-path/character-sprites.js';
import { MovableObject } from '../objects/movable-object.class.js';
import { switchCharAnimation } from './switch-char-animation.js';
import { charMovement } from './char-movements.js';

export class Character extends MovableObject {

  x = -47;
  y = 280;
  world;
  speed = 1;
  currentAnimation = null;
  energy = 100;
  opacity = 0;
  spawnDuration = 800;
  spawnStartedAt = Date.now();
  throwingAnimationActive = false;
  slashAnimationActive = false;
  slashInputLocked = false;
  isHurtState = false;
  isDying = false;
  isDead = false;
  hurtUntil = 0;
  knockbackUntil = 0;
  knockbackDirection = 0;
  knockbackSpeed = 0;
  
  IDLE = CHARACTER_SPRITES.IDLE_ANIMATION;
  WALKING = CHARACTER_SPRITES.WALKING_ANIMATION;
  RUNNING = CHARACTER_SPRITES.RUNNING_ANIMATION;
  JUMPING = CHARACTER_SPRITES.JUMPING_ANIMATION;
  FLYING = CHARACTER_SPRITES.JUMPING_LOOP_ANIMATION;
  FALLING = CHARACTER_SPRITES.FALLING_ANIMATION;
  THROWING = CHARACTER_SPRITES.THROWING_ANIMATION;
  SLASHING = CHARACTER_SPRITES.SLASHING_ANIMATION;
  HURT = CHARACTER_SPRITES.HURT_ANIMATION;
  DYING = CHARACTER_SPRITES.DYING_ANIMATION;

  /**
   * Creates the character, loads all sprite sets, and starts physics and animation updates.
   */
  constructor() {
    super();
    this.loadImage('./img/Character/lvl_1/Idle/0_Dark_Oracle_Idle_000.png');
    this.loadImages(this.IDLE);
    this.loadImages(this.WALKING);
    this.loadImages(this.RUNNING);
    this.loadImages(this.JUMPING);
    this.loadImages(this.FLYING);
    this.loadImages(this.FALLING);
    this.loadImages(this.THROWING);
    this.loadImages(this.SLASHING);
    this.loadImages(this.HURT);
    this.loadImages(this.DYING);

    this.applyGravity();
    this.animation();
  }

  /**
   * Starts the character update loops for movement and sprite animation.
   * Runs movement at 60 FPS and updates the displayed animation frame every 50 ms.
   *
   * @returns {void}
   */
  animation() {
    // ./models/character/char-movements.js handles all movement logic, including input and knockback
    setInterval(() => charMovement(this), 1000 / 60);
    // ./models/character/switch-char-animation.js selects the correct animation based on the character's current state
    setInterval(() => switchCharAnimation(this), 50);
  }

  /**
   * Draws the character with its current spawn or fade opacity applied.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   * @returns {void}
   */
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    super.draw(ctx);
    ctx.restore();
  }

  /**
   * Returns the adjusted collision box used for character hit detection.
   *
   * @returns {{x: number, y: number, width: number, height: number, offsetY: number}} The active collision area.
   */
  getCollisionArea() {
    return {
      x: this.x + 45,
      y: this.y + 35,
      width: this.width - 90,
      height: this.height - 60,
      offsetY: 30,
    };
  }

  // Collision and damage handling
  isHurt() {
    return this.hurtUntil > Date.now();
  }

  hit(duration = 333) {
    this.energy = Math.max(0, this.energy - 20);
    this.world?.lifeBar.setPercentage(this.energy);

    if (this.energy === 0) {
      this.die();
      return;
    }

    this.hurtUntil = Date.now() + duration;
    this.isHurtState = true;

    setTimeout(() => this.isHurtState = false, duration + 555); // Ensure the hurt state lasts slightly longer than the animation
  }

  startKnockback(sourceX = null, duration = 333, speed = 5) {
    this.knockbackUntil = Date.now() + duration;
    this.knockbackSpeed = speed;
    if (sourceX === null) {
      this.knockbackDirection = this.imgDirectionChange ? 1 : -1;
      return;
    }

    let characterCenterX = this.x + this.width / 2;
    this.knockbackDirection = sourceX < characterCenterX ? 1 : -1;
  }

  startThrowingAnimation() {
    if (this.isDying || this.isDead) return;

    this.throwingAnimationActive = true;
  }

  die() {
    if (this.isDying || this.isDead) return;

    this.isDying = true;
    this.isHurtState = false;
    this.throwingAnimationActive = false;
    this.slashAnimationActive = false;
    this.knockbackUntil = 0;
    this.currentAnimation = null;
    this.currentImage = 0;
  }

  playThrowingAnimation() {
    this.spriteAnimation(this.THROWING, false);

    if (this.currentAnimation === this.THROWING && this.currentImage >= this.THROWING.length - 1) {
      this.throwingAnimationActive = false;
    }
  }

  // Slash attack handling
  playSlashAnimation() {
    this.spriteAnimation(this.SLASHING, false);

    if (this.currentAnimation === this.SLASHING && this.currentImage >= this.SLASHING.length - 1) {
      this.slashAnimationActive = false;
    }
  }

  playDyingAnimation() {
    this.spriteAnimation(this.DYING, false);

    if (this.currentAnimation === this.DYING && this.currentImage >= this.DYING.length - 1) {
      this.isDead = true;
    }
  }

  // Override the spriteAnimation method to reset the animation when switching states
  spriteAnimation(sprites, loop = true) {
    if (this.currentAnimation !== sprites) {
      this.currentAnimation = sprites;
      this.currentImage = 0;
    }

    let i = loop
      // Loop through the animation frames if loop is true, otherwise play the animation once
      ? this.currentImage % sprites.length
      // Play the animation once and stop at the last frame if loop is false
      : Math.min(this.currentImage, sprites.length - 1);
    let path = sprites[i];
    this.img = this.imgCache[path];

    if (loop || this.currentImage < sprites.length - 1) this.currentImage++;
  }


}