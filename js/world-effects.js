/**
 * @typedef {object} BloodSplatterParticle
 * @property {number} x - Current horizontal particle position.
 * @property {number} y - Current vertical particle position.
 * @property {number} vx - Horizontal particle velocity.
 * @property {number} vy - Vertical particle velocity.
 * @property {number} gravity - Downward acceleration applied each frame.
 * @property {number} radius - Render radius of the particle.
 * @property {string} color - Fill color used when drawing the particle.
 * @property {number} startedAt - Timestamp when the particle effect started.
 * @property {number} duration - Lifespan contribution used for fading.
 * @property {number} expiresAt - Timestamp when the particle should be discarded.
 */

/**
 * Creates a burst of blood splatter particles for hit and death effects.
 *
 * @param {number} originX - World x-position where the effect starts.
 * @param {number} originY - World y-position where the effect starts.
 * @param {number} direction - Horizontal direction multiplier for the splatter force.
 * @param {number} now - Current timestamp used for particle lifetime tracking.
 * @returns {BloodSplatterParticle[]} The generated particle burst.
 */
export function createBloodSplatterParticles(originX, originY, direction, now) {
  let particles = [];

  for (let index = 0; index < 24; index++) {
    particles.push({
      x: originX + (Math.random() * 30 - 15),
      y: originY + (Math.random() * 26 - 13),
      vx: direction * (3.2 + Math.random() * 5.2),
      vy: -5.5 + Math.random() * 4,
      gravity: 0.2 + Math.random() * 0.12,
      radius: 2 + Math.random() * 5.5,
      color: Math.random() > 0.45 ? 'rgba(120, 8, 14, 1)' : 'rgba(196, 20, 20, 1)',
      startedAt: now,
      duration: 420 + Math.random() * 260,
      expiresAt: now + 720,
    });
  }

  return particles;
}