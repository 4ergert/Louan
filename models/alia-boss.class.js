class AliaBoss extends MovableObject {
  height = 500;
  width = 500;
  y = -10;
  x = 4400;
  speed = 0.15;
  imgDirectionChange = true;
  isBoss = true;
  maxEnergy = 5;
  energy = 5;
  isHurt = false;
  isDying = false;
  isDead = false;
  isSlashing = false;
  isSlashAnimationActive = false;
  slashHitTriggered = false;
  dyingAnimationSpeed = 100;
  animationFrames = [];
  hurtTimeout = null;

  IMAGES_WALKING = [
    'img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Idle Blinking/0_Skeleton_Warrior_Idle Blinking_000.png',
    'img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Idle Blinking/0_Skeleton_Warrior_Idle Blinking_001.png',
    'img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Idle Blinking/0_Skeleton_Warrior_Idle Blinking_002.png',
    'img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Idle Blinking/0_Skeleton_Warrior_Idle Blinking_003.png',
    'img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Idle Blinking/0_Skeleton_Warrior_Idle Blinking_004.png',
    'img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Idle Blinking/0_Skeleton_Warrior_Idle Blinking_005.png',
    'img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Idle Blinking/0_Skeleton_Warrior_Idle Blinking_006.png',
    'img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Idle Blinking/0_Skeleton_Warrior_Idle Blinking_007.png',
    'img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Idle Blinking/0_Skeleton_Warrior_Idle Blinking_008.png',
    'img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Idle Blinking/0_Skeleton_Warrior_Idle Blinking_009.png',
    'img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Idle Blinking/0_Skeleton_Warrior_Idle Blinking_010.png',
    'img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Idle Blinking/0_Skeleton_Warrior_Idle Blinking_011.png',
    'img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Idle Blinking/0_Skeleton_Warrior_Idle Blinking_012.png',
    'img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Idle Blinking/0_Skeleton_Warrior_Idle Blinking_013.png',
    'img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Idle Blinking/0_Skeleton_Warrior_Idle Blinking_014.png',
    'img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Idle Blinking/0_Skeleton_Warrior_Idle Blinking_015.png',
    'img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Idle Blinking/0_Skeleton_Warrior_Idle Blinking_016.png',
    'img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Idle Blinking/0_Skeleton_Warrior_Idle Blinking_017.png'
  ];
  HURT_ANIMATION = [
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Hurt/0_Skeleton_Warrior_Hurt_000.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Hurt/0_Skeleton_Warrior_Hurt_001.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Hurt/0_Skeleton_Warrior_Hurt_002.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Hurt/0_Skeleton_Warrior_Hurt_003.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Hurt/0_Skeleton_Warrior_Hurt_004.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Hurt/0_Skeleton_Warrior_Hurt_005.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Hurt/0_Skeleton_Warrior_Hurt_006.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Hurt/0_Skeleton_Warrior_Hurt_007.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Hurt/0_Skeleton_Warrior_Hurt_008.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Hurt/0_Skeleton_Warrior_Hurt_009.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Hurt/0_Skeleton_Warrior_Hurt_010.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Hurt/0_Skeleton_Warrior_Hurt_011.png'
  ];
  DYING_ANIMATION = [
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Dying/0_Skeleton_Warrior_Dying_000.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Dying/0_Skeleton_Warrior_Dying_001.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Dying/0_Skeleton_Warrior_Dying_002.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Dying/0_Skeleton_Warrior_Dying_003.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Dying/0_Skeleton_Warrior_Dying_004.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Dying/0_Skeleton_Warrior_Dying_005.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Dying/0_Skeleton_Warrior_Dying_006.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Dying/0_Skeleton_Warrior_Dying_007.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Dying/0_Skeleton_Warrior_Dying_008.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Dying/0_Skeleton_Warrior_Dying_009.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Dying/0_Skeleton_Warrior_Dying_010.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Dying/0_Skeleton_Warrior_Dying_011.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Dying/0_Skeleton_Warrior_Dying_012.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Dying/0_Skeleton_Warrior_Dying_013.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Dying/0_Skeleton_Warrior_Dying_014.png'
  ];
  SLASHING_ANIMATION = [
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Slashing/0_Skeleton_Warrior_Slashing_000.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Slashing/0_Skeleton_Warrior_Slashing_001.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Slashing/0_Skeleton_Warrior_Slashing_002.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Slashing/0_Skeleton_Warrior_Slashing_003.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Slashing/0_Skeleton_Warrior_Slashing_004.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Slashing/0_Skeleton_Warrior_Slashing_005.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Slashing/0_Skeleton_Warrior_Slashing_006.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Slashing/0_Skeleton_Warrior_Slashing_007.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Slashing/0_Skeleton_Warrior_Slashing_008.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Slashing/0_Skeleton_Warrior_Slashing_009.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Slashing/0_Skeleton_Warrior_Slashing_010.png',
    './img/Enemies/Skeleton_Warrior_3/PNG/PNG Sequences/Slashing/0_Skeleton_Warrior_Slashing_011.png'
  ];

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.HURT_ANIMATION);
    this.loadImages(this.DYING_ANIMATION);
    this.loadImages(this.SLASHING_ANIMATION);
    this.animationFrames = this.IMAGES_WALKING;
    this.animate();
  }

  playAnimation(images) {
    let isSingleRunAnimation = this.isDying || this.isHurt || this.isSlashAnimationActive;
    let i = isSingleRunAnimation
      ? Math.min(this.currentImage, images.length - 1)
      : this.currentImage % images.length;
    let path = images[i];
    this.img = this.imgCache[path];

    if (this.isSlashAnimationActive && !this.slashHitTriggered && i >= 4) {
      this.slashHitTriggered = true;
      this.world?.handleBossSlashHit?.();
    }

    if (isSingleRunAnimation && this.currentImage >= images.length - 1) {
      if (this.isHurt) this.finishHurtAnimation();
      if (this.isSlashAnimationActive) this.finishSlashAnimation();
      return;
    }

    if (!isSingleRunAnimation || this.currentImage < images.length - 1) {
      this.currentImage++;
    }
  }

  animate() {
    setInterval(() => {
      if (this.world?.isPaused) return;

      this.playAnimation(this.animationFrames);
    }, this.dyingAnimationSpeed);
  }

  hit() {
    if (this.isDying || this.isDead) return false;

    this.energy = Math.max(0, this.energy - 1);
    this.startHurtAnimation();
    if (this.energy > 0) return false;

    this.die();
    return true;
  }

  startHurtAnimation() {
    this.isHurt = true;
    this.animationFrames = this.HURT_ANIMATION;
    this.currentImage = 0;

    if (this.hurtTimeout) clearTimeout(this.hurtTimeout);
    this.hurtTimeout = setTimeout(() => {
      this.finishHurtAnimation();
    }, this.HURT_ANIMATION.length * this.dyingAnimationSpeed + 50);
  }

  finishHurtAnimation() {
    if (this.isDying || !this.isHurt) return;

    this.isHurt = false;
    let shouldKeepSlashing = this.isSlashing || this.world?.isCharacterWithinBossSlashRange?.();
    this.isSlashing = shouldKeepSlashing;
    this.isSlashAnimationActive = shouldKeepSlashing;
    this.slashHitTriggered = false;
    this.animationFrames = shouldKeepSlashing ? this.SLASHING_ANIMATION : this.IMAGES_WALKING;
    this.currentImage = 0;
    if (this.hurtTimeout) clearTimeout(this.hurtTimeout);
    this.hurtTimeout = null;
  }

  setSlashingState(isSlashing) {
    if (this.isDying || this.isDead || this.isHurt) return;
    if (isSlashing) {
      if (this.isSlashAnimationActive) return;

      this.isSlashing = true;
      this.isSlashAnimationActive = true;
      this.slashHitTriggered = false;
      this.animationFrames = this.SLASHING_ANIMATION;
      this.currentImage = 0;
      return;
    }

    if (this.isSlashAnimationActive) return;
    if (!this.isSlashing) return;

    this.isSlashing = false;
    this.slashHitTriggered = false;
    this.animationFrames = this.IMAGES_WALKING;
    this.currentImage = 0;
  }

  finishSlashAnimation() {
    if (!this.isSlashAnimationActive || this.isDying || this.isDead) return;

    let shouldKeepSlashing = this.world?.isCharacterWithinBossSlashRange?.() || false;
    this.isSlashAnimationActive = shouldKeepSlashing;
    this.isSlashing = shouldKeepSlashing;
    this.slashHitTriggered = false;
    this.animationFrames = shouldKeepSlashing ? this.SLASHING_ANIMATION : this.IMAGES_WALKING;
    this.currentImage = 0;
  }

  die() {
    if (this.isDying || this.isDead) return this.DYING_ANIMATION.length * this.dyingAnimationSpeed + 50;

    this.isDying = true;
    this.isHurt = false;
    this.isSlashing = false;
    this.isSlashAnimationActive = false;
    this.slashHitTriggered = false;
    this.animationFrames = this.DYING_ANIMATION;
    this.currentImage = 0;
    if (this.hurtTimeout) clearTimeout(this.hurtTimeout);
    this.hurtTimeout = null;

    const dyingDuration = this.DYING_ANIMATION.length * this.dyingAnimationSpeed + 50;
    setTimeout(() => {
      this.isDead = true;
    }, dyingDuration);

    return dyingDuration;
  }

  getCollisionArea() {
    return {
      x: this.x + 180,
      y: this.y + 230,
      width: this.width - 350,
      height: this.height - 400,
      offsetY: 30,
    };
  }
}