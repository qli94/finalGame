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
    scene: [Menu, Credit, Instruction, Scene1, Gameover1, Transition1, Scene2, Gameover2, Transition2, Scene3, Gameover3, Ending]
   // scene: [Scene3]
};

let game = new Phaser.Game(config);

let gameOptions = {
    platformSpeedRange: [300, 300],
    spawnRange: [100, 300],
    platformSizeRange: [300, 300],
    platformHeightRange: [-5, 5],
    platformHeighScale: 20,
    platformVerticalLimit: [0.4, 0.8],
    playerGravity: 900,
    jumpForce: 700,
    playerStartPosition: 200,
    jumps: 2,
    coinPercent: 50,
    firePercent: 25,
    //trashPercent: 30
};

let keyUP, keyRIGHT, keyLEFT, keySPACE, keyR, keyDOWN;

let cursors;

let highScore = 0;

const SCALE = 0.5;

const tileSize = 26;




