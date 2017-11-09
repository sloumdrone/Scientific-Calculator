$(document).ready(initialize);

var currentCalculation;

function initialize(){
  $('.button').on('click',handleClicks);
}

function handleClicks(){
  var clickType = getClickType(this);

  if (currentCalculation){
    var spaceBeforeNow = currentCalculation[currentCalculation.length-1];
    if (spaceBeforeNow['type'] === 'op' && clickType === 'op'){
      spaceBeforeNow['value'] = $(this).text();
      spaceBeforeNow['precedence'] = getPrecedence($(this).text());
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
    } else if (clickType === 'clear') {
      currentCalculation = undefined;
    } else if (clickType === 'calc'){
      runCalc();
    }
  } else if (clickType === 'num'){
    currentCalculation = [];
    currentCalculation.push({
      type: 'num',
      value: $(this).text(),
      precedence: null
    });
  }
  return currentCalculation;
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


function runCalc(){
  var pos;
  var val;
  if (currentCalculation.length > 1){
    if (currentCalculation.indexOf('x^y') >= 0){
      pos = indexOf('x^y');
      val = calcExponent(currentCalculation[pos-1],currentCalculation[pos+1]);
    } else if (indexOf('x') >= 0 or)
    currentCalculation.splice(pos-1,3,val);
  }

}


function calcExponent(num1,num2,opLocation){
  Math.pow(num1,num2);
}
