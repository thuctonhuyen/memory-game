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
  startTime: 0,
  endTime: 0,
  totalMoves: 0,
  totalMatch: 0,
  cards: [DIAMOND, DIAMOND, PAPER_PLANE, PAPER_PLANE, ANCHOR, ANCHOR, BOLT, BOLT, CUBE, CUBE, LEAF, LEAF, BICYCLE, BICYCLE, BOMB, BOMB],
  currentChoice: undefined,
  numberOfSelectedCards: 0,
}

var dataLayer = {
  ...initialStateOfDataLayer
};

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
      // TODO: handle the case to allow ppl to flip:
      // target.className = _.trim(_.replace(targetClassName, cardClassName + activeCardClassName, ""));
      return;
    } else {
      target.className = targetClassName + " " + cardClassName + activeCardClassName;

      // handle matching here....
      handleMatchingCard(target);
    }

    showTotalMoves();
    calculateRanking();
  }
}

function handleMatchingCard(target) {
  var currentChoice = _.toNumber(_.get(dataLayer, 'currentChoice'));
  var currentChoiceVal = currentChoice < _.size(dataLayer.cards) && dataLayer.cards[currentChoice];

  var nextChoice = target && _.toNumber(target.getAttribute('data-attr'));
  var nextChoiceVal = nextChoice < _.size(dataLayer.cards) && dataLayer.cards[nextChoice];

  if (!currentChoice || currentChoice !== nextChoice) {
    if (currentChoice !== 0 && !currentChoice) {

      dataLayer.currentChoice = nextChoice;
      dataLayer.numberOfSelectedCards += 1;
    } else {
      dataLayer.numberOfSelectedCards += 1;

      if (dataLayer.numberOfSelectedCards >= 2) {
        dataLayer.totalMoves += 1;
        // if match
        if (currentChoiceVal === nextChoiceVal) {
          dataLayer.totalMatch += 1;
          document.getElementById("success-sound").play();
          bindMatchClases(currentChoice, nextChoice);
        } else {
          setTimeout(handleFailure, 500);
        }
        dataLayer.currentChoice = undefined;
        dataLayer.numberOfSelectedCards = 0;
      } else {
        dataLayer.currentChoice = nextChoice;
      }
    }
  }

  if(dataLayer.totalMatch === _.size(dataLayer.cards) / 2) {
    setTimeout(toggleSuccess, 800);
  }
}

function handleFailure() {
  document.getElementById("failure-sound").play();
  hideCards();
}

var successModalClassName = 'successModal';
function toggleSuccess(hide) {
  var target = document.querySelector('.' + successModalClassName);
  var targetClassName = _.get(target, 'className');
  if(hide) {
    target.className = _.trim(_.replace(targetClassName, 'show', ''));
    return;
  }
  // end time:
  dataLayer.endTime = Date.now();

  //play success sound
  document.getElementById('win-sound').play();

  //show success modal:
  var messageParagraph = document.querySelector('.' + 'successModal__message-paragraph');
  var totalTime = (dataLayer.endTime - dataLayer.startTime);
  totalTime = totalTime > 0 ? moment(totalTime).format('mm:ss') : 0;
  messageParagraph.innerText = 'You won the game ' + ' in ' + (totalTime) + ' minutes!';
  //minutes:
  if(!_.includes(target.className, 'show')) {
    target.className = targetClassName + " show";
  } else {
    target.className = _.trim(_.replace(targetClassName, 'show', ''));
  }

  calculateRanking(true);
}

var EXCELLENT_UPPER_BOUND = 10;
var GOOD_UPPER_BOUND = 20;
function calculateRanking(isModal) {
  var target;

  if(isModal){
    target = document.querySelector('.successModal__rank');
    if(target) {
      target.parentElement.removeChild(target);
    }

    target = document.createElement('div');
    target.className = 'successModal__rank';
  } else {
    target = document.querySelector('.score-panel__stars');
    if(target) {
      target.parentElement.removeChild(target);
    }

    target = document.createElement('div');
    target.className= 'score-panel__stars col-4';
  }

  var totalStars = 0;
  if(dataLayer.totalMoves <= EXCELLENT_UPPER_BOUND) {
    totalStars = 3;
  } else if (dataLayer.totalMoves <= GOOD_UPPER_BOUND) {
    totalStars = 2;
  } else {
    totalStars = 1;
  }

  var stars = _.range(totalStars);
  var fragment = document.createDocumentFragment();

  _.forEach(stars, function(star){
    var newElement = document.createElement('span');
    newElement.className = isModal ? 'successModal__icon fa fa-star' : 'score-panel__star-icon fa fa-star';
    fragment.appendChild(newElement);
  })

  target.appendChild(fragment);

  if(isModal) {
    var insertPlace = document.querySelector('.modal-body');
    var beforeNode = document.querySelector('.successModal__message-paragraph');
    insertPlace.insertBefore(target, insertPlace.firstChild);
  } else {
    var insertPlace = document.querySelector('.score-panel');
    insertPlace.insertBefore(target, insertPlace.firstChild);
  }
}

function bindMatchClases(currentChoice, nextChoice) {
  var matchA = document.querySelector('.' + cardClassName + '[data-attr="' + currentChoice + '"]');
  matchA.className = _.trim(_.replace(matchA.className, cardClassName + activeCardClassName, cardClassName + matchCardClassName));
  var matchB = document.querySelector('.' + cardClassName + '[data-attr="' + nextChoice + '"]');
  matchB.className = _.trim(_.replace(matchB.className, cardClassName + activeCardClassName, cardClassName + matchCardClassName));
}

function hideCards() {
  var openingCards = document.querySelectorAll("." + cardClassName + activeCardClassName);
  _.forEach(openingCards, function (card) {
    card.className = _.trim(_.replace(card.className, cardClassName + activeCardClassName, ""));
  })
}

function bindAllCardsClick() {
  var cards = document.querySelectorAll("." + cardClassName);
  _.forEach(cards, function (card) {
    card.addEventListener("click", onCardClick);
  });
}

function initCardsOptions() {
  var deckSection = document.querySelector('.deck');
  if (deckSection) {
    deckSection.parentElement.removeChild(deckSection);
  }
  deckSection = document.createElement('section');
  deckSection.className = 'deck row';

  // first shuffle data:
  var cards = shuffle(dataLayer.cards);
  // then render...
  _.forEach(cards, function (card, index) {
    var newELement = document.createElement('div');
    newELement.className = "deck__card-wrapper col-6 col-md-3";

    var iconClassName = _.get(cardIcons, '' + card);
    if (iconClassName) {
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

function showTotalMoves() {
  var totalMovesElem = document.querySelector('.score-panel__total-moves');

  if(totalMovesElem) {
    totalMovesElem.innerText = 'Total moves: ' + dataLayer.totalMoves;
  }
}

var restartButtonClassName = "restart-button"

function onRestart() {
  // shuffle options:
  var cards = shuffle(dataLayer.cards);

  // reset to initial state of data layer:
  dataLayer = { ...initialStateOfDataLayer
  };
  dataLayer.cards = cards;

  // hide modals:
  toggleSuccess(true);

  //render cards again:
  init();
}

function bindRestartClick() {
  var restartButtons = document.querySelectorAll('.' + restartButtonClassName);
  _.forEach(restartButtons, function(restartButton){
    restartButton.addEventListener('click', onRestart);
  });
}

function initTime() {
  dataLayer.startTime = Date.now();
}

function bindCloseModalClick() {
  document.querySelector('.successModal__dialog-close').addEventListener('click', function(){
    toggleSuccess(true);
  })
}

function init() {
  initTime();
  initCardsOptions();
  bindRestartClick();
  bindCloseModalClick();
  showTotalMoves();
}

// Execution:
init();