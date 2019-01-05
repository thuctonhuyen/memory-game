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
    target.className= 'score-panel__stars col-3';
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
  const openingCards = document.querySelectorAll("." + cardClassName + activeCardClassName);
  _.forEach(openingCards, function (card) {
    card.className = _.trim(_.replace(card.className, cardClassName + activeCardClassName, ""));
  })
}

function showTotalMoves() {
  let totalMovesElem = document.querySelector('.score-panel__total-moves');

  if(totalMovesElem) {
    totalMovesElem.innerText = 'Total moves: ' + dataLayer.totalMoves;
  }
}

function displayTime() {
  const endTime = dataLayer.endTime;
  const startTime = dataLayer.startTime;
  let totalTime = !endTime ? (Date.now() - startTime) : endTime - startTime;
  totalTime = moment(totalTime).format('mm:ss');
  document.querySelector('.' + totalTimeClassName).innerText = 'Total Time: ' + totalTime;
  setTimeout(function(){ displayTime() }, 500);
}
