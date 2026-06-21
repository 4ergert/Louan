import { isMoving, isRunning, isSpawning, updateSlashState } from './char-movements.js';

/**
 * Selects and plays the appropriate character animation for the current state.
 * Prioritizes spawn, damage, attack, air, running, and walking states in that order.
 *
 * @param {import('./character.class.js').Character} character - The active character instance.
 * @returns {void}
 */
export function switchCharAnimation(character) {
  if (character.world?.isPaused) return;

  updateSlashState(character);

  switch (true) {
    case isSpawning(character):
      character.spriteAnimation(character.IDLE);
      break;
    case character.isDying:
      character.playDyingAnimation();
      break;
    case character.isHurt():
      character.spriteAnimation(character.HURT);
      break;
    case character.throwingAnimationActive:
      character.playThrowingAnimation();
      break;
    case character.slashAnimationActive:
      character.playSlashAnimation();
      break;
    case character.isAboveGround() && character.vcY > 3:
      character.spriteAnimation(character.JUMPING, false); // Play the jumping animation once
      break;
    case character.isAboveGround() && character.vcY < -1: // Falling down fast
      character.spriteAnimation(character.FALLING);
      break;
    case character.isAboveGround():
      character.spriteAnimation(character.FLYING); // Play the flying animation while in the air
      break;
    case isRunning(character):
      if (!character.isHurtState) {
        character.spriteAnimation(character.RUNNING);
        character.speed = 4;
      }
      break;
    case isMoving(character):
      if (!character.isHurtState) {
        character.spriteAnimation(character.WALKING);
        character.speed = 2;
      }
      break;
    default:
      character.spriteAnimation(character.IDLE);
  }
}