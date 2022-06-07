class Scene2 extends Phaser.Scene{
    constructor(){
        super("level2Scene");
    }
    preload(){
        this.load.path = "./assets/";
        this.load.image('platform', 'platform.png');
        this.load.image('player','character.png');
        this.load.image('2', 'scene2.png');
        this.load.image('monster', 'enemy.png');
        this.load.audio('bgm2','Scene2.wav');
        this.load.audio('jump', 'jump.wav');
        this.load.audio('duck','crouch.wav');
        this.load.audio('bonus','bonus.wav');
        this.load.audio('hit','hitt.wav');
        //this.load.image('fire','fire.png');

        this.load.spritesheet("coin", "coin.png", {
            frameWidth: 20,
            frameHeight: 20
        });
        this.jump = 1;
        
    }
    create(){

        this.bgm2 = this.sound.add('bgm2');
        this.jump_sound = this.sound.add('jump');
        this.duck = this.sound.add('duck');
        this.bonus = this.sound.add('bonus');

        this.coinScore = 0;
        this.jumpSpeed = -1000;
        this.scroll_speed = 8.5;
        this.speeding = 1;

        this.bgm2.play();

        this.scenes = this.add.tileSprite(0, 0, game.config.width, game.config.height, '2').setOrigin(0);

        this.player = this.physics.add.sprite(gameOptions.playerStartPosition, game.config.height / 2, "player");
        this.player.setGravityY(gameOptions.playerGravity);

        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // player state
        this.playerState = 1;
 
        this.monster = this.physics.add.sprite(game.config.width, Math.random()*(490-420) + 220,  'monster').setOrigin(0);
        this.monster.body.allowGravity = false;
        this.enemy = this.add.group();
        this.enemy.add(this.monster);

        this.anims.create({
            key: "rotate",
            frames: this.anims.generateFrameNumbers("coin", {
                start: 0,
                end: 5
            }),
            frameRate: 20,
            yoyo: true,
            repeat: -1
        });

        // group with all active platforms.
        this.platformGroup = this.add.group({
 
            // once a platform is removed, it's added to the pool
            removeCallback: function(platform){
                platform.scene.platformPool.add(platform)
            }
        });
 
        // platform pool
        this.platformPool = this.add.group({
 
            removeCallback: function(platform){
                platform.scene.platformGroup.add(platform)
            }
        });
 
        // group with all active coins.
        this.coinGroup = this.add.group({
 
            
            removeCallback: function(coin){
                coin.scene.coinPool.add(coin)
            }
        });
 
        // coin pool
        this.coinPool = this.add.group({
 
          
            removeCallback: function(coin){
                coin.scene.coinGroup.add(coin)
            }
        });
 
   
        this.addedPlatforms = 0;
 
      
        this.playerJumps = 0;
 
        
        this.addPlatform(game.config.width, game.config.width / 2, game.config.height * gameOptions.platformVerticalLimit[1]);
 
  
        this.gameover = false;
 
        // setting collisions between the player and the platform group
        //this.platformCollider = this.physics.add.collider(this.player, this.platformGroup, function(){
 
            // play "run" animation if the player is on a platform
            //if(!this.player.anims.isPlaying){
               // this.player.anims.play("run");
           // }
       // }, null, this);
        this.physics.add.collider(this.player, this.platformGroup);
        let textConfig2 = {
            fontFamily: 'Fantasy',
            fontSize: '30px',
            color: '#5C44C2',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        this.score = 0;
        this.scoreCurrent = this.add.text(10, 10, "Current Score: 0", textConfig2).setOrigin(0);
        this.time.addEvent({ delay: 3000, callback: this.miles, callbackScope: this, loop: true });
        

        // setting collisions between the player and the coin group
        this.physics.add.overlap(this.player, this.coinGroup, this.collectCoin, null, this)

        this.physics.add.collider(this.monster, this.platformGroup);
        this.physics.add.collider(this.monster,  this.player, ()=>{
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
            this.hit.play();
            this.playerState--;
        });
        

        this.monster.body.setVelocityX(-700);


    }
    collectCoin(player, coin){
        coin.disableBody(true, true);
        this.coinScore += 1;
        this.scoreCurrent.text = "Current Score: " + this.coinScore;
        this.sound.play('bonus');
    }
 
    addPlatform(platformWidth, posX, posY){
        this.addedPlatforms ++;
        let platform;
        if(this.platformPool.getLength()){
            platform = this.platformPool.getFirst();
            platform.x = posX;
            platform.y = posY;
            platform.active = true;
            platform.visible = true;
            this.platformPool.remove(platform);
           
            platform.displayWidth = platformWidth;
            platform.tileScaleX = 1 / platform.scaleX;
        }
        else{
            platform = this.add.tileSprite(posX, posY, platformWidth, 50, "platform");
            this.physics.add.existing(platform);
            platform.body.setImmovable(true);
            platform.body.setVelocityX(Phaser.Math.Between(gameOptions.platformSpeedRange[0], gameOptions.platformSpeedRange[1]) * -1);
            platform.setDepth(2);
            this.platformGroup.add(platform);
        }
        this.nextPlatformDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);
 
        
        if(this.addedPlatforms > 1){
            
            if(Phaser.Math.Between(1, 100) <= gameOptions.coinPercent){
                if(this.coinPool.getLength()){
                    let coin = this.coinPool.getFirst();
                    coin.x = posX;
                    coin.y = posY - 100;
                    coin.alpha = 1;
                    coin.active = true;
                    coin.visible = true;
                    this.coinPool.remove(coin);
                }
                else{
                    let coin = this.physics.add.sprite(posX, posY - 100, "coin");
                    coin.setImmovable(true);
                    coin.setVelocityX(platform.body.velocity.x);
                    coin.anims.play("rotate");
                    coin.setDepth(2);
                    this.coinGroup.add(coin);
                }
            }
        }
}
 
    
    
    update(){
        console.log(this.coinScore);
       
        // game over
        if(this.player.y > game.config.height||this.playerState <= 0||this.player.x<-30){
            this.gameOver = true;
            this.bgm2.stop();
            this.scene.start('over2Scene');
        }
        this.player.x = gameOptions.playerStartPosition;

        if (this.coinScore == 10){
            this.scene.start('transition2Scene');
            this.bgm2.stop();
        }

        if (Phaser.Input.Keyboard.JustDown(keyR)){
            this.bgm2.stop();
            this.scene.start('level2Scene');
        }

        if(this.monster.body.x <-200){
            this.monster_reset();
        }

        if(this.jump>0 && Phaser.Input.Keyboard.DownDuration(keyUP,100)&&!keyDOWN.isDown) {
         
            this.jump_sound.play();
            this.player.body.setVelocityY(-500);
            this.jumping=true;
        }
        if(this.jumping && keyDOWN.isUp) {

            this.jump--;
            this.jumping = false;
        }
        if(this.player.body.onFloor()){
            this.jump = 1;
            this.jumping=false;

        }

        if(keyDOWN.isDown){
            
            if(Phaser.Input.Keyboard.JustDown(keyDOWN)){
                this.duck.play(); 
           
             }
            
            // initial size
            this.player.setSize(75,50);
            // changing size
            this.player.setDisplaySize(55,30);
            
            if(!this.jumping){
            this.player.body.setVelocityY(700);
            }
        }

        if(Phaser.Input.Keyboard.JustUp(keyDOWN)||this.player.y>game.config.height){
              
            this.player.body.setVelocityY(0);
          
            // jumping high after pressing keyDOWN
            this.player.y = 450;
            // player's position after pressing keyDOWN
            this.player.setSize(100,100);
            // player's scale after pressing keyDOWN
            this.player.setDisplaySize(100,100);

        }

       
        // recycling platforms
        let minDistance = game.config.width;
        let rightmostPlatformHeight = 0;
        this.platformGroup.getChildren().forEach(function(platform){
            let platformDistance = game.config.width - platform.x - platform.displayWidth / 2;
            if(platformDistance < minDistance){
                minDistance = platformDistance;
                rightmostPlatformHeight = platform.y;
            }
            if(platform.x < - platform.displayWidth / 2){
                this.platformGroup.killAndHide(platform);
                this.platformGroup.remove(platform);
            }
        }, this);

        this.coinGroup.getChildren().forEach(function(coin){
            if(coin.x < - coin.displayWidth / 2){
                this.coinGroup.killAndHide(coin);
                this.coinGroup.remove(coin);
            }
        }, this);
 
        // adding new platforms
        if(minDistance > this.nextPlatformDistance){
            let nextPlatformWidth = Phaser.Math.Between(gameOptions.platformSizeRange[0], gameOptions.platformSizeRange[1]);
            let platformRandomHeight = gameOptions.platformHeighScale * Phaser.Math.Between(gameOptions.platformHeightRange[0], gameOptions.platformHeightRange[1]);
            
            let nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
            let minPlatformHeight = game.config.height * gameOptions.platformVerticalLimit[0];
            let maxPlatformHeight = game.config.height * gameOptions.platformVerticalLimit[1];
            let nextPlatformHeight = Phaser.Math.Clamp(nextPlatformGap, minPlatformHeight, maxPlatformHeight);
            this.addPlatform(nextPlatformWidth, game.config.width + nextPlatformWidth / 2, nextPlatformHeight);
        }
        if(!this.gameOver){
            this.scenes.tilePositionX += this.scroll_speed;
           // this.player.onGround = this.player.body.touching.down;

        }

    }
    monster_reset(){
        this.monster.x = game.config.width+250;
        this.num = (-1*((Math.random()*(500-300)+500)))*this.speeding;
        this.monster.body.setVelocityX(this.num);

    }
}