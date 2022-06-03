class Scene3 extends Phaser.Scene {
    constructor() {
      super("level3Scene");
    }
    preload() {
        this.load.path = "./assets/";
        this.load.image('3', 'scene3.png');
        this.load.image('player','player.png');
        this.load.image('platform','platform_center.png');
        this.load.image('monster','enemy.png');
        //this.load.image('T','m2.png');
        this.load.audio('jump', 'jump.wav');
        this.load.audio('blip', 'blip.wav');
        this.load.audio('sit', 'sit.wav');
        this.load.audio('bgm1', 'background.wav');
        
       
    }

    create() { 
        // define keys
        this.jump_sound = this.sound.add('jump');
        this.sit = this.sound.add('sit');
        this.bgm1 = this.sound.add('bgm1');
        this.bgm2 = this.sound.add('bgm2');

        // add background music
        this.bgm1.stop();
        this.bgm1.play();

        // adding keys
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        
        // setting values
        this.jumpSpeed = -1000;
        this.changedSpeed = 5;
        this.speeding = 1;
        this.physics.world.gravity.y = 2600; 

        this.scene3 = this.add.tileSprite(0, 0, game.config.width, game.config.height, '3').setOrigin(0);

        this.ground = this.add.group();
        this.enemy = this.add.group();

        // initial player setting
        this.player = this.physics.add.sprite(50, 450, 'player').setOrigin(0.5,0.5);

        // player state
        this.playerState = 1;

        // make ground tiles
        for(let i = 0; i < game.config.width; i += tileSize) { 
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize,  'platform').setScale(SCALE).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            groundTile.setDepth(1);
            this.ground.add(groundTile);
        }
        

        // create monster(the big one)
        this.monster = this.physics.add.sprite(game.config.width, 455 ,  'monster').setOrigin(0);
        this.monster.body.allowGravity = false;
        
        

       
        
        // add enemies to group
        this.enemy = this.add.group();
       
        this.enemy.add(this.monster);
     
        
        
        
        // player's physical settings
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.monster, this.ground);
        this.physics.add.collider(this.monster,  this.player, ()=>{
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
            this.playerState--;
        });
       

        // game over flag
        this.gameOver = false;
        

        // speed setting
        this.monster.body.setVelocityX(-300);
        
    

    }
    update() {

        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            this.sound.play('blip');
            this.bgm1.stop();
            this.scene.start('transition1Scene');
        }
            
        
        if (Phaser.Input.Keyboard.JustDown(keyF)) {
            this.sound.play('blip');
            this.scene.start('level3Scene');
            this.bgm1.stop();
            //this.bgm2.stop();
    }

            
        // game ending handling
        if(this.gameOver){

            this.scene.start('level1Scene');
            this.bgm1.stop();
            //this.bgm2.stop();
        }


        if(!this.gameOver){
            this.scene3.tilePositionX += this.changedSpeed;
            this.player.onGround = this.player.body.touching.down;

            

            if(this.player.x<50){
                this.state = "behind";
            
            }else if(this.player.x>70){
               this.state = "ahead";
            }
            else{
                this.state = "zone";
            }
            
            if(this.player.onGround){
                this.jump = 1;
                this.jumping=false;
                
                
            
            }
         
            switch(this.state){
                case "behind":
                    this.player.body.velocity.x =20;
                    break;
                case "ahead":
                    this.player.body.velocity.x =-20;
                    break;
                case "zone":
                    this.player.body.velocity.x = 0;

            }
          

            // jumping control
            if(this.jump>0 && Phaser.Input.Keyboard.DownDuration(keyUP,100)&&!keyDOWN.isDown) {
         
                this.jump_sound.play();
                this.player.body.setVelocityY(-800);
                this.jumping=true;
            }
            if(this.jumping && keyDOWN.isUp) {
 
                this.jump--;
                this.jumping = false;
            }


            // change setting while jumping to scene2
            if(this.monster.body.x <-200){
                this.monster_reset();
            }
           
           

            if(keyDOWN.isDown){
                if(Phaser.Input.Keyboard.JustDown(keyDOWN)){
                   this.sit.play(); 
              
                }
                // initial size
                this.player.setSize(75,50);
                // changing size
                this.player.setDisplaySize(55,30);
                
                if(!this.jumping){
                this.player.body.setVelocityY(700);
                }
            }


            // player's state after pressing DOWN
            if(Phaser.Input.Keyboard.JustUp(keyDOWN)||this.player.y>game.config.height){
              
                this.player.body.setVelocityY(0);
              
                // jumping high after pressing keyDOWN
                this.player.y = 450;
                // player's position after pressing keyDOWN
                this.player.setSize(100,100);
                // player's scale after pressing keyDOWN
                this.player.setDisplaySize(100,100);

            }

            if(this.playerState <= 0||this.player.x<-30){
                
                this.gameOver = true;
            }
        }
        
        //this.time1 = Math.trunc(15 - this.clock.getElapsedSeconds());
       // this.timerRight.text = this.time1;

        
    }





    monster_reset(){
        this.monster.x = game.config.width+50;
        this.num = (-1*((Math.random()*(500-300)+300)))*this.speeding;
        this.monster.body.setVelocityX(this.num);
        

    }

}