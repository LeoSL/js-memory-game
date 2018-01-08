/* globals jQuery window document */

const $ = jQuery;

const GameOver = {
  initGameOverEventListener: function initGameOverEventListener() {
    document.addEventListener('memoryGameOver', GameOver.youWon);
  },

  // fancyTimeFormat FUNCTION from https://stackoverflow.com/questions/3733227 (ES6 converted) //
  transformTotalTime: function transformTotalTime(totalTime) {
    // Hours, minutes and seconds
    const hrs = Math.floor(totalTime / 3600);
    const mins = Math.floor((totalTime % 3600) / 60);
    const secs = totalTime % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    let convertedTime = '';

    if (hrs > 0) {
      convertedTime += `${hrs}${(mins < 10 ? '0' : '')}h `;
    }

    convertedTime += `${mins}${(secs < 10 ? '0' : '')}m `;
    convertedTime += `${secs}s`;
    return convertedTime;
  },

  populateModalData: function populateModalData() {
    const totalMoves = window.MemoryGameCounters.moveCount.moves;
    const totalTime = window.MemoryGameCounters.timer.elapsed;
    const starRating = window.MemoryGameCounters.starCount.stars;

    $('#modal-total-moves').text(`${totalMoves} Moves`);
    $('#modal-total-time').text(`in ${GameOver.transformTotalTime(totalTime)}`);
    $('#modal-star-rating').text(`Star rating: ${starRating}`);
  },

  fadeInTrophy: function fadeInTrophy() {
    $('.trophy-img').addClass('fade-in');
  },

  youWon: function youWon() {
    GameOver.populateModalData();
    $('#you-won-modal').modal('toggle');
    window.setTimeout(GameOver.fadeInTrophy, 300);
  },
};

GameOver.initGameOverEventListener();
