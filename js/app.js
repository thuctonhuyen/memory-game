/*
    Data Layer
*/
var DIAMOND = 0;
var PAPER_PLANE = 1;
var ANCHOR = 2;
var BOLT = 3;
var CUBE = 4;
var LEAF = 5;
var BICYCLE = 6;
var BOMB = 7;

var cardIcons = {
  [DIAMOND]: 'fa fa-diamond',
  [PAPER_PLANE]: 'fa fa-paper-plane-o',
  [ANCHOR]: 'fa fa-anchor',
  [BOLT]: 'fa fa-bolt',
  [CUBE]: 'fa fa-cube',
  [LEAF]: 'fa fa-leaf',
  [BICYCLE]: 'fa fa-bicycle',
  [BOMB]: 'fa fa-bomb',
}

var initialStateOfDataLayer = {
  totalMoves: 3,
  totalMatch: 0,
  cards: [DIAMOND, DIAMOND, PAPER_PLANE, PAPER_PLANE, ANCHOR, ANCHOR, BOLT, BOLT, CUBE, CUBE, LEAF, LEAF, BICYCLE, BICYCLE, BOMB, BOMB],
  currentChoice: undefined,
  numberOfSelectedCards: 0,
}

var dataLayer = {
  ...initialStateOfDataLayer
};

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
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

var activeCardClassName = "--show";
var matchCardClassName = "--match";
var cardClassName = "deck__card";

function onCardClick(event) {
  document.getElementById("click-sound").play();
  var target = _.get(event, "target");

  if (target) {
    var targetClassName = _.get(target, "className");
    if (_.includes(targetClassName, matchCardClassName)) {
      return;
    }
    if (_.includes(targetClassName, activeCardClassName)) {
      // target.className = _.trim(_.replace(targetClassName, cardClassName + activeCardClassName, ""));
      return;
    } else {
      target.className = targetClassName + " " + cardClassName + activeCardClassName;

      // handle matching here....
      handleMatchingCard(target);
    }
  }
}

function handleMatchingCard(target) {

  // TODO: use lodash:
  var currentChoice = _.toNumber(_.get(dataLayer, 'currentChoice'));
  var currentChoiceVal = currentChoice < _.size(dataLayer.cards) && dataLayer.cards[currentChoice];

  var nextChoice = target && _.toNumber(target.getAttribute('data-attr'));
  var nextChoiceVal = nextChoice < _.size(dataLayer.cards) && dataLayer.cards[nextChoice];

  console.log('current choice', currentChoice, currentChoiceVal);
  console.log('next choice', nextChoice, nextChoiceVal);
  // console.log('totalselected cards', dataLayer.numberOfSelectedCards);

  if(!currentChoice || currentChoice !== nextChoice) {
    if(!currentChoiceVal) {
      dataLayer.currentChoice = nextChoice;
      dataLayer.numberOfSelectedCards += 1;
    } else if(nextChoiceVal) {
      dataLayer.numberOfSelectedCards += 1;
      console.log('here...', dataLayer.numberOfSelectedCards);
      if(dataLayer.numberOfSelectedCards >= 2) {
        // if match
        if(currentChoiceVal === nextChoiceVal) {
          dataLayer.totalMatch += 1;
          document.getElementById("success-sound").play();
          bindMatchClases(currentChoice, nextChoice);
        } else {
          document.getElementById("failure-sound").play();
          dataLayer.totalMoves -= 1;
          // hideCards();
        }
        dataLayer.currentChoice = undefined;
        dataLayer.numberOfSelectedCards = 0;
      } else {
        dataLayer.currentChoice = nextChoice;
      }
    }
  }

  if(dataLayer.totalMoves <= 0) {
    document.getElementById("lost-sound").play();
    onRestart();
  }

  console.log('totalMoves', dataLayer.totalMoves);
  console.log('numberofselected cards', dataLayer.numberOfSelectedCards);
}

function bindMatchClases(currentChoice, nextChoice) {
  var matchA = document.querySelector('.' + cardClassName + '[data-attr="' + currentChoice + '"]');
  matchA.className = _.trim(_.replace(matchA.className, cardClassName + activeCardClassName, cardClassName + matchCardClassName));
  var matchB = document.querySelector('.' + cardClassName + '[data-attr="' + nextChoice + '"]');
  matchB.className = _.trim(_.replace(matchB.className, cardClassName + activeCardClassName, cardClassName + matchCardClassName));
}

function hideCards() {
  var openingCards = document.querySelectorAll("." + cardClassName + activeCardClassName);
  _.forEach(openingCards, function(card) {
    card.className =_.trim(_.replace(card.className, cardClassName + activeCardClassName, ""));
  })
}

function bindAllCardsClick() {
  var cards = document.querySelectorAll("." + cardClassName);
  _.forEach(cards, function(card) {
    card.addEventListener("click", onCardClick);
  });
}

function initCardsOptions() {
  var deckSection = document.querySelector('.deck');
  if(!deckSection) {
    deckSection = document.createElement('section');
    deckSection.className = 'deck row';
  } else {
    deckSection.innerHTML = '';
  }

  // first shuffle data:
  var cards = shuffle(dataLayer.cards);
  // then render...
  _.forEach(cards, function(card, index){
    var newELement = document.createElement('div');
    newELement.className = "deck__card-wrapper col-6 col-md-3";

    var iconClassName = _.get(cardIcons, '' + card);
    if(iconClassName) {
      newELement.innerHTML = `
        <div class="deck__card" data-attr="${index}">
          <i class="deck__card-icon ${iconClassName}"></i>
        </div>
      `;
      deckSection.appendChild(newELement);
    }

  });

  document.querySelector('.container').appendChild(deckSection);
  bindAllCardsClick();
}

var restartButtonClassName ="score-panel__restart-button"
function onRestart() {
  // shuffle options:
  var cards = shuffle(dataLayer.cards);

  // reset to initial state of data layer:
  dataLayer = initialStateOfDataLayer;
  dataLayer.cards = cards;

  //render cards again:
  initCardsOptions();
}


function bindRestartClick() {
  document.querySelector('.' + restartButtonClassName).addEventListener('click', onRestart);
}

function init() {
  initCardsOptions();
  bindRestartClick();
}

// Execution:
init();