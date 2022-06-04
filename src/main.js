let config = {
    type: Phaser.CANVAS,
    width: 1024,
    height: 768,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [Scene1, Transition1, Scene2, Transition2, Scene3, Gameover, Menu]
};

let game = new Phaser.Game(config);

let gameOptions = {
    platformSpeedRange: [300, 300],
    spawnRange: [90, 300],
    platformSizeRange: [90, 300],
    platformHeightRange: [-5, 5],
    platformHeighScale: 20,
    platformVerticalLimit: [0.4, 0.8],
    playerGravity: 900,
    jumpForce: 400,
    playerStartPosition: 200,
    jumps: 2,
    coinPercent: 25,
    firePercent: 25
};

let keyUP, keyRIGHT, keyLEFT, keySPACE, keyR, keyDOWN, keyF;

let cursors;

let highScore = 0;

const SCALE = 0.5;

const tileSize = 26;




