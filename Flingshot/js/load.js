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

    game.load.image('ProgressBar-0', 'assets/images/ProgressBar-0.png');
    game.load.image('ProgressBar-1', 'assets/images/ProgressBar-1.png');
    game.load.image('ProgressBar-2', 'assets/images/ProgressBar-2.png');
    game.load.image('ProgressBar-3', 'assets/images/ProgressBar-3.png');
    game.load.image('ProgressBar-4', 'assets/images/ProgressBar-4.png');


    game.load.spritesheet('teacher', 'assets/images/Teacher graphic.png', 150, 354);
    game.load.spritesheet('instruction', 'assets/images/instruction.png', 270, 579);

    game.load.image('table', 'assets/images/table.png');


    game.load.image('arrow', 'assets/images/blackarrow.png');
    game.load.image('tail', 'assets/images/black.png');
    game.load.image('origin', 'assets/images/blackdot.png');
    game.load.image('analog','assets/images/grey.png');


      //spit bubble
      game.load.image('bubble', 'assets/images/bubble.png');
      game.load.image('bluespit', 'assets/images/bluespitbubble.png');
      game.load.image('bluecircle', 'assets/images/bluecircle.png');
      game.load.image('drop','assets/images/drop.png');

    game.load.physics('physicsData1', 'assets/physics/studenthead-1.json');
    game.load.physics('physicsData2', 'assets/physics/studenthead-2.json');
    game.load.physics('physicsData3', 'assets/physics/studenthead-3.json');
    game.load.physics('physicsData4', 'assets/physics/studenthead-4.json');
    game.load.physics('physicsData5', 'assets/physics/studenthead-5.json');
    // game.load.physics('physicsDataTeacher','assets/physics/teacher-hit.json');
    game.load.physics('physicsDataTeacher','assets/physics/teacher-collision.json');
    game.load.image('gradeF','assets/images/gradeF.png');




    //sound effects
    game.load.audio('collisionSound', 'assets/audio/collisionSound.mp3');
    game.load.audio('pain1male','assets/audio/pain1male.mp3');
    game.load.audio('pain2male','assets/audio/pain2male.mp3');
    game.load.audio('pain3fem','assets/audio/pain3fem.mp3');
    game.load.audio('pain4fem','assets/audio/pain4fem.mp3');
    game.load.audio('pain5male','assets/audio/pain5male.mp3');
    game.load.audio('schoolbell','assets/audio/schoolbell.mp3');

  },
  create : function() {
    game.state.start('menu');
  }
}
