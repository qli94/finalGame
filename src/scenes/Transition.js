class Transition1 extends Phaser.Scene {
    constructor() {
      super("transition1Scene");
    }

    preload() {
        this.load.image('transition1', './assets/night_back03.png');
 
    }

    create() {
        let textConfig = {
            fontFamily: 'Fantasy',
            fontSize: '40px',
            color: '#66ffff',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        
        this.scenes = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'transition1').setOrigin(0);

        this.add.text(game.config.width/2, game.config.height/3, 'Welcome to the next level !!', textConfig).setOrigin(0.5,1);
        this.add.text(game.config.width/2, game.config.height/1.5, 'If you are ready, please press SPACE', textConfig).setOrigin(0.5,1);

       

        // keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

        

    update() {


        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            
            this.scene.start('level2Scene');    
        }
    }
}

class Transition2 extends Phaser.Scene {
    constructor() {
      super("transition2Scene");
    }

    preload() {
        this.load.image('transition2', './assets/spScene.png');
    }

    create() {
        let textConfig = {
            fontFamily: 'Fantasy',
            fontSize: '40px',
            color: '#66ffff',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        
        this.scenes = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'transition2').setOrigin(0);

        this.add.text(game.config.width/2, game.config.height/3, 'There is still the LAST LEVEL !!', textConfig).setOrigin(0.5,1);
        this.add.text(game.config.width/2, game.config.height/1.5, 'If you are ready, please press SPACE', textConfig).setOrigin(0.5,1);


        // keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            
            this.scene.start('level3Scene');    
        }
    }
}