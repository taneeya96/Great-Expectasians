var loseState = {
  create : function(){
    var losePage = game.add.sprite(0,0,'losePage');
    var resetButton = game.add.sprite(700, 540,'resetButton');
    var finalScore = this.game.state.states['play'].getCurrentScore();
    var scoreDisplay = game.add.text(450,570, finalScore,{fill: '#7CFC00', fontSize: 130, stroke: '#7CFC00', strokeThickness: 6});
    resetButton.scale.setTo(0.15,0.15);
    resetButton.inputEnabled  = true;
    resetButton.events.onInputDown.add(loseState.restartGame,this);
  },
  restartGame : function() {
    game.state.start('play');
  }
}
