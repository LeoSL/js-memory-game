/* globals jQuery window document StarCounter */

/**
 * Assign jQuery global to a dollar sign convention
 */
const $ = jQuery;

/**
 * Handles the actions triggered after a Memory Game is over
 */
const GameOver = {
  /**
   * Adds a document listener that calls a winning function
   */
  initGameOverEventListener: function initGameOverEventListener() {
    document.addEventListener('memoryGameOver', GameOver.youWon);
  },

  /**
   * fancyTimeFormat function from https://stackoverflow.com/questions/3733227 - ES6 converted
   * @param {Number} totalTime
   */
  transformTotalTime: function transformTotalTime(totalTime) {
    const hrs = Math.floor(totalTime / 3600);
    const mins = Math.floor((totalTime % 3600) / 60);
    const secs = totalTime % 60;
    let convertedTime = '';

    if (hrs > 0) {
      convertedTime += `${hrs}${(mins < 10 ? '0' : '')}h `;
    }

    convertedTime += `${mins}${(secs < 10 ? '0' : '')}m `;
    convertedTime += `${secs}s`;
    return convertedTime;
  },

  /**
   * Builds winning modal star rating
   * @param {Number} starRating
   */
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

  /**
   * Populates bootstrap modal with game data
   */
  populateModalData: function populateModalData() {
    const totalMoves = window.MemoryGameCounters.moveCount.moves;
    const totalTime = window.MemoryGameCounters.timer.elapsed;
    const starRating = window.MemoryGameCounters.starCount.stars;

    $('#modal-total-moves').text(`${totalMoves} Moves`);
    $('#modal-total-time').text(`in ${GameOver.transformTotalTime(totalTime)}`);
    GameOver.buildStarRating(starRating);
  },

  /**
   * Fade in CSS animation to show a shinning trophy
   */
  fadeInTrophy: function fadeInTrophy() {
    $('.trophy-img').addClass('fade-in');
  },

  /**
   * Toggles bootstrap modal
   */
  toggleModal: function toggleModal() {
    $('#you-won-modal').modal('toggle');
  },

  /**
   * Function called after document received the 'memoryGameOver' event
   * Triggers bootstrap modal screen appearence, populate is game data and fade in a shinny trophy
   */
  youWon: function youWon() {
    GameOver.populateModalData();
    GameOver.toggleModal();
    window.setTimeout(GameOver.fadeInTrophy, 300);
    $('#modal-cancel').on('click', GameOver.toggleModal);
  },
};

GameOver.initGameOverEventListener();
