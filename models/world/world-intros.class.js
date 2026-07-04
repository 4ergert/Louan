const INTRO_CONFIG = {
  opening: { duration: 6500, typeSpeed: 45, hasCompletedFlag: true },
  boss: { duration: 5000, typeSpeed: 55, hasCompletedFlag: false },
  alia: { duration: 7000, typeSpeed: 45, hasCompletedFlag: true },
  characterResponse: { duration: 5000, typeSpeed: 45, hasCompletedFlag: false },
};

const ACTIVE_INTRO_TYPES = Object.keys(INTRO_CONFIG);

/**
 * @typedef {'opening' | 'boss' | 'alia' | 'characterResponse'} IntroType
 */

/**
 * @typedef {Object} IntroBubbleConfig
 * @property {number} bubbleX
 * @property {number} bubbleY
 * @property {number} width
 * @property {number} height
 * @property {Array<[number, number]>} tailPoints
 * @property {string} font
 * @property {string[]} textLines
 */

/**
 * Creates the default runtime state for all intro types.
 *
 * @returns {Record<string, boolean | number | null | string[]>}
 */
function createIntroStateDefaults() {
  return Object.entries(INTRO_CONFIG).reduce((defaults, [introType, config]) => {
    defaults[`${introType}IntroTriggered`] = false;
    defaults[`${introType}IntroStartedAt`] = 0;
    defaults[`${introType}IntroTimeout`] = null;
    defaults[`${introType}IntroDuration`] = config.duration;
    defaults[`${introType}IntroTypeSpeed`] = config.typeSpeed;
    defaults[`${introType}IntroLines`] = [];

    if (config.hasCompletedFlag) defaults[`${introType}IntroCompleted`] = false;

    return defaults;
  }, {});
}

export class WorldIntros {
  introSkipLocked = false;

  /**
   * Creates the intro state container.
   */
  constructor() {
    Object.assign(this, createIntroStateDefaults());
  }

  /**
   * Skips or completes the currently active intro when space is pressed.
   *
   * @returns {void}
   */
  handleIntroSkip() {
    if (!this.keyboard.SPACE) {
      this.introSkipLocked = false;
      return;
    }

    if (this.introSkipLocked) return;
    this.introSkipLocked = true;

    const activeIntroType = this.getActiveIntroType();
    if (!activeIntroType) return;

    this.skipIntroStep(this.getIntroLines(activeIntroType), activeIntroType);
  }

  /**
   * Skips to fully visible text or finishes the given intro.
   *
   * @param {string[]} lines
   * @param {IntroType} introType
   * @returns {void}
   */
  skipIntroStep(lines, introType) {
    if (!this.isIntroTextFullyVisible(lines, this.getIntroStartedAt(introType), this.getIntroTypeSpeed(introType))) {
      this.setIntroToFullText(lines, introType);
      return;
    }

    if (introType === 'opening') this.finishOpeningIntro();
    if (introType === 'boss') this.finishBossIntro();
    if (introType === 'alia') this.finishAliaIntro();
    if (introType === 'characterResponse') this.finishCharacterResponseIntro();
  }

  /**
   * Returns the dynamic property name for an intro field.
   *
   * @param {IntroType} introType
   * @param {string} suffix
   * @returns {string}
   */
  getIntroPropertyName(introType, suffix) {
    return `${introType}Intro${suffix}`;
  }

  /**
   * @param {IntroType} introType
   * @returns {string[]}
   */
  getIntroLines(introType) {
    return this[this.getIntroPropertyName(introType, 'Lines')];
  }

  /**
   * @param {IntroType} introType
   * @returns {boolean}
   */
  isIntroActive(introType) {
    return this[`is${introType.charAt(0).toUpperCase()}${introType.slice(1)}IntroActive`]();
  }

  /**
   * Returns the highest-priority active intro type.
   *
   * @returns {IntroType | null}
   */
  getActiveIntroType() {
    return ACTIVE_INTRO_TYPES.find((introType) => this.isIntroActive(introType)) ?? null;
  }

  /**
   * @param {IntroType} introType
   * @returns {number}
   */
  getIntroStartedAt(introType) {
    return this[this.getIntroPropertyName(introType, 'StartedAt')];
  }

  /**
   * @param {IntroType} introType
   * @returns {number}
   */
  getIntroTypeSpeed(introType) {
    return this[this.getIntroPropertyName(introType, 'TypeSpeed')];
  }

  /**
   * Fast-forwards an intro to show its full text immediately.
   *
   * @param {string[]} lines
   * @param {IntroType} introType
   * @returns {void}
   */
  setIntroToFullText(lines, introType) {
    let fullCharCount = lines.join(' ').length;
    let typeSpeed = this.getIntroTypeSpeed(introType);
    let startedAt = Date.now() - fullCharCount * typeSpeed;

    this[this.getIntroPropertyName(introType, 'StartedAt')] = startedAt;
  }

  /**
   * @param {string[]} lines
   * @param {number} startedAt
   * @param {number} typeSpeed
   * @returns {boolean}
   */
  isIntroTextFullyVisible(lines, startedAt, typeSpeed) {
    let elapsedTime = Date.now() - startedAt;
    let visibleChars = Math.floor(elapsedTime / typeSpeed);
    return visibleChars >= lines.join(' ').length;
  }

  /**
   * Finishes the opening intro and resumes gameplay.
   *
   * @returns {void}
   */
  finishOpeningIntro() {
    if (this.openingIntroTimeout) clearTimeout(this.openingIntroTimeout);
    this.openingIntroTimeout = null;
    this.isPaused = false;
    this.openingIntroCompleted = true;
  }

  /**
   * Finishes the boss intro and triggers its completion side effects.
   *
   * @returns {void}
   */
  finishBossIntro() {
    if (this.bossIntroTimeout) clearTimeout(this.bossIntroTimeout);
    this.bossIntroTimeout = null;
    this.isPaused = false;
    this.onBossIntroFinished?.();
  }

  /**
   * Finishes the Alia intro and optionally starts the character response intro.
   *
   * @returns {void}
   */
  finishAliaIntro() {
    if (this.aliaIntroTimeout) clearTimeout(this.aliaIntroTimeout);
    this.aliaIntroTimeout = null;
    this.aliaIntroTriggered = false;

    if (this.characterResponseIntroLines.length) {
      this.startCharacterResponseIntro();
      return;
    }

    this.isPaused = false;
  }

  /**
   * Starts the character response intro after the Alia intro.
   *
   * @returns {void}
   */
  startCharacterResponseIntro() {
    if (this.characterResponseIntroTriggered) return;

    this.characterResponseIntroTriggered = true;
    this.isPaused = true;
    this.characterResponseIntroStartedAt = Date.now();
    this.resetKeyboard();

    this.characterResponseIntroTimeout = setTimeout(() => {
      this.finishCharacterResponseIntro();
    }, this.characterResponseIntroDuration);
  }

  /**
   * Finishes the character response intro and starts the ending escort.
   *
   * @returns {void}
   */
  finishCharacterResponseIntro() {
    if (this.characterResponseIntroTimeout) clearTimeout(this.characterResponseIntroTimeout);
    this.characterResponseIntroTimeout = null;
    this.characterResponseIntroTriggered = false;
    this.isPaused = false;
    this.startEndingEscort?.();
  }

  /**
   * @returns {boolean}
   */
  isBossIntroActive() {
    return this.isPaused && this.bossIntroTriggered && !!this.bossLVL1;
  }

  /**
   * @returns {boolean}
   */
  isOpeningIntroActive() {
    return this.isPaused && this.openingIntroTriggered && !this.openingIntroCompleted;
  }

  /**
   * @returns {boolean}
   */
  isAliaIntroActive() {
    return this.isPaused && this.aliaIntroTriggered;
  }

  /**
   * @returns {boolean}
   */
  isCharacterResponseIntroActive() {
    return this.isPaused && this.characterResponseIntroTriggered;
  }

  /**
   * Resets all keyboard flags to their unpressed state.
   *
   * @returns {void}
   */
  resetKeyboard() {
    Object.keys(this.keyboard).forEach((key) => {
      this.keyboard[key] = false;
    });
  }

  /**
   * Applies world settings from the active level onto the world instance.
   *
   * @returns {void}
   */
  applyLevelWorldSettings() {
    if (!this.lvl || !this.lvl.worldSettings) return;

    Object.assign(this, this.lvl.worldSettings);
  }

  /**
   * Returns the currently visible portion of intro text split into its original lines.
   *
   * @param {string[]} lines
   * @param {number} startedAt
   * @param {number} typeSpeed
   * @returns {string[]}
   */
  getVisibleIntroLines(lines, startedAt, typeSpeed) {
    let elapsedTime = Date.now() - startedAt;
    let visibleChars = Math.floor(elapsedTime / typeSpeed);
    let fullText = lines.join(' ');
    let visibleText = fullText.slice(0, visibleChars);
    let visibleLines = [];
    let currentIndex = 0;

    lines.forEach((line) => {
      let lineText = visibleText.slice(currentIndex, currentIndex + line.length);
      visibleLines.push(lineText);
      currentIndex += line.length + 1;
    });

    return visibleLines;
  }

  /**
   * Draws a configured speech bubble and its text.
   *
   * @param {IntroBubbleConfig} config
   * @returns {void}
   */
  drawIntroBubble({ bubbleX, bubbleY, width, height, tailPoints, font, textLines }) {
    this.ctx.save();
    this.configureBubbleContext(font);
    this.drawBubbleBody(bubbleX, bubbleY, width, height);
    this.drawBubbleTail(tailPoints);
    this.drawBubbleText(textLines, bubbleX, bubbleY);
    this.ctx.restore();
  }

  /**
   * Applies the shared canvas styles used by intro bubbles.
   *
   * @param {string} font
   * @returns {void}
   */
  configureBubbleContext(font) {
    this.ctx.fillStyle = '#fff8ea';
    this.ctx.strokeStyle = '#3a2412';
    this.ctx.lineWidth = 4;
    this.ctx.font = font;
    this.ctx.textBaseline = 'top';
  }

  /**
   * @param {number} bubbleX
   * @param {number} bubbleY
   * @param {number} width
   * @param {number} height
   * @returns {void}
   */
  drawBubbleBody(bubbleX, bubbleY, width, height) {
    this.ctx.fillRect(bubbleX, bubbleY, width, height);
    this.ctx.strokeRect(bubbleX, bubbleY, width, height);
  }

  /**
   * @param {Array<[number, number]>} tailPoints
   * @returns {void}
   */
  drawBubbleTail(tailPoints) {
    this.ctx.beginPath();
    tailPoints.forEach(([x, y], index) => {
      if (index === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    });
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }

  /**
   * @param {string[]} textLines
   * @param {number} bubbleX
   * @param {number} bubbleY
   * @returns {void}
   */
  drawBubbleText(textLines, bubbleX, bubbleY) {
    this.ctx.fillStyle = '#3a2412';
    textLines.forEach((line, index) => {
      this.ctx.fillText(line, bubbleX + 18, bubbleY + 16 + index * 28);
    });
  }

  /**
   * Draws the boss intro speech bubble.
   *
   * @returns {void}
   */
  drawBossIntroBubble() {
    let bossScreenX = this.bossLVL1.x + this.camera_x;
    let bubbleX = Math.max(20, Math.min(this.canvas.width - 300, bossScreenX + 50));
    let bubbleY = 35;
    let textLines = this.getVisibleIntroLines(this.bossIntroLines, this.bossIntroStartedAt, this.bossIntroTypeSpeed);

    this.drawIntroBubble({
      bubbleX,
      bubbleY,
      width: 333,
      height: 110,
      tailPoints: [
        [bubbleX + 56, bubbleY + 110],
        [bubbleX + 86, bubbleY + 110],
        [bubbleX + 97, bubbleY + 138],
      ],
      font: 'bold 20px Cinzel Decorative',
      textLines,
    });
  }

  /**
   * Draws the opening intro speech bubble.
   *
   * @returns {void}
   */
  drawOpeningIntroBubble() {
    let bubbleX = 180;
    let bubbleY = 30;
    let textLines = this.getVisibleIntroLines(this.openingIntroLines, this.openingIntroStartedAt, this.openingIntroTypeSpeed);

    this.drawIntroBubble({
      bubbleX,
      bubbleY,
      width: 380,
      height: 148,
      tailPoints: [
        [bubbleX + 70, bubbleY + 148],
        [bubbleX + 110, bubbleY + 148],
        [bubbleX + 60, bubbleY + 180],
      ],
      font: 'bold 16px Cinzel Decorative',
      textLines,
    });
  }

  /**
   * Draws the Alia intro speech bubble.
   *
   * @returns {void}
   */
  drawAliaIntroBubble() {
    if (!this.alia) return;

    let aliaScreenX = this.alia.x + this.camera_x;
    let bubbleX = Math.max(20, Math.min(this.canvas.width - 430, aliaScreenX - 70));
    let bubbleY = 35;
    let textLines = this.getVisibleIntroLines(this.aliaIntroLines, this.aliaIntroStartedAt, this.aliaIntroTypeSpeed);

    this.drawIntroBubble({
      bubbleX,
      bubbleY,
      width: 430,
      height: 140,
      tailPoints: [
        [bubbleX + 80, bubbleY + 140],
        [bubbleX + 115, bubbleY + 140],
        [bubbleX + 96, bubbleY + 176],
      ],
      font: 'bold 16px Cinzel Decorative',
      textLines,
    });
  }

  /**
   * Draws the character response intro speech bubble.
   *
   * @returns {void}
   */
  drawCharacterResponseIntroBubble() {
    let characterScreenX = this.character.x + this.camera_x;
    let bubbleX = Math.max(20, Math.min(this.canvas.width - 430, characterScreenX - 70));
    let bubbleY = 35;
    let textLines = this.getVisibleIntroLines(
      this.characterResponseIntroLines,
      this.characterResponseIntroStartedAt,
      this.characterResponseIntroTypeSpeed
    );

    this.drawIntroBubble({
      bubbleX,
      bubbleY,
      width: 430,
      height: 110,
      tailPoints: [
        [bubbleX + 70, bubbleY + 110],
        [bubbleX + 105, bubbleY + 110],
        [bubbleX + 74, bubbleY + 146],
      ],
      font: 'bold 16px Cinzel Decorative',
      textLines,
    });
  }
}