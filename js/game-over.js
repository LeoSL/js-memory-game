/* globals jQuery window document StarCounter */

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

  buildStarRating: function buildStarRating(starRating) {
    const starLine = StarCounter.createStarLineDOMElement();
    let counter = 0;
    let star;

    [1, 2, 3].forEach(() => {
      star = StarCounter.createStarElement();
      star.firstChild.classList.add('modal-stars');
      starLine.appendChild(star);
    });

    starLine.classList.add('modal-star-line');
    $('#modal-star-rating').append(starLine);

    while (counter < 3 - starRating) {
      StarCounter.decreaseStarElement('modal-stars');
      counter += 1;
    }
  },

  populateModalData: function populateModalData() {
    const totalMoves = window.MemoryGameCounters.moveCount.moves;
    const totalTime = window.MemoryGameCounters.timer.elapsed;
    const starRating = window.MemoryGameCounters.starCount.stars;

    $('#modal-total-moves').text(`${totalMoves} Moves`);
    $('#modal-total-time').text(`in ${GameOver.transformTotalTime(totalTime)}`);
    GameOver.buildStarRating(starRating);
  },

  fadeInTrophy: function fadeInTrophy() {
    $('.trophy-img').addClass('fade-in');
  },

  toggleModal: function toggleModal() {
    $('#you-won-modal').modal('toggle');
  },

  youWon: function youWon() {
    GameOver.populateModalData();
    GameOver.toggleModal();
    window.setTimeout(GameOver.fadeInTrophy, 300);
    $('#modal-cancel').on('click', GameOver.toggleModal);
  },
};

GameOver.initGameOverEventListener();
