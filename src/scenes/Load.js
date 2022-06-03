class Load extends Phaser.Scene {
    constructor() {
      super("loadScene");
    }

    preload() {
        this.load.image('load', './assets/night_back03.png');
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
      
     
        
        this.scenes = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'night_back03').setOrigin(0);

        // detail contents
        textConfig.fontSize = '30px';
        textConfig.color = '#6666ff';

        this.add.text(game.config.width/2, game.config.height/3, 'The Next Level will begin in', textConfig).setOrigin(0.5,1);
        this.add.text(game.config.width/2, game.config.height/2, 'If you are ready, please press SPACE', textConfig).setOrigin(0.5,1);


        // keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            this.sfx_select.play();
            this.scene.start('loadScene');    
        }
    }
}