class Gameover extends Phaser.Scene {
    constructor() {
      super("overScene");
    }

    preload() {
        this.load.image('Gameover', './assets/GameOver.png');
        this.load.audio('over','./assets/Gameover.wav');
    }

    create() {

        this.over = this.sound.add('over');

        this.over.play();
        
        this.scenes = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'Gameover').setOrigin(0);

       
        // keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.start('menuScene');    
            this.over.stop();
        }
    }
}