/* eslint-disable prefer-rest-params */

/* globals window document localStorage CustomEvent */

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

// SHUFFLE FUNCTION from http://stackoverflow.com/a/2450976 (ES6 converted) //
/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 */
const shuffle = (array) => {
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

// GAME ACTION //

const setItemInLocalStorage = (cardId) => {
  let id = cardId;
  let localStorageKey = 'leoSLMemoryGamecard2';
  let localStorageValues = [];
  const copyCat = id.match('-match') || false;

  if (localStorage.getItem('leoSLMemoryGamecard1') === null) localStorageKey = 'leoSLMemoryGamecard1';

  if (copyCat) id = id.replace('-match', '');

  localStorageValues = [cardId, id];

  localStorage.setItem(localStorageKey, localStorageValues);
};

const clearLocalStorage = () => {
  localStorage.removeItem('leoSLMemoryGamecard1');
  localStorage.removeItem('leoSLMemoryGamecard2');
};

const checkIfUserWon = () => {
  const gameOver = window.MemoryGameCounters.cardCounter.checkMatchedCardsCount();
  window.MemoryGameCounters.timer.gameOver = gameOver;
};

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
    const cardToHide = arguments[0]; // 'arguments' var. available by setTimeout() callback function
    cardToHide.setAttribute('class', 'card');
  }

  static shrinkCard() {
    const cardToShrink = arguments[0];
    cardToShrink.classList.remove('expand');
  }

  static pickCard(card) {
    const cardId = card.id;
    CardActions.showCard(card);
    setItemInLocalStorage(cardId);
  }

  static setCardTransitionAttributes(id, cardClasses) {
    const card = document.getElementById(id);
    cardClasses.forEach(cardClass => card.classList.add(cardClass));
  }

  static setCardNoMatchAnimation(id) {
    const card = document.getElementById(id);
    const cardClasses = ['no-match', 'expand'];

    CardActions.setCardTransitionAttributes(id, cardClasses);
    window.setTimeout(CardActions.hideCard, 700, card);
  }

  static noMatch() {
    CardActions.setCardNoMatchAnimation(this.card1.key);
    CardActions.setCardNoMatchAnimation(this.card2.key);
    window.MemoryGameCounters.starCount.checkStarRating();
  }

  static addCardMatchColor(id) {
    const cardClasses = ['matched', 'expand'];
    CardActions.setCardTransitionAttributes(id, cardClasses);
    window.setTimeout(CardActions.shrinkCard, 700, document.getElementById(id));
  }

  static weHaveAmatch() {
    CardActions.addCardMatchColor(this.card1.key);
    CardActions.addCardMatchColor(this.card2.key);
    checkIfUserWon();
  }

  static resolveCards(isAMatch) {
    const doWeHaveAmatch = isAMatch;
    doWeHaveAmatch ? CardActions.weHaveAmatch() : CardActions.noMatch(); // eslint-disable-line no-unused-expressions
    clearLocalStorage();
  }

  static compareCards() {
    let card1Values = localStorage.getItem('leoSLMemoryGamecard1');
    let card2Values = localStorage.getItem('leoSLMemoryGamecard2');
    let isAMatch;

    if (card1Values && card2Values) {
      card1Values = card1Values.split(',');
      card2Values = card2Values.split(',');

      this.card1 = {
        key: card1Values[0],
        value: card1Values[1],
      };

      this.card2 = {
        key: card2Values[0],
        value: card2Values[1],
      };

      isAMatch = (this.card1.value === this.card2.value);
      CardActions.resolveCards(isAMatch);
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

// COUNTERS (Star Rating, Timer and Moves Count) EVENT HANDLER //
const triggerCountersEvent = (eventType, detail) => {
  const countersEvent = new CustomEvent(eventType, detail);
  document.dispatchEvent(countersEvent);
};
//

// MAIN APP COMPONENT //
const App = {
  initCounters: function initCounters(deckCardsNumber) {
    const detail = { detail: { deckCount: deckCardsNumber } };
    triggerCountersEvent('initCounters', detail);
  },

  initDeck: function initDeck() {
    const deck = new Deck();
    deck.buildDeck();
    deck.render();
    App.initCounters(deck.cardDeck.length);
  },

  bindCards: function bindCards() {
    const cardActions = new CardActions();
    cardActions.bindCardActions();
  },

  bindRestart: function bindRestart() {
    const restartElement = document.getElementById('restart-game');

    restartElement.addEventListener('click', () => {
      App.endGame();
      clearLocalStorage();
      App.startGame();
    });
  },

  endCounters: function endCounters() {
    triggerCountersEvent('endCounters');
  },

  removeDOMElements: function removeDOMElements() {
    document.getElementById('card-deck').remove();
    document.getElementById('elapsed-time-counter').remove();
    document.getElementById('stars-line').remove();
  },

  startGame: function startGame() {
    App.initDeck();
    App.bindCards();
    App.bindRestart();
  },

  endGame: function endGame() {
    App.endCounters();
    App.removeDOMElements();
  },
};
//

App.startGame();
