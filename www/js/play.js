//import HealthBar from 'phaser-percent-bar';

var timerColor = "#00ff00";
var scoreColor = "rgba(255,255,255,0.7)";
var levelColor = "#68D81D";
var scoreFont = "Georgia, cursive";
var scoreBarColor = "be011f";
var scoreBarOutlineColor = 0xFFFFFF;
var timerBarColor = '#00ff00';
var scoreBar;
var scoreBarRectangle;
var spriteScore;
var timerBarRectangle;
var spriteTime;
var finalWarningOn = true;
var playMusic = true;


var playState = {


    create : function(){
        gamePaused = false;

        slingshotX = 450;
        slingshotY = 400;
        slingshotHeight = 340;
        tailWidth = 10;
        ballinitx=slingshotX+100;
        ballinity=slingshotY+65;
        ballsInMotion = [];
        buttonXPos = 1100;
        buttonYPos = 115;
        WALL_Z = 300;
        WALL_FLOOR = 260;
//    Scoring for game and levels
        currentLevel = 1;
        score = 0;
        levelGoalIncrement=[80,130,160,180,200,230,230,500];
        levelsGoals = [80,210,370,550,750,980,1210,1710];
        levelGoal = 80;
        // levelGoalIncrement=[10,130,160,180,200,230,230,260]; //for testing
        // levelsGoals = [10,20,40,80,750,980,1210,1470];  //for testing
        // levelGoal = 10; //for testing
        wrongHitPoints = 5;
        rightHitPoints = 10;

        bground = game.add.sprite(0,0,'background');
        bground.alpha = 1.0;
        bground.inputEnabled = true;

        //Collisions Groups
        studentCollisionGroup = game.physics.p2.createCollisionGroup();
        ballCollisionGroup = game.physics.p2.createCollisionGroup();
        teacherCollisionGroup = game.physics.p2.createCollisionGroup();
        inactiveCollisionGroup = game.physics.p2.createCollisionGroup();


        teacher = game.add.sprite(465, 112, 'teacher');
        game.physics.p2.enable(teacher);
        teacher.body.clearShapes();
        teacher.body.loadPolygon('physicsDataTeacher','Teacher graphic');
        teacher.body.static = true;
        //teacher hand animations
        teacher.alpha = 1;
        var walk = teacher.animations.add('walk');
        teacher.animations.play('walk', 3, true);
        teacher.body.setCollisionGroup(teacherCollisionGroup);
        teacher.body.collides(ballCollisionGroup,this.teacherHit,this);





        // moves from world stage to group as a child
        // create an instance of graphics, then add it to a group

        var table = game.add.sprite(475, 135, 'table');
        table.alpha = 1;

        bground.events.onInputDown.add(this.holdBall);
        bground.events.onInputUp.add(this.launchBall);

        //adding sound effects to be used else where
        backgroundMusic = game.add.audio('background');
        classroom = game.add.audio('classroom');
        collisionSound = game.add.audio('collisionSound');
        ticTok = game.add.audio('tic')
        pain1male = game.add.audio('pain1male');
        pain2male = game.add.audio('pain2male');
        pain3fem = game.add.audio('pain3fem');
        pain4fem = game.add.audio('pain4fem');
        pain5male = game.add.audio('pain5male');
        schoolbell = game.add.audio('schoolbell');

        //This loads in fonts to be used later
        this.game.load.bitmapFont('myfont', 'assets/fonts/font.png', 'assets/fonts/font.fnt');
        this.game.load.bitmapFont('LF','assets/fonts/level.png','assets/fonts/level.fnt')
        this.game.load.bitmapFont('WHF','assets/fonts/wrong.png','assets/fonts/wrong.fnt')




        timerLevelDisplay = game.add.text(500,450,'',{fill: '#ffffff' , fontSize: 50, stroke: '#ffffff', strokeThickness: 2});

        //Displays score with the myfont font
        scoreDisplay = game.add.bitmapText(650,16,'myfont','0',50);
        //Displays the level in the LF font
        levelFont = game.add.bitmapText(995,20,'LF','Level:',50)



        //adds spit particles to collisions with students
        emitter = game.add.emitter(0,0,100);
        emitter.makeParticles('bluecircle');
        emitter.minParticleScale = 0.018;
        emitter.maxParticleScale = 0.020;
        var spitGrouping = 500;
        emitter.minParticleSpeed = { x: -spitGrouping/2, y: -spitGrouping/2 };
        emitter.maxParticleSpeed = { x:  spitGrouping/4, y:  spitGrouping };
        emitter.gravity = 1000;



        //Students locations on the canvas
        studentXs = [320,610,915,175,1095];
        studentYs = [280,280,280,525,525];
        arrayStudents = [];

        for (var i=0; i<5; i++){
            var student = this.addStudent('student'+(i+1), studentXs[i], studentYs[i]);
            arrayStudents.push(student);
            student.body.clearShapes();
            student.body.loadPolygon('physicsData'+(i+1), 'student'+(i+1)+'-active');
            student.body.setCollisionGroup(studentCollisionGroup);
            student.body.collides(ballCollisionGroup,this.ballHit,this);
        }

        slingshot = game.add.sprite(slingshotX,slingshotY,'slingshot');
        slingshot.height = slingshotHeight;

        //the control arrow
        analog = game.add.sprite(300, 300, 'analog');
        analog.width = tailWidth;
        analog.anchor.setTo(0.5,0);
        analog.rotation = 3.14/2;
        analog.alpha =0; //hide sprite

        tail = game.add.sprite(300, 300, 'tail');
        tail.width = tailWidth;
        tail.anchor.setTo(0.5,1)
        tail.rotation = 3.14/2;
        tail.alpha = 0;

        arrow = game.add.sprite(300, 300, 'arrow');
        arrow.scale.setTo(0.1,0.1);
        arrow.anchor.setTo(0,0.5);
        arrow.alpha = 0;

        origin = game.add.sprite(300,300,'origin');
        origin.scale.setTo(0.02,0.02);
        origin.anchor.setTo(0.5,0.5);
        origin.alpha = 0;

        pauseButton = game.add.button(buttonXPos, buttonYPos, 'pauseButton', this.pause , this, 2, 1, 0);
        pauseButton.scale.setTo(0.19,0.19);

        levelupPopup = game.add.sprite(game.world.centerX, game.world.centerY, 'pausePopup');
        levelupPopup.alpha = 0;
        levelupPopup.anchor.set(0.5,0.5);
        levelupPopup.inputEnabled = true;
        levelupPopup.input.enabled=false;




        playButton = game.add.sprite(game.world.centerX-200,game.world.centerY+40, 'MenuButton');
        playButton.anchor.set(0.5,0.5);
        playButton.scale.setTo(0.1,0.1);
        playButton.alpha=0;
        playButton.inputEnabled = true;
        playButton.input.enabled=false;
        playButton.events.onInputDown.add(this.play,this);

        restartButton = game.add.sprite(game.world.centerX+120, game.world.centerY-10,'resetButton');
        restartButton.scale.setTo(0.1,0.1);
        restartButton.inputEnabled  = true;
        restartButton.input.enabled = false;
        restartButton.alpha =0;
        restartButton.events.onInputDown.add(this.restart,this);

        //Creates the ScoreBar rectangle for us to later change the width of
        scoreBarRectangle= game.add.bitmapData(700 ,128);
        scoreBarRectangle.ctx.beginPath();
        scoreBarRectangle.ctx.rect(0,0,700,25);
        scoreBarRectangle.ctx.fillStyle = '#be011f';
        scoreBarRectangle.ctx.fill();
        //Turns our bitmap rectangle into a sprite
        spriteScore = game.add.sprite(300, 646, scoreBarRectangle);
        // Creates outlines to both the scoreBar along with the timerbar
        group = this.add.group();
        scoreBarOutline = this.game.add.graphics();
        timerBarOutline = this.game.add.graphics();
        timerBarOutline.beginFill(0x000000,.3);
        timerBarOutline.drawRect(300,675, 700,24);
        timerBarOutline.endFill();
        group.add(timerBarOutline);




        //Score Bar Outline
        scoreBarOutline.beginFill(0x000000,.3)
        scoreBarOutline.drawRect(300, 646, 700, 25);
        scoreBarOutline.endFill();
        group.add(scoreBarOutline);

        //Creates the rectangle for us to later change the width of
        timerBarRectangle = game.add.bitmapData(700,128);
        timerBarRectangle.ctx.beginPath();
        timerBarRectangle.ctx.rect(0,0,700,25);
        timerBarRectangle.ctx.fillStyle = timerBarColor;
        timerBarRectangle.ctx.fill();
        //Turns our bitmap rectangle into a sprite
        spriteTime = game.add.sprite(300,676,timerBarRectangle);


        randomIndex = Math.floor(Math.random() * 5);
        randomStudent = arrayStudents[randomIndex];
        var studentNumber = randomIndex+1;
        randomStudent.loadTexture('student'+studentNumber+'-active', 0);
        for( var i=0; i< arrayStudents.length; i++)
        {
            arrayStudents[i].alpha = 0.25;
        }
        randomStudent.alpha = 1;

        ballInSlingshot = this.createBall();
        //Timer Instance
        timer = game.time.create(); //timer for levels
        timerConstant = 30; //each level is 30 seconds long
        timerEvent = timer.add(Phaser.Timer.SECOND * timerConstant, this.checkLevelGoal); //a timer for each level
        timeToChangeTarget = game.time.now + 4000;
        ballsTimer = game.time.events.loop(50, this.updateBalls, this); //timer to create depth effects

        timerLevel = game.time.create(); //timer for levels
        timerLevelConstant = 3; //each break between levels is 3 seconds long
        timerLevelEvent = timerLevel.add(Phaser.Timer.SECOND * timerLevelConstant, this.levelUpResume); //a timer for each level



        this.initiateTimer();
        this.initiateTimerLevel()

        playState.play();

    },

    spitBurst: function(ballX, ballY){
        emitter.x = ballX;
        emitter.y = ballY;
        emitter.start(true,350,null,10);
    },

    initiateTimer: function(){
        timer = game.time.create();
        timerEvent = timer.add(Phaser.Timer.SECOND * timerConstant, playState.checkLevelGoal);
        timer.start();
        playState.updateTimeToChangeTarget();

    },
//Timer color
    reinitiateTimer: function(){
        timer.stop();
        timer.destroy();
        playState.initiateTimer();
        finalWarningOn = true;

    },

    initiateTimerLevel: function(){
        timerLevel = game.time.create();
        timerLevelEvent = timerLevel.add(Phaser.Timer.SECOND * timerLevelConstant, this.levelUpResume);
        timerLevel.pause();
        timerLevelDisplay.visible = false;
    },

    destroyTimerLevel: function(){
        timerLevel.stop();
        timerLevel.destroy();
        playState.initiateTimerLevel()
    },

    createBall : function() {
        var newBall = game.add.sprite(ballinitx, ballinity, 'ball');
        game.physics.p2.enable(newBall);
        newBall.scale.setTo(0.15,0.15);
        newBall.anchor.setTo(0.5, 0.5);
        newBall.body.setCircle(30); //for collision
        newBall.body.static = true;
        newBall.body.setCollisionGroup(ballCollisionGroup);
        newBall.body.collides(teacherCollisionGroup);
        newBall.body.collides(studentCollisionGroup);
        newBall.body.z =0;
        newBall.body.velocity.z = 0;
        newBall.hitFloor = false;
        newBall.floor = -1000;
        newBall.timesHitFloor =0;
        return newBall;
    },
    updateLevelUp: function(){
        levelFont.text = "Level: "+currentLevel;

    },
    //Gives you additional time for the final level
    updateBonusTime: function(){
        var secs = 0;
        if(score == 1300){
            timer.pause();
        }
        else if (score == 1330){
            timer.resume();
        }

    },
    updateScoreBar : function(){ //updates width of the ScoreBarRectangle so that it reflects progress through the level
        spriteScore.width = score*8.75
        if (score<0){
            spriteScore.width =0}
        if (score == 80){
            spriteScore.width = 0;
        }
        else if (score> 80){
            spriteScore.width = (score-80) * 5.384} // Math for width = (score - previous Level goal) * 700/point goal increment
        if (score == 210){
            spriteScore.width =0 }
        else if (score > 210){
            spriteScore.width = (score-210)*4.375}
        if (score == 370){
            spriteScore.width =0}
        else if(score > 370){
            spriteScore.width = (score-370)* 3.888889}
        if (score == 550){
            spriteScore.width =0}
        else if(score > 550){
            spriteScore.width = (score -550)* 3.5}
        if (score == 750){
            spriteScore.width = 0}
        else if (score > 750){
            spriteScore.width = (score - 750) *3.04347826087 }
        if (score == 980){
            spriteScore.width =0}
        else if (score > 980){
            spriteScore.width = (score-980)*3.04347826087}
        if (score == 1210){
            spriteScore.width = 0}
        else if (score>1210){
            spriteScore.width = (score-1210)*.71428571428}
        if (score == 1710){
            spriteScore.width = 700}

    },
    updateTimerBar : function(){ //Changes the width of the timerBarRectangle to match the timer
        spriteTime.width = (timer.ms/30000)*700
        var endTime = 10;
        var timerOver = 29.9
        if(timer.ms/1000 > timerConstant - endTime && timer.ms/1000 < (timerConstant - endTime + .01)   && finalWarningOn ){
            finalWarningOn == false;
            ticTok.play();
        }
    },
    updateMusic : function(){
        var startMusic = 0.1
        if(currentLevel == 1 && timer.ms/1000 < startMusic){
            backgroundMusic.loopFull();
            classroom.loopFull();
        }
        if(gamePaused == true){
            backgroundMusic.pause();
            classroom.pause();
        }
        if(gamePaused == false && classroom.pause){
            classroom.resume();
            backgroundMusic.resume();
        }
    },










    addStudent : function(image, x, y){
        var student = game.add.sprite(x,y, image);
        game.physics.p2.enable(student);
        student.anchor.set(0.5,0.5);
        student.body.static = true;
        return(student);
    },

    holdBall : function() {
        playState.showArrow();
        ballInSlingshot.body.static = true;
    },

    showArrow: function() {
        //create arrow where the pointer is
        origin.alpha = 1;
        arrow.alpha = 1;
        tail.alpha = 1;
        analog.alpha = 0.5;
        var originX = game.input.activePointer.worldX;
        var originY = game.input.activePointer.worldY;
        origin.x = originX;
        origin.y = originY;
        arrow.x = originX;
        arrow.y = originY;
        tail.x = originX;
        tail.y = originY;
        analog.x = originX;
        analog.y = originY;
    },

    hideArrow : function (){
        origin.alpha = 0;
        arrow.alpha = 0;
        tail.alpha = 0;
        analog.alpha = 0;
    },

    launchBall : function () {
        var arrowLengthX = arrow.x - origin.x;
        var arrowLengthY = arrow.y - origin.y;
        if(Math.abs(arrowLengthY) > 3){
            ballInSlingshot.body.static = false;
            var Xvector = (arrow.x - origin.x) *13;
            var Yvector = (arrow.y - origin.y) *13;
            ballInSlingshot.body.velocity.x = Xvector;
            ballInSlingshot.body.velocity.y = Yvector;
            ballInSlingshot.body.velocity.z = - arrowLengthY / 10;
            ballsInMotion.push(ballInSlingshot);
            ballInSlingshot = playState.createBall();
        }
        playState.hideArrow();
    },

    updateBalls : function () {
        for (i=0; i< ballsInMotion.length ; i++){
            if (ballsInMotion[i].timesHitFloor > 4){
                ballsInMotion[i].kill();
                ballsInMotion.splice(i, 1);
            } else{
                playState.updateBallSize(ballsInMotion[i]);
            }
        }
    },

    updateBallSize : function(ball){
        if(!ball.hitFloor){
            if (ball.body.z >= WALL_Z){ //ball hits back wall
                ball.body.velocity.x = 0;
                ball.floor = WALL_FLOOR;
            }else{ //update ball size based on z-position
                ball.body.z += ball.body.velocity.z;
                var size = 0.15/(1 + ball.body.z*0.003);
                ball.scale.setTo(size,size);
                ball.floor = (screenheight + 300) / (1 + ball.body.z * 0.01);
            }
        }
        if(ball.body.y >= ball.floor){
            playState.bounceOffFloor(ball);
        }
    },

    bounceOffFloor : function (ball) {
        ball.body.velocity.y = -ball.body.velocity.y/2.5;
        ball.body.velocity.x = ball.body.velocity.x/1.5;
        ball.floor = ball.body.y;
        ball.timesHitFloor++;
        ball.hitFloor = true;
    },

    ballHit : function(student, ball) {
        ballCollided = true;
        if (student.x == randomStudent.x && student.y == randomStudent.y){
            playState.studentHit(ball.x, ball.y);
            studentnum = randomIndex+1;
            game.time.events.add(Phaser.Timer.SECOND * 10000, randomStudent.loadTexture('student'+studentnum, 0), this);
            playState.chooseStudent();
            score += rightHitPoints;
        }
        else{
            playState.showScoreTween("lose", ball.x, ball.y);
            score -= wrongHitPoints;
        }
        ball.sprite.body.setCollisionGroup(inactiveCollisionGroup); //
    },

//Points flashing after a hit
    showScoreTween : function (action, x, y){
        if (action == "add"){
//      var text = game.add.text(x,y,'+'+ rightHitPoints,{fill: '#00ff00', fontWeight: 'bold' , fontSize: 60});
            var text = game.add.bitmapText(x,y,'LF','+' + rightHitPoints,60);
            var deltaScore = rightHitPoints;
        } else{
//      var text = game.add.text(x,y,'-'+ wrongHitPoints,{fill: '#ff0000', fontWeight: 'bold' , fontSize: 60});
            var text = game.add.bitmapText(x,y,'WHF','-'+ wrongHitPoints,60);
            var deltaScore= -wrongHitPoints;
        }
        //source: html5gamedevs.com
        game.time.events.add(
            300,
            function() {
                game.add.tween(text).to({x: 550, y: 16}, 600, Phaser.Easing.Linear.None, true); //text moves to x,y positions
                game.add.tween(text).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);//text disappears
            });
        game.time.events.add(1000, function(){
            text.destroy();
        });

    },

    pause :  function (){
        pauseButton.alpha =0;
        playState.pausedState();
        playButton.alpha=1;
        playButton.input.enabled=true;

        restartButton.alpha = 1;
        restartButton.input.enabled = true;
        ticTok.pause();

    },

    pausedState: function(){
        game.physics.p2.pause();
        game.time.events.pause([ballsTimer]);
        timer.pause();
        teacher.animations.paused = true;
        bground.inputEnabled = false;
        gamePaused = true;

    },

    displayInvisible: function(){
        pauseButton.alpha = 0;

        timerBarOutline.alpha = 0;
        scoreBarOutline.alpha = 0;
        spriteScore.alpha = 0;
        spriteTime.alpha = 0;
    },

    displayVisible: function(){
        pauseButton.alpha = 1;
        timerBarOutline.alpha = 1;
        scoreBarOutline.alpha = 1;
        spriteScore.alpha = 1;
        spriteTime.alpha = 1;
    },


    changeState: function(){
        game.input.enabled = false; //Allows us to pause physics and keep the running feel going
        playState.displayInvisible();
        // game.physics.p2.pause();
        // game.time.events.pause([ballsTimer]);
        timer.pause();
        // teacher.animations.paused = true;
        bground.inputEnabled = false;
        gamePaused = true;
        randomStudent.alpha = 0.25
    },

    play :  function(){
        pauseButton.alpha = 1;
        game.physics.p2.resume();
        bground.inputEnabled = true;
        game.time.events.resume([ballsTimer]);
        timer.resume();
        playButton.alpha=0;
        playButton.input.enabled=false;
        restartButton.alpha =0;
        restartButton.input.enabled = false;
        playState.updateTimeToChangeTarget();
        teacher.animations.paused = false;
        gamePaused = false;
        ticTok.resume();

    },





    checkLevelGoal : function(level){
        if (score<levelGoal)
        {
            ticTok.pause();
            classroom.pause();
            backgroundMusic.pause();
            schoolbell.play();
            emitter.destroy();

            game.state.start('lose');
        }
        else
        {
            if(currentLevel == 7){
                game.input.enabled = false;
                game.state.start('win');
                ticTok.pause();
                backgroundMusic.pause();
                classroom.pause();
            }
            playState.changeState();
            ticTok.pause();
            levelupPopup.alpha=1;
            levelupPopup.input.enabled=true;
            pauseButton.inputEnabled = false;
            playState.hideArrow();

            timerLevel.start()
        }
    },


    levelUpResume: function(){
        levelGoal = levelsGoals[currentLevel];


        playState.destroyTimerLevel();
        playState.reinitiateTimer();
        currentLevel=currentLevel+1;

        pauseButton.inputEnabled = true;

        levelupPopup.alpha=0;
        levelupPopup.input.enabled=false;
        bground.inputEnabled = true;

        for(var i =0; i<ballsInMotion.length; i++){
            ballsInMotion[i].destroy();
        }
        ballsInMotion = [];
        balballInSlingshot = playState.createBall();

        //reset students graphics
        for(var i = 0; i<3; i++)
        {
            studNum = i+1
            arrayStudents[i].loadTexture('student'+studNum,0);
        }
        randomStudent.alpha = 1;

        game.physics.p2.resume();
        game.input.enabled = true;
        game.time.events.resume();
        playState.displayVisible();
        gamePaused = false;
        teacher.animations.paused = false;
    },


    chooseStudent : function (){
        randomStudent.alpha = 0.25;
        studentnum = randomIndex+1;
        game.time.events.add(Phaser.Timer.SECOND * 10000, randomStudent.loadTexture('student'+studentnum, 0), this);
        var num = Math.floor((Math.random() * 5));
        while(num==randomIndex)
        {
            num = Math.floor((Math.random() * 5));
        }
        randomIndex=num;
        randomStudent = arrayStudents[randomIndex];
        studentNumber = randomIndex+1;
        randomStudent.loadTexture('student'+studentNumber+'-active', 0);
        randomStudent.alpha = 1;
        playState.updateTimeToChangeTarget();
    },

    studentHit: function (ballX, ballY){
        studentnum = randomIndex+1
        if (studentnum==1){
            pain1male.play();
        }
        else if (studentnum==2){
            pain2male.play();
        }
        else if(studentnum==3){
            pain3fem.play();
        }
        else if(studentnum==4){
            pain4fem.play();
        }
        else if(studentnum==5){
            pain5male.play();
        }
        //collisionSound.play();
        randomStudent.alpha = 0.25;
        playState.spitBurst(ballX,ballY);
        playState.showScoreTween("add", ballX, ballY);
    },

    teacherHit: function(ball){
        game.physics.arcade.collide(ball, teacher, this.screenshake(), null, this);

    },

    screenshake: function(){
        this.camera.shake(0.01, 1000, true, Phaser.Camera.SHAKE_BOTH, true);
    },

    render :  function () {
        scoreDisplay.text = score ;



        ;
        timerLevelDisplay.text= this.formatTime(Math.round((timerLevelEvent.delay - timerLevel.ms) / 1000));


    },

    formatTime :  function(s) {
        var minutes = "0" + Math.floor(s / 60);
        var seconds = "0" + (s - minutes * 60);
        return minutes.substr(-2) + ":" + seconds.substr(-2);
    },


    update :  function () {
        this.updateArrow();
        this.updateMusic();
        this.updateBonusTime();

        this.updateScoreBar();
        this.updateTimerBar();


        this.updateLevelProgressBar();

        if (score>=levelGoal){
            this.checkLevelGoal();
        }

        this.updateTargetStudent();
        this.updateLevelUp();
    },

    updateLevelProgressBar: function() {
        var goal = levelGoalIncrement[currentLevel-1] ;
        if (currentLevel == 1){
            var levelScore = score;
        }else{
            var levelScore = score - levelsGoals[currentLevel-2];
        }


    },

    add : function(a,b){
        return (a+b);
    },


    updateTargetStudent: function() {
        if (!gamePaused && game.time.now >= timeToChangeTarget){
            playState.chooseStudent();
        }
    },

    updateArrow: function(){
        //source: phaser.io/examples
        if (game.input.activePointer.isDown){
            var dist = game.physics.arcade.distanceToPointer(origin);
            var angle = game.physics.arcade.angleToPointer(origin);

            if (Math.abs(angle) <= 0.05){
                arrow.rotation = 3.14;
            } else{
                arrow.rotation =  angle + 3.14;
            }
            tail.rotation = angle - 3.14/2;
            analog.rotation = angle - 3.14/2;

            tail.height = 0.5*dist;
            analog.height = dist;
            arrow.x = origin.x -  0.5*dist*Math.cos(angle);
            arrow.y = origin.y - 0.5*dist*Math.sin(angle);
        }
    },

    updateTimeToChangeTarget: function(){
        if(currentLevel < 7){
            var factor = currentLevel;
        }else{var factor = 7};
        var changeFactor = Array( factor+3, factor+2, factor+3, factor+1, factor+1, factor, factor,factor,factor,factor)[Math.floor(Math.random()*10)];
        var deltaTime = 4000 - 3600*(changeFactor)/10 //shorten interval with higher level. level 10 at 0.8s
        timeToChangeTarget = game.time.now + deltaTime;
    },

    getCurrentScore: function(){
        return score;
    },
    restart : function() {
        game.state.start('play');
    }
    // Trying to put in a progress bar


}