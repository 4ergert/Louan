import { drawGameOverOverlay, drawVictoryOverlay, syncGameOverActions, syncVictoryActions } from '../../world-render-effects.js';
import { isTouchMobileDevice } from '../../mobile.js';

/**
 * Overlay-specific world rendering methods.
 */
export const worldOverlayRenderingMethods = {
  /**
   * Draws full-screen overlays such as game over, victory, and intro prompts.
   *
   * @returns {void}
   */
  drawOverlayLayer() {
    this.drawGameOverState();
    this.drawOverlayPrompts();
  },

  /**
   * Draws the game-over overlay and keeps retry actions in sync.
   *
   * @returns {void}
   */
  drawGameOverState() {
    if (!this.character.isDead) return syncGameOverActions(false);

    this.bossLVL1?.setIdleState?.();
    if (!this.gameOverStartedAt) this.gameOverStartedAt = Date.now();
    this.playGameOverAudio();
    let showRetryPrompt = this.isGameOverRetryReady();

    syncGameOverActions(showRetryPrompt);
    drawGameOverOverlay(this.ctx, this.canvas, showRetryPrompt);
  },

  /**
   * Draws non-game-over overlays such as victory, chase, intro, and hint prompts.
   *
   * @returns {void}
   */
  drawOverlayPrompts() {
    if (this.victoryOverlayVisible) drawVictoryOverlay(this.ctx, this.canvas, this.isVictoryPromptReady());
    else syncVictoryActions(false);
    if (this.endingLiamChaseActive) this.drawEndingLiamChaseBubble();
    this.drawActiveIntroBubble();
    this.drawBonePickupHint();
  },

  /**
   * Draws the temporary post-intro throw hint when configured by the current level.
   *
   * @returns {void}
   */
  drawBonePickupHint() {
    if (isTouchMobileDevice()) return;
    if (!this.openingIntroHintStartedAt || !this.openingIntroHintText) return;

    const elapsedTime = Date.now() - this.openingIntroHintStartedAt;

    if (elapsedTime >= this.openingIntroHintDuration) {
      this.openingIntroHintStartedAt = 0;
      return;
    }

    this.ctx.save();
    this.ctx.font = 'bold 28px Cinzel Decorative';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = 'rgba(255, 248, 234, 0.72)';
    this.ctx.strokeStyle = 'rgba(58, 36, 18, 0.45)';
    this.ctx.lineWidth = 3;
    this.ctx.strokeText(this.openingIntroHintText, this.canvas.width / 2, this.canvas.height * 0.95);
    this.ctx.fillText(this.openingIntroHintText, this.canvas.width / 2, this.canvas.height * 0.95);
    this.ctx.restore();
  },
};