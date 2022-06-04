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
        let menuConfig = {
            fontFamily: 'Fantasy',
            fontSize: '90px',
            color: '#6600ff',
            align: 'center',
            padding: {
                top: 5,
                bottom: 15,
            },
            fixedWidth: 0
        }
        
        // load background
        this.scenes = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'poster').setOrigin(0);

        // other texts config
        menuConfig.fontSize = '40px';
        menuConfig.color = '#6699ff';
        menuConfig.fontFamily = 'Courier';

        // other texts
        //this.add.text(game.config.width/2, game.config.height/2.5, 'LEFT To Start', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/1.8, 'SPACE to Start', menuConfig).setOrigin(0.5);
        //this.add.text(game.config.width/2, game.config.height/1.4, 'SPACE for Credit', menuConfig).setOrigin(0.5);

        // keys
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
       // if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
         //   this.sound.play('blip');
         //   this.scene.start('playScene');    
       // }
        //if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          //  this.sound.play('blip');
         //   this.scene.start('level1Scene'); 
      //  }
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.sound.play('blip');
            this.scene.start('level1Scene');
        }

    }
}