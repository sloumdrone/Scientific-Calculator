$(document).ready(initialize);

var currentCalculation;

function initialize(){
  console.log('Initialized');
  $('.button').on('click',handleClicks);
}

function handleClicks(){
  var clickType = getClickType(this);

  if (currentCalculation){
    var spaceBeforeNow = currentCalculation[currentCalculation.length-1];
    if (spaceBeforeNow['type'] === 'op' && clickType === 'op'){
      spaceBeforeNow['value'] = $(this).text();
      spaceBeforeNow['precendence'] = getPrecendence($(this).text());
    } else if (spaceBeforeNow['type'] === 'num' && clickType === 'op'){
      currentCalculation.push({
        type: 'op',
        value: $(this).text(),
        precedence: getPrecedence($(this).text())
      });
    } else if (spaceBeforeNow['type'] === 'op' && clickType === 'num'){
      currentCalculation.push({
        type: 'num',
        value: $(this).text(),
        precedence: null
      });
    } else if (spaceBeforeNow['type'] === 'num' && clickType === 'num') {
      spaceBeforeNow['value'] += $(this).text();
    }
  } else if (clickType === 'num'){
    currentCalculation = [];
    currentCalculation.push({
      type: 'num',
      value: $(this).text(),
      precedence: null
    });
  }
}

function getClickType(clickValue){
  if ($(clickValue).hasClass('num')){
    return 'num';
  } else if ($(clickValue).hasClass('op')) {
    return 'op';
  } else if ($(clickValue).hasClass('clr')) {
    return 'clear';
  } else {
    return 'calc';
  }
}

function getPrecedence(value){
  if (value === 'x' || value === '/'){
    return 'md';
  } else if (value === '+' || value === '-'){
    return 'as';
  } else if (value === 'x^y'){
    return 'e';
  } else {
    return false;
  }
}
