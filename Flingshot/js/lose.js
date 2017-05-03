var loseState = {
  create : function(){
    var gradeF = game.add.sprite(game.world.centerX, game.world.centerY,'gradeF');
    gradeF.scale.setTo(0.8,0.8);
    var resetButton = game.add.sprite(game.world.centerX, game.world.centerY+50,'resetButton');
    resetButton.scale.setTo(0.5,0.5);
    resetButton.inputEnabled  = true;
    resetButton.events.onInputDown.add(loseState.restartGame,this);
  },
  restartGame : function() {
    game.state.start('play');
  }
}
