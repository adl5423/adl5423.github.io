import Phaser from 'phaser';

export class EnemyGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);
    this.createMultiple({
      key: 'enemy',
      frameQuantity: 25,
      classType: Enemy
    });
  }

  reset() {
    this.getChildren().forEach((enemy) => {
      enemy.move();
    });
  }
}

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'enemy');
    this.speed = Phaser.Math.Between(100, 200);
  }

  move() {
    this.body.collideWorldBounds = true;
    this.body.onWorldBounds = true;
    this.x = Phaser.Math.Between(50, 500);
    this.y = 30;
    this.setActive(true);
    this.setVisible(true);
    this.dirx = Phaser.Math.Between(-1, 1);
    this.diry = Phaser.Math.Between(1, 2);
    this.setVelocity(this.dirx * this.speed, this.diry * this.speed);
  }

  onWorldBounds() {
    this.move();
  }
}
