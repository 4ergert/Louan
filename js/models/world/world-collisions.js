import { die, startKnockback } from '../character/char-animation-actions.js';
import { SkeletonWarrior2 } from '../enemies/skeleton_warrior_2.class.js';

/**
 * Collision and combat resolution methods for the world.
 */
export const worldCollisionMethods = {
  /**
   * Runs the collision/update pipeline for the current fixed step.
   *
   * @returns {void}
   */
  updateCollisions() {
    if (this.isPaused) return;

    this.updateEndingEscort();
    const standableObjects = this.getStandableObjects();

    this.updatePlatformLandings(standableObjects);
    this.updateWorldInteractions();

    if (this.character.isDying || this.character.isDead) return;

    this.updateCombatInteractions();
  },

  /**
   * Resolves platform landings for all platform-aware object groups.
   *
   * @param {Array<*>} standableObjects
   * @returns {void}
   */
  updatePlatformLandings(standableObjects) {
    this.landOnNearbyPlatforms(this.character, standableObjects);
    this.landOnNearbyPlatforms(this.alia, standableObjects, (alia) => alia.hasLanded = true);
    this.updateEnemyPlatformLandings(standableObjects);

    this.updateEnvironmentPlatformLandings(standableObjects);
  },

  /**
   * Applies platform landing logic to non-boss living enemies.
   *
   * @param {Array<*>} standableObjects
   * @returns {void}
   */
  updateEnemyPlatformLandings(standableObjects) {
    this.lvl.enemies.forEach((enemy) => {
      if (!this.canEnemyLandOnPlatforms(enemy)) return;

      this.landOnNearbyPlatforms(enemy, standableObjects);
    });
  },

  /**
   * Applies platform landing logic to environment objects affected by platforms.
   *
   * @param {Array<*>} standableObjects
   * @returns {void}
   */
  updateEnvironmentPlatformLandings(standableObjects) {
    this.lvl.environmentObjects.forEach((object) => {
      if (!object.affectedByPlatforms) return;

      this.landOnNearbyPlatforms(object, standableObjects, (affectedObject) => {
        affectedObject.speedX = 0;
        affectedObject.isCollectible = true;
      });
    });
  },

  /**
   * @param {*} enemy
   * @returns {boolean}
   */
  canEnemyLandOnPlatforms(enemy) {
    return !enemy.isBoss && !enemy.isDying && !enemy.isDead;
  },

  /**
   * Resolves combat interactions for the current fixed update.
   *
   * @returns {void}
   */
  updateCombatInteractions() {
    this.handleThrowInput();
    this.updateThrownBones();
    this.updateBossThrownSwords();
    this.updateBossAttackState();
    if (this.resolveStompedEnemy()) return;
    this.resolveEnemyContactHits();
  },

  /**
   * Resolves the first enemy stomped by the character.
   *
   * @returns {boolean}
   */
  resolveStompedEnemy() {
    let stompedEnemy = this.lvl.enemies.find((enemy) => this.isStompableEnemy(enemy));

    if (!stompedEnemy) return false;
    this.bounceOffEnemy(stompedEnemy);
    this.handleEnemyDefeat(stompedEnemy);
    return true;
  },

  /**
   * @param {*} enemy
   * @returns {boolean}
   */
  isStompableEnemy(enemy) {
    return !enemy.isBoss && !enemy.isDying && !enemy.isDead &&
      this.character.isColliding(enemy) && this.isStompingEnemy(enemy);
  },

  /**
   * Resolves direct character damage from colliding with non-stomped melee enemies.
   *
   * @returns {void}
   */
  resolveEnemyContactHits() {
    this.lvl.enemies.forEach((enemy) => {
      if (enemy.isDying || enemy.isDead) return;
      if (enemy.isBoss) return;
      if (enemy instanceof SkeletonWarrior2) return;

      if (this.character.isColliding(enemy) && !this.character.isHurt()) {
        startKnockback(this.character, enemy.x + enemy.width / 2);
        this.character.hit();
      }
    });
  },

  /**
   * @returns {number}
   */
  getCharacterFallDeathY() {
    return this.canvas.height;
  },

  /**
   * @returns {boolean}
   */
  isCharacterInDeathFallZone() {
    let fallDeathStartX = this.lvl.worldSettings?.fallDeathStartX;

    return typeof fallDeathStartX === 'number' && this.character.x >= fallDeathStartX;
  },

  /**
   * Kills the character after a fatal fall into the abyss.
   *
   * @returns {void}
   */
  handleCharacterFallDeath() {
    if (this.character.isDead) return;
    if (!this.character.shouldKeepFallingIntoAbyss()) return;
    if (this.character.y < this.getCharacterFallDeathY()) return;

    die(this.character);
    this.character.isDying = false;
    this.character.isDead = true;
    this.character.vcY = -6;
  },

  /**
   * Removes non-boss enemies that fall out of the playable area.
   *
   * @returns {void}
   */
  handleEnemyFallDeath() {
    this.lvl.enemies.forEach((enemy) => {
      if (enemy.isBoss || enemy.isDying || enemy.isDead) return;
      if (typeof enemy.shouldKeepFallingIntoAbyss !== 'function') return;
      if (!enemy.shouldKeepFallingIntoAbyss()) return;
      if (enemy.y < this.getCharacterFallDeathY()) return;

      let dyingDuration = enemy.die();

      setTimeout(() => this.removeEnemy(enemy), dyingDuration);
    });
  },

  /**
   * @returns {Array<*>}
   */
  getStandableObjects() {
    return this.standableObjectsCache;
  },

  /**
   * Rebuilds the cached list of objects that can be stood on.
   *
   * @returns {void}
   */
  refreshStandableObjectsCache() {
    this.standableObjectsCache = [
      ...(this.lvl.platformObjects ?? []),
      ...(this.lvl.solidObjects ?? []),
    ];
  },

  /**
   * Returns standable objects near the provided target.
   *
   * @param {* | null | undefined} target
   * @param {Array<*>} standableObjects
   * @param {number} [margin=120]
   * @returns {Array<*>}
   */
  getNearbyStandableObjects(target, standableObjects, margin = 120) {
    if (!target) return [];

    let collisionArea = target.getCollisionArea?.() ?? target;
    let minX = collisionArea.x - margin;
    let maxX = collisionArea.x + collisionArea.width + margin;

    return standableObjects.filter((platform) => {
      let platformArea = platform.getCollisionArea();

      return platformArea.x + platformArea.width >= minX && platformArea.x <= maxX;
    });
  },

  /**
   * Lands a target on all nearby matching platforms.
   *
   * @param {* | null | undefined} target
   * @param {Array<*>} standableObjects
   * @param {((target: *, platform: *) => void) | null} [onLand=null]
   * @returns {void}
   */
  landOnNearbyPlatforms(target, standableObjects, onLand = null) {
    if (!target) return;
    if (typeof target.isLandingOn !== 'function' || typeof target.landOn !== 'function') return;

    this.getNearbyStandableObjects(target, standableObjects).forEach((platform) => {
      if (!target.isLandingOn(platform)) return;

      target.landOn(platform);
      onLand?.(target, platform);
    });
  },

  /**
   * Resolves solid-object blocking collisions against the character.
   *
   * @returns {void}
   */
  blockCharacterBySolidObjects() {
    (this.lvl.solidObjects ?? []).forEach((solidObject) => {
      if (!this.character.isColliding(solidObject)) return;
      if (this.character.isLandingOn(solidObject)) return;
      if (this.shouldIgnoreSolidCollisionFromBelow(solidObject)) return;

      this.resolveCharacterSolidCollision(solidObject);
    });
  },

  /**
   * Resolves a character collision against one solid object.
   *
   * @param {*} solidObject
   * @returns {void}
   */
  resolveCharacterSolidCollision(solidObject) {
    let characterArea = this.character.getCollisionArea();
    let solidArea = solidObject.getCollisionArea();
    let overlaps = this.getCharacterSolidOverlaps(characterArea, solidArea);

    if (Math.min(overlaps.top, overlaps.bottom) < Math.min(overlaps.left, overlaps.right)) {
      this.resolveCharacterVerticalSolidCollision(solidArea, characterArea, overlaps);
      return;
    }

    this.resolveCharacterHorizontalSolidCollision(solidArea, characterArea, overlaps);
  },

  /**
   * Computes overlap distances between the character and a solid object.
   *
   * @param {{ x: number, y: number, width: number, height: number }} characterArea
   * @param {{ x: number, y: number, width: number, height: number }} solidArea
   * @returns {{ left: number, right: number, top: number, bottom: number }}
   */
  getCharacterSolidOverlaps(characterArea, solidArea) {
    return {
      left: characterArea.x + characterArea.width - solidArea.x,
      right: solidArea.x + solidArea.width - characterArea.x,
      top: characterArea.y + characterArea.height - solidArea.y,
      bottom: solidArea.y + solidArea.height - characterArea.y,
    };
  },

  /**
   * Resolves a vertical collision between the character and a solid object.
   *
   * @param {{ y: number, height: number }} solidArea
   * @param {{ y: number, height: number }} characterArea
   * @param {{ top: number, bottom: number }} overlaps
   * @returns {void}
   */
  resolveCharacterVerticalSolidCollision(solidArea, characterArea, overlaps) {
    let characterOffsetY = characterArea.y - this.character.y;

    if (overlaps.top < overlaps.bottom) {
      this.character.y = solidArea.y - characterArea.height - characterOffsetY;
      this.character.vcY = 0;
      return;
    }

    this.character.y = solidArea.y + solidArea.height - characterOffsetY;
    if (this.character.vcY > 0) this.character.vcY = 0;
  },

  /**
   * Resolves a horizontal collision between the character and a solid object.
   *
   * @param {{ x: number, width: number }} solidArea
   * @param {{ x: number, width: number }} characterArea
   * @param {{ left: number, right: number }} overlaps
   * @returns {void}
   */
  resolveCharacterHorizontalSolidCollision(solidArea, characterArea, overlaps) {
    let characterOffsetX = characterArea.x - this.character.x;

    if (overlaps.left < overlaps.right) {
      this.character.x = solidArea.x - characterArea.width - characterOffsetX;
      return;
    }

    this.character.x = solidArea.x + solidArea.width - characterOffsetX;
  },

  /**
   * @param {*} solidObject
   * @returns {boolean}
   */
  shouldIgnoreSolidCollisionFromBelow(solidObject) {
    if (!solidObject.ignoreCollisionFromBelow) return false;

    let characterArea = this.character.getCollisionArea();
    let solidArea = solidObject.getCollisionArea();
    let characterCenterY = characterArea.y + characterArea.height / 2;
    let solidCenterY = solidArea.y + solidArea.height / 2;

    return characterCenterY >= solidCenterY;
  },

  /**
   * @param {*} enemy
   * @returns {boolean}
   */
  isStompingEnemy(enemy) {
    let characterArea = this.character.getCollisionArea();
    let enemyArea = enemy.getCollisionArea();
    let characterFeet = characterArea.y + characterArea.height;

    return this.character.vcY < 0 && characterFeet <= enemyArea.y + 25;
  },

  /**
   * Applies the bounce response after stomping an enemy.
   *
   * @param {*} enemy
   * @returns {void}
   */
  bounceOffEnemy(enemy) {
    let characterArea = this.character.getCollisionArea();
    let enemyArea = enemy.getCollisionArea();

    this.character.y = enemyArea.y - characterArea.height - characterArea.offsetY;
    this.character.vcY = 5;
  },
};
