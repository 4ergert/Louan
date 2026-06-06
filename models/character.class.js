class Character extends MovableObject {

  constructor() {
    super().loadImage('./img/Character/lvl_1/Idle/0_Dark_Oracle_Idle_000.png');
  }

  jump() {
    this.y -= 10;
  }

  moveLeft() {
    this.x -= 5;
  }
}