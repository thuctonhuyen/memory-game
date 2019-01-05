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
  [BOMB]: 'fa fa-bomb'
}

var initialStateOfDataLayer = {
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

var dataLayer = {
  ...initialStateOfDataLayer
};

var activeCardClassName = "--show";
var matchCardClassName = "--match";
var cardClassName = "deck__card";
var successModalClassName = 'successModal';
var restartButtonClassName = "restart-button";
var totalTimeClassName = "score-panel__total-time-wrapper";

var EXCELLENT_UPPER_BOUND = 10;
var GOOD_UPPER_BOUND = 20;
