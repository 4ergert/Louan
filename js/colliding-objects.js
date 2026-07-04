/**
 * @typedef {object} CollisionArea
 * @property {number} x - Left edge of the collision box.
 * @property {number} y - Top edge of the collision box.
 * @property {number} width - Width of the collision box.
 * @property {number} height - Height of the collision box.
 * @property {number} [offsetY] - Optional vertical offset used when snapping to surfaces.
 */

/**
 * @typedef {object} CollidableObject
 * @property {function(): CollisionArea} getCollisionArea - Returns the collision box used for overlap checks.
 */

/**
 * @typedef {CollidableObject & {vcY: number, y: number}} LandingMovableObject
 */

/**
 * @typedef {object} BossSlashRangeContext
 * @property {{isDead: boolean, isDying: boolean, getCollisionArea: function(): CollisionArea}} bossLVL1 - Boss entity to test against.
 * @property {{getCollisionArea: function(): CollisionArea}} character - Active player character.
 */

/**
 * Checks whether a movable object is landing on top of a platform.
 * @param {LandingMovableObject} movableObject - The object that may be landing.
 * @param {CollidableObject} platform - The platform to check against.
 * @returns {boolean} True when the object is falling onto the platform surface.
 */
export function isLandingOn(movableObject, platform) {
  let ownCollisionArea = movableObject.getCollisionArea();
  let platformArea = platform.getCollisionArea();
  let feet = ownCollisionArea.y + ownCollisionArea.height;
  let landingTolerance = Math.max(20, Math.abs(movableObject.vcY) + 5);

  return (
    movableObject.vcY <= 0 &&
    ownCollisionArea.x + ownCollisionArea.width > platformArea.x &&
    ownCollisionArea.x < platformArea.x + platformArea.width &&
    ownCollisionArea.y < platformArea.y &&
    feet >= platformArea.y &&
    feet <= platformArea.y + landingTolerance
  );
}

/**
 * Snaps a movable object onto the top of a platform and clears its vertical speed.
 * @param {LandingMovableObject} movableObject - The object that is landing.
 * @param {CollidableObject} platform - The platform to land on.
 * @returns {void}
 */
export function landOn(movableObject, platform) {
  let ownCollisionArea = movableObject.getCollisionArea();
  let platformArea = platform.getCollisionArea();

  movableObject.y = platformArea.y - ownCollisionArea.height - ownCollisionArea.offsetY;
  movableObject.vcY = 0;
}

/**
 * Checks whether the character overlaps another collidable object.
 * @param {CollidableObject} character - The character hitbox source.
 * @param {CollidableObject} object - The other object to test.
 * @returns {boolean} True when both collision areas overlap.
 */
export function isCollidingWithCharacter(character, object) {
  let characterArea = character.getCollisionArea();
  let objectArea = object.getCollisionArea();

  return (
    characterArea.x + characterArea.width > objectArea.x &&
    characterArea.x < objectArea.x + objectArea.width &&
    characterArea.y + characterArea.height > objectArea.y &&
    characterArea.y < objectArea.y + objectArea.height
  );
}

/**
 * Checks whether the current object overlaps another collidable object.
 * @this {CollidableObject}
 * @param {CollidableObject} otherObject - The other object to test.
 * @returns {boolean} True when both collision areas overlap.
 */
export function isColliding(otherObject) {
  let ownCollisionArea = this.getCollisionArea();
  let otherCollisionArea = otherObject.getCollisionArea();

  return (
    ownCollisionArea.x + ownCollisionArea.width > otherCollisionArea.x &&
    ownCollisionArea.x < otherCollisionArea.x + otherCollisionArea.width &&
    ownCollisionArea.y + ownCollisionArea.height > otherCollisionArea.y &&
    ownCollisionArea.y < otherCollisionArea.y + otherCollisionArea.height
  );
}

/**
 * Checks whether the character is close enough to the level boss for a slash attack.
 * Requires vertical overlap and a horizontal gap of at most 100 pixels.
 *
 * @this {BossSlashRangeContext}
 * @returns {boolean} True when the character is inside the boss slash range.
 */
export function isCharacterWithinBossSlashRange() {
  if (this.bossLVL1.isDead || this.bossLVL1.isDying) return false;
  
  let characterArea = this.character.getCollisionArea();
  let bossArea = this.bossLVL1.getCollisionArea();

  if (!overlapsVertically(characterArea, bossArea)) return false;
  let horizontalGap = getHorizontalGap(characterArea, bossArea);
  return horizontalGap <= 100;
}

/**
 * Checks whether two collision areas overlap vertically.
 * @param {CollisionArea} firstArea - The first collision box.
 * @param {CollisionArea} secondArea - The second collision box.
 * @returns {boolean} True when both collision areas share vertical space.
 */
function overlapsVertically(firstArea, secondArea) {
  return (
    firstArea.y < secondArea.y + secondArea.height &&
    firstArea.y + firstArea.height > secondArea.y
  );
}

/**
 * Calculates the horizontal distance between two collision areas.
 * Returns `0` when they already overlap horizontally.
 * @param {CollisionArea} firstArea - The first collision box.
 * @param {CollisionArea} secondArea - The second collision box.
 * @returns {number} The empty horizontal space between both collision areas.
 */
function getHorizontalGap(firstArea, secondArea) {
  let firstRightEdge = firstArea.x + firstArea.width;
  let secondRightEdge = secondArea.x + secondArea.width;

  return Math.max(
    secondArea.x - firstRightEdge,
    firstArea.x - secondRightEdge,
    0
  );
}