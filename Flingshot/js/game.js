
const screenwidth=1280;
const screenheight=720;
/** NEW GAME STATE
var game = new Phaser.Game(screenwidth, screenheight, Phaser.CANVAS, 'gameDiv');

game.state.add('boot', bootState);
game.state.add('load',loadState);
game.state.add('menu',menuState);
game.state.add('play',playState);
game.state.add('win',winState);
*/


var randomStudent;
var game = new Phaser.Game(screenwidth, screenheight, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

var  ballsTimer= null;
var targetStudentTimer;
const targetInitialTimeInterval = 4;
var balls = [];
var ball = null;
var timer,timerEvent;
var timerConstant = 40;
var progressBar

function preload() {
    game.load.image('Menu','assets/images/MainMenu.png');
    game.load.image('MenuButton','assets/images/MenuPlay.png');
    game.load.image('StartInstructions','assets/images/InstructionsPage3.png');
    game.load.image('BackButton','assets/images/BackButton.png');
    game.load.image('background','assets/images/Background1.png');
    game.load.image('ball', 'assets/images/paperBall.png');
    game.load.image('slingshot', 'assets/images/CatapultSprite.png')
    game.load.image('student1', 'assets/images/student1.png');
    game.load.image('student1-hit', 'assets/images/student1-hit.png');
    game.load.image('student1-active', 'assets/images/student1-active.png');
    game.load.image('student2', 'assets/images/student2.png');
    game.load.image('student2-hit', 'assets/images/student2-hit.png');
    game.load.image('student2-active', 'assets/images/student2-active.png');
    game.load.image('student3', 'assets/images/student3.png');
    game.load.image('student3-hit', 'assets/images/student3-hit.png');
    game.load.image('student3-active', 'assets/images/student3-active.png');
    game.load.image('student4', 'assets/images/student4.png');
    game.load.image('student4-hit', 'assets/images/student4-hit.png');
    game.load.image('student4-active', 'assets/images/student4-active.png');
    game.load.image('student5', 'assets/images/student5.png');
    game.load.image('student5-hit', 'assets/images/student5-hit.png');
    game.load.image('student5-active', 'assets/images/student5-active.png');



    game.load.image('arrow', 'assets/images/blackarrow.png');
    game.load.image('tail', 'assets/images/black.png');
    game.load.image('origin', 'assets/images/blackdot.png');
    game.load.image('analog','assets/images/grey.png');

    game.load.image('pauseButton','assets/images/PauseButton2.png');
    game.load.image('resetButton','assets/images/ResetButton.png')
    game.load.image('playButton', 'assets/images/PlayButton.png');

    game.load.physics('physicsData', 'assets/physics/studentHead1.json');
    game.load.image('gradeF','assets/images/gradeF.png');

    game.load.image('pausePopup','assets/images/overwatch.png');

    //sound effects
    game.load.audio('collisionSound', 'assets/audio/collisionSound.mp3');

    game.load.image('progressBar','assets/images/progressBar.png');

}

var text;

var slingshotX = 450;
var slingshotY = 400
var slingshotHeight = 340
var ballInSlingshot;
var ballHeld = false;
var ballSpeed = 0;
const ballinitx=slingshotX+100;
const ballinity=slingshotY+65;
var ballFlying = false;
var ballCollided = false;
var currentVel = 0;
var sz = 0.15;

var analog;
var tail;
var arrow;
var arrowInvisible;//measure velocity
var origin;
var background;
const tailWidth = 10;

var resetButton;
var pauseButton;
var playButton;
const buttonXPos = 1100;
const buttonYPos = 115;
const pauseButtonHeight = 60;

var arrayStudents;

var score = 0;
var pointGoal=100;
var levelGoal=[0,80,130,160,180,200,230,260,280,300,320,340];
const wrongHitPoints = 5;
const rightHitPoints = 10;
var gradeF;
var currentLevel=1;
var customBound;

var ballsInMotion = [];
var studentCollisionGroup;
var ballCollisionGroup;
var inactiveCollisionGroup;
var playRect; // rectangle inside paper ball in menu screen

var progressBar;
function create() {

    game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;


    bground = game.add.sprite(0,0,'background');
    bground.alpha = 0.75; //transparency of background


    pausePopup = game.add.sprite(game.world.centerX, game.world.centerY+100, 'pausePopup');
    pausePopup.alpha = 0;
    pausePopup.anchor.set(0.5,0.5);
    pausePopup.inputEnabled = true;
    pausePopup.input.enabled=false;


    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 500; //larger y gravity the narrower the parabol.
    game.physics.p2.restitution = 0.2; //bounciness of the world
    game.physics.p2.setImpactEvents(true);

    timerDisplay = game.add.text(40,16,'',{fill: '#ffffff' });
    scoreDisplay = game.add.text(500, 16, '', { fill: '#ffffff' });
    goalDisplay = game.add.text(700,16,'',{fill: '#ffffff' });
    levelDisplay = game.add.text(1000,16,'',{fill: '#ffffff' });
    timerDisplay.fontSize = 40;
    scoreDisplay.fontSize = 40;
    goalDisplay.fontSize = 40;
    levelDisplay.fontSize = 40;


    //sound effects
    collisionSound = game.add.audio('collisionSound');

    studentCollisionGroup = game.physics.p2.createCollisionGroup();
    ballCollisionGroup = game.physics.p2.createCollisionGroup();
    inactiveCollisionGroup = game.physics.p2.createCollisionGroup();

    var studentXs = [320,610,915,175,1095];
    var studentYs = [280,280,280,525,525];
    //current student 4: x= 600, y=250. 2= 1000,500
    arrayStudents = [];

    for (var i=0; i<5; i++){
        var student = addStudent('student'+(i+1), studentXs[i], studentYs[i]);
        arrayStudents.push(student);

        //uncommented - 3
        student.body.setRectangle(80,80); //for collision, box-shaped
        student.body.clearShapes();
        student.body.loadPolygon('physicsData', 'student1');

        student.body.setCollisionGroup(studentCollisionGroup);
        student.body.collides(ballCollisionGroup,ballHit,this);
    }


    //Creates custom lower bound for ball, value to be set later:
    customBound = null;


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


    //buttons
    pauseButton = game.add.button(buttonXPos, buttonYPos, 'pauseButton', pause , this, 2, 1, 0);

   	pauseButton.scale.setTo(0.03,0.03);

    progressBar = game.add.sprite(400,40,'progressBar');
    progressBar.scale.setTo(0.5,0.5);

    randomIndex = Math.floor(Math.random() * 5);


    //randomIndex = 0;
    randomStudent = arrayStudents[randomIndex];
    studentNumber = randomIndex+1;
    randomStudent.loadTexture('student'+studentNumber+'-active', 0);
    for( var i=0; i< arrayStudents.length; i++)
    {
      arrayStudents[i].alpha = 0.50;
    }
    randomStudent.alpha = 1;

    gradeF = game.add.sprite(game.world.centerX, game.world.centerY,'gradeF');
    gradeF.anchor.set(0.5,0.5);
    gradeF.alpha = 0;
    gradeF.inputEnabled=true;
    gradeF.input.enabled=false;

    levelupPopup = game.add.sprite(game.world.centerX, game.world.centerY, 'pausePopup');
    levelupPopup.alpha = 0;
    levelupPopup.anchor.set(0.5,0.5);
    levelupPopup.inputEnabled = true;
    levelupPopup.input.enabled=false;


    LevelUpButton = game.make.sprite(0,0, 'playButton');
    LevelUpButton.anchor.set(0.5,0.5);
    LevelUpButton.scale.setTo(0.08,0.08);
    LevelUpButton.alpha=1;
    LevelUpButton.inputEnabled = true;
    LevelUpButton.input.enabled=false;
    LevelUpButton.input.priorityID=1;
    LevelUpButton.events.onInputDown.add(levelUpResume,this);
    levelupPopup.addChild(LevelUpButton);

    playButton = game.add.sprite(game.world.centerX,game.world.centerY, 'MenuButton');
    playButton.scale.setTo(0.1,0.1);
    playButton.alpha=0;
    playButton.inputEnabled = true;
    playButton.input.enabled=false;
    playButton.events.onInputDown.add(resume,this);

    resetButton = game.make.sprite(0,100, 'resetButton');

    resetButton.anchor.set(0.5,0.5);
    resetButton.scale.setTo(0.3,0.3);
    resetButton.alpha=1;
    resetButton.inputEnabled = true;
    resetButton.input.enabled=false;
    resetButton.input.priorityID = 1;
    resetButton.events.onInputDown.add(reset,this);
    gradeF.addChild(resetButton);

    startInstructions = game.add.sprite(-10,0,'StartInstructions');
    startInstructions.scale.setTo(0.9,1);
    startInstructions.alpha =0;
    startInstructions.events.onInputDown.add(startGame,this);

    menu = game.add.sprite(0,0,'Menu');
    menu.alpha = 1;


    backButton = game.add.sprite(50,250,'BackButton');
    backButton.alpha =0;
    backButton.scale.setTo(0.2,0.2);
    backButton.events.onInputDown.add(backToMenu,this);

    menuButton = game.add.sprite(500,50,'MenuButton');
    menuButton.alpha = 1;
    menuButton.scale.setTo(0.1,0.1);
    menuButton.inputEnabled  = true;
    menuButton.events.onInputDown.add(displayStartInstructions,this);


       			// play button
                playRect = this.add.graphics(0, 0);
                // draw a rectangle
                playRect.lineStyle(2, 0x0000FF, 0.5);
                playRect.beginFill(0xFF8080, 1);
                playRect.drawRect(this.world.centerX+280, this.world.centerY + 20, 160, 160);
                playRect.endFill();
                playRect.inputEnabled = true;
                playRect.events.onInputDown.add(displayStartInstructions,this);
                playRect.alpha =0;



    initiateTimer();

}

function initiateTimer(){
  console.log("---->initiateTimer");
  timer = game.time.create();
  timerEvent = timer.add(Phaser.Timer.SECOND * timerConstant, endTimer);
}

function initiateTargetStudentTimer(){
  game.time.events.remove(targetStudentTimer);
  var changeFactor = Array(currentLevel+2, currentLevel+1, currentLevel+1, currentLevel, currentLevel,currentLevel,currentLevel,currentLevel)[Math.floor(Math.random()*8)];
  var targetCurrentTimeInterval = targetInitialTimeInterval - 2*Math.log(changeFactor)/Math.log(10) //shorten interval with higher level. level 10 at 1s
  targetStudentTimer = game.time.events.add(Phaser.Timer.SECOND * targetCurrentTimeInterval, chooseStudent, this);
}

function reIniTimer(){
  console.log("---->reIniTimer");
  timer.destroy();
  initiateTimer();
  timer.start();
  // game.time.events.remove(targetStudentTimer);
  initiateTargetStudentTimer();
  timerDisplay.addColor("#ffffff",0);
  timerDisplay.stroke = "#ffffff";
}
function levelUpResume(){
  console.log("--->levelUpResume");
  score = 0;
  scoreDisplay.text ="Score : " + score + '/' + levelGoal[currentLevel];
  timerConstant-=5;
  reIniTimer();
  currentLevel=currentLevel+1;
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
  balballInSlingshot = createBall();

  game.physics.p2.resume();
  game.time.events.resume();
  // game.time.events.pause(ballsTimer);
}

function createBall() {
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
}


function addStudent(image, x, y){
    student = game.add.sprite(x,y, image);
    game.physics.p2.enable(student);
    student.anchor.set(0.5,0.5);
    student.body.static = true;
    //FOR COLLISION
    //uncommented - 2
    student.body.clearShapes();
    student.body.loadPolygon('physicsData', 'student1');
    return(student)
}

function holdBall() {
    showArrow();
    ballInSlingshot.body.static = true;
}

function launchBall() {
    arrowLengthX = arrow.x - origin.x;
    arrowLengthY = arrow.y - origin.y;
    if(Math.abs(arrowLengthY) > 3){
        ballInSlingshot.body.static = false;
        Xvector = (arrow.x - origin.x) *13;
        Yvector = (arrow.y - origin.y) *13;
        ballInSlingshot.body.velocity.x = Xvector;
        ballInSlingshot.body.velocity.y = Yvector;
        currentVel = Yvector;
        ballFlying = true;
        ballInSlingshot.body.velocity.z = - arrowLengthY / 10;
        ballsInMotion.push(ballInSlingshot);
        ballInSlingshot = createBall();
    }
    hideArrow();
}

function updateBalls() {
    for (i=0; i< ballsInMotion.length ; i++){
        if (ballsInMotion[i].timesHitFloor > 4){
            ballsInMotion[i].kill();
            ballsInMotion.splice(i, 1);
        } else{
            updateBallSize(ballsInMotion[i]);
        }
    }
}

const WALL_Z = 300;
const WALL_FLOOR = 260;

function updateBallSize(ball){
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
    bounceOffFloor(ball);
  }
}

function bounceOffFloor(ball) {
  ball.body.velocity.y = -ball.body.velocity.y/2.5;
  ball.body.velocity.x = ball.body.velocity.x/1.5;
  ball.floor = ball.body.y;
  ball.timesHitFloor++;
  ball.hitFloor = true;
}

function showArrow() {
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
}

function hideArrow(){
    origin.alpha = 0;
    arrow.alpha = 0;
    tail.alpha = 0;
    analog.alpha = 0;
}

function ballHit(body1, body2) {
    console.log("--->ballHit");
    ballCollided = true;
    if (body1.x == randomStudent.x && body1.y == randomStudent.y){
        studentHit(body2.x, body2.y);
        studentnum = randomIndex+1;

        //TESTING TIMER HERE
        //randomStudent.loadTexture('student'+studentnum+'-hit', 0);

        //for some reason the code only works when the timer keeps going on. If the seconds are set to 1 or something, it gives an error. Moreover, running this function prevents the hit animation from working.
        game.time.events.add(Phaser.Timer.SECOND * 10000, randomStudent.loadTexture('student'+studentnum, 0), this);

        chooseStudent();

    }
    else{
      showScoreTween("lose", body2.x, body2.y);
    }

    body2.sprite.body.setCollisionGroup(inactiveCollisionGroup);
}

function flashScore(){
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
}

function update() {
    // update the control arrow
    if (game.input.activePointer.isDown){
        var dist = game.physics.arcade.distanceToPointer(origin);
        var angle = game.physics.arcade.angleToPointer(origin);

        if (Math.abs(angle) <= 0.05){
            arrow.rotation = 0;
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

      timerDisplay.text=formatTime(Math.round((timerEvent.delay - timer.ms) / 1000));
      flashTimerDisplay();
      if (score>=levelGoal[currentLevel]){
        console.log("------>update");
        endTimer();
      }
  }


function reset(){
  console.log("--->reset");
  gradeF.alpha = 0;
  restart();
  randomStudent.alpha = 0.5;
  chooseStudent();
  score=0;
  timerConstant = 40;
  reIniTimer();
  currentLevel=1;
  resume();
  gradeF.input.enabled=false;
  resetButton.input.enabled=false;
}

function pause(){
    console.log("-->pause");
    game.physics.p2.pause();
    game.time.events.pause();
    timer.pause();
    bground.inputEnabled = false;
    playButton.alpha=1;
    playButton.input.enabled=true;

}


function restart(){
    ballSpeed=0;
    ballFlying = false;
    ballCollided = false;
    for(var i =0; i<ballsInMotion.length; i++){
        ballsInMotion[i].destroy();
    }
    for(var i = 0; i<3; i++)
    {
      studNum = i+1
      arrayStudents[i].loadTexture('student'+studNum,0);
    }
    ballsInMotion = [];
    balballInSlingshot = createBall();
    bground.inputEnabled = true;
    game.physics.p2.resume();
    initiateTargetStudentTimer();
    sz = 0.15;

}

function play(){
  console.log("--->play");
  game.physics.p2.resume();
  bground.inputEnabled = true;
  game.time.events.resume([ballsTimer, targetStudentTimer]);
  initiateTargetStudentTimer();
  timer.resume();
}

function resume(){
  console.log("--->resume");
  play();
  game.time.events.resume(targetStudentTimer);
  playButton.alpha=0;
  playButton.input.enabled=false;
}


function startGame(){
  startInstructions.alpha =0;
  startInstructions.inputEnabled = false;
  console.log("--->startGame");
  menu.alpha=0;
  menuButton.alpha = 0;
  menuButton.input.enabled = false;
  bground.inputEnabled = true;
  bground.events.onInputDown.add(holdBall);
  bground.events.onInputUp.add(launchBall);
  ballInSlingshot = createBall();
  ballsTimer = game.time.events.loop(50, updateBalls, this);
  initiateTargetStudentTimer();
  timer.start();
}

function backToMenu()
{
  backButton.alpha = 0;
  menu.alpha =1;
  menuButton.alpha = 1;
  menuButton.inputEnabled = true;
}

function chooseStudent(){
  randomStudent.alpha = 0.5;
  num = Math.floor((Math.random() * 5));
  while(num==randomIndex)
  {
    num = Math.floor((Math.random() * 5));
  }
  randomIndex=num;
  randomStudent = arrayStudents[randomIndex];
  studentNumber = randomIndex+1;
  randomStudent.loadTexture('student'+studentNumber+'-active', 0);
  randomStudent.alpha = 1;

  initiateTargetStudentTimer();
}

function studentHit(ballX, ballY){
    console.log("--->studentHit");
    collisionSound.play();
    // score+= rightHitPoints;
    randomStudent.alpha = 0.5;
    showScoreTween("add", ballX, ballY);
}

function showScoreTween(action, x, y){
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
    if (score ==levelGoal[currentLevel]){
      flashScore();
    }
  });

}

function checkPointLimit(level){
  game.physics.p2.pause();
  game.time.events.pause([ballsTimer, targetStudentTimer]);
  bground.inputEnabled = false;
  if (score<levelGoal[level])
  {
    randomStudent.alpha = 0.5;
    gradeF.alpha =1;
    gradeF.input.enabled=true;
    resetButton.input.enabled=true;
    //bground.events.onInputDown.add(reset);
  } else
  {
    levelDisplay.text="Level: "+currentLevel;
    levelupPopup.alpha=1;
    levelupPopup.input.enabled=true;
    LevelUpButton.input.enabled=true;
  }
}

function formatTime(s) {
        var minutes = "0" + Math.floor(s / 60);
        var seconds = "0" + (s - minutes * 60);
        return minutes.substr(-2) + ":" + seconds.substr(-2);
    }

function endTimer() {
  console.log("---->endTimer");
  timer.stop();
  checkPointLimit(currentLevel);
}


function displayStartInstructions()
{
	playRect.inputEnabled = false;
  menu.alpha = 0;
  menuButton.alpha = 0;
  menuButton.inputEnabled = false;
  startInstructions.alpha = 1;
  startInstructions.inputEnabled = true;
}

function flashTimerDisplay(){
  var currentTime = Math.round((timerEvent.delay - timer.ms) / 100)/10
  if ( currentTime <6){
    timerDisplay.addColor("#ff0000",0);
    timerDisplay.stroke = "#ff0000";
    timerDisplay.strokeThickness = 1*(currentTime%1*2 + 2);
    timerDisplay.fontSize = (currentTime%1 + 1)*40;
  }
}


function render() {
    levelDisplay.text="Level: "+currentLevel;
    scoreDisplay.text ="Score : " + score + '/' + levelGoal[currentLevel];
    if(score < levelGoal[currentLevel]){
      scoreDisplay.addColor("#ff0000", 0); //red
    }
    else {
      scoreDisplay.addColor("#00ff00", 0); //green
    }

    //goalDisplay.text="Goal: "+levelGoal[currentLevel];
}
