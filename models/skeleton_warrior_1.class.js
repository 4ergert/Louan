class SkeletonWarriorLVL1 extends MovableObject {

  y = 280;
  speed = 0.4;
  moveDirection = -1;
  animationFrames = [];

  IDLE_ANIMATION = [
    './img/Enemies/Skeleton_Warrior_1/Idle/0_Skeleton_Warrior_Idle_000.png',
    './img/Enemies/Skeleton_Warrior_1/Idle/0_Skeleton_Warrior_Idle_001.png',
    './img/Enemies/Skeleton_Warrior_1/Idle/0_Skeleton_Warrior_Idle_002.png',
    './img/Enemies/Skeleton_Warrior_1/Idle/0_Skeleton_Warrior_Idle_003.png',
    './img/Enemies/Skeleton_Warrior_1/Idle/0_Skeleton_Warrior_Idle_004.png',
    './img/Enemies/Skeleton_Warrior_1/Idle/0_Skeleton_Warrior_Idle_005.png',
    './img/Enemies/Skeleton_Warrior_1/Idle/0_Skeleton_Warrior_Idle_006.png',
    './img/Enemies/Skeleton_Warrior_1/Idle/0_Skeleton_Warrior_Idle_007.png',
    './img/Enemies/Skeleton_Warrior_1/Idle/0_Skeleton_Warrior_Idle_008.png',
    './img/Enemies/Skeleton_Warrior_1/Idle/0_Skeleton_Warrior_Idle_009.png',
    './img/Enemies/Skeleton_Warrior_1/Idle/0_Skeleton_Warrior_Idle_010.png',
    './img/Enemies/Skeleton_Warrior_1/Idle/0_Skeleton_Warrior_Idle_011.png',
    './img/Enemies/Skeleton_Warrior_1/Idle/0_Skeleton_Warrior_Idle_012.png',
    './img/Enemies/Skeleton_Warrior_1/Idle/0_Skeleton_Warrior_Idle_013.png',
    './img/Enemies/Skeleton_Warrior_1/Idle/0_Skeleton_Warrior_Idle_014.png',
    './img/Enemies/Skeleton_Warrior_1/Idle/0_Skeleton_Warrior_Idle_015.png',
    './img/Enemies/Skeleton_Warrior_1/Idle/0_Skeleton_Warrior_Idle_016.png',
    './img/Enemies/Skeleton_Warrior_1/Idle/0_Skeleton_Warrior_Idle_017.png',
  ];
  WALKING_ANIMATION = [
    './img/Enemies/Skeleton_Warrior_1/Walking/0_Skeleton_Warrior_Walking_000.png',
    './img/Enemies/Skeleton_Warrior_1/Walking/0_Skeleton_Warrior_Walking_001.png',
    './img/Enemies/Skeleton_Warrior_1/Walking/0_Skeleton_Warrior_Walking_002.png',
    './img/Enemies/Skeleton_Warrior_1/Walking/0_Skeleton_Warrior_Walking_003.png',
    './img/Enemies/Skeleton_Warrior_1/Walking/0_Skeleton_Warrior_Walking_004.png',
    './img/Enemies/Skeleton_Warrior_1/Walking/0_Skeleton_Warrior_Walking_005.png',
    './img/Enemies/Skeleton_Warrior_1/Walking/0_Skeleton_Warrior_Walking_006.png',
    './img/Enemies/Skeleton_Warrior_1/Walking/0_Skeleton_Warrior_Walking_007.png',
    './img/Enemies/Skeleton_Warrior_1/Walking/0_Skeleton_Warrior_Walking_008.png',
    './img/Enemies/Skeleton_Warrior_1/Walking/0_Skeleton_Warrior_Walking_009.png',
    './img/Enemies/Skeleton_Warrior_1/Walking/0_Skeleton_Warrior_Walking_010.png',
    './img/Enemies/Skeleton_Warrior_1/Walking/0_Skeleton_Warrior_Walking_011.png',
    './img/Enemies/Skeleton_Warrior_1/Walking/0_Skeleton_Warrior_Walking_012.png',
    './img/Enemies/Skeleton_Warrior_1/Walking/0_Skeleton_Warrior_Walking_013.png',
    './img/Enemies/Skeleton_Warrior_1/Walking/0_Skeleton_Warrior_Walking_014.png',
    './img/Enemies/Skeleton_Warrior_1/Walking/0_Skeleton_Warrior_Walking_015.png',
    './img/Enemies/Skeleton_Warrior_1/Walking/0_Skeleton_Warrior_Walking_016.png',
    './img/Enemies/Skeleton_Warrior_1/Walking/0_Skeleton_Warrior_Walking_017.png',
    './img/Enemies/Skeleton_Warrior_1/Walking/0_Skeleton_Warrior_Walking_018.png',
    './img/Enemies/Skeleton_Warrior_1/Walking/0_Skeleton_Warrior_Walking_019.png',
    './img/Enemies/Skeleton_Warrior_1/Walking/0_Skeleton_Warrior_Walking_020.png',
    './img/Enemies/Skeleton_Warrior_1/Walking/0_Skeleton_Warrior_Walking_021.png',
    './img/Enemies/Skeleton_Warrior_1/Walking/0_Skeleton_Warrior_Walking_022.png',
    './img/Enemies/Skeleton_Warrior_1/Walking/0_Skeleton_Warrior_Walking_023.png'
  ];


  constructor() {
    super();
    this.loadImage('./img/Enemies/Skeleton_Warrior_1/Idle/0_Skeleton_Warrior_Idle_000.png');
    this.loadImages(this.IDLE_ANIMATION);
    this.loadImages(this.WALKING_ANIMATION);
    this.animationFrames = this.WALKING_ANIMATION;

    this.x = 700 + Math.random() * 500;

    this.animation();
    this.startPatrol();
  }

  animation() {
    setInterval(() => {
      let i = this.currentImage % this.animationFrames.length;
      let path = this.animationFrames[i];
      this.img = this.imgCache[path];
      this.currentImage++;
    }, 100);
  }

  startPatrol() {
    setInterval(() => {
      this.x += this.moveDirection * this.speed;
      this.imgDirectionChange = this.moveDirection < 0;
    }, 1000 / 60);

    this.scheduleDirectionChange();
  }

  scheduleDirectionChange() {
    const nextChangeInMs = 2000 + Math.random() * 3000;

    setTimeout(() => {
      this.moveDirection *= -1;
      this.scheduleDirectionChange();
    }, nextChangeInMs);
  }

  getCollisionArea() {
    return {
      x: this.x + 50,
      y: this.y + 45,
      width: this.width - 100,
      height: this.height - 70,
      offsetY: 40,
    };
  }
}