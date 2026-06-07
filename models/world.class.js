class World {

  character = new Character();
  enemies = [
    new SkeletonWarriorLVL1(),
    new SkeletonWarriorLVL1(),
    new SkeletonWarriorLVL1()
  ];
  backgroundObjects = [
    new BackgroundObject('img/Background/Autumn_Forest_2D_Platformer_Tileset_Background - Layer 00.png'),
    new BackgroundObject('img/Background/Autumn_Forest_2D_Platformer_Tileset_Background - Layer 01.png')
  ];
  canvas;
  ctx;
  keyboard;
  camera_x = 0;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
  }

  setWorld() {
    this.character.world = this;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    
    this.addObjectsToMap(this.backgroundObjects);
    this.addObjectsToMap(this.enemies);
    this.addToMap(this.character);

    this.ctx.translate(-this.camera_x, 0);

    
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach(object => {
      this.addToMap(object);
    });
  }

  addToMap(movableObject) {
    if (movableObject.imgDirectionChange) {
      this.ctx.save();
      this.ctx.translate(movableObject.x + movableObject.width / 2, 0);
      this.ctx.scale(-1, 1);
      this.ctx.translate(-movableObject.x - movableObject.width / 2, 0);
    }
    this.ctx.drawImage(movableObject.img, movableObject.x, movableObject.y, movableObject.width, movableObject.height);
    if (movableObject.imgDirectionChange) {
      this.ctx.restore();
    }
  }
}