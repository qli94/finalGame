class Instruction extends Phaser.Scene {
    constructor() {
      super("instructionScene");
    }

    preload() {
        this.load.path = "./assets/";
        this.load.image('instruction', 'instruction.png');
        this.load.audio('blip', 'blip.wav');
    }

    create() {

        this.scenes = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'instruction').setOrigin(0);

        // keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.sound.play('blip');
            this.scene.start('level1Scene');    
        }
    }
}