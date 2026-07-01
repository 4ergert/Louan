import { DrawableObject } from './drawable-objects.class.js';

export class Bone extends DrawableObject {
  x = 0;
  y = 0;
  width = 40;
  height = 40;
  IMAGE_BONE = './assets/img/Enemies/Skeleton_Warrior_3/PNG/Vector Parts/Left Arm.png';

  constructor(x = 0, y = 0) {
    super();
    this.x = x;
    this.y = y;
    this.loadImage(this.IMAGE_BONE);
  }
}