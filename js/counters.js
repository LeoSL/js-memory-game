/* globals window document CustomEvent */

// COUNTERS COMPONENTS //
const Timer = class Timer {
  constructor() {
    this.begins = new Date().getTime();
    this.elapsed = '0.0';
    this.gameOver = false;
  }

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

const MovesCounter = class MovesCounter {
  constructor() {
    this.moves = 0;
  }

  increment() {
    this.moves += 1;
    this.render();
  }

  render() {
    const movesCounterElement = document.getElementById('moves-counter');
    movesCounterElement.textContent = `${this.moves} Moves`;
  }
};

const StarCounter = class StarCounter {
  constructor() {
    this.stars = 3;
  }

  static decreaseStarElement(className) {
    const stars = document.getElementsByClassName(className);
    const star = stars[(stars.length - 1)];
    star.setAttribute('class', 'fa fa-star-o');
  }

  checkStarRating() {
    const counters = window.MemoryGameCounters;

    if (counters.moveCount.moves > 0 && this.stars > 1 && (counters.moveCount.moves % 8) === 0) {
      this.stars -= 1;
      StarCounter.decreaseStarElement('fa-star');
    }
  }

  static createStarLineDOMElement() {
    const ulStarLine = document.createElement('ul');
    ulStarLine.setAttribute('id', 'stars-line');
    ulStarLine.setAttribute('class', 'stars');
    return ulStarLine;
  }

  static createStarElement() {
    const starLi = document.createElement('li');
    const starItem = document.createElement('i');
    starItem.setAttribute('class', 'fa fa-star');
    starLi.append(starItem);
    return starLi;
  }

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

const CardCounter = class CardCounter {
  constructor(cardCount) {
    this.matchedCards = 0;
    this.deckCardCount = cardCount;
  }

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

const Counters = {
  startTimer: function startTimer() {
    const timer = new Timer();
    timer.render();
    return timer;
  },

  startMoveCount: function startMoveCount() {
    const movesCounter = new MovesCounter();
    movesCounter.render();
    return movesCounter;
  },

  startStarCounter: function startStarCounter() {
    const starCounter = new StarCounter();
    starCounter.render();
    return starCounter;
  },

  startCardCounter: function startCardCounter(cardCount) {
    const cardCounter = new CardCounter(cardCount);
    return cardCounter;
  },

  initCounters: function initCounters(cardCount) {
    window.MemoryGameCounters = {
      starCount: Counters.startStarCounter(),
      moveCount: Counters.startMoveCount(),
      timer: Counters.startTimer(),
      cardCounter: Counters.startCardCounter(cardCount),
    };
  },

  endCounters: function endCounters() {
    window.MemoryGameCounters = {};
  },

  initCounterEventListeners: function initCounterEventListeners() {
    document.addEventListener('initCounters', (event) => {
      Counters.initCounters(event.detail.deckCount);
    });
    document.addEventListener('endCounters', Counters.endCounters);
  },
};
//

Counters.initCounterEventListeners();
