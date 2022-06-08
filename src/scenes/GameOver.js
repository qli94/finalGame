class Gameover1 extends Phaser.Scene {
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

class Gameover2 extends Phaser.Scene {
    constructor() {
      super("over2Scene");
    }

    preload() {
        this.load.image('GameOver', './assets/GameOver23.png');
        this.load.audio('over','./assets/Gameover.wav');
    }

    create() {

        this.over = this.sound.add('over');

        this.over.play();
        
        this.scenes = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'GameOver').setOrigin(0);

       
        // keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.start('menuScene');    
            this.over.stop();
        }
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.start('level2Scene');
            this.over.stop();        }
    }
}

class Gameover3 extends Phaser.Scene {
    constructor() {
      super("over3Scene");
    }

    preload() {
        this.load.image('GameOver', './assets/GameOver23.png');
        this.load.audio('over','./assets/Gameover.wav');
    }

    create() {

        this.over = this.sound.add('over');

        this.over.play();
        
        this.scenes = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'GameOver').setOrigin(0);

       
        // keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.start('menuScene');    
            this.over.stop();
        }
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.start('level3Scene');
            this.over.stop();        }
    }
}