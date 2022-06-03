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
    scene: [Scene1, Transition1, Scene2, Transition2, Scene3]
};

let game = new Phaser.Game(config);

let keyUP, keyRIGHT, keyLEFT, keySPACE, keyR, keyDOWN, keyF; keyRIGHT;

const SCALE = 0.5;

const tileSize = 26;




