class Menu extends Phaser.Scene {
    constructor() {
      super('menuScene');
    }

    preload() {
        this.load.path = "./assets/";
        this.load.image('poster', 'menu.png');
        this.load.audio('jump', 'jump.wav');
        this.load.audio('blip', 'blip.wav');
        this.load.audio('bgm1', 'initial_background.wav');
        
    }
    create() {
        
        // load background
        this.scenes = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'poster').setOrigin(0);

        // other texts config
       

        // keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
      
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            this.sound.play('blip');
            this.scene.start('creditScene'); 
        }
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.sound.play('blip');
            this.scene.start('instructionScene');
        }

    }
}