var screenwidth=1200;
var screenheight=600;
var randomStudent;
var game = new Phaser.Game(screenwidth, screenheight, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });
var  ballsTimer= null;
var balls = [];
var ball = null;
var timer,timerEvent;

function preload() {
    game.load.image('Menu','images/MainMenu.png');
    game.load.image('MenuButton','images/MenuPlay.png');
    game.load.image('background','images/Background1.png');
    game.load.image('ball', 'images/paperBall.png');
    game.load.image('slingshot', 'images/CatapultSprite.png')
    game.load.image('student1', 'images/student1.png');
    game.load.image('student1-hit', 'images/student1-hit.png');
    game.load.image('student2', 'images/student2.png');
    game.load.image('student2-hit', 'images/student2-hit.png');
    game.load.image('student3', 'images/student3.png');
    game.load.image('student3-hit', 'images/student3-hit.png');
    game.load.image('student4', 'images/student3.png');
    game.load.image('student5', 'images/student3.png');

    game.load.image('arrow', 'images/blackarrow.png');
    game.load.image('tail', 'images/black.png');
    game.load.image('origin', 'images/blackdot.png');
    game.load.image('analog','images/grey.png');

    game.load.image('pauseButton','images/PauseButton2.png');
    game.load.image('resetButton','images/ResetButton.png')
    game.load.image('playButton', 'images/PlayButton.png');

    game.load.physics('physicsData', 'assets/studentHead1.json');
    game.load.image('gradeF','images/gradeF.png');

    game.load.image('pausePopup','images/overwatch.png');

    //sound effects
    game.load.audio('collisionSound', 'assets/Audio/collisionSound.mp3');

  //game.load.spritesheet('runningStudent', 'images/RunningStudentSpriteSheet3.png', 125, 500, 8,60);

}

var text;

var slingshotX = 450;
var slingshotY = 500
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
const buttonYPos = 65;
const pauseButtonHeight = 60;

var arrayStudents;
//var runningStudent;

var score = 0;
var pointGoal=100;
var levelGoal=[0,30,250,420,720];
const wrongHitPoints = 5;
const rightHitPoints = 10;
var gradeF;
var currentLevel=1;
var customBound;

var ballsInMotion = [];
var studentCollisionGroup;
var ballCollisionGroup;
var inactiveCollisionGroup;

function create() {

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;


    bground = game.add.sprite(0,0,'background');
    bground.alpha = 0.75; //transparency of background


    pausePopup = game.add.sprite(game.world.centerX, game.world.centerY, 'pausePopup');
    pausePopup.alpha = 0;
    pausePopup.anchor.set(0.5,0.5);
    pausePopup.inputEnabled = false;



    playButton = game.make.sprite(0,0, 'MenuButton');
    playButton.anchor.set(0.5,0.5);
    playButton.scale.setTo(0.1,0.1);
    playButton.alpha=1;
    playButton.inputEnabled = true;
    playButton.input.priorityID = 1;
    playButton.events.onInputDown.add(resume,this);
    pausePopup.addChild(playButton);


    levelupPopup = game.add.sprite(game.world.centerX, game.world.centerY, 'pausePopup');
    levelupPopup.alpha = 0;
    levelupPopup.anchor.set(0.5,0.5);
    levelupPopup.inputEnabled = false;


    LevelUpButton = game.make.sprite(0,0, 'playButton');
    LevelUpButton.anchor.set(0.5,0.5);
    LevelUpButton.scale.setTo(0.08,0.08);
    LevelUpButton.alpha=1;
    LevelUpButton.inputEnabled = true;
    LevelUpButton.input.priorityID=1;
    LevelUpButton.events.onInputDown.add(levelUpResume,this);
    levelupPopup.addChild(LevelUpButton);

    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 500; //larger y gravity the narrower the parabol.
    game.physics.p2.restitution = 0.1; //bounciness of the world
    game.physics.p2.setImpactEvents(true);

    timerDisplay = game.add.text(32,16,'',{fill: '#ffffff' });
    scoreDisplay = game.add.text(350, 16, '', { fill: '#ffffff' });
    goalDisplay = game.add.text(700,16,'',{fill: '#ffffff' });
    levelDisplay = game.add.text(1000,16,'',{fill: '#ffffff' });

    //sound effects
    collisionSound = game.add.audio('collisionSound');

    studentCollisionGroup = game.physics.p2.createCollisionGroup();
    ballCollisionGroup = game.physics.p2.createCollisionGroup();
    inactiveCollisionGroup = game.physics.p2.createCollisionGroup();

    // runningStudent = game.add.sprite(50,50,'runningStudent');
    // runningStudent.scale.setTo(0.5,0.5)
    // var walk = runningStudent.animations.add('walk');
    // runningStudent.animations.play('walk',5,true);

    var studentXs = [320,1000,870,200,600];
    var studentYs = [250,500,250,500,250];
    arrayStudents = [];

    for (var i=0; i<3; i++){
        var student = addStudent('student'+(i+1), studentXs[i], studentYs[i]);
        arrayStudents.push(student);
        //student.body.setRectangle(80,80); //for collision, box-shaped

        // student.body.clearShapes();
    // student.body.loadPolygon('physicsData', 'student1');
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
    //resetButton = game.add.button(buttonXPos, buttonYPos+60, 'resetButton', reset , this, 2, 1, 0 );
    //playButton = game.add.button(buttonXPos, buttonYPos+120,'playButton', play , this, 2, 1, 0);

   	pauseButton.scale.setTo(0.03,0.03);
   	//resetButton.scale.setTo(0.15,0.15);
   	//playButton.scale.setTo(0.054,0.054);



    randomIndex = Math.floor((Math.random() * 3))

    //randomIndex = 0;
    randomStudent = arrayStudents[randomIndex];
    for( var i=0; i< arrayStudents.length; i++)
    {
      arrayStudents[i].alpha = 0.50;
    }
    randomStudent.alpha = 1;

    gradeF = game.add.sprite(game.world.centerX, game.world.centerY,'gradeF');
    gradeF.anchor.set(0.5,0.5);
    gradeF.alpha = 0;
    gradeF.inputEnabled=false;

    //var rw = gradeF.width / 2;
    //var rh = gradeF.height/2;
    var resetButton = game.make.sprite(0,100, 'resetButton');

    resetButton.anchor.set(0.5,0.5);
    resetButton.scale.setTo(0.3,0.3);
    resetButton.alpha=1;
    resetButton.inputEnabled = true;
    resetButton.input.priorityID = 1;
    resetButton.events.onInputDown.add(reset,this);
    gradeF.addChild(resetButton);


    menu = game.add.sprite(-100,-100,'Menu');
    menu.alpha = 1;


    menuButton = game.add.sprite(500,50,'MenuButton');
    menuButton.alpha = 1;
    menuButton.scale.setTo(0.1,0.1);
    menuButton.inputEnabled  = true;
    menuButton.events.onInputDown.add(startGame,this);
    initiateTimer();

}

function initiateTimer(){
  timer = game.time.create();
  timerEvent = timer.add(Phaser.Timer.SECOND * 20, endTimer);
}

function reIniTimer(){
  timer.destroy();
  initiateTimer();
  timer.start();
}
function levelUpResume(){
  reIniTimer();
  levelupPopup.alpha=0;
  levelupPopup.inputEnabled=false;
  bground.inputEnabled = true;
  game.physics.p2.resume();
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
    // student.body.clearShapes();
    //     student.body.loadPolygon('physicsData', 'student1');
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
        Xvector = (arrow.x - origin.x) *10;
        Yvector = (arrow.y - origin.y) *10;
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

function updateBallSize(ball){
  if(!ball.hitFloor){
    ball.body.z += ball.body.velocity.z;
    var size = 0.15/(1 + ball.body.z*0.005);
    ball.scale.setTo(size,size);
    ball.floor = (screenheight + 300) / (1 + ball.body.z * 0.01);
  }
  if(ball.body.y > ball.floor){
    bounceOffFloor(ball);
  }
}

function bounceOffFloor(ball) {
  ball.body.velocity.y = -ball.body.velocity.y/1.5;
  ball.body.velocity.x = ball.body.velocity.x/1.5;
  ball.body.y = ball.floor;
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
    ballCollided = true;
    if (body1.x == randomStudent.x && body1.y == randomStudent.y){
        studentHit();
        studentnum = randomIndex+1;
        randomStudent.loadTexture('student'+studentnum+'-hit', 0);
        chooseStudent();
    }
    else{
      score-= wrongHitPoints;
      console.log("5 points taken off")
    }
    //not working -- runningStuddent collision
    // if(body1.x ==runningStudent.x && body1.y == runningStudent.y){
    //   score+=50;
    //   scoreDisplay.text = "Score : "+score;
    // }
    body2.sprite.body.setCollisionGroup(inactiveCollisionGroup);
}

function update() {
    //Randomized selection of student

    //Restart after collision.
    for(var i=0; i<ballsInMotion.lenght; i++){

    ballsInMotion[i].body.collideWorldBounds = true;
    if(i==ballsInMotion.length -1)
    {
      restart();
    }
  }

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

      // runningStudent.x += 2;
      //
      // if (runningStudent.x < -runningStudent.width)
      // {
      //   runningStudent.x = game.world.width;
      // }

  }
function setCustomBound(x, y){
    var sim = game.physics.p2;
    var mask = sim.boundsCollisionGroup.mask;
    var h = 100;
    console.log(x,y);
    customBound = new p2.Body({ mass: 0, position: [sim.pxmi(x), sim.pxmi(y + h) ] });
    customBound.addShape(new p2.Plane());
    sim.world.addBody(customBound);
}


function isBallDirectionChanged( newVel){
    if (newVel * currentVel < 0){
        currentVel = newVel;
        return true;
    } else{
        currentVel = newVel;
        return false;
    }
}


function reset(){
  gradeF.alpha = 0;
  restart();
  randomStudent.alpha = 0.5;
  chooseStudent();
  score=0;
  reIniTimer();
  currentLevel=1;
}

function pause(){
    console.log("-->pause");
    game.physics.p2.pause();
    game.time.events.pause(ballsTimer);
    timer.pause();
    bground.inputEnabled = false;
    pausePopup.alpha=1;
    pausePopup.inputEnabled=true;

}


function restart(){
    ballSpeed=0;
    ballFlying = false;
    ballCollided = false;
    for(var i =0; i<ballsInMotion.length; i++){
        ballsInMotion[i].destroy();
    }
    ballsInMotion = [];
    ballsInMotion.push(createBall());
    ballInSlingshot = ballsInMotion[ballsInMotion.length - 1];
    bground.inputEnabled = true;
    game.physics.p2.resume();
    sz = 0.15;

}

function play(){
  game.physics.p2.resume();
  bground.inputEnabled = true;
  game.time.events.resume(ballsTimer);
  timer.resume();
}

function resume(){
  console.log("--->resume");
  play();
  pausePopup.alpha=0;
  pausePopup.inputEnabled=false;
}


function startGame(){
  menu.alpha=0;
  menuButton.alpha = 0;
  menuButton.inputEnabled = false;
  bground.inputEnabled = true;
  bground.events.onInputDown.add(holdBall);
  bground.events.onInputUp.add(launchBall);
  ballInSlingshot = createBall();
  ballsTimer = game.time.events.loop(100, updateBalls, this);
  timer.start();
}



function chooseStudent(){
  num = Math.floor((Math.random() * 3));
  while(num==randomIndex)
  {
    num = Math.floor((Math.random() * 3));
  }
  randomIndex=num;
  randomStudent = arrayStudents[randomIndex];
  randomStudent.alpha = 1;
}

function studentHit(){
    collisionSound.play();
    score+= rightHitPoints;
    console.log("10 points added");
    randomStudent.alpha = 0.5;
}

function checkPointLimit(level){
  game.physics.p2.pause();
  game.time.events.pause(ballsTimer);
  bground.inputEnabled = false;
  if (score<levelGoal[level])
  {
    randomStudent.alpha = 0.5;
    gradeF.alpha =1;

  } else
  {
    currentLevel=level+1;
    levelDisplay.text="Level: "+currentLevel;
    levelupPopup.alpha=1;
  }
}

function formatTime(s) {
        var minutes = "0" + Math.floor(s / 60);
        var seconds = "0" + (s - minutes * 60);
        return minutes.substr(-2) + ":" + seconds.substr(-2);
    }

function endTimer() {
        timer.stop();
        checkPointLimit(currentLevel);
}

function render() {
    timerDisplay.text=formatTime(Math.round((timerEvent.delay - timer.ms) / 1000));
    levelDisplay.text="Level: "+currentLevel;
    scoreDisplay.text ="Score : " + score;
    goalDisplay.text="Goal: "+levelGoal[currentLevel];
}
