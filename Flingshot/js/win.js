var winState = {
  create : function(){
    var winPage = game.add.sprite(0,0,'winPage');
    var resetButton = game.add.sprite(game.world.centerX-150, game.world.centerY-50,'resetButton');
    var finalScore = this.game.state.states['play'].getCurrentScore();
    var scoreDisplay = game.add.text(650,450, finalScore,{fill: '#FEFEFA', fontSize: 130, stroke: '#FEFEFA', strokeThickness: 6});
    resetButton.scale.setTo(0.15,0.15);
    resetButton.inputEnabled  = true;
    resetButton.events.onInputDown.add(loseState.restartGame,this);
  },
  restartGame : function() {
    game.state.start('play');
  }

}
