var instructionsState = {
  create : function(){
    var string = 'Hit the students!';
    var startInstructions = game.add.sprite(0,0,'StartInstructions');
    var instruct = game.add.sprite(600,170,'instruction');
    instruct.alpha = 1;
    var walk = instruct.animations.add('walk');
    instruct.animations.play('walk', 7, true);

    startInstructions.scale.setTo(1,1);
    startInstructions.events.onInputDown.add(this.startGame,this);
    startInstructions.alpha = 1;
    startInstructions.inputEnabled = true;
    this.game.load.bitmapFont('myfont', 'assets/fonts/font.png', 'assets/fonts/font.fnt');
    instructionDisplay = game.add.bitmapText(855,450,'myfont',string.toUpperCase(),38);
  },
  startGame: function()
  {
    game.state.start('play');

  }
}
