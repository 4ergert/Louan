import { isColliding } from '../../js/colliding-objects.js';

export class DrawableObject {
  img;
  imgCache = {};
  currentImage = 0;
  x = 0;
  y = 0;
  width = 150;
  height = 150;
  showCollisionArea = false;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(arr) {
    arr.forEach(path => {
      let img = new Image();
      img.src = path;
      this.imgCache[path] = img;
    });
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawCollisionArea(ctx) {
    if (!this.showCollisionArea) return;

    let collisionArea = this.getCollisionArea();

    // ctx.beginPath();
    // ctx.lineWidth = "2";
    // ctx.strokeStyle = "red";
    // ctx.rect(
    //   collisionArea.x,
    //   collisionArea.y,
    //   collisionArea.width,
    //   collisionArea.height
    // );
    // ctx.stroke();
  }

  getCollisionArea() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      offsetY: 0,
    };
  }

  isColliding(otherObject) {
    return isColliding.call(this, otherObject);
  }
}