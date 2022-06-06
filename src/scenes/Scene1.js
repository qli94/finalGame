class Scene1 extends Phaser.Scene{
    constructor(){
        super("level1Scene");
    }
    preload(){
        
        this.load.path = "./assets/";
        this.load.image('platform', '1_plateform_center.png');
        this.load.image('player','character.png');
        this.load.image('1', 'scene1.png');
        this.load.image('monster', 'enemy.png');
        this.load.audio('bgm1', 'background.wav');
        this.load.audio('jump', 'jump.wav');
        this.load.image('trash','trash1.png');
        this.load.audio('duck','crouch.wav');
        //this.load.spritesheet("monster", "enemyAnimate.png", {
            //frameWidth: 40,
            //frameHeight: 70
       // });
    }
    create(){

        this.bgm1 = this.sound.add('bgm1');
        this.jump_sound = this.sound.add('jump');
        this.duck = this.sound.add('duck');
        // add background music
        this.bgm1.play();

        this.jumpSpeed = -1000;
        this.scroll_speed = 5;
        this.speeding = 1;
 
        
        this.scenes = this.add.tileSprite(0, 0, game.config.width, game.config.height, '1').setOrigin(0);

        this.player = this.physics.add.sprite(gameOptions.playerStartPosition, game.config.height / 2, "player");
        this.player.setGravityY(gameOptions.playerGravity);

        //this.fire = this.physics.add.sprite(game.config.width/2, game.config.height/2, 'fire').setScale(SCALE);

        // player state
        this.playerState = 1;
        
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        //keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        this.anims.create({
            key: "run",
            frames: this.anims.generateFrameNumbers("monster", {
                start: 0,
                end: 1
            }),
            frameRate: 20,
            repeat: -1
        });

        // monster
        this.monster = this.physics.add.sprite(game.config.width, 700 ,  'monster').setOrigin(0);
        //this.add.sprite(game.config.width, 500, 'monster').play('run');
        //this.monster.anims.play("rotate");
        this.monster.body.allowGravity = false;

        this.trash = this.physics.add.sprite(Math.random()*(490-420) + 220, game.config.width, 'trash').setOrigin(0);
        this.trash.body.allowGravity = false;

       
        this.enemy = this.add.group();
        this.enemy.add(this.monster);

        this.monster.body.setVelocityX(-300);


        this.platformGroup = this.add.group({
 
            removeCallback: function(platform){
                platform.scene.platformPool.add(platform)
            }
        });
 
        // pool
        this.platformPool = this.add.group({
 
            removeCallback: function(platform){
                platform.scene.platformGroup.add(platform)
            }
        });
  

        // number of consecutive jumps made by the player
        this.playerJumps = 0;
 
        // adding platforms
        this.addPlatform(game.config.width, game.config.width / 1.5);

        // setting collisions between the player and the platform group
        this.physics.add.collider(this.player, this.platformGroup);
 
        this.physics.add.collider(this.monster, this.platformGroup);
        this.physics.add.collider(this.monster,  this.player, ()=>{
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
            this.playerState--;
        });

        this.clock = this.time.delayedCall(15000, () => {
           
        }, null, this);

        // ---------------------------- count down --------------------------
        let textConfig = {
            fontFamily: 'Fantasy',
            fontSize: '90px',
            color: '#ffcc66',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.timerRight = this.add.text(game.config.width/2-8, 12, + this.clock.getElapsedSeconds(), textConfig);

        this.transition1Scene = this.time.delayedCall(15000, () => {
           this.scene.start('transition1Scene');  
           this.bgm1.stop();
        }, null, this);

        // == ----------------------------------------------------------------- ==

        this.physics.add.overlap(this.player, this.trashGroup, function(player, trash){
 
        }, null, this);

        
        
    }

   //jump() {
        //if((!this.dying) && (this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < gameOptions.jumps))){
          //  if(this.player.body.touching.down){
          //      this.playerJumps = 0;
          //  }
           // this.player.setVelocityY(gameOptions.jumpForce * -1);
           // this.playerJumps ++;
 
            // stop animation
            //this.player.anims.stop();
       // }
   // }


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
            platform.tileScaleX = 1.5 / platform.scaleX;
        }
        else{
            platform = this.add.tileSprite(posX, posY, platformWidth, 60, "platform");
            this.physics.add.existing(platform);
            platform.body.setImmovable(true);
            platform.body.setVelocityX(Phaser.Math.Between(gameOptions.platformSpeedRange[0], gameOptions.platformSpeedRange[1]) * -1);
            platform.setDepth(2);
            this.platformGroup.add(platform);
        }
        this.nextPlatformDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);

        if(this.addedPlatforms > 1){
            
            if(Phaser.Math.Between(1, 100) <= gameOptions.trashPercent){
                if(this.trashPool.getLength()){
                    let trash = this.trashPool.getFirst();
                    trash.x = posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth / 2) - 30;
                    trash.y = posY - 50;
                    trash.alpha = 1;
                    trash.active = true;
                    trash.visible = true;
                    this.trashPool.remove(trash);
                }
                else{
                    let trash = this.physics.add.sprite(posX, posY - 100, "trash");
                    trash.setImmovable(true);
                    trash.setVelocityX(platform.body.velocity.x);
                    //trash.anims.play("rotate");
                    trash.setDepth(0);
                    this.trashGroup.add(trash);
                }
            }
        }

 
    }
 
  
    update(){

        // game over
        if(this.player.y > game.config.height||this.playerState <= 0||this.player.x<-30){
            this.gameover = true;
            this.bgm1.stop();
            this.scene.start('overScene');
        }
        this.player.x = gameOptions.playerStartPosition;

        if(this.monster.body.x <-200){
            this.monster_reset();
        }
    
       // if(this.trash.body.y > 300||this.trash.body.velocity.y==0){
       //     this.trash_reset();
       // }
        
       this.scenes.tilePositionX += this.scroll_speed;

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
            if(platform.x < - platform.displayWidth / 2.5){
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
            this.addPlatform(nextPlatformWidth, game.config.width + nextPlatformWidth / 1.5, nextPlatformHeight);
        }

   

    // count down
    this.time1 = Math.trunc(15 - this.clock.getElapsedSeconds());
    this.timerRight.text = this.time1;
    }
    monster_reset(){
        this.monster.x = game.config.width+250;
        this.num = (-1*((Math.random()*(500-300)+300)))*this.speeding;
        this.monster.body.setVelocityX(this.num);

    }
    //trash_reset(){
       // this.trash.y = game.config.height+35;
      //  this.position = (-1*((Math.random()*(450-380)+340)))*this.speeding;
      //  this.trash.body.setVelocityY(this.position);
   // }
}