class World {
  character = new Character();
  lifeBar = new LifeBar();
  coinsBar = new CoinsBar();
  throwableObjects = new ThrowableObject(16, 111, true);
  thrownRooks = [];
  lvl = lvl_1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  throwInputLocked = false;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.checkCollisions();
  }

  setWorld() {
    this.character.world = this;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawBackgrounds();

    this.ctx.translate(this.camera_x, 0);
    
    this.addObjectsToMap(this.lvl.platformObjects);
    this.addObjectsToMap(this.lvl.environmentObjects);
    this.addObjectsToMap(this.lvl.enemies);
    this.addObjectsToMap(this.thrownRooks);
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.lifeBar);
    this.addToMap(this.coinsBar);
    this.addToMap(this.throwableObjects);
    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);

    this.ctx.translate(-this.camera_x, 0);

    if (this.character.isDead) {
      this.drawGameOverOverlay();
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

  addObjectsToMap(objects) {
    objects.forEach(object => {
      this.addToMap(object);
    });
  }

  addToMap(movableObject) {
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
      this.lvl.platformObjects.forEach(platform => {
        if (this.character.isLandingOn(platform)) {
          this.character.landOn(platform);
        }
      });

      this.collectCoins();
      this.collectRooks();
      this.handleThrowInput();
      this.updateThrownRooks();

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

    this.lvl.environmentObjects.push(new Coins(coinX, coinY));
  }

  removeEnemy(enemyToRemove) {
    this.lvl.enemies = this.lvl.enemies.filter(enemy => enemy !== enemyToRemove);
  }
}