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

/**
 * @typedef {object} FireflyParticle
 * @property {number} x - Current world-space horizontal position.
 * @property {number} y - Current vertical position.
 * @property {number} vx - Base horizontal drift speed.
 * @property {number} vy - Base vertical drift speed.
 * @property {number} radius - Core particle radius.
 * @property {number} glowRadius - Radius of the outer glow.
 * @property {number} alpha - Base glow intensity.
 * @property {number} twinkleSpeed - Speed multiplier for pulsing brightness.
 * @property {number} phase - Offset used to desynchronize motion and twinkle.
 * @property {string} coreColor - Fill color for the particle center.
 * @property {string} glowColor - Fill color for the outer glow.
 */

/**
 * Creates a light ambient swarm of firefly particles for the upper world area.
 *
 * @param {number} cameraX - Horizontal camera offset.
 * @param {number} viewportWidth - Visible canvas width.
 * @param {number} maxY - Lower vertical bound where the particles may appear.
 * @param {number} count - Total number of particles to generate.
 * @returns {FireflyParticle[]}
 */
export function createFireflyParticles(cameraX, viewportWidth, maxY, count = 22) {
  let particles = [];
  let viewportLeft = -cameraX - 80;
  let viewportRight = -cameraX + viewportWidth + 80;
  let spawnFloor = Math.max(56, maxY);

  for (let index = 0; index < count; index++) {
    particles.push(createFireflyParticle(viewportLeft, viewportRight, spawnFloor));
  }

  return particles;
}

/**
 * Creates a single firefly within the provided spawn bounds.
 *
 * @param {number} minX
 * @param {number} maxX
 * @param {number} maxY
 * @returns {FireflyParticle}
 */
export function createFireflyParticle(minX, maxX, maxY) {
  let radius = 1.1 + Math.random() * 2.4;

  return {
    x: minX + Math.random() * (maxX - minX),
    y: 12 + Math.random() * Math.max(24, maxY - 12),
    vx: -0.12 + Math.random() * 0.24,
    vy: -0.06 + Math.random() * 0.12,
    radius,
    glowRadius: radius * (2.8 + Math.random() * 1.7),
    alpha: 0.26 + Math.random() * 0.32,
    twinkleSpeed: 0.0011 + Math.random() * 0.002,
    phase: Math.random() * Math.PI * 2,
    coreColor: Math.random() > 0.52 ? 'rgba(239, 255, 230, 0.95)' : 'rgba(216, 255, 177, 0.92)',
    glowColor: Math.random() > 0.48 ? 'rgba(188, 255, 164, 0.34)' : 'rgba(255, 255, 255, 0.3)',
  };
}