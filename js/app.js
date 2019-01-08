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
    newELement.className = "deck__card-wrapper col-3";

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

function onRestart() {
  // shuffle options:
  var cards = shuffle(dataLayer.cards);

  // reset to initial state of data layer:
  dataLayer = Object.assign({}, initialStateOfDataLayer);
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
  dataLayer.startTime = moment();
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
  calculateRanking();
  displayTime();
}

// Execution:
init();