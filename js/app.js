/* eslint-disable prefer-rest-params */

/* globals window document localStorage */

// SHUFFLE FUNCTION //
/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) { // eslint-disable-line no-unused-vars
  const shuffledArray = array;
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    shuffledArray[currentIndex] = shuffledArray[randomIndex];
    shuffledArray[randomIndex] = temporaryValue;
  }

  return shuffledArray;
}
//

// MATH UTILS COMPONENT //
const MathUtils = class MathUtils {
  static getRandomInt(minNumber, maxNumber) {
    const min = Math.ceil(minNumber);
    const max = Math.floor(maxNumber);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  static getRandomCardId() {
    return Math.round(Math.random() * 10000);
  }
};
//

// CARD STYLE LIST COMPONENT //
const CardStylelist = [
  'fa-diamond',
  'fa-paper-plane-o',
  'fa-anchor',
  'fa-bolt',
  'fa-cube',
  'fa-leaf',
  'fa-bicycle',
  'fa-bomb',
];
//

// CARD COMPONENT //
const Card = class Card {
  constructor(cardId, cardStyle, cardStyleId) {
    this.cardId = cardId || MathUtils.getRandomCardId();
    this.cardStyle = cardStyle || CardStylelist[cardStyleId];
  }

  render() {
    const card = document.createElement('li');
    const cardItem = document.createElement('i');

    card.setAttribute('class', 'card');
    card.setAttribute('id', this.cardId);
    cardItem.setAttribute('class', `fa ${this.cardStyle}`);

    card.append(cardItem);

    return card;
  }
};
//


// DECK COMPONENT //
const Deck = class Deck {
  constructor(dimension) {
    this.deckWidth = dimension || 4;
    this.cardDeck = [];
  }

  duplicateCards() {
    let duplicatedCard;

    this.cardDeck.forEach((card) => {
      duplicatedCard = new Card(`${card.cardId}-match`, card.cardStyle, null);
      this.cardDeck.push(duplicatedCard);
    });
  }

  static createDeckDOMElement() {
    const cardDeckElement = document.createElement('ul');
    cardDeckElement.setAttribute('id', 'card-deck');
    cardDeckElement.setAttribute('class', 'deck');
    document.getElementById('memory-game-main-div').append(cardDeckElement);
  }

  buildDeck() {
    const numberOfCards = this.deckWidth * this.deckWidth;
    let card;
    let iterator = 0;

    while (iterator < (numberOfCards / 2)) {
      card = new Card(null, null, iterator);
      this.cardDeck.push(card);
      iterator += 1;
    }

    this.duplicateCards();
    this.cardDeck = shuffle(this.cardDeck);

    Deck.createDeckDOMElement();
  }

  render() {
    this.cardDeck.forEach((card) => {
      document.getElementById('card-deck').append(card.render());
    });
  }
};

//

// COUNTERS COMPONENTS //
const Timer = class Timer {
  constructor() {
    this.begins = new Date().getTime();
    this.elapsed = '0.0';
  }

  render() {
    const scorePanel = document.getElementById('score-panel-section');
    const timerElement = document.createElement('span');
    let time;

    timerElement.setAttribute('id', 'elapsed-time');
    scorePanel.append(timerElement);

    window.setInterval(() => {
      time = new Date().getTime() - this.begins;

      this.elapsed = Math.floor(time / 100) / 10;

      if (Math.round(this.elapsed) === this.elapsed) this.elapsed += '.0';

      timerElement.textContent = this.elapsed;
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
    movesCounterElement.textContent = this.moves;
  }
};

const StarCounter = class StarCounter {
  constructor() {
    this.stars = 3;
  }

  static decreaseStarElement() {
    const stars = document.getElementsByClassName('fa-star');
    const star = stars[(stars.length - 1)];
    star.setAttribute('class', 'fa fa-star-o');
  }

  checkStarRating() {
    const counters = window.MemoryGameCounters;
    if (this.stars > 0 && (counters.moveCount.moves % 4) === 0) {
      this.stars -= 1;
      StarCounter.decreaseStarElement();
    }
  }

  static createStarElement() {
    const starLi = document.createElement('li');
    const starItem = document.createElement('i');
    starItem.setAttribute('class', 'fa fa-star');
    starLi.append(starItem);

    document.getElementById('stars-line').append(starLi);
  }

  static createStarLineDOMElement() {
    const movesCounter = document.getElementById('moves-counter');
    const cardDeckElement = document.createElement('ul');
    cardDeckElement.setAttribute('id', 'stars-line');
    cardDeckElement.setAttribute('class', 'stars');

    document.getElementById('score-panel-section').insertBefore(cardDeckElement, movesCounter);
  }

  render() {
    let counter = 0;
    StarCounter.createStarLineDOMElement();

    while (counter < this.stars) {
      StarCounter.createStarElement();
      counter += 1;
    }
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
};
//


// GAME ACTION //
const CardActions = class CardActions {
  constructor() {
    this.cards = Array.from(document.getElementsByClassName('card'));
    this.card1 = '';
    this.card2 = '';
  }

  static showCard(card) {
    card.setAttribute('class', 'card open show');
  }

  static hideCard() {
    arguments[0].setAttribute('class', 'card');
  }

  static setItemInLocalStorage(cardId) {
    let id = cardId;
    const copyCat = id.match('-match');

    if (copyCat !== null && copyCat.length > 0) {
      id = id.replace('-match', '');
    }

    localStorage.setItem(cardId, id);
  }

  static pickCard(card) {
    const cardId = card.id;
    CardActions.showCard(card);
    CardActions.setItemInLocalStorage(cardId);
  }

  static setTransitionAttributes(id, cardClasses) {
    const card = document.getElementById(id);
    card.setAttribute('class', `${card.getAttribute('class')} ${cardClasses}`);
  }

  static setWrongMatchAnimation(id) {
    const card = document.getElementById(id);
    const cardClasses = 'no-match expand';

    CardActions.setTransitionAttributes(id, cardClasses);
    window.setTimeout(CardActions.hideCard, 700, card);
  }

  static triggerWrongMatchAnimation() {
    CardActions.setWrongMatchAnimation(this.card1.key);
    CardActions.setWrongMatchAnimation(this.card2.key);
    window.MemoryGameCounters.starCount.checkStarRating();
  }

  static addMatchColor(id) {
    const cardClasses = 'matched';
    CardActions.setTransitionAttributes(id, cardClasses);
  }

  static weHaveAmatch() {
    CardActions.addMatchColor(this.card1.key);
    CardActions.addMatchColor(this.card2.key);
  }

  static resolveCards(isEqualMatch) {
    isEqualMatch ? CardActions.weHaveAmatch() : CardActions.triggerWrongMatchAnimation();
    localStorage.removeItem(this.card1.key);
    localStorage.removeItem(this.card2.key);
  }

  static compareCards() {
    let cards = [];
    let isEqualMatch;

    if (localStorage.length === 2) {
      cards = Object.keys(localStorage);

      this.card1 = {
        key: cards[0],
        value: localStorage.getItem(cards[0]),
      };

      this.card2 = {
        key: cards[1],
        value: localStorage.getItem(cards[1]),
      };

      isEqualMatch = (this.card1.value === this.card2.value);
      CardActions.resolveCards(isEqualMatch);
    }
  }

  triggerMove() {
    const cardIsHidden = !this.classList.contains('open');

    if (cardIsHidden) {
      CardActions.pickCard(this);
      window.MemoryGameCounters.moveCount.increment();

      CardActions.compareCards();
    }
  }

  bindCardActions() {
    this.cards.forEach((card) => {
      card.addEventListener('click', this.triggerMove);
    });
  }
};
//

// MAIN APP COMPONENT //
const App = {
  initDeck: function initDeck() {
    const deck = new Deck();
    deck.buildDeck();
    deck.render();
  },

  bindCards: function bindCards() {
    const cardActions = new CardActions();
    cardActions.bindCardActions();
  },

  initCounters: function initCounters() {
    window.MemoryGameCounters = {
      timer: Counters.startTimer(),
      moveCount: Counters.startMoveCount(),
      starCount: Counters.startStarCounter(),
    };
  },

  bindRestart: function bindRestart() {
    const restartIcon = document.getElementById('restart-game');
    restartIcon.addEventListener('click', () => {
      App.endGame();
      App.startGame();
    });
  },

  endGame: function endGame() {
    document.getElementById('card-deck').remove();
    document.getElementById('elapsed-time').remove();
    document.getElementById('stars-line').remove();
    window.MemoryGameCounters = {};
  },

  startGame: function startGame() {
    App.initDeck();
    App.bindCards();
    App.initCounters();
    App.bindRestart();
  },
};
//

App.startGame();
