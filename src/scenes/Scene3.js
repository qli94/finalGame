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
    }
    create(){

        this.bgm3 = this.sound.add('bgm3');
        this.jump_sound = this.sound.add('jump');

        this.jumpSpeed = -1000;
        this.scroll_speed = 10;
        this.speeding = 1;

        this.bgm3.play();
 
        this.scenes = this.add.tileSprite(0, 0, game.config.width, game.config.height, '3').setOrigin(0);

        this.player = this.physics.add.sprite(gameOptions.playerStartPosition, game.config.height / 2, "player");
        this.player.setGravityY(gameOptions.playerGravity);


        // player state
        this.playerState = 1;
        
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // monster
        this.monster = this.physics.add.sprite(game.config.width, 500 ,  'monster').setOrigin(0);
        this.monster.body.allowGravity = false;

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
 
        // adding a platform to the game, the arguments are platform width and x position
        this.addPlatform(game.config.width, game.config.width / 1.5);

 
        // setting collisions between the player and the platform group
        this.physics.add.collider(this.player, this.platformGroup);
 
        this.physics.add.collider(this.monster, this.ground);
        this.physics.add.collider(this.monster,  this.player, ()=>{
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
            this.playerState--;
        });

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
        this.time.addEvent({ delay: 3000, callback: this.miles, callbackScope: this, loop: true });

        //if(highScore>=0){
            //this.highScore = this.add.text(265, 80, "High Score: "+ highScore+ " miles", textConfig2).setOrigin(1,0);
       // }

    }
 
    // the core of the script: platform are added from the pool or created on the fly
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
            platform = this.add.tileSprite(posX, posY, platformWidth, 60, "platform");
            this.physics.add.existing(platform);
            platform.body.setImmovable(true);
            platform.body.setVelocityX(Phaser.Math.Between(gameOptions.platformSpeedRange[0], gameOptions.platformSpeedRange[1]) * -1);
            platform.setDepth(2);
            this.platformGroup.add(platform);
        }
        this.nextPlatformDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);
 
    }
 
  
    update(){

        // game over
        if(this.player.y > game.config.height||this.playerState <= 0||this.player.x<-30){
            this.gameOver = true;
            this.bgm3.stop();
            this.scene.start('overScene');

            if(this.score > highScore){
                highScore = this.score;
            }
        }
        this.player.x = gameOptions.playerStartPosition;

        if(this.jump>0 && Phaser.Input.Keyboard.DownDuration(keyUP,100)&&!keyDOWN.isDown) {
         
            this.jump_sound.play();
            this.player.body.setVelocityY(-500);
            this.jumping=true;
        }
        if(this.jumping && keyDOWN.isUp) {

            this.jump--;
            this.jumping = false;
        }

        if(keyDOWN.isDown){
            
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

        if (this.score == 5){
            this.bgm3.stop();
            this.scene.start('menuScene');
            
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
        if(!this.gameOver){
            this.scenes.tilePositionX += this.scroll_speed;
            this.player.onGround = this.player.body.touching.down;

            if(this.player.onGround){
                this.jump = 1;
                this.jumping=false;
                
                
            
            }
    }
    if(this.monster.body.x <-200){
        this.monster_reset();
    }
    }

    miles(){
        this.score += 1;
        this.scoreCurrent.text = "Current Score: " + this.score + " miles";
    }

    monster_reset(){
        this.monster.x = game.config.width+50;
        this.num = (-1*((Math.random()*(500-300)+300)))*this.speeding;
        this.monster.body.setVelocityX(this.num);

    }
}