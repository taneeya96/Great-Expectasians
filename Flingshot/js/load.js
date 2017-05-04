var loadState = {
  preload : function(){
    game.load.image('Menu','assets/images/MainMenu.png');
    game.load.image('StartInstructions','assets/images/InstructionsPage3.png');
    game.load.image('winPage','assets/images/winPage.png');
    game.load.image('losePage', 'assets/images/GameOver.png');

    game.load.image('MenuButton','assets/images/MenuPlay.png');
    game.load.image('BackButton','assets/images/BackButton.png');
    game.load.image('pauseButton','assets/images/PauseButton2.png');
    game.load.image('resetButton','assets/images/MenuReset.png')
    game.load.image('playButton', 'assets/images/PlayButton.png');
    game.load.image('pausePopup','assets/images/overwatch.png');

   
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


    game.load.spritesheet('mummy', 'assets/images/Teacher graphic.png', 150, 354);
    game.load.image('table', 'assets/images/table.png');


    game.load.image('arrow', 'assets/images/blackarrow.png');
    game.load.image('tail', 'assets/images/black.png');
    game.load.image('origin', 'assets/images/blackdot.png');
    game.load.image('analog','assets/images/grey.png');


    game.load.physics('physicsData1', 'assets/physics/studenthead-1.json');
    game.load.physics('physicsData2', 'assets/physics/studenthead-2.json');
    game.load.physics('physicsData3', 'assets/physics/studenthead-3.json');
    game.load.physics('physicsData4', 'assets/physics/studenthead-4.json');
    game.load.physics('physicsData5', 'assets/physics/studenthead-5.json');

    game.load.image('gradeF','assets/images/gradeF.png');

    //sound effects
    game.load.audio('collisionSound', 'assets/audio/collisionSound.mp3');

    game.load.image('progressBar','assets/images/progressBar.png');

    

  },
  create : function() {
    game.state.start('menu');
  }
}
