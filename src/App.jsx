import React, { useEffect, useState } from 'react';
import Phaser from 'phaser';
import './App.css';
import { LaserGroup } from './LaserGroup';
import { EnemyGroup } from './EnemyGroup';
import { playerDestroyed, newGame } from './functions';

const App = () => {
  const [lives, setLives] = useState(3);
  const [startGame, setStartGame] = useState(false);

  const handleLivesChange = (e) => {
    setLives(parseInt(e.target.value, 10));
  };

  const handleStartGame = () => {
    setStartGame(true);
  };

  useEffect(() => {
    if (!startGame) return;

    const config = {
      type: Phaser.AUTO,
      width: 600,
      height: 800,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: {
        preload: preload,
        create: create,
        update: update
      }
    };

    const game = new Phaser.Game(config);

    function preload() {
      this.load.image('player', 'assets/player.png');
      this.load.image('laser', 'assets/laser.png');
      this.load.image('enemy', 'assets/enemy.png');
      this.load.atlas('explosion', 'assets/explosion.png', 'assets/explosion.json');
      this.load.audio('playerLaser', 'assets/sounds/laser_player.ogg');
      this.load.audio('playerDestroyed', 'assets/sounds/player_destroyed.ogg');
      this.load.audio('enemyDestroyed', 'assets/sounds/enemy_destroyed.ogg');
    }

    function create() {
      this.laserSound = this.sound.add('playerLaser');
      this.playerDestroyedSound = this.sound.add('playerDestroyed');
      this.enemyDestroyedSound = this.sound.add('enemyDestroyed');

      this.player = this.physics.add.sprite(300, 700, 'player');
      this.playerSpeed = 160;
      this.playerAlive = true;
      this.gameOver = false;

      this.laserGroup = new LaserGroup(this);
      this.enemyGroup = new EnemyGroup(this);
      for (let i = 0; i < this.enemyGroup.getLength(); i++) {
        this.enemyGroup.getChildren()[i].move();
      }

      this.score = 0;
      this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#FFFF00' });
      this.lives = lives; // Use the input value for lives
      this.livesText = this.add.text(16, 48, `lives: ${this.lives}`, { fontSize: '32px', fill: '#FFFF00' });
      this.restartText = this.add.text(40, 300, 'Press Shift to Try Again', { fontSize: '36px', fill: '#FFFF00' });
      this.restartText.visible = false;
      this.gameOverText = this.add.text(175, 200, 'Game Over', { fontSize: '50px', fill: '#FFFF00' });
      this.gameOverText.visible = false;

      this.emitter = this.add.particles(0, 0, 'explosion', {
        frame: ['red', 'yellow', 'green', 'blue', 'purple'],
        lifespan: 1000,
        speed: { min: 50, max: 100 },
        emitting: false
      });

      this.physics.add.overlap(this.enemyGroup, this.laserGroup, (enemy, laser) => {
        this.emitter.lifespan = 1000;
        this.emitter.explode(40, enemy.x, enemy.y);
        this.enemyDestroyedSound.play();
        enemy.move();
        laser.disableBody(true, true);
        this.score += 50;
        this.scoreText.setText('score: ' + this.score);
      });

      this.physics.add.overlap(this.player, this.enemyGroup, (player, enemy) => {
        this.emitter.explode(40, enemy.x, enemy.y);
        enemy.move();
        playerDestroyed(this);
      });

      this.cursorKeys = this.input.keyboard.createCursorKeys();
      this.input.keyboard.on('keydown-SPACE', () => {
        if (this.player.active === true) {
          this.laserSound.play();
          this.laserGroup.fireLaser();
        }
      });

      this.physics.world.on('worldbounds', (body) => {
        body.gameObject.onWorldBounds();
      });
    }

    function update() {
      if (this.cursorKeys.left.isDown && this.player.x > 20) {
        this.player.setVelocityX(-this.playerSpeed);
      } else if (this.cursorKeys.right.isDown && this.player.x < 580) {
        this.player.setVelocityX(this.playerSpeed);
      } else {
        this.player.setVelocityX(0);
      }

      if (this.cursorKeys.shift.isDown && this.playerAlive === false) {
        newGame(this);
      }
    }

    return () => {
      game.destroy(true);
    };
  }, [startGame, lives]);

  return (
    <div>
      {!startGame && (
        <div>
          <input
            type="number"
            value={lives}
            onChange={handleLivesChange}
            min="1"
            max="10"
            style={{ fontSize: '24px', padding: '10px', margin: '20px' }}
          />
          <button onClick={handleStartGame} style={{ fontSize: '24px', padding: '10px' }}>
            Start Game
          </button>
        </div>
      )}
      {startGame && <div id="game-container" />}
    </div>
  );
};

export default App;
