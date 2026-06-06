class MovableObject {
  x = 100;
  y = 300;
  img;
  width = 150;
  height = 150;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  moveRight() {
    this.x += 5;
  }

  moveLeft() {
    this.x -= 5;
  }
}