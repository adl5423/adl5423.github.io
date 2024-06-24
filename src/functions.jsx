export function playerDestroyed(scene) {
  scene.playerAlive = false;
  scene.restartText.visible = true;
  scene.emitter.lifespan = 4000;
  scene.emitter.explode(80, scene.player.x, scene.player.y);
  scene.playerDestroyedSound.play();
  scene.player.disableBody(true, true);

  scene.lives--;
  scene.livesText.setText('lives: ' + scene.lives);

  if (scene.lives <= 0) {
    scene.gameOver = true;
    scene.gameOverText.visible = true;
    scene.restartText.visible = true;
  }
}

export function newGame(scene) {
  scene.restartText.visible = false;
  scene.laserGroup.reset();
  scene.enemyGroup.reset();
  scene.emitter.lifespan = 1000;

  scene.playerAlive = true;
  scene.player.enableBody(true, 300, 700, true, true);

  if (scene.gameOver === true) {
    scene.gameOver = false;
    scene.gameOverText.visible = false;
    scene.score = 0;
    scene.scoreText.setText('score: ' + scene.score);
    scene.lives = 3;
    scene.livesText.setText('lives: ' + scene.lives);
  }
}
