import { CHARACTER_SPRITES } from '../sprites-path/character-sprites.js';
import { createStartScreenAudio, playBackgroundAudio, stopBackgroundAudio } from '../audio.js';

/**
 * @typedef {Object} StartScreenSceneEffects
 * @property {number} characterX
 * @property {number} baseY
 * @property {number} breathingOffset
 * @property {number} transitionProgress
 * @property {number} flicker
 * @property {number} emberPulse
 * @property {HTMLImageElement | undefined} currentFrame
 */

/**
 * @typedef {Object} StartPromptGradients
 * @property {CanvasGradient} lineOneGradient
 * @property {CanvasGradient} lineTwoGradient
 */

/**
 * Renders and animates the game's start screen.
 */
export class StartScreen {
	/**
	 * @param {HTMLCanvasElement} canvas
	 */
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.framePaths = CHARACTER_SPRITES.IDLE_BLINKING_ANIMATION;
		this.frames = [];
		this.frameIndex = 0;
		this.frameDelay = 140;
		this.lastFrameSwitch = 0;
		this.animationId = 0;
		this.characterWidth = 180;
		this.characterHeight = 180;
		this.isReady = false;
		this.pendingStart = false;
		this.isTransitioning = false;
		this.transitionStartedAt = 0;
		this.transitionDuration = 900;
		this.onTransitionComplete = null;
		this.backgroundAudio = createStartScreenAudio();
		this.loadFrames();
		this.animate = this.animate.bind(this);
	}

	/**
	 * Preloads all start-screen character frames.
	 *
	 * @returns {void}
	 */
	loadFrames() {
		let loadedFrames = 0;
    

		this.frames = this.framePaths.map((path) => {
			const image = new Image();
			image.onload = () => {
				loadedFrames++;
				if (loadedFrames === this.framePaths.length) {
					this.isReady = true;
					if (this.pendingStart) this.start();
				}
			};
			image.src = path;
			return image;
		});
	}

	/**
	 * Starts the start-screen loop once assets are ready.
	 *
	 * @returns {void}
	 */
	start() {
		if (!this.isReady) {
			this.pendingStart = true;
			return;
		}

		this.pendingStart = false;
		this.playBackgroundAudio();
		cancelAnimationFrame(this.animationId);
		this.animationId = requestAnimationFrame(this.animate);
	}

	/**
	 * Stops animation and background audio.
	 *
	 * @returns {void}
	 */
	stop() {
		cancelAnimationFrame(this.animationId);
		this.stopBackgroundAudio();
	}

	/**
	 * Starts the start-screen background audio.
	 *
	 * @returns {void}
	 */
	playBackgroundAudio() {
		playBackgroundAudio(this.backgroundAudio);
	}

	/**
	 * Stops the start-screen background audio.
	 *
	 * @returns {void}
	 */
	stopBackgroundAudio() {
		stopBackgroundAudio(this.backgroundAudio);
	}

	/**
	 * Begins the fade-out transition into the game.
	 *
	 * @param {(() => void) | null} onComplete
	 * @returns {void}
	 */
	beginTransition(onComplete) {
		if (this.isTransitioning) return;
		this.isTransitioning = true;
		this.transitionStartedAt = 0;
		this.onTransitionComplete = onComplete;
	}

	/**
	 * Advances animation and renders the current frame.
	 *
	 * @param {number} timestamp
	 * @returns {void}
	 */
	animate(timestamp) {
		if (this.isTransitioning && !this.transitionStartedAt) this.transitionStartedAt = timestamp;

		this.updateAnimationFrame(timestamp);
		this.drawScene(timestamp);
		if (this.finishTransitionIfComplete(timestamp)) return;
		this.animationId = requestAnimationFrame(this.animate);
	}

	/**
	 * Advances the sprite frame when the frame delay elapsed.
	 *
	 * @param {number} timestamp
	 * @returns {void}
	 */
	updateAnimationFrame(timestamp) {
		if (timestamp - this.lastFrameSwitch < this.frameDelay) return;

		this.frameIndex = (this.frameIndex + 1) % this.frames.length;
		this.lastFrameSwitch = timestamp;
	}

	/**
	 * Completes the transition once its duration has elapsed.
	 *
	 * @param {number} timestamp
	 * @returns {boolean}
	 */
	finishTransitionIfComplete(timestamp) {
		const progress = this.getTransitionProgress(timestamp);

		if (progress < 1) return false;

		this.isTransitioning = false;
		this.onTransitionComplete?.();
		return true;
	}

	/**
	 * Returns the normalized transition progress.
	 *
	 * @param {number} timestamp
	 * @returns {number}
	 */
	getTransitionProgress(timestamp) {
		if (!this.isTransitioning || !this.transitionStartedAt) return 0;
		return Math.min((timestamp - this.transitionStartedAt) / this.transitionDuration, 1);
	}

	/**
	 * Renders the full start-screen scene for the current frame.
	 *
	 * @param {number} timestamp
	 * @returns {void}
	 */
	drawScene(timestamp) {
		const ctx = this.ctx;
		const sceneEffects = this.getSceneEffects(timestamp);

		this.clearScene(ctx);
		this.drawCharacterFrame(ctx, sceneEffects);
		this.drawStartPrompt(ctx, sceneEffects);
	}

	/**
	 * Computes the transient visual values for the current frame.
	 *
	 * @param {number} timestamp
	 * @returns {StartScreenSceneEffects}
	 */
	getSceneEffects(timestamp) {
		const transitionProgress = this.getTransitionProgress(timestamp);
		const flickerStrength = 1 + transitionProgress * 2.4;

		return {
			characterX: -40,
			baseY: -20,
			breathingOffset: Math.sin(timestamp / 320) * 4,
			transitionProgress,
			flicker: ((Math.sin(timestamp / 85) + Math.sin(timestamp / 130)) * 0.5) * flickerStrength,
			emberPulse: Math.min(((Math.sin(timestamp / 260) + 1) / 2) + transitionProgress * 0.45, 1.5),
			currentFrame: this.frames[this.frameIndex],
		};
	}

	/**
	 * Clears the canvas before drawing the next frame.
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @returns {void}
	 */
	clearScene(ctx) {
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		ctx.fillStyle = 'rgba(0, 0, 0, 0)';
		ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	/**
	 * Draws the animated character and its ground shadow.
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {StartScreenSceneEffects} sceneEffects
	 * @returns {void}
	 */
	drawCharacterFrame(ctx, { characterX, baseY, breathingOffset, currentFrame }) {
		ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
		ctx.beginPath();
		ctx.ellipse(characterX + 87, 150, 32, 12, 0, 0, Math.PI * 2);
		ctx.fill();

		if (!currentFrame?.complete) return;

		ctx.drawImage(
			currentFrame,
			characterX,
			baseY + breathingOffset,
			this.characterWidth,
			this.characterHeight
		);
	}

	/**
	 * Draws the glowing start prompt text.
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {StartScreenSceneEffects} sceneEffects
	 * @returns {void}
	 */
	drawStartPrompt(ctx, { flicker, emberPulse }) {
		const { lineOneGradient, lineTwoGradient } = this.createStartPromptGradients(ctx);

		ctx.save();
		ctx.font = 'bold 32px Cinzel Decorative';
		ctx.textBaseline = 'top';

		ctx.shadowColor = `rgba(255, 82, 0, ${0.45 + emberPulse * 0.25})`;
		ctx.shadowBlur = 14 + emberPulse * 12;
		ctx.shadowOffsetX = 1 + flicker * 1.5;
		ctx.shadowOffsetY = 3 + emberPulse * 2;
		ctx.fillStyle = 'rgba(160, 32, 0, 0.6)';
		this.drawStartPromptText(ctx, 212, 54, 122, 104);

		ctx.shadowColor = `rgba(255, 170, 40, ${0.55 + emberPulse * 0.25})`;
		ctx.shadowBlur = 22 + emberPulse * 16;
		ctx.shadowOffsetX = flicker * 2;
		ctx.shadowOffsetY = 0;
		ctx.fillStyle = lineOneGradient;
		ctx.fillText('Drücke Leertaste,', 210, 50);
		ctx.fillStyle = lineTwoGradient;
		ctx.fillText('um Louans Reise zu beginnen.', 120, 100);

		ctx.shadowColor = 'rgba(255, 250, 220, 0.35)';
		ctx.shadowBlur = 6;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.fillStyle = '#fff7de';
		this.drawStartPromptText(ctx, 210, 50, 120, 100);

		ctx.restore();
	}

	/**
	 * Creates the gradients used by the start prompt text.
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @returns {StartPromptGradients}
	 */
	createStartPromptGradients(ctx) {
		const lineOneGradient = ctx.createLinearGradient(0, 50, 0, 90);
		lineOneGradient.addColorStop(0, '#fff7cf');
		lineOneGradient.addColorStop(0.45, '#ffd36b');
		lineOneGradient.addColorStop(1, '#ff7a1a');

		const lineTwoGradient = ctx.createLinearGradient(0, 100, 0, 140);
		lineTwoGradient.addColorStop(0, '#fff7cf');
		lineTwoGradient.addColorStop(0.45, '#ffd36b');
		lineTwoGradient.addColorStop(1, '#ff7a1a');

		return { lineOneGradient, lineTwoGradient };
	}

	/**
	 * Draws the two prompt text lines at the given coordinates.
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {number} lineOneX
	 * @param {number} lineOneY
	 * @param {number} lineTwoX
	 * @param {number} lineTwoY
	 * @returns {void}
	 */
	drawStartPromptText(ctx, lineOneX, lineOneY, lineTwoX, lineTwoY) {
		ctx.fillText('Drücke Leertaste,', lineOneX, lineOneY);
		ctx.fillText('um Louans Reise zu beginnen.', lineTwoX, lineTwoY);
	}
}