var playState = {


  create : function(){
    timer = game.time.create();
    timerConstant = 10;
    timerEvent = timer.add(Phaser.Timer.SECOND * timerConstant, this.endTimer);
    targetInitialTimeInterval = 4;
    targetStudentTimer = game.time.events.add(Phaser.Timer.SECOND * targetInitialTimeInterval, this.chooseStudent, this);
    gamePaused = false;
    currentLevel = 1;
    console.log(currentLevel);
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
    wrongHitPoints = 5;
    rightHitPoints = 10;

    score = 0;
    levelGoal=[0,130,160,180,200,230,260,280,300,320,340];
    totalGoal = 80;

    bground = game.add.sprite(0,0,'background');
    bground.alpha = 0.75;
    bground.inputEnabled = true;
    bground.events.onInputDown.add(this.holdBall);
    bground.events.onInputUp.add(this.launchBall);

    timerDisplay = game.add.text(40,16,'',{fill: '#ffffff' });
    scoreDisplay = game.add.text(500, 16, '', { fill: '#ffffff' });
    goalDisplay = game.add.text(700,16,'',{fill: '#ffffff' });
    levelDisplay = game.add.text(1000,16,'',{fill: '#ffffff' });
    timerDisplay.fontSize = 40;
    scoreDisplay.fontSize = 40;
    goalDisplay.fontSize = 40;
    levelDisplay.fontSize = 40;

    studentCollisionGroup = game.physics.p2.createCollisionGroup();
    ballCollisionGroup = game.physics.p2.createCollisionGroup();
    inactiveCollisionGroup = game.physics.p2.createCollisionGroup();

    studentXs = [320,610,915,175,1095];
    studentYs = [280,280,280,525,525];
    //current student 4: x= 600, y=250. 2= 1000,500
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


    LevelUpButton = game.make.sprite(0,0, 'playButton');
    LevelUpButton.anchor.set(0.5,0.5);
    LevelUpButton.scale.setTo(0.19,0.19);
    LevelUpButton.alpha=1;
    LevelUpButton.inputEnabled = true;
    LevelUpButton.input.enabled=false;
    LevelUpButton.input.priorityID=1;
    LevelUpButton.events.onInputDown.add(this.levelUpResume,this);
    levelupPopup.addChild(LevelUpButton);

    playButton = game.add.sprite(game.world.centerX,game.world.centerY, 'MenuButton');
    playButton.anchor.set(0.5,0.5);
    playButton.scale.setTo(0.1,0.1);
    playButton.alpha=0;
    playButton.inputEnabled = true;
    playButton.input.enabled=false;
    playButton.events.onInputDown.add(this.resume,this);

    progressBar = game.add.sprite(400,40,'progressBar');
    progressBar.scale.setTo(0.5,0.5);

    randomIndex = Math.floor(Math.random() * 5);
    randomStudent = arrayStudents[randomIndex];
    var studentNumber = randomIndex+1;
    randomStudent.loadTexture('student'+studentNumber+'-active', 0);
    for( var i=0; i< arrayStudents.length; i++)
    {
      arrayStudents[i].alpha = 0.50;
    }
    randomStudent.alpha = 1;

    ballInSlingshot = this.createBall();
    ballsTimer = game.time.events.loop(50, this.updateBalls, this);
    this.initiateTargetStudentTimer();
    this.initiateTimer();
    playState.play();

    collisionSound = game.add.audio('collisionSound');

  },

  initiateTimer: function(){
    timerEvent = timer.add(Phaser.Timer.SECOND * timerConstant, this.endTimer);
    timer.start();
  },

  initiateTargetStudentTimer: function(){
    if (!gamePaused){
      game.time.events.remove(targetStudentTimer);
      var changeFactor = Array(currentLevel+2, currentLevel+1, currentLevel+1, currentLevel, currentLevel,currentLevel,currentLevel,currentLevel)[Math.floor(Math.random()*8)];
      var targetCurrentTimeInterval = targetInitialTimeInterval - 2*Math.log(changeFactor)/Math.log(10) //shorten interval with higher level. level 10 at 1s
      targetStudentTimer = game.time.events.add(Phaser.Timer.SECOND * targetCurrentTimeInterval, this.chooseStudent, this);
    }
  },

  reIniTimer: function(){
    timer.destroy();
    this.initiateTimer();
    timer.start();
    // game.time.events.remove(targetStudentTimer);
    this.initiateTargetStudentTimer();
    timerDisplay.addColor("#ffffff",0);
    timerDisplay.stroke = "#ffffff";
  },

  levelUpResume: function(){
    scoreDisplay.text ="Score : " + score + '/' + totalGoal;
    this.reIniTimer();
    currentLevel=currentLevel+1;
    pauseButton.inputEnabled = true;
    levelupPopup.alpha=0;
    levelupPopup.input.enabled=false;
    LevelUpButton.input.enabled=false;
    bground.inputEnabled = true;

    for(var i =0; i<ballsInMotion.length; i++){
        ballsInMotion[i].destroy();
    }
    for(var i = 0; i<3; i++)
    {
      studNum = i+1
      arrayStudents[i].loadTexture('student'+studNum,0);
    }
    ballsInMotion = [];
    balballInSlingshot = playState.createBall();

    game.physics.p2.resume();
    game.time.events.resume();
    gamePaused = true;
  },

  createBall : function() {
    console.log('ball created')
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

  addStudent : function(image, x, y){
      var student = game.add.sprite(x,y, image);
      game.physics.p2.enable(student);
      student.anchor.set(0.5,0.5);
      student.body.static = true;

      return(student)
  },
  holdBall : function() {
      console.log('hold ball')
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
      console.log("launch ball", arrowLengthX)
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
      if (ball.body.z >= WALL_Z){
        ball.body.velocity.x = 0;
        ball.floor = WALL_FLOOR;
      }else{
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

  ballHit : function(body1, body2) {
      console.log("--->ballHit");
      ballCollided = true;
      if (body1.x == randomStudent.x && body1.y == randomStudent.y){
          playState.studentHit(body2.x, body2.y);
          studentnum = randomIndex+1;
          game.time.events.add(Phaser.Timer.SECOND * 10000, randomStudent.loadTexture('student'+studentnum, 0), this);
          playState.chooseStudent();
      }
      else{
        playState.showScoreTween("lose", body2.x, body2.y);
      }
      body2.sprite.body.setCollisionGroup(inactiveCollisionGroup);
  },


  showScoreTween : function (action, x, y){
    console.log("----->showScoreTween");
    if (action == "add"){
      var text = game.add.text(x,y,'+'+ rightHitPoints,{fill: '#00ff00', fontWeight: 'bold' , fontSize: 60});
      var deltaScore = rightHitPoints;
    } else{
      var text = game.add.text(x,y,'-'+ wrongHitPoints,{fill: '#ff0000', fontWeight: 'bold' , fontSize: 60});
      var deltaScore= -wrongHitPoints;
    }
    game.time.events.add(
        300,
        function() {
            console.log("fade text")
            game.add.tween(text).to({x: 550, y: 16}, 600, Phaser.Easing.Linear.None, true);
            game.add.tween(text).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
        });
    game.time.events.add(1000, function(){
      text.destroy();
      score+= deltaScore;
      if (score ==totalGoal){
        playState.flashScore();
      }
    });

  },

  flashScore : function(){
   console.log('flash score');
   game.time.events.add(100, function(){
     scoreDisplay.fontSize = 50;
     scoreDisplay.addColor("#00ffff",0);
     game.time.events.add(350, function(){
       scoreDisplay.fontSize = 45;
       game.time.events.add(350, function(){
         scoreDisplay.fontSize = 50;
         game.time.events.add(300, function(){
           scoreDisplay.fontSize = 40; scoreDisplay.addColor("#ffffff",0);}, this);
       }, this);
     }, this);
   }, this)
 },

pause :  function (){
     console.log("-->pause");
     game.physics.p2.pause();
     game.time.events.pause([ballsTimer, targetStudentTimer]);
     timer.pause();
     bground.inputEnabled = false;
     playButton.alpha=1;
     playButton.input.enabled=true;
     gamePaused = true;
 },
play :  function (){
   console.log("--->play");
   game.physics.p2.resume();
   bground.inputEnabled = true;
   game.time.events.resume([ballsTimer, targetStudentTimer]);
   this.initiateTargetStudentTimer();
   timer.resume();
   gamePaused = false;
 },

 resume :  function(){
   console.log("--->resume");
   this.play();
   game.time.events.resume(targetStudentTimer);
   playButton.alpha=0;
   playButton.input.enabled=false;
   gamePaused = false;
 },
 flashTimerDisplay : function (){
   var currentTime = Math.round((timerEvent.delay - timer.ms) / 100)/10
   if ( currentTime <6){
     timerDisplay.addColor("#ff0000",0);
     timerDisplay.stroke = "#ff0000";
     timerDisplay.strokeThickness = 1*(currentTime%1*2 + 2);
     timerDisplay.fontSize = (currentTime%1 + 1)*40;
   }
 },

  checkPointLimit : function(level){
   game.physics.p2.pause();
   game.time.events.pause([ballsTimer, targetStudentTimer]);
   gamePaused = true;
   bground.inputEnabled = false;
   if (score<totalGoal)
   {
     game.state.start('win');
   } else
   {
     levelDisplay.text="Level: "+currentLevel;
     levelupPopup.alpha=1;
     levelupPopup.input.enabled=true;
     LevelUpButton.input.enabled=true;
     pauseButton.inputEnabled = false;
     playState.hideArrow();
   }
 },

formatTime :  function(s) {
   var minutes = "0" + Math.floor(s / 60);
   var seconds = "0" + (s - minutes * 60);
   return minutes.substr(-2) + ":" + seconds.substr(-2);
  },

endTimer : function() {
  console.log("---->endTimer");
  timer.stop();
  playState.checkPointLimit(currentLevel);
},

chooseStudent : function (){
  randomStudent.alpha = 0.5;
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

  playState.initiateTargetStudentTimer();
},
studentHit: function (ballX, ballY){
    console.log("--->studentHit");
    collisionSound.play();
    // score+= rightHitPoints;
    randomStudent.alpha = 0.5;
    playState.showScoreTween("add", ballX, ballY);
},

render :  function () {
    levelDisplay.text="Level: "+currentLevel;
    scoreDisplay.text ="Score : " + score + '/' + totalGoal;
    if(score < totalGoal){
      scoreDisplay.addColor("#ff0000", 0); //red
    }
    else {
      scoreDisplay.addColor("#00ff00", 0); //green
    }

  },

update :  function () {
    if(ballsInMotion[0])
    {
      console.log(ballsInMotion[0].body.x);
    }
     // update the control arrow
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

       timerDisplay.text= this.formatTime(Math.round((timerEvent.delay - timer.ms) / 1000));
       this.flashTimerDisplay();

       if (score>=totalGoal){
         console.log("------>update");
         this.endTimer();
         totalGoal += levelGoal[currentLevel];
       }
   },



}
