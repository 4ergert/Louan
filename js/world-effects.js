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