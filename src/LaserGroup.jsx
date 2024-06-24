import Phaser from 'phaser';

export class LaserGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);
    this.createMultiple({
      key: 'laser',
      frameQuantity: 20,
      active: false,
      visible: false,
      classType: Laser
    });
  }

  fireLaser() {
    const laser = this.getFirstDead(false);
    if (laser) {
      laser.fire(this.scene.player.x, this.scene.player.y);
    }
  }

  reset() {
    this.getChildren().forEach((laser) => {
      laser.disableBody(true, true);
    });
  }
}

export class Laser extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'laser');
    this.speed = 400;
  }

  fire(x, y) {
    this.body.collideWorldBounds = true;
    this.body.onWorldBounds = true;
    this.enableBody(true, x, y, true, true);
    this.setVelocityY(-this.speed);
  }

  onWorldBounds() {
    this.disableBody(true, true);
  }
}
