class Ending extends Phaser.Scene {
    constructor() {
      super("endingScene");
    }

    preload() {
        
        this.load.path = "./assets/";
        this.load.image('ending', 'end.png');
        this.load.audio('end', 'end.wav');
    }

    create() {

        this.end = this.sound.add('end');

        this.end.play();

        this.scenes = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'ending').setOrigin(0);

        // keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            this.sound.play('blip');
            this.end.stop();
            this.scene.start('menuScene');    
        }
    }
}