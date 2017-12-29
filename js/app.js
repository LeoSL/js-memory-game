/* global document */

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
    cardItem.setAttribute('id', this.cardId);
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
      duplicatedCard = new Card(card.cardId, card.cardStyle, null);
      this.cardDeck.push(duplicatedCard);
    });
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
  }

  render() {
    this.cardDeck.forEach((card) => {
      document.getElementById('card-deck').append(card.render());
    });
  }
};

//

// MAIN APP COMPONENT //

const App = {
  init: function init() {
    const deck = new Deck();
    deck.buildDeck();
    deck.render();
  },
};

App.init();
