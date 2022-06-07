class Credit extends Phaser.Scene {
    constructor() {
      super("creditScene");
    }

    preload() {
        
        this.load.path = "./assets/";
        this.load.image('credit', 'credit.png');
        this.load.audio('blip', 'blip.wav');
    }

    create() {

        this.scenes = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'credit').setOrigin(0);

        // keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            this.sound.play('blip');
            this.scene.start('menuScene');    
        }
    }
}