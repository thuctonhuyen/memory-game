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
  if (hide) {
    target.className = _.trim(_.replace(targetClassName, showClassName, ''));
    return;
  }
  // end time:
  dataLayer.endTime = Date.now();

  //play success sound
  document
    .getElementById('win-sound')
    .play();

  //show success modal:
  var messageParagraph = document.querySelector('.' + susccesModalMessageParagraph);
  var totalTime = (dataLayer.endTime - dataLayer.startTime);
  totalTime = totalTime > 0
    ? moment(totalTime).format(totalTimeFormat)
    : 0;
  messageParagraph.innerText = _.replace(messageParagraphText, replaceText, totalTime);
  //minutes:
  if (!_.includes(target.className, showClassName)) {
    target.className = targetClassName + " " + showClassName;
  } else {
    target.className = _.trim(_.replace(targetClassName, showClassName, ''));
  }

  calculateRanking(true);
}

function calculateRanking(isModal) {
  var target;

  if (isModal) {
    target = document.querySelector('.' + successModalRankClassName);
    if (target) {
      target
        .parentElement
        .removeChild(target);
    }

    target = document.createElement(successModalRankElemType);
    target.className = successModalRankClassName;
  } else {
    target = document.querySelector('.' + scorePanelStarsClassName);
    if (target) {
      target
        .parentElement
        .removeChild(target);
    }

    target = document.createElement(scorePanelStarsElemType);
    target.className = scorePanelStarsClassName + " " + scorePanelStarsColumnClassName;
  }

  var totalStars = 0;
  if (dataLayer.totalMoves <= EXCELLENT_UPPER_BOUND) {
    totalStars = 3;
  } else if (dataLayer.totalMoves <= GOOD_UPPER_BOUND) {
    totalStars = 2;
  } else {
    totalStars = 1;
  }

  var stars = _.range(totalStars);
  var fragment = document.createDocumentFragment();

  _.forEach(stars, function (star) {
    var newElement = document.createElement(successModalIconElemType);
    newElement.className = isModal
      ? successModalIconClassName
      : scorePanelStarIconClassName;
    fragment.appendChild(newElement);
  })

  target.appendChild(fragment);

  if (isModal) {
    const insertPlace = document.querySelector('.' + modalBodyClassName);
    insertPlace.insertBefore(target, insertPlace.firstChild);
  } else {
    const insertPlace = document.querySelector('.' + scorePanelClassName);
    insertPlace.insertBefore(target, insertPlace.firstChild);
  }
}

function bindMatchClases(currentChoice, nextChoice) {
  let matchA = document.querySelector('.' + cardClassName + '[data-attr="' + currentChoice + '"]');
  matchA.className = _.trim(_.replace(matchA.className, cardClassName + activeCardClassName, cardClassName + matchCardClassName));
  let matchB = document.querySelector('.' + cardClassName + '[data-attr="' + nextChoice + '"]');
  matchB.className = _.trim(_.replace(matchB.className, cardClassName + activeCardClassName, cardClassName + matchCardClassName));
}

function hideCards() {
  const openingCards = document.querySelectorAll("." + cardClassName + activeCardClassName);
  _.forEach(openingCards, function (card) {
    card.className = _.trim(_.replace(card.className, cardClassName + activeCardClassName, ""));
  })
}

function showTotalMoves() {
  let totalMovesElem = document.querySelector('.' + scorePanelTotalMovesClassName);

  if (totalMovesElem) {
    totalMovesElem.innerText = _.replace(totalMovesText, replaceText, dataLayer.totalMoves)
  }
}

function displayTime() {
  const endTime = dataLayer.endTime;
  const startTime = dataLayer.startTime;
  let totalTime = !endTime
    ? (Date.now() - startTime)
    : endTime - startTime;
  totalTime = moment(totalTime).format(totalTimeFormat);
  document
    .querySelector('.' + totalTimeClassName)
    .innerText = _.replace(totalTimeText, replaceText, totalTime);
  setTimeout(function () {
    displayTime()
  }, 500);
}
