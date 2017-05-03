var winState = {
  create : function(){
    var winPage = game.add.sprite(0,0,'winPage');
    var resetButton = game.add.sprite(game.world.centerX, game.world.centerY+50,'resetButton');
    resetButton.scale.setTo(0.5,0.5);
    resetButton.inputEnabled  = true;
    resetButton.events.onInputDown.add(loseState.restartGame,this);
  },
  restartGame : function() {
    game.state.start('play');
  }

}
