/**
 * World-space visibility and draw helper methods.
 */
export const worldViewportRenderingMethods = {
  /**
   * Draws each visible object from the provided collection.
   *
   * @param {Array<{ x: number, y: number, width: number, height: number }>} objects
   * @returns {void}
   */
  addObjectsToMap(objects) {
    objects.forEach((object) => {
      if (!this.isWorldObjectVisible(object)) return;

      this.addToMap(object);
    });
  },

  /**
   * Checks whether a world object intersects the visible viewport bounds.
   *
   * @param {{ x: number, y: number, width: number, height: number }} object
   * @returns {boolean}
   */
  isWorldObjectVisible(object) {
    return this.isHorizontallyVisible(object.x, object.width) && this.isVerticallyVisible(object.y, object.height);
  },

  /**
   * @param {number} x
   * @param {number} width
   * @param {number} [buffer=160]
   * @returns {boolean}
   */
  isHorizontallyVisible(x, width, buffer = 160) {
    const viewportLeft = -this.camera_x - buffer;
    const viewportRight = -this.camera_x + this.canvas.width + buffer;

    return x + width >= viewportLeft && x <= viewportRight;
  },

  /**
   * @param {number} y
   * @param {number} height
   * @param {number} [buffer=160]
   * @returns {boolean}
   */
  isVerticallyVisible(y, height, buffer = 160) {
    const viewportTop = -buffer;
    const viewportBottom = this.canvas.height + buffer;

    return y + height >= viewportTop && y <= viewportBottom;
  },

  /**
   * Draws one movable world object and applies horizontal flipping when needed.
   *
   * @param {{ imgDirectionChange?: boolean, x: number, width: number, draw: (ctx: CanvasRenderingContext2D) => void, drawCollisionArea: (ctx: CanvasRenderingContext2D) => void }} movableObject
   * @returns {void}
   */
  addToMap(movableObject) {
    if (movableObject.imgDirectionChange) this.flipImage(movableObject);
    movableObject.draw(this.ctx);
    movableObject.drawCollisionArea(this.ctx);
    if (movableObject.imgDirectionChange) this.ctx.restore();
  },

  /**
   * Mirrors the canvas context around the object's horizontal center.
   *
   * @param {{ x: number, width: number }} movableObject
   * @returns {void}
   */
  flipImage(movableObject) {
    this.ctx.save();
    this.ctx.translate(movableObject.x + movableObject.width / 2, 0);
    this.ctx.scale(-1, 1);
    this.ctx.translate(-movableObject.x - movableObject.width / 2, 0);
  },
};