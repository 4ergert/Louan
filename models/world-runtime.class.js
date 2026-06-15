class World {
  character = new Character();
  lifeBar = new LifeBar();
  bossLifeBar = new BossLifeBar();
  coinsBar = new CoinsBar();
  throwableObjects = new ThrowableObject(16, 111, true);
  thrownRooks = [];
  lvl = lvl_1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  throwInputLocked = false;
  isPaused = false;
  openingIntroTriggered = false;
  openingIntroCompleted = false;
  openingIntroStartedAt = 0;
  openingIntroDuration = 6500;
  openingIntroTypeSpeed = 45;
  openingIntroLines = [
    'Irgendwas stimmt hier nicht!',
    'Meine Geschwister Alia und Liam',
    'sind verschwunden.',
    'Ich sollte sie suchen gehen.'
  ];
  bossIntroTriggered = false;
  bossIntroStartedAt = 0;
  bossIntroDuration = 5000;
  bossIntroTypeSpeed = 55;
  bossIntroLines = [
    'Arrrrr, ich bin Aliam,',
    'der Skelet-König,',
    'arrrrr!'
  ];
  aliaBoss = new AliaBoss();

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.checkCollisions();
  }

  setWorld() {
    this.assignWorld(this.character);
    this.assignWorld(this.aliaBoss);
    this.assignWorld(this.throwableObjects);
    this.assignWorldToAll(this.lvl.enemies);
    this.assignWorldToAll(this.lvl.environmentObjects);
  }

  assignWorld(drawableObject) {
    if (drawableObject) drawableObject.world = this;
  }

  assignWorldToAll(drawableObjects) {
    drawableObjects.forEach(drawableObject => this.assignWorld(drawableObject));
  }

  draw() {
    this.updateOpeningIntro();
    this.updateBossIntro();
    this.updateBossLifeBar();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawBackgrounds();

    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.lvl.platformObjects);
    this.addObjectsToMap(this.lvl.environmentObjects);
    this.addObjectsToMap(this.lvl.enemies);
    this.addToMap(this.aliaBoss);
    this.addObjectsToMap(this.thrownRooks);
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.lifeBar);
    if (this.shouldShowBossLifeBar()) this.addToMap(this.bossLifeBar);
    this.addToMap(this.coinsBar);
    this.addToMap(this.throwableObjects);
    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);

    this.ctx.translate(-this.camera_x, 0);

    if (this.character.isDead) {
      this.drawGameOverOverlay();
    }

    if (this.isOpeningIntroActive()) {
      this.drawOpeningIntroBubble();
    }

    if (this.isBossIntroActive()) {
      this.drawBossIntroBubble();
    }



    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  // Draw backgrounds with parallax effect
  drawBackgrounds() {
    this.lvl.backgroundObjects.forEach(background => {
      const offsetX = this.camera_x * background.parallaxFactor;

      this.ctx.save();
      this.ctx.translate(offsetX, 0);
      this.addToMap(background);
      this.ctx.restore();
    });
  }

  drawGameOverOverlay() {
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(16, 10, 7, 0.68)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.font = 'bold 56px Georgia';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.lineWidth = 6;
    this.ctx.strokeStyle = '#100a07';
    this.ctx.fillStyle = '#d9a441';
    this.ctx.strokeText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.restore();
  }

  updateOpeningIntro() {
    if (this.openingIntroTriggered || this.character.isDead || this.character.isSpawning()) return;

    this.openingIntroTriggered = true;
    this.isPaused = true;
    this.openingIntroStartedAt = Date.now();
    this.resetKeyboard();

    setTimeout(() => {
      this.isPaused = false;
      this.openingIntroCompleted = true;
    }, this.openingIntroDuration);
  }

  updateBossIntro() {
    if (!this.openingIntroCompleted || this.bossIntroTriggered || this.character.isDead) return;
    if (!this.isBossFullyVisible() || !this.isCharacterNearBoss()) return;

    this.bossIntroTriggered = true;
    this.isPaused = true;
    this.bossIntroStartedAt = Date.now();
    this.resetKeyboard();

    setTimeout(() => {
      this.isPaused = false;
    }, this.bossIntroDuration);
  }

  isBossFullyVisible() {
    let bossScreenX = this.aliaBoss.x + this.camera_x;
    return bossScreenX >= 0 && bossScreenX + this.aliaBoss.width <= this.canvas.width + 100;
  }

  isCharacterNearBoss() {
    let characterRightEdge = this.character.x + this.character.width;
    return this.aliaBoss.x - characterRightEdge <= 400;
  }

  isBossIntroActive() {
    return this.isPaused && this.bossIntroTriggered;
  }

  shouldShowBossLifeBar() {
    return this.openingIntroCompleted && this.isBossVisibleOnScreen() && !this.aliaBoss.isDead;
  }

  isBossVisibleOnScreen() {
    let bossScreenX = this.aliaBoss.x + this.camera_x;
    return bossScreenX + this.aliaBoss.width > 0 && bossScreenX < this.canvas.width;
  }

  isOpeningIntroActive() {
    return this.isPaused && this.openingIntroTriggered && !this.openingIntroCompleted;
  }

  resetKeyboard() {
    Object.keys(this.keyboard).forEach(key => {
      this.keyboard[key] = false;
    });
  }

  drawBossIntroBubble() {
    let bossScreenX = this.aliaBoss.x + this.camera_x;
    let bubbleX = Math.max(20, Math.min(this.canvas.width - 300, bossScreenX + 50));
    let bubbleY = 35;
    let textLines = this.getVisibleIntroLines(this.bossIntroLines, this.bossIntroStartedAt, this.bossIntroTypeSpeed);

    this.ctx.save();
    this.ctx.fillStyle = '#fff8ea';
    this.ctx.strokeStyle = '#3a2412';
    this.ctx.lineWidth = 4;
    this.ctx.fillRect(bubbleX, bubbleY, 333, 110);
    this.ctx.strokeRect(bubbleX, bubbleY, 333, 110);

    this.ctx.beginPath();
    this.ctx.moveTo(bubbleX + 56, bubbleY + 110);
    this.ctx.lineTo(bubbleX + 86, bubbleY + 110);
    this.ctx.lineTo(bubbleX + 97, bubbleY + 138);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.fillStyle = '#3a2412';
    this.ctx.font = 'bold 20px Georgia';
    this.ctx.textBaseline = 'top';
    textLines.forEach((line, index) => {
      this.ctx.fillText(line, bubbleX + 18, bubbleY + 16 + index * 28);
    });
    this.ctx.restore();
  }

  drawOpeningIntroBubble() {
    let bubbleX = 180;
    let bubbleY = 30;
    let textLines = this.getVisibleIntroLines(this.openingIntroLines, this.openingIntroStartedAt, this.openingIntroTypeSpeed);

    this.ctx.save();
    this.ctx.fillStyle = '#fff8ea';
    this.ctx.strokeStyle = '#3a2412';
    this.ctx.lineWidth = 4;
    this.ctx.fillRect(bubbleX, bubbleY, 380, 148);
    this.ctx.strokeRect(bubbleX, bubbleY, 380, 148);

    this.ctx.beginPath();
    this.ctx.moveTo(bubbleX + 70, bubbleY + 148);
    this.ctx.lineTo(bubbleX + 110, bubbleY + 148);
    this.ctx.lineTo(bubbleX + 60, bubbleY + 180);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.fillStyle = '#3a2412';
    this.ctx.font = 'bold 20px Georgia';
    this.ctx.textBaseline = 'top';
    textLines.forEach((line, index) => {
      this.ctx.fillText(line, bubbleX + 18, bubbleY + 16 + index * 28);
    });
    this.ctx.restore();
  }

  getVisibleIntroLines(lines, startedAt, typeSpeed) {
    let elapsedTime = Date.now() - startedAt;
    let visibleChars = Math.floor(elapsedTime / typeSpeed);
    let fullText = lines.join(' ');
    let visibleText = fullText.slice(0, visibleChars);
    let visibleLines = [];
    let currentIndex = 0;

    lines.forEach(line => {
      let lineText = visibleText.slice(currentIndex, currentIndex + line.length);
      visibleLines.push(lineText);
      currentIndex += line.length + 1;
    });

    return visibleLines;
  }

  addObjectsToMap(objects) {
    objects.forEach(object => {
      this.addToMap(object);
    });
  }

  addToMap(movableObject) {
    if (movableObject.isDead) return;

    if (movableObject.imgDirectionChange) this.flipImage(movableObject);
    movableObject.draw(this.ctx);
    movableObject.drawCollisionArea(this.ctx);
    if (movableObject.imgDirectionChange) this.ctx.restore();
  }

  flipImage(movableObject) {
    this.ctx.save();
    this.ctx.translate(movableObject.x + movableObject.width / 2, 0);
    this.ctx.scale(-1, 1);
    this.ctx.translate(-movableObject.x - movableObject.width / 2, 0);
  }

  checkCollisions() {
    setInterval(() => {
      if (this.isPaused) return;

      this.lvl.platformObjects.forEach(platform => {
        if (this.character.isLandingOn(platform)) {
          this.character.landOn(platform);
        }
      });

      this.collectCoins();
      this.collectRooks();
      this.handleThrowInput();
      this.updateThrownRooks();
      this.handleBossContact();

      let stompedEnemy = this.lvl.enemies.find(enemy =>
        !enemy.isDying && !enemy.isDead &&
        this.character.isColliding(enemy) && this.isStompingEnemy(enemy)
      );

      if (stompedEnemy) {
        this.bounceOffEnemy(stompedEnemy);
        this.handleEnemyDefeat(stompedEnemy);
        return;
      }

      this.lvl.enemies.forEach(enemy => {
        if (enemy.isDying || enemy.isDead) return;

        if (this.character.isColliding(enemy) && !this.character.isHurt()) {
          this.character.startKnockback();
          this.character.hit();
        }
      });
    }, 1000 / 60);
  }

  handleBossContact() {
    if (this.aliaBoss.isDead || this.character.isHurt()) return;
    if (!this.character.isColliding(this.aliaBoss)) return;

    this.character.startKnockback();
    this.character.hit();
  }

  updateBossLifeBar() {
    let percentage = (this.aliaBoss.energy / this.aliaBoss.maxEnergy) * 100;
    this.bossLifeBar.setPercentage(percentage);
  }

  collectCoins() {
    let collectedCoins = this.lvl.environmentObjects.filter(object =>
      object instanceof Coins && this.isCollidingWithCharacter(object)
    );

    if (collectedCoins.length === 0) return;

    this.lvl.environmentObjects = this.lvl.environmentObjects.filter(object =>
      !(object instanceof Coins && this.isCollidingWithCharacter(object))
    );

    this.coinsBar.addCoin(collectedCoins.length);
  }

  collectRooks() {
    let collectedRooks = this.lvl.environmentObjects.filter(object =>
      object instanceof ThrowableObject && this.isCollidingWithCharacter(object)
    );

    if (collectedRooks.length === 0) return;

    this.lvl.environmentObjects = this.lvl.environmentObjects.filter(object =>
      !(object instanceof ThrowableObject && this.isCollidingWithCharacter(object))
    );

    this.throwableObjects.addRook(collectedRooks.length);
  }

  handleThrowInput() {
    if (this.keyboard.X && !this.throwInputLocked && this.throwableObjects.rooks > 0) {
      this.character.startThrowingAnimation();
      this.throwRook();
      this.throwInputLocked = true;
    }

    if (!this.keyboard.X) {
      this.throwInputLocked = false;
    }
  }

  throwRook() {
    let direction = this.character.imgDirectionChange ? -1 : 1;
    let rookX = direction > 0 ? this.character.x + this.character.width - 60 : this.character.x + 30
    let rookY = this.character.y + 80;
    let rook = new ThrowableObject(rookX, rookY);

    this.assignWorld(rook);
    rook.launch(direction);
    this.thrownRooks.push(rook);
    this.throwableObjects.removeRook(1);
  }

  updateThrownRooks() {
    this.thrownRooks.forEach(rook => rook.updateThrow());
    this.handleThrownRookHits();
    this.thrownRooks = this.thrownRooks.filter(rook => !rook.hasHitTarget && !rook.isOffscreen(this.camera_x, this.canvas.width));
  }

  handleThrownRookHits() {
    this.thrownRooks.forEach(rook => {
      let hitEnemy = this.lvl.enemies.find(enemy =>
        !enemy.isDying &&
        !enemy.isDead &&
        this.isCollidingBetween(rook, enemy)
      );

      if (!hitEnemy) return;

      rook.hasHitTarget = true;
      this.handleEnemyDefeat(hitEnemy);
    });

    this.thrownRooks.forEach(rook => {
      if (rook.hasHitTarget || this.aliaBoss.isDead) return;
      if (!this.isCollidingBetween(rook, this.aliaBoss)) return;

      rook.hasHitTarget = true;
      this.aliaBoss.hit();
      this.updateBossLifeBar();
    });
  }

  isCollidingBetween(firstObject, secondObject) {
    let firstArea = firstObject.getCollisionArea();
    let secondArea = secondObject.getCollisionArea();

    return (
      firstArea.x + firstArea.width > secondArea.x &&
      firstArea.x < secondArea.x + secondArea.width &&
      firstArea.y + firstArea.height > secondArea.y &&
      firstArea.y < secondArea.y + secondArea.height
    );
  }

  isCollidingWithCharacter(object) {
    let characterArea = this.character.getCollisionArea();
    let objectArea = object.getCollisionArea();

    return (
      characterArea.x + characterArea.width > objectArea.x &&
      characterArea.x < objectArea.x + objectArea.width &&
      characterArea.y + characterArea.height > objectArea.y &&
      characterArea.y < objectArea.y + objectArea.height
    );
  }

  // Check if the character is stomping on the enemy
  isStompingEnemy(enemy) {
    let characterArea = this.character.getCollisionArea();
    let enemyArea = enemy.getCollisionArea();
    let characterFeet = characterArea.y + characterArea.height;

    return this.character.vcY < 0 && characterFeet <= enemyArea.y + 25;
  }

  bounceOffEnemy(enemy) {
    let characterArea = this.character.getCollisionArea();
    let enemyArea = enemy.getCollisionArea();

    this.character.y = enemyArea.y - characterArea.height - characterArea.offsetY;
    this.character.vcY = 5;
  }

  handleEnemyDefeat(enemy) {
    let dyingDuration = enemy.die();

    setTimeout(() => {
      this.spawnCoinAt(enemy);
      this.removeEnemy(enemy);
    }, dyingDuration);
  }

  spawnCoinAt(enemy) {
    let enemyArea = enemy.getCollisionArea();
    let coinX = enemyArea.x + enemyArea.width / 2 - 15;
    let coinY = enemyArea.y + enemyArea.height / 2 - 15;

    let coin = new Coins(coinX, coinY);
    this.assignWorld(coin);
    this.lvl.environmentObjects.push(coin);
  }

  removeEnemy(enemyToRemove) {
    this.lvl.enemies = this.lvl.enemies.filter(enemy => enemy !== enemyToRemove);
  }
}