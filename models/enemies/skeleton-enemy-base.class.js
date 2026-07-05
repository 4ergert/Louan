import { MovableObject } from '../objects/movable-object.class.js';

/**
 * Shared base for skeleton-like enemies that patrol platforms, can be thrown,
 * and use a timed death animation.
 */
export class SkeletonEnemyBase extends MovableObject {
  /**
   * Applies the shared constructor setup for patrolling skeleton enemies.
   *
   * @param {number} x Initial horizontal position.
   * @param {number} y Initial vertical position.
   * @param {string} idleImagePath Default image shown before animation playback.
   * @param {string[][]} animationSets Sprite sequences that should be preloaded.
   * @param {string[]} initialAnimationFrames Animation sequence used after initialization.
   * @returns {void}
   */
  initializePatrolEnemy(x, y, idleImagePath, animationSets, initialAnimationFrames) {
    this.x = x;
    this.y = y;
    this.loadImage(idleImagePath);
    animationSets.forEach((frames) => this.loadImages(frames));
    this.animationFrames = initialAnimationFrames;
    this.applyGravity();
    this.resetDirectionTimer();
  }

  /**
   * Moves the enemy along its current platform and reacts to landing and blocked edges.
   *
   * @returns {void}
   */
  updatePatrolStep() {
    if (!this.world || !this.canPatrol()) return;

    this.resetThrowStateOnLanding();
    if (this.handleBlockedPlatform()) return;

    this.x += this.moveDirection * this.speed;
    this.imgDirectionChange = this.moveDirection < 0;
  }

  /**
   * Hook that allows subclasses to temporarily suppress normal patrol movement.
   *
   * @returns {boolean}
   */
  canPatrol() {
    return true;
  }

  /**
   * Restores normal patrol speed after a boss throw once the enemy lands on a platform.
   *
   * @returns {void}
   */
  resetThrowStateOnLanding() {
    if (!this.isThrownByBoss || this.vcY > 0 || !this.isStandingOnPlatform()) return;

    this.isThrownByBoss = false;
    this.speed = this.defaultSpeed;
  }

  /**
   * Reverses direction and reports whether patrol movement should stop for this frame.
   *
   * @returns {boolean}
   */
  handleBlockedPlatform() {
    if (!this.shouldReverseAtBlockedPlatform()) return false;

    this.moveDirection *= -1;
    this.imgDirectionChange = this.moveDirection < 0;

    return true;
  }

  /**
   * Counts down to the next random patrol turn and flips direction when the timer expires.
   *
   * @returns {void}
   */
  updateDirectionTimer() {
    if (!this.canAutoChangeDirection()) return;

    this.directionChangeRemainingMs -= this.world?.updateStepMs ?? 0;

    if (this.directionChangeRemainingMs > 0 || this.isDying) return;

    this.moveDirection *= -1;
    this.resetDirectionTimer();
  }

  /**
   * Hook that allows subclasses to suspend timed autonomous direction changes.
   *
   * @returns {boolean}
   */
  canAutoChangeDirection() {
    return true;
  }

  /**
   * Schedules the next random autonomous direction change in milliseconds.
   *
   * @returns {void}
   */
  resetDirectionTimer() {
    this.directionChangeRemainingMs = 2000 + Math.random() * 3000;
  }

  /**
   * Repositions the enemy and gives it an initial upward and horizontal throw impulse.
   *
    * @param {number} direction Horizontal throw direction, usually `-1` or `1`.
    * @param {number} startX Spawn x-position for the throw.
    * @param {number} startY Spawn y-position for the throw.
   * @returns {void}
   */
  launchFromBoss(direction, startX, startY) {
    this.x = startX;
    this.y = startY;
    this.moveDirection = direction;
    this.imgDirectionChange = direction < 0;
    this.speed = this.throwSpeed;
    this.vcY = 4;
    this.isThrownByBoss = true;
    this.onLaunchFromBoss();
  }

  /**
   * Hook for subclasses that need to reset extra state after a boss throw.
   *
   * @returns {void}
   */
  onLaunchFromBoss() {}

  /**
    * Repeated calls while dying or after death return the same duration.
   * Starts the death sequence and returns how long the animation will last.
    * @returns {number} Duration of the death animation in milliseconds.
   * @returns {number}
   */
  die() {
    let dyingDuration = this.DYING.length * this.dyingAnimationSpeed + 50;

    if (this.isDying || this.isDead) return dyingDuration;

    this.startDyingState();
    setTimeout(() => this.isDead = true, dyingDuration);

    return dyingDuration;
  }

  /**
   * Applies the shared non-reversible state changes for the death animation.
   *
   * @returns {void}
   */
  startDyingState() {
    this.isDying = true;
    this.speed = 0;
    this.moveDirection = 0;
    this.isThrownByBoss = false;
    this.animationFrames = this.DYING;
    this.currentImage = 0;
    this.imgDirectionChange = false;
    this.onStartDyingState();
  }

  /**
   * Hook for subclasses that need to clear extra state while dying.
   *
   * @returns {void}
   */
  onStartDyingState() {}

  /**
   * Returns the effective collision box used for platform and damage checks.
   *
   * @returns {{x: number, y: number, width: number, height: number, offsetY: number}}
   */
  getCollisionArea() {
    return {
      x: this.x + 50,
      y: this.y + 45,
      width: this.width - 100,
      height: this.height - 70,
      offsetY: 40,
    };
  }

  /**
   * Keeps the enemy airborne when it has stepped off a platform into an abyss.
   *
    * @returns {boolean} `true` when gravity should continue to treat the enemy as above ground.
   */
  isAboveGround() {
    if (this.shouldKeepFallingIntoAbyss()) return true;

    return super.isAboveGround();
  }

  /**
    * Determines whether the enemy should keep falling because no standable object is below it.
    *
    * @returns {boolean} `true` when the enemy has left a platform and should continue falling.
   */
  shouldKeepFallingIntoAbyss() {
    if (this.isStandingOnPlatform()) return false;
    if (!this.world) return false;

    return !this.hasStandableObjectBelow();
  }

  /**
    * Checks whether any standable object still exists below the current collision area.
    *
    * @returns {boolean} `true` when a standable object is found underneath the enemy.
   */
  hasStandableObjectBelow() {
    let ownCollisionArea = this.getCollisionArea();
    let feet = ownCollisionArea.y + ownCollisionArea.height;

    return this.getStandableObjects().some((platform) => {
      let platformArea = platform.getCollisionArea();
      let overlapsHorizontally =
        ownCollisionArea.x + ownCollisionArea.width > platformArea.x &&
        ownCollisionArea.x < platformArea.x + platformArea.width;

      return overlapsHorizontally && platformArea.y >= feet;
    });
  }

  /**
    * Decides whether the next platform in the patrol direction is a blocked platform type.
    *
    * @returns {boolean} `true` when the enemy should reverse instead of moving forward.
   */
  shouldReverseAtBlockedPlatform() {
    let nextPlatform = this.getNextPlatform();

    return this.isBlockedPlatform(nextPlatform);
  }

  /**
    * Finds the platform the enemy would land on after its next horizontal movement step.
    *
    * @returns {object|null} The matching platform object or `null` when no landing platform is ahead.
   */
  getNextPlatform() {
    let nextCollisionArea = this.getNextCollisionArea();
    let nextFeet = nextCollisionArea.y + nextCollisionArea.height;
    let landingTolerance = Math.max(20, Math.abs(this.vcY) + 5);

    return (this.world?.lvl?.platformObjects ?? []).find((platform) => {
      let platformArea = platform.getCollisionArea();

      return this.isLandingOnPlatform(nextCollisionArea, nextFeet, landingTolerance, platformArea);
    }) ?? null;
  }

  /**
    * Checks whether the next movement step would place the enemy on top of a platform.
    *
    * @param {{x: number, y: number, width: number, height: number}} nextCollisionArea Collision box after the next step.
    * @param {number} nextFeet Projected y-position of the enemy feet.
    * @param {number} landingTolerance Allowed vertical snap tolerance for landing.
    * @param {{x: number, y: number, width: number, height: number}} platformArea Collision box of the platform.
    * @returns {boolean} `true` when the next step should be treated as a landing.
   */
  isLandingOnPlatform(nextCollisionArea, nextFeet, landingTolerance, platformArea) {
    return (
      nextCollisionArea.x + nextCollisionArea.width > platformArea.x &&
      nextCollisionArea.x < platformArea.x + platformArea.width &&
      nextCollisionArea.y < platformArea.y &&
      nextFeet >= platformArea.y &&
      nextFeet <= platformArea.y + landingTolerance
    );
  }

  /**
    * Builds the projected collision box for the next horizontal movement step.
    *
    * @returns {{x: number, y: number, width: number, height: number, offsetY: number}} Projected collision box.
   */
  getNextCollisionArea() {
    let collisionArea = this.getCollisionArea();

    return {
      ...collisionArea,
      x: collisionArea.x + this.moveDirection * this.speed,
    };
  }

  /**
   * Identifies platform sprites that should force the enemy to turn around.
   *
   * @param {{imgPath?: string}|null} platform Platform candidate to inspect.
   * @returns {boolean} `true` when the platform is marked as blocked for patrol movement.
   */
  isBlockedPlatform(platform) {
    if (!platform?.imgPath) return false;

    return platform.imgPath.includes('Ground 10.png')
      || platform.imgPath.includes('Ground 12.png');
  }
}