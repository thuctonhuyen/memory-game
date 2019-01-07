/*
    Data Layer
*/
const DIAMOND = 0;
const PAPER_PLANE = 1;
const ANCHOR = 2;
const BOLT = 3;
const CUBE = 4;
const LEAF = 5;
const BICYCLE = 6;
const BOMB = 7;

const cardIcons = {
  [DIAMOND]: 'fa fa-diamond',
  [PAPER_PLANE]: 'fa fa-paper-plane-o',
  [ANCHOR]: 'fa fa-anchor',
  [BOLT]: 'fa fa-bolt',
  [CUBE]: 'fa fa-cube',
  [LEAF]: 'fa fa-leaf',
  [BICYCLE]: 'fa fa-bicycle',
  [BOMB]: 'fa fa-bomb'
}

const initialStateOfDataLayer = {
  startTime: 0,
  endTime: 0,
  totalMoves: 0,
  totalMatch: 0,
  cards: [
    DIAMOND,
    DIAMOND,
    PAPER_PLANE,
    PAPER_PLANE,
    ANCHOR,
    ANCHOR,
    BOLT,
    BOLT,
    CUBE,
    CUBE,
    LEAF,
    LEAF,
    BICYCLE,
    BICYCLE,
    BOMB,
    BOMB
  ],
  currentChoice: undefined,
  numberOfSelectedCards: 0
}

let dataLayer = {
  ...initialStateOfDataLayer
};

const activeCardClassName = "--show";
const matchCardClassName = "--match";
const cardClassName = "deck__card";
const successModalClassName = 'successModal';
const restartButtonClassName = "restart-button";
const totalTimeClassName = "score-panel__total-time-wrapper";
const showClassName = "show";
const susccesModalMessageParagraph = "successModal__message-paragraph";
const successModalRankClassName = "successModal__rank";
const scorePanelStarsClassName = "score-panel__stars";
const scorePanelStarsColumnClassName = "col-3";
const successModalIconClassName = "successModal__icon fa fa-star";
const scorePanelStarIconClassName = "score-panel__star-icon fa fa-star";
const modalBodyClassName = "modal-body";
const scorePanelClassName = "score-panel";
const scorePanelTotalMovesClassName = "score-panel__total-moves";

const EXCELLENT_UPPER_BOUND = 10;
const GOOD_UPPER_BOUND = 20;

const clickAudioId = "click-sound";
const successAudioId = "success-sound";
const failureAudioId = "failure-sound";

const replaceText = "[...]";
const messageParagraphText = "You won the game in [...] minutes!";
const totalMovesText = "Total Moves: [...]";
const totalTimeText = "Total Time: [...]";

const totalTimeFormat = "mm:ss";
const scorePanelStarsElemType = "div";
const successModalRankElemType = "div";
const successModalIconElemType = "span";
const handleFailureTimeOut = 500;
const handleSuccessTimeOut = 800;