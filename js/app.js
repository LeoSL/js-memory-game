/* eslint-disable prefer-rest-params */

/* globals window document localStorage CustomEvent jQuery */

/**
 * MathUtils class to wrap math operations
 */
const MathUtils = class MathUtils {
  /**
   * Method to return random integers in orde to populate HTML's id="" tags
   * @static
   * @return {Number}
   */
  static getRandomCardId() {
    return Math.round(Math.random() * 10000);
  }
};


/**
 * Simple list to aggregate card CSS classes names
 */
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


/**
 * Card class component, renders a full card DOM Element
 */
const Card = class Card {
  /**
   * Creates an instance of Card.
   * @param {Number} cardId
   * @param {String} cardStyle
   * @param {String} cardStyleId
   */
  constructor(cardId, cardStyle, cardStyleId) {
    this.cardId = cardId || MathUtils.getRandomCardId();
    this.cardStyle = cardStyle || CardStylelist[cardStyleId];
  }

  /**
   * Renders card DOM Element
   * @return {Object}
   */
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

/**
 * shuffle function from http://stackoverflow.com/a/2450976 (ES6 converted)
 * Creates a list that holds all of your deck cards, shuffled.
 * @return {Array}
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

/**
 * Deck class component, responsible for create a Deck and populate it with Cards
 * Appends the created Deck into card-deck DOM Element
 */
const Deck = class Deck {
  /**
   * Creates an instance of Deck.
   * @param {Number} dimension
   */
  constructor(dimension) {
    this.deckWidth = dimension || 4;
    this.cardDeck = [];
  }

  /**
   * Takes class-property cardDeck cards and generates copies of them
   * Built to generate matching cards, the basic infrastructure to a Memory Game
   */
  duplicateCards() {
    let duplicatedCard;

    this.cardDeck.forEach((card) => {
      duplicatedCard = new Card(`${card.cardId}-match`, card.cardStyle, null);
      this.cardDeck.push(duplicatedCard);
    });
  }

  /**
   * Creates a card deck DOM Element and appends it to Memory Game main HTML div
   * @static
   */
  static createDeckDOMElement() {
    const cardDeckElement = document.createElement('ul');
    cardDeckElement.setAttribute('id', 'card-deck');
    cardDeckElement.setAttribute('class', 'deck');
    document.getElementById('memory-game-main-div').append(cardDeckElement);
  }

  /**
   * Gets card deck dimensions to populate deck with a list of matching cards
   */
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

  /**
   * For each card existing in class cardDeck property, appends it at card deck DOM Element
   */
  render() {
    this.cardDeck.forEach((card) => {
      document.getElementById('card-deck').append(card.render());
    });
  }
};

/**
 * Dispatch events to document in order to trigger Counters functionalities
 * @param {String} eventType
 * @param {Object} detail
 */
const triggerCountersEvent = (eventType, detail) => {
  const countersEvent = new CustomEvent(eventType, detail);
  document.dispatchEvent(countersEvent);
};

/**
 * Mount event details with cards number count and dispatch it to document
 * @param {String} deckCardsNumber
 */
const initCounters = (deckCardsNumber) => {
  const detail = { detail: { deckCount: deckCardsNumber } };
  triggerCountersEvent('initCounters', detail);
};


/**
 * Set items into user's browser local storage.
 * Uses specific keys in order to avoid localStorage entries overriding.
 * Removes 'match' string from identifiers before registering it to local storage.
 * @param {String} cardId
 */
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

/**
 * Clears specific items from user's browser local storage
 */
const clearLocalStorage = () => {
  localStorage.removeItem('leoSLMemoryGamecard1');
  localStorage.removeItem('leoSLMemoryGamecard2');
};

/**
 * Calls Memory Game Counters checkMatchedCardsCount function.
 * Assign a boolean {gameOver} value to stop Timer Counter
 */
const checkIfUserWon = () => {
  const gameOver = window.MemoryGameCounters.cardCounter.checkMatchedCardsCount();
  window.MemoryGameCounters.timer.gameOver = gameOver;
};

/**
 * Checks if this is the first user game move by reading the local storage
 */
const isTheFirstMove = () => localStorage.getItem('leoSLmemoryGameFirstMove');

/**
 * Initialize game counters if user makes the first move
 */
const initGameCounters = () => {
  initCounters(localStorage.getItem('leoSLdeckCardLength'));
  localStorage.setItem('leoSLmemoryGameFirstMove', false);
};

/**
 * Implements game main functionality
 * Triggers card animations (show, hide, expand, shrink)
 * Adds card colors (mach, no-match, visible, hidden, already matched)
 */
const CardActions = class CardActions {
  /**
   * Creates an instance of CardActions.
   */
  constructor() {
    this.cards = Array.from(document.getElementsByClassName('card'));
    this.card1 = '';
    this.card2 = '';
  }

  /**
   * Set card's visibile CSS classes
   * @static
   * @param {Object} card
   */
  static showCard(card) {
    card.setAttribute('class', 'card open show');
  }

  /**
   * Callback function triggered after no match animation
   * Set card's hidden CSS classes
   * @static
   */
  static hideCard() {
    const cardToHide = arguments[0]; // 'arguments' var. available by setTimeout() callback function
    cardToHide.setAttribute('class', 'card');
  }

  /**
   * Set card's shrink CSS animation
   * @static
   */
  static shrinkCard() {
    const cardToShrink = arguments[0];
    cardToShrink.classList.remove('expand');
  }

  /**
   * Flips cards up and set its values into local storage
   * @static
   * @param {Object} card
   */
  static pickCard(card) {
    const cardId = card.id;
    CardActions.showCard(card);
    setItemInLocalStorage(cardId);
  }

  /**
   * Adds CSS animations classes to DOM element
   * @static
   * @param {String} id
   * @param {Array} cardClasses
   */
  static setCardTransitionAttributes(id, cardClasses) {
    const card = document.getElementById(id);
    cardClasses.forEach(cardClass => card.classList.add(cardClass));
  }

  /**
   * Set card no match CSS animation
   * @static
   * @param {String} card
   */
  static setCardNoMatchAnimation(id) {
    const card = document.getElementById(id);
    const cardClasses = ['no-match', 'expand'];

    CardActions.setCardTransitionAttributes(id, cardClasses);
    window.setTimeout(CardActions.hideCard, 700, card);
  }

  /**
   * Calls no match animation and check Counters star rating
   * @static
   */
  static noMatch() {
    CardActions.setCardNoMatchAnimation(this.card1.key);
    CardActions.setCardNoMatchAnimation(this.card2.key);
    window.MemoryGameCounters.starCount.checkStarRating();
  }

  /**
   * Set card match CSS color and shrink cardanimation
   * @static
   * @param {String} id
   */
  static addCardMatchColor(id) {
    const cardClasses = ['matched', 'expand'];
    CardActions.setCardTransitionAttributes(id, cardClasses);
    window.setTimeout(CardActions.shrinkCard, 700, document.getElementById(id));
  }

  /**
   * Adds match color to cards when there is a match
   * @static
   */
  static weHaveAmatch() {
    CardActions.addCardMatchColor(this.card1.key);
    CardActions.addCardMatchColor(this.card2.key);
    checkIfUserWon();
  }

  /**
   * Checks if there is a card match
   * Calls its specific CSS attributes and transitions
   * Clears local storage, removing the matched or non-matched cards
   * @static
   * @param {boolean} isAMatch
   */
  static resolveCards(isAMatch) {
    const doWeHaveAmatch = isAMatch;
    doWeHaveAmatch ? CardActions.weHaveAmatch() : CardActions.noMatch(); // eslint-disable-line no-unused-expressions
    clearLocalStorage();
  }

  /**
   * Gets two cards from local storage
   * Increments move cards after two cards selected
   * Checks if there is a match between the cards and call CSS screen responses
   * @static
   */
  static compareCards() {
    let card1Values = localStorage.getItem('leoSLMemoryGamecard1');
    let card2Values = localStorage.getItem('leoSLMemoryGamecard2');
    let isAMatch;

    if (card1Values && card2Values) {
      window.MemoryGameCounters.moveCount.increment();

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

  /**
   * If the card is hidden and its the first move, initiate game counters
   * Make the card visible my calling pickCard method
   * Check if there a card match
   */
  triggerMove() {
    const cardIsHidden = !this.classList.contains('open');

    if (cardIsHidden) {
      if (isTheFirstMove() === 'true') initGameCounters();
      CardActions.pickCard(this);
      CardActions.compareCards();
    }
  }

  /**
   * Bind card HTML elements to trigger card actions after a click
   */
  bindCardActions() {
    this.cards.forEach((card) => {
      card.addEventListener('click', this.triggerMove);
    });
  }
};

/**
 * Wrap main game functions
 * Initialize card deck
 * Bind cards to trigger actions after click
 * Bind restart HTML element
 * Start and end game, manipulating deck and card states
 */
const App = {
  /**
   * Initialize game card deck
   */
  initDeck: function initDeck() {
    const deck = new Deck();
    deck.buildDeck();
    deck.render();
    localStorage.setItem('leoSLdeckCardLength', deck.cardDeck.length);
  },

  /**
   * Bind card deck cards to trigger card actions after click
   */
  bindCards: function bindCards() {
    const cardActions = new CardActions();
    cardActions.bindCardActions();
  },

  /**
   * Bind restart HTML element to restart game after click
   */
  bindRestart: function bindRestart() {
    const elements = Array.from(document.getElementsByClassName('restart-game'));

    elements.forEach((element) => {
      element.addEventListener('click', () => {
        if (element.id === 'play-again-modal') jQuery('#you-won-modal').modal('toggle');
        App.endGame();
        clearLocalStorage();
        App.startGame();
      });
    });
  },

  /**
   * End game Counters
   */
  endCounters: function endCounters() {
    triggerCountersEvent('endCounters');
  },

  /**
   * Removes DOM elements after a game reaches its end
   */
  removeDOMElements: function removeDOMElements() {
    document.getElementById('card-deck').remove();
    document.getElementById('star-line-moves-div').lastChild.remove();
    document.getElementById('time-elapsed').firstChild.remove();
  },

  /**
   * Starts a Memory Game session
   */
  startGame: function startGame() {
    App.initDeck();
    App.bindCards();
    localStorage.setItem('leoSLmemoryGameFirstMove', true);
  },

  /**
   * Ends a Memory Game session
   */
  endGame: function endGame() {
    App.endCounters();
    App.removeDOMElements();
    document.getElementById('moves-counter').textContent = '0 Moves';
  },
};

App.startGame();
App.bindRestart();
