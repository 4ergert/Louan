import { DrawableObject } from '../objects/drawable-objects.class.js';

export class LifeBar extends DrawableObject {
  imgLife ='./assets/img/Collectable Object/Autumn_Forest_2D_Platformer_Tileset_Collectable Object - Life.png';
  percentage = 100;
  maxSegments = 5;
  segmentBlinkUntil = 0;
  blinkCycleDuration = 180;
  blinkCycles = 3;

  constructor() {
    super();
    this.loadImage(this.imgLife);
    this.x = 16;
    this.y = 16;
    this.width = 40;
    this.height = 40;
  }

  draw(ctx) {
    super.draw(ctx);
    this.drawLifeSegments(ctx);
  }

  drawLifeSegments(ctx) {
    let filledSegments = Math.ceil((this.percentage / 100) * this.maxSegments);
    let segmentWidth = 8;
    let segmentHeight = 24;
    let gap = 6;
    let startX = this.x + this.width + 12;
    let startY = this.y + (this.height - segmentHeight) / 2;
    let isBlinking = this.isSegmentBlinkActive();
    let blinkVisible = !isBlinking || this.isBlinkFrameVisible();

    for (let i = 0; i < this.maxSegments; i++) {
      ctx.fillStyle = this.getSegmentFillColor(i, filledSegments, blinkVisible);
      ctx.fillRect(startX + i * (segmentWidth + gap), startY, segmentWidth, segmentHeight);

      ctx.strokeStyle = '#1f140d';
      ctx.lineWidth = 2;
      ctx.strokeRect(startX + i * (segmentWidth + gap), startY, segmentWidth, segmentHeight);
    }
  }

  getSegmentColor() {
    if (this.percentage > 90) return '#47b36b';
    if (this.percentage > 30) return '#d9a441';
    return '#c84c3b';
  }

  getSegmentFillColor(index, filledSegments, blinkVisible) {
    if (!blinkVisible) return '#f7f0a1';
    return index < filledSegments ? this.getSegmentColor() : '#5b4b39';
  }

  isSegmentBlinkActive() {
    return this.segmentBlinkUntil > Date.now();
  }

  isBlinkFrameVisible() {
    let remainingDuration = this.segmentBlinkUntil - Date.now();
    let elapsedDuration = this.blinkCycles * this.blinkCycleDuration * 2 - remainingDuration;
    let blinkFrame = Math.floor(elapsedDuration / this.blinkCycleDuration);

    return blinkFrame % 2 === 0;
  }

  triggerSegmentBlink() {
    this.segmentBlinkUntil = Date.now() + this.blinkCycles * this.blinkCycleDuration * 2;
  }

  setPercentage(percentage) {
    this.percentage = Math.max(0, Math.min(100, percentage));
  }
}