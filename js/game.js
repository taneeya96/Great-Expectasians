var screenwidth=1200;
var screenheight=600;


var game = new Phaser.Game(screenwidth, screenheight, Phaser.CANVAS, 'phaser-example');

function preload() {
    game.load.image('background','images/Background.png');
    game.load.image('ball', 'images/paperBall.png');
    game.load.image('slingshot', 'images/CatapultSprite.png')
    game.load.image('student1', 'images/student1.png');
    game.load.image('student2', 'images/student2.png');
    game.load.image('student3', 'images/student1.png');
    game.load.image('student4', 'images/student4.png');
    game.load.image('student5', 'images/student5.png');

    game.load.image('arrow', 'images/blackarrow.png');
    game.load.image('tail', 'images/black.png');
    game.load.image('origin', 'images/blackdot.png');
    game.load.image('analog','images/grey.png');

    game.load.image('pauseButton','images/PauseButton2.png');
    game.load.image('resetButton','images/ResetButton.png')
    game.load.image('playButton', 'images/PlayButton.png');


}


var text;
var counter = 0;
//<<<<<<< Updated upstream
var slingshotX = 450;
var slingshotY = 300
var slingshotHeight = 340
//=======
//const slingshotX = 300;
//const slingshotY = 300
//const slingshotHeight = 340
//>>>>>>> Stashed changes
var ball;
var ballHeld = false; //checks if the ball is held or not
var ballSpeed = 0; // speed of the ball
const ballinitx=slingshotX+100;
const ballinity=slingshotY+65;

var analog;
var tail;
var arrow;
var origin;
var background;
const tailWidth = 10;
var ballFlying = false;
var ballDragged = false;

var resetButton;
var pauseButton;
var playButton;
const buttonXPos = 1100;
const buttonYPos = 50;
const pauseButtonHeight = 60;




function create() {

    bground = game.add.sprite(0,0,'background');
    bground.alpha = 0.75; //transparency of background
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // set global gravity
    game.physics.arcade.gravity.y = 100;

    text = game.add.text(450, 16, '', { fill: '#ffffff' });

    student1 = game.add.sprite(320, 150, 'student1');
    game.physics.enable(student1, Phaser.Physics.ARCADE);
    student1.body.immovanewstudentble = true;
    student1.anchor.set(0.5,0.5);
    student1.body.allowGravity = false;
    student1.body.collideWorldBounds = true;
    student1.body.immovable = true;

    student2 = game.add.sprite(600, 150, 'student2');
    game.physics.enable(student2, Phaser.Physics.ARCADE);
    student2.body.immovanewstudentble = true;
    student2.anchor.set(0.5,0.5);
    student2.body.allowGravity = false;
    student2.body.collideWorldBounds = true;
    student2.body.immovable = true;

    student3 = game.add.sprite(870, 150, 'student3');
    game.physics.enable(student3, Phaser.Physics.ARCADE);
    student3.body.immovanewstudentble = true;
    student3.anchor.set(0.5,0.5);
    student3.body.allowGravity = false;
    student3.body.collideWorldBounds = true;
    student3.body.immovable = true;

    student4 = game.add.sprite(200, 500, 'student4');
    game.physics.enable(student4, Phaser.Physics.ARCADE);
    student4.body.immovanewstudentble = true;
    student4.anchor.set(0.5,0.5);
    student4.body.allowGravity = false;
    student4.body.collideWorldBounds = true;
    student4.body.immovable = true;

    student5 = game.add.sprite(1000, 500, 'student5');
    game.physics.enable(student5, Phaser.Physics.ARCADE);
    student5.body.immovanewstudentble = true;
    student5.anchor.set(0.5,0.5);
    student5.body.allowGravity = false;
    student5.body.collideWorldBounds = true;
    student5.body.immovable = true;

    //  This creates a simple sprite that is using our loaded image and
    //  displays it on-screen and assign it to a variable

    ball = game.add.sprite(ballinitx, ballinity, 'ball');
    ball.scale.setTo(0.15,0.15);
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.anchor.setTo(0.5, 0.5);
    ball.body.collideWorldBounds = false; //bounces against walls
    ball.body.allowGravity = false;


    slingshot = game.add.sprite(slingshotX,slingshotY,'slingshot');
    slingshot.height = slingshotHeight;

    //initStudents(4,3);

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

    bground.inputEnabled = true;
    bground.events.onInputDown.add(holdBall);
    bground.events.onInputUp.add(launchBall);

    //buttons
    pauseButton = game.add.sprite(buttonXPos, buttonYPos, 'pauseButton' );
   	resetButton = game.add.sprite(buttonXPos, buttonYPos+60, 'resetButton');
   	playButton = game.add.sprite(buttonXPos, buttonYPos+120,'playButton');

   	pauseButton.scale.setTo(0.015,0.015);
   	resetButton.scale.setTo(0.15,0.15);
   	playButton.scale.setTo(0.054,0.054);

   	pauseButton.inputEnabled = true;
   	resetButton.inputEnabled = true;
   	playButton.inputEnabled = true;

   	pauseButton.events.onInputDown.add(pause, this);
   	resetButton.events.onInputDown.add(reset,this);
   	playButton.events.onInputDown.add(play,this);

}




function holdBall() {
    if(!ballFlying){
        showArrow();
        ball.body.moves = false;
        ball.body.velocity.setTo(0, 0);
        ball.body.allowGravity = false;
    }

}

function launchBall() {

    hideArrow();
    ball.body.bounce.setTo(0.9, 0.9);
    ball.body.moves = true;
    Xvector = (arrow.x - origin.x) * 5;
    Yvector = (arrow.y - origin.y) * 5;
    ball.body.allowGravity = true;
    ball.body.velocity.setTo(Xvector, Yvector);
    ballFlying = true;



}

function showArrow() {
    //create arrow where the pointer is
    console.log("called showArrow")
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


function update() {

    //arrow.rotation = game.physics.arcade.angleBetween(arrow, ball);

    if (game.physics.arcade.collide(student1, ball)){
        counter++;
        text.text = "You hit the student " + counter + " times!";
        restart();
    } if (game.physics.arcade.collide(student2, ball)){
        counter++;
        text.text = "You hit the student " + counter + " times!";
        restart();
    } if (game.physics.arcade.collide(student3, ball)){
        counter++;
        text.text = "You hit the student " + counter + " times!";
        restart();
    } if (game.physics.arcade.collide(student4, ball)){
        counter++;
        text.text = "You hit the student " + counter + " times!";
        restart();
    } if (game.physics.arcade.collide(student5, ball)){
        counter++;
        text.text = "You hit the student " + counter + " times!";
        restart();
    }

    if (ball.x < 0 || ball.x> screenwidth || ball.y > screenheight || ball.y < 0){
     restart();
    }

    if (ballFlying){
        bground.inputEnabled = false;
    } else {
        bground.inputEnabled = true;
    }

    // update the control arrow
    if (game.input.activePointer.isDown && !ballFlying){
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
}

function reset(){
	restart();
	counter =0;
	text.text = "";
}

function pause(){
	ball.body.moves = false;
	ball.body.allowGravity = false;
}

function restart(){
    	ballSpeed=0;
        ball.reset(ballinitx,ballinity);
        ball.body.allowGravity = false;
        ballFlying = false;
}
function play()
{
    if(ballFlying)
    {
        ball.body.moves = true;
        ball.body.allowGravity = true;
    }
}

function render() {

    game.debug.text("Drag the ball and release to launch", 32, 32);

}