/* globals window document CustomEvent */

/**
 * Timer counter controls how much time elapsed since the game start
 */
const Timer = class Timer {
  /**
   * Creates an instance of Timer.
   */
  constructor() {
    this.begins = new Date().getTime();
    this.elapsed = '0.0';
    this.gameOver = false;
  }

  /**
   * Renders elapsed time into HTML
   */
  render() {
    const timerElement = document.createElement('span');
    let time;

    timerElement.setAttribute('id', 'elapsed-time-counter');

    document.getElementById('time-elapsed').append(timerElement);

    window.setInterval(() => {
      if (this.gameOver === false) {
        time = new Date().getTime() - this.begins;

        this.elapsed = Math.floor(time / 100) / 10;

        if (Math.round(this.elapsed) === this.elapsed) this.elapsed += '.0';

        timerElement.textContent = Math.trunc(this.elapsed);
      }
    }, 100);
  }
};

/**
 * Count user's movements flipping the cards
 */
const MovesCounter = class MovesCounter {
  /**
   * Creates an instance of MovesCounter.
   */
  constructor() {
    this.moves = 0;
  }

  /**
   * Increments class property move count
   */
  increment() {
    this.moves += 1;
    this.render();
  }

  /**
   * Renders move count number into HTML
   */
  render() {
    const movesCounterElement = document.getElementById('moves-counter');
    movesCounterElement.textContent = `${this.moves} Moves`;
  }
};

/**
 * Handles the Memory Game star rating
 */
const StarCounter = class StarCounter {
  /**
   * Creates an instance of StarCounter.
   */
  constructor() {
    this.stars = 3;
  }

  /**
   * Transforms the star element style from filled to empty star
   * @static
   * @param {String} className
   */
  static decreaseStarElement(className) {
    const stars = document.getElementsByClassName(className);
    const star = stars[(stars.length - 1)];
    star.setAttribute('class', 'fa fa-star-o');
  }

  /**
   * Checks star rating and decrease it if
   * there is at least one move
   * there is more than 1 filled star left
   * and move count is divisible by 8
   */
  checkStarRating() {
    const counters = window.MemoryGameCounters;

    if (counters.moveCount.moves > 0 && this.stars > 1 && (counters.moveCount.moves % 8) === 0) {
      this.stars -= 1;
      StarCounter.decreaseStarElement('fa-star');
    }
  }

  /**
   * Creates star rating line DOM Element
   * @static
   */
  static createStarLineDOMElement() {
    const ulStarLine = document.createElement('ul');
    ulStarLine.setAttribute('id', 'stars-line');
    ulStarLine.setAttribute('class', 'stars');
    return ulStarLine;
  }

  /**
   * Creates star DOM Element
   * @static
   */
  static createStarElement() {
    const starLi = document.createElement('li');
    const starItem = document.createElement('i');
    starItem.setAttribute('class', 'fa fa-star');
    starLi.append(starItem);
    return starLi;
  }

  /**
   * Renders the star rating depending on class stars numbers
   */
  render() {
    let counter = 0;
    const starLine = StarCounter.createStarLineDOMElement();
    const starLineMovesDiv = document.getElementById('star-line-moves-div');
    let star;

    starLineMovesDiv.append(starLine);

    while (counter < this.stars) {
      star = StarCounter.createStarElement();
      starLineMovesDiv.lastChild.append(star);
      counter += 1;
    }
  }
};

/**
 * Count the cards to check if the game is over or not
 */
const CardCounter = class CardCounter {
  /**
   * Creates an instance of CardCounter.
   * @param {Number} cardCount
   */
  constructor(cardCount) {
    this.matchedCards = 0;
    this.deckCardCount = cardCount;
  }

  /**
   * Checks if the number of cards matched is the same as the total cards in the deck
   * It it is, ends the games
   * @return {boolean}
   */
  checkMatchedCardsCount() {
    let gameOver = false;
    let endGameEvent;
    this.matchedCards = document.getElementsByClassName('card open show matched').length;
    if (this.matchedCards === Number(this.deckCardCount)) {
      endGameEvent = new CustomEvent('memoryGameOver');
      document.dispatchEvent(endGameEvent);
      gameOver = true;
    }
    return gameOver;
  }
};

/**
 * Wraps all counters initializers and event handlers
 */
const Counters = {
  /**
   * Starts timer counter
   */
  startTimer: function startTimer() {
    const timer = new Timer();
    timer.render();
    return timer;
  },

  /**
   * Starts move counter
   */
  startMoveCount: function startMoveCount() {
    const movesCounter = new MovesCounter();
    movesCounter.render();
    return movesCounter;
  },

  /**
   * Starts star counter
   */
  startStarCounter: function startStarCounter() {
    const starCounter = new StarCounter();
    starCounter.render();
    return starCounter;
  },

  /**
   * Starts card counter
   */
  startCardCounter: function startCardCounter(cardCount) {
    const cardCounter = new CardCounter(cardCount);
    return cardCounter;
  },

  /**
   * Init all counters and append them in  window global variable
   */
  initCounters: function initCounters(cardCount) {
    window.MemoryGameCounters = {
      starCount: Counters.startStarCounter(),
      moveCount: Counters.startMoveCount(),
      timer: Counters.startTimer(),
      cardCounter: Counters.startCardCounter(cardCount),
    };
  },

  /**
   * End counters by assign an empty object to MemoryGameCounter window property
   */
  endCounters: function endCounters() {
    window.MemoryGameCounters = {};
  },

  /**
   * Initiates listeners to initialize or end Memory Game
   */
  initCounterEventListeners: function initCounterEventListeners() {
    document.addEventListener('initCounters', (event) => {
      Counters.initCounters(event.detail.deckCount);
    });
    document.addEventListener('endCounters', Counters.endCounters);
  },
};

Counters.initCounterEventListeners();
