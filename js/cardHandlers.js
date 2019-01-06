function onCardClick(event) {
  document.getElementById(clickAudioId).play();
  let target = _.get(event, "target");

  if (target) {
    const targetClassName = _.get(target, "className");
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
  const currentChoice = _.toNumber(_.get(dataLayer, 'currentChoice'));
  const currentChoiceVal = currentChoice < _.size(dataLayer.cards) && dataLayer.cards[currentChoice];

  const nextChoice = target && _.toNumber(target.getAttribute('data-attr'));
  const nextChoiceVal = nextChoice < _.size(dataLayer.cards) && dataLayer.cards[nextChoice];

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
          document.getElementById(successAudioId).play();
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
  document.getElementById(failureAudioId).play();
  hideCards();
}