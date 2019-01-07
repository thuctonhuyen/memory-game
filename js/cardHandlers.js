function onCardClick(event) {
  document
    .getElementById(clickAudioId)
    .play();
  let target = _.get(event, "target");

  if (target) {
    const targetClassName = _.get(target, "className");
    if (_.includes(targetClassName, matchCardClassName)) {
      return;
    }
    if (_.includes(targetClassName, activeCardClassName)) {
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
  const currentChoice = _.toNumber(_.get(dataLayer, 'currentChoice'));
  const currentChoiceVal = currentChoice < _.size(dataLayer.cards) && dataLayer.cards[currentChoice];

  const nextChoice = target && _.toNumber(target.getAttribute('data-attr'));
  const nextChoiceVal = nextChoice < _.size(dataLayer.cards) && dataLayer.cards[nextChoice];

  // if the currentChoice does not exist or the currentChoice is not the same at the same position at the next Choice:
  if (!currentChoice || currentChoice !== nextChoice) {
    // if current choice is falsy (0 in this case is truthy)
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
          document
            .getElementById(successAudioId)
            .play();
          bindMatchClases(currentChoice, nextChoice);
        } else {
          setTimeout(handleFailure, handleFailureTimeOut);
        }
        dataLayer.currentChoice = undefined;
        dataLayer.numberOfSelectedCards = 0;
      } else {
        dataLayer.currentChoice = nextChoice;
      }
    }
  }

  // if totalMatch equals to the total pairs of cards then success!
  if (dataLayer.totalMatch === _.size(dataLayer.cards) / 2) {
    setTimeout(toggleSuccess, handleSuccessTimeOut);
  }
}

function handleFailure() {
  document
    .getElementById(failureAudioId)
    .play();
  hideCards();
}