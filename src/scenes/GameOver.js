class Gameover extends Phaser.Scene {
    constructor() {
      super("overScene");
    }

    preload() {
        this.load.image('Gameover', './assets/GameOver.png');
    }

    create() {
        let textConfig = {
            fontFamily: 'Fantasy',
            fontSize: '90px',
            color: '#5C44C2',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
      
     
        
        this.scenes = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'Gameover').setOrigin(0);

        // detail contents
        textConfig.fontSize = '30px';
        textConfig.color = '#6666ff';

        //this.add.text(game.config.width/2, game.config.height/3, 'GAME OVER', textConfig).setOrigin(0.5,1);
        this.add.text(game.config.width/2, game.config.height/1.5, 'If you are ready to re-start, please press SPACE', textConfig).setOrigin(0.5,1);


        // keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.start('menuScene');    
        }
    }
}