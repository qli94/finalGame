class Scene3 extends Phaser.Scene{
    constructor(){
        super("level3Scene");
    }
    preload(){
        this.load.path = "./assets/";
        this.load.image('platform', 'plateform_center.png');
        this.load.image('player','character.png');
        this.load.image('3', 'scene3.png');
        this.load.image('monster', 'enemy.png');
        this.load.audio('bgm3','Scene3.wav');
        this.load.audio('jump', 'jump.wav');
        this.load.audio('duck','crouch.wav');
        this.load.audio('bonus','bonus.wav');
        this.load.audio('hit','hitt.wav');
        this.load.audio('duck','crouch.wav');
        this.load.image('trash','trash2.png');
        
        //this.load.audio('over','Gameover.wav');
        //this.load.image('fire','fire.png');

      
        this.load.spritesheet("fire", "fire.png", {
            frameWidth: 40,
            frameHeight: 70
        });
    
        
    }
    create(){

        this.bgm3 = this.sound.add('bgm3');
        this.jump_sound = this.sound.add('jump');
        this.duck = this.sound.add('duck');
        //this.over = this.sound.add('over');
        this.hit = this.sound.add('hit');

        this.jumpSpeed = -1000;
        this.scroll_speed = 10;
        this.speeding = 1;
 
        this.bgm3.play();

        this.scenes = this.add.tileSprite(0, 0, game.config.width, game.config.height, '3').setOrigin(0);

      
        this.player = this.physics.add.sprite(gameOptions.playerStartPosition, game.config.height / 2, "player");
        this.player.setGravityY(gameOptions.playerGravity);
       // this.player.setDepth(2);

        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // player state
        this.playerState = 1;
 

        this.anims.create({
            key: "burn",
            frames: this.anims.generateFrameNumbers("fire", {
                start: 0,
                end: 4
            }),
            frameRate: 15,
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
       

        this.fireGroup = this.add.group({
 
            // once a firecamp is removed, it's added to the pool
            removeCallback: function(fire){
                fire.scene.firePool.add(fire)
            }
        });
 
        // fire pool
        this.firePool = this.add.group({
 
            // once a fire is removed from the pool, it's added to the active fire group
            removeCallback: function(fire){
                fire.scene.fireGroup.add(fire)
            }
        });
 
   
        this.addedPlatforms = 0;
 
      
        this.playerJumps = 0;
 

        this.addPlatform(game.config.width, game.config.width / 2, game.config.height * gameOptions.platformVerticalLimit[1]);
 
  
        this.gameover = false;
 
        // setting collisions between the player and the platform group
        this.platformCollider = this.physics.add.collider(this.player, this.platformGroup, function(){
 
            // play "run" animation if the player is on a platform
           // if(!this.player.anims.isPlaying){
           //     this.player.anims.play("run");
          //  }
        }, null, this);
 
        this.physics.add.overlap(this.player, this.fireGroup, function(player, fire){
 
            this.gameover = true;
            this.hit.play();
            this.bgm3.stop();
            this.scene.start('over3Scene');
            this.player.anims.stop();
            this.player.setFrame(2);
            this.player.body.setVelocityY(-200);
            this.physics.world.removeCollider(this.platformCollider);
 
        }, null, this);

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
        this.scoreCurrent = this.add.text(10, 10, "Current Score: "+ this.score + " miles", textConfig2).setOrigin(0);
        this.time.addEvent({ delay: 2500, callback: this.miles, callbackScope: this, loop: true });

        this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.addTrash2, callbackScope: this, loop: true });

    }
    addTrash2 (){
        this.trash2 = this.physics.add.sprite(game.config.width,  Phaser.Math.Between(100, 300), "trash");
        this.trash2.angle = 90;
        this.trash2.setVelocityX(-800);
        this.trash2.setDisplaySize(25, 55);
        this.physics.add.collider(this.trash2, this.player, ()=>{
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
            this.hit.play();
            this.playerState--;
        });
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
            platform = this.add.tileSprite(posX, posY, platformWidth, 55, "platform");
            this.physics.add.existing(platform);
            platform.body.setImmovable(true);
            platform.body.setVelocityX(Phaser.Math.Between(gameOptions.platformSpeedRange[0], gameOptions.platformSpeedRange[1]) * -1);
            platform.setDepth(2);
            this.platformGroup.add(platform);
        }
        this.nextPlatformDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);
 

        if(Phaser.Math.Between(1, 100) <= gameOptions.firePercent){
            if(this.firePool.getLength()){
                let fire = this.firePool.getFirst();
                fire.x = posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth);
                fire.y = posY - 30;
                fire.alpha = 1;
                fire.active = true;
                fire.visible = true;
                this.firePool.remove(fire);
            }
            else{
                let fire = this.physics.add.sprite(posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth), posY - 46, "fire");
                fire.setImmovable(true);
                fire.setVelocityX(platform.body.velocity.x);
                fire.setSize(4, 1, true)
                fire.anims.play("burn");
                fire.setDepth(2);
                this.fireGroup.add(fire);
            }
        }
        
}
 
    
    
    update(){

        // game over
        if(this.player.y > game.config.height||this.playerState <= 0||this.player.x<-30){
            this.gameOver = true;
            this.bgm3.stop();
            this.scene.start('over3Scene');
        }
        this.player.x = gameOptions.playerStartPosition;

        this.scenes.tilePositionX += this.scroll_speed;

        if (this.score == 10){
            this.scene.start('endingScene');
            this.bgm3.stop();
        }

        if (Phaser.Input.Keyboard.JustDown(keyR)){
            this.bgm3.stop();
            this.scene.start('level3Scene');
        }

        if (Phaser.Input.Keyboard.JustDown(keySPACE)){
            this.bgm3.stop();
            this.scene.start('menuScene');
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
     
    }
    miles(){
        this.score += 1;
        this.scoreCurrent.text = "Current Score: " + this.score + " miles";
    }
}