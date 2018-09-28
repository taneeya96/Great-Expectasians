//import HealthBar from 'phaser-percent-bar';

var timerColor = "#374f77";
var scoreColor = "rgba(255,255,255,0.7)";
var levelColor = "#68D81D";
var scoreFont = "Georgia, cursive";
var scoreBarColor = 0xbe011f;
var scoreBarOutlineColor = 0xFFFFFF;
var timerBarColor = 0x5A6351;

var playState = {


  create : function(){
    timer = game.time.create(); //timer for levels
    timerConstant = 30; //each level is 30 seconds long
    timerEvent = timer.add(Phaser.Timer.SECOND * timerConstant, this.checkLevelGoal); //a timer for each level
    timeToChangeTarget = game.time.now + 4000;
    ballsTimer = game.time.events.loop(50, this.updateBalls, this); //timer to create depth effects

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
    levelGoalIncrement=[80,130,160,180,200,230,230,260];
    levelsGoals = [80,210,370,550,750,980,1210,1470];
    levelGoal = 80;
    wrongHitPoints = 5;
    rightHitPoints = 10;

    bground = game.add.sprite(0,0,'background');
    bground.alpha = 1.0;
    bground.inputEnabled = true;


    teacher = game.add.sprite(390, -65, 'mummy');
    teacher.alpha = 1;
    var walk = teacher.animations.add('walk');
    teacher.animations.play('walk', 3, true);

//    progressBar = game.add.sprite(950, 15, 'ProgressBar-0');
//    progressBar.scale.setTo(0.1,0.1);
//    progressBar.alpha = 1;



    // moves from world stage to group as a child
    // create an instance of graphics, then add it to a group

    var table = game.add.sprite(475, 135, 'table');
    table.alpha = 1;

    bground.events.onInputDown.add(this.holdBall);
    bground.events.onInputUp.add(this.launchBall);

    //adding in the sound effects
    collisionSound = game.add.audio('collisionSound');
    pain1male = game.add.audio('pain1male');
    pain2male = game.add.audio('pain2male');
    pain3fem = game.add.audio('pain3fem');
    pain4fem = game.add.audio('pain4fem');
    pain5male = game.add.audio('pain5male');


    timerDisplay = game.add.text(40,16,'',{fill: timerColor , fontSize: 50, stroke: timerColor, strokeThickness: 2});

    scoreDisplay = game.add.text(650, 16, '', {fill: scoreColor , fontSize: 40, font: scoreFont});
    goalDisplay = game.add.text(700,16,'',{fill: '#ffffff', fontSize:50 });
    levelDisplay = game.add.text(995,20,'',{fill: levelColor, fontSize:40 });

    studentCollisionGroup = game.physics.p2.createCollisionGroup();
    ballCollisionGroup = game.physics.p2.createCollisionGroup();
    inactiveCollisionGroup = game.physics.p2.createCollisionGroup();

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


    LevelUpButton = game.make.sprite(0,200, 'playButton');
    LevelUpButton.anchor.set(0.5,0.5);
    LevelUpButton.scale.setTo(0.19,0.19);
    LevelUpButton.alpha=1;
    LevelUpButton.inputEnabled = true;
    LevelUpButton.input.enabled=false;
    LevelUpButton.input.priorityID=1;
    LevelUpButton.events.onInputDown.add(this.levelUpResume,this);
    levelupPopup.addChild(LevelUpButton);

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

    this.initiateTimer();
    playState.play();

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
    timerDisplay.addColor(timerColor,50);
    timerDisplay.stroke = timerColor;
  },

  levelUpResume: function(){
    levelGoal = levelsGoals[currentLevel];

//    scoreDisplay.text = "Score : " + score;
//    scoreDisplay.text ="Score : " + score + '/'+ levelsGoals[currentLevel-1];
    timerDisplay.fontSize = 50;
    timerDisplay.strokeThickness = 2;


    playState.reinitiateTimer();
    currentLevel=currentLevel+1;

    pauseButton.inputEnabled = true;

    levelupPopup.alpha=0;
    levelupPopup.input.enabled=false;
    LevelUpButton.input.enabled=false;
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

    game.physics.p2.resume();
    game.time.events.resume();
    gamePaused = false;
    teacher.animations.paused = false;
  },


  createBall : function() {
    var newBall = game.add.sprite(ballinitx, ballinity, 'ball');
    game.physics.p2.enable(newBall);
    newBall.scale.setTo(0.15,0.15);
    newBall.anchor.setTo(0.5, 0.5);
    newBall.body.setCircle(30); //for collision
    newBall.body.static = true;
    newBall.body.setCollisionGroup(ballCollisionGroup);
    newBall.body.collides(studentCollisionGroup);
    newBall.body.z =0;
    newBall.body.velocity.z = 0;
    newBall.hitFloor = false;
    newBall.floor = -1000;
    newBall.timesHitFloor =0;
    return newBall;
  },
  createScoreBar : function(){
  // ScoreBar

          let group = this.add.group();
          // created on the world
          var ScoreBar = game.add.graphics(); // adds to the world stage
          ScoreBar.lineStyle(2, scoreBarColor, 1);
          ScoreBar.beginFill(scoreBarColor, 1);
          ScoreBar.drawRect(300, 650,score , 25);
          ScoreBar.endFill();
          group.add(ScoreBar);
          // ScoreBar Outline
          let scoreBarOutline = this.game.add.graphics();
          scoreBarOutline.lineStyle(2,scoreBarOutlineColor,1);
          scoreBarOutline.drawRect(300,650,700,25);
          group.add(scoreBarOutline);
          return(ScoreBar);


  },
  createTimerBar: function(){
  // TimerBar
            let group = this.add.group();
            var timerBar = game.add.graphics();
            timerBar.lineStyle(2,timerBarColor, 1 );
            timerBar.beginFill(timerBarColor, 1);
            timerBar.drawRect(300,675,700,25);
            timerBar.endFill();
            group.add(timerBar);
            //TimerBar Outline
            let timerBarOutline = this.game.add.graphics();
            timerBarOutline.lineStyle(2,scoreBarOutlineColor,1);
            timerBarOutline.drawRect(300,675, 700,25);
            group.add(timerBarOutline);
            return(timerBar);
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
      var text = game.add.text(x,y,'+'+ rightHitPoints,{fill: '#00ff00', fontWeight: 'bold' , fontSize: 60});
      var deltaScore = rightHitPoints;
    } else{
      var text = game.add.text(x,y,'-'+ wrongHitPoints,{fill: '#ff0000', fontWeight: 'bold' , fontSize: 60});
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
 },

pausedState: function(){
  game.physics.p2.pause();
  game.time.events.pause([ballsTimer]);
  timer.pause();
  teacher.animations.paused = true;
  bground.inputEnabled = false;
  gamePaused = true;
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
 },



 flashTimerDisplay : function (){
   var currentTime = Math.round((timerEvent.delay - timer.ms) / 100)/10
   if ( currentTime <6){
     timerDisplay.addColor("#ff0000",0);
     timerDisplay.stroke = "#ff0000";
     timerDisplay.strokeThickness = 1*(currentTime%1*2 + 2);
     timerDisplay.fontSize = (currentTime%1 + 1)*50;
   }
 },

  checkLevelGoal : function(level){
   playState.pausedState();
   if (score<levelGoal)
   {
     game.state.start('lose');
   } else
   {
     if(currentLevel == 7){
      game.state.start('win');
     }
     levelDisplay.text="Level: "+currentLevel;
     levelupPopup.alpha=1;
     levelupPopup.input.enabled=true;
     LevelUpButton.input.enabled=true;
     pauseButton.inputEnabled = false;
     playState.hideArrow();
   }
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
    playState.showScoreTween("add", ballX, ballY);
},

render :  function () {
    levelDisplay.text="Level: "+currentLevel;
    scoreDisplay.text = score;

;
    timerDisplay.text= this.formatTime(Math.round((timerEvent.delay - timer.ms) / 1000));
    if(score < levelGoal){
      scoreDisplay.addColor(scoreColor, 0); //red
    }
    else {
      scoreDisplay.addColor(scoreColor, 0); //green
    }

  },

formatTime :  function(s) {
   var minutes = "0" + Math.floor(s / 60);
   var seconds = "0" + (s - minutes * 60);
   return minutes.substr(-2) + ":" + seconds.substr(-2);
  },


update :  function () {
      this.updateArrow();

      this.flashTimerDisplay();
      this.createTimerBar();
      this.createScoreBar();


      this.updateLevelProgressBar();

       if (score>=levelGoal){
         this.checkLevelGoal();
       }

      this.updateTargetStudent();
   },

   updateLevelProgressBar: function() {
      var goal = levelGoalIncrement[currentLevel-1] ;
      if (currentLevel == 1){
        var levelScore = score;
      }else{
        var levelScore = score - levelsGoals[currentLevel-2];
      }

//      if(levelScore < goal * 0.25){
//        progressBar.loadTexture('ProgressBar-0', 0);
//      } else if(levelScore >= goal*0.25 && levelScore < goal*0.5){
//        progressBar.loadTexture('ProgressBar-1', 0);
//      } else if(levelScore >= goal*0.5 && levelScore < goal*0.75 ){
//        progressBar.loadTexture('ProgressBar-2', 0);
//      } else if(levelScore >= goal*0.75 && levelScore < goal){
//        progressBar.loadTexture('ProgressBar-3', 0);
//      } else if(levelScore >= goal){
//        progressBar.loadTexture('ProgressBar-4', 0);
//      }
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
