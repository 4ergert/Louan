import { MovableObject } from '../objects/movable-object.class.js';
import { ALIA_SPRITES } from './alia-sprites.js';

export class Alia extends MovableObject {
  world;
  speed = 3;
  currentAnimation = null;
  maxDistanceToCharacter = 100;
  followTolerance = 8;
  hasLanded = false;

  IDLE = ALIA_SPRITES.IDLE_ANIMATION;
  WALK = ALIA_SPRITES.WALK_ANIMATION;
  RUN = ALIA_SPRITES.RUN_ANIMATION;

  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.loadImage(ALIA_SPRITES.IDLE_ANIMATION[0]);
    this.loadImages(this.IDLE);
    this.loadImages(this.WALK);
    this.loadImages(this.RUN);

    this.applyGravity();
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.followCharacter();
    }, 1000 / 60);

    setInterval(() => {
      this.lookAtCharacter();
      this.playAnimation(this.isRunningToCharacter() ? this.RUN : this.IDLE);
    }, 100);
  }

  followCharacter() {
    if (!this.world?.character) return;
    if (this.world.isPaused) return;

    let xDistance = this.world.character.x - this.x;

    if (Math.abs(xDistance) <= this.maxDistanceToCharacter) return;

    let targetDistance = this.maxDistanceToCharacter - this.followTolerance;
    let direction = Math.sign(xDistance);
    let step = Math.min(Math.abs(xDistance) - targetDistance, this.speed);

    this.x += direction * step;
  }

  isRunningToCharacter() {
    if (!this.world?.character) return false;

    return Math.abs(this.world.character.x - this.x) > this.maxDistanceToCharacter;
  }

  isIdleForIntro() {
    return this.hasLanded && !this.isAboveGround() && !this.isRunningToCharacter() && this.currentAnimation === this.IDLE;
  }

  lookAtCharacter() {
    if (!this.world?.character) return;

    this.imgDirectionChange = this.world.character.x < this.x;
  }

  playAnimation(images) {
    if (this.currentAnimation !== images) {
      this.currentAnimation = images;
      this.currentImage = 0;
    }

    let frameIndex = this.currentImage % images.length;
    let path = images[frameIndex];

    this.img = this.imgCache[path];
    this.currentImage++;
  }
}