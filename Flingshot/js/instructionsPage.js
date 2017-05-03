var instructionsState = {
  create : function(){
    var startInstructions = game.add.sprite(-10,0,'StartInstructions');
    startInstructions.scale.setTo(0.9,1);
    startInstructions.events.onInputDown.add(this.startGame,this);
    //menuButton.inputEnabled = false;
    startInstructions.alpha = 1;
    startInstructions.inputEnabled = true;
  },
  startGame: function()
  {
    game.state.start('play');
  }
}
