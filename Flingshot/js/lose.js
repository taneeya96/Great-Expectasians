var loseState = {
  create : function(){
    var losePage = game.add.sprite(0,0,'losePage');
    this.camera.shake(0.01, 1000, true, Phaser.Camera.SHAKE_BOTH, true);
    var resetButton = game.add.sprite(700, 540,'resetButton');
    var finalScore = this.game.state.states['play'].getCurrentScore();
    var scoreDisplay = game.add.text(430,560, finalScore,{fill: '#7CFC00', fontSize: 130, stroke: '#7CFC00', strokeThickness: 6});
    resetButton.scale.setTo(0.15,0.15);
    resetButton.inputEnabled  = true;
    resetButton.events.onInputDown.add(loseState.restartGame,this);
  },
  restartGame : function() {
     schoolbell.pause();
    game.state.start('play');
  }
}
