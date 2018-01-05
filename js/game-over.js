// TO-DO : EventListener to show modal and Game Score
// dispatchEvent to App.endGame() when modal is shown
// click restartGame button when [RESTART] modal button is clicked (maybe bind through classes)
// stop timer when game is finished
//

/* globals jQuery document */

const $ = jQuery;

const GameOver = {
  initGameOverEventListener: function initGameOverEventListener() {
    document.addEventListener('memoryGameOver', GameOver.youWon);
  },

  youWon: function youWon() {
    $('#you-won-modal').modal('toggle');
  },
};

GameOver.initGameOverEventListener();
