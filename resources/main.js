$(document).ready(initialize);

var calcArr = [];
var memory = [];
var calcHistory = [];
var canDecimal = true;
var calcPressed = false;

function initialize(){
  routeInputClicks();
}

function handleNumClicks(){
  //start new calc if num was pressed after equals without an op first
  if (calcPressed){
    calcArr = [];
  }
  calcPressed = false;

  var currentNum = $(this).text();
  if (currentNum === 'π'){
    currentNum = Math.PI;
  }

  if (calcArr[0]){
    if (!isNaN(calcArr[calcArr.length-1]) || calcArr[calcArr.length-1][calcArr[calcArr.length-1].length-1] === '.'){
      calcArr[calcArr.length-1] += currentNum;
    } else {
      calcArr.push(currentNum);
    }
  } else {
    calcArr.push(currentNum);
  }
  $('.display').text(calcArr.join(' '));
}

function handleFlip(){
  if (calcArr[0]){
      if (!isNaN(calcArr[calcArr.length-1])){
        calcArr[calcArr.length-1] = Number(calcArr[calcArr.length-1]) * -1;
      }
  }
  $('.display').text(calcArr.join(' '));
}

function handleOpClicks(){
  calcPressed = false;
  if (calcArr[0]){
    if (isNaN(calcArr[calcArr.length-1])){
      calcArr[calcArr.length-1] = $(this).text();
    } else {
      calcArr.push($(this).text());
    }
    $('.display').text(calcArr.join(' '));
  } else {
    $('.display').text('0');
  }
  canDecimal = true;

}

function handleDecClicks(){
  calcPressed = false;
  if (!isNaN(calcArr[calcArr.length-1]) && canDecimal){
    calcArr[calcArr.length-1] += '.';
    canDecimal = false;
  } else if (canDecimal){
    calcArr.push('0.');
    canDecimal = false;
  }
  $('.display').text(calcArr.join(' '));
}

function handleCalc(){
  canDecimal = true;


  //Allow for repeat = operation
  if (!calcPressed){
    memory = calcArr.slice(calcArr.length - 2,calcArr.length);
    if (isNaN(memory[memory.length-1])){
      memory = memory.reverse();
    }
    calcPressed = true;
  } else {
    calcArr = calcArr.concat(memory);
  }

  //Allow for terminal operator
  if (isNaN(calcArr[calcArr.length-1])){
    calcArr.push(calcArr[calcArr.length-2]);
  }

  //remove entry operators
  if(isNaN(calcArr[0])){
    calcArr.shift();
  }

  calcHistory.unshift(calcArr.join(' '));
  buildHistory();
  runCalc()
}


function runCalc(){
  var pos;
  var val;

  //begin recursive calculation
  if (calcArr.length >= 2){
    if (calcArr.indexOf('^') >= 0){
      pos = calcArr.indexOf('^');
      val = calcExponent(calcArr[pos-1],calcArr[pos+1]);
    } else if (calcArr.findIndex(checkMultiplyOrDivide) >= 0){
      pos = calcArr.findIndex(checkMultiplyOrDivide);
      if (calcArr[pos] === 'x'){
          val = calcMultiply(calcArr[pos-1],calcArr[pos+1]);
      } else {
        val = calcDivide(calcArr[pos-1],calcArr[pos+1]);
      }
    } else if (calcArr.findIndex(checkAddOrSubtract) >= 0){
      pos = calcArr.findIndex(checkAddOrSubtract);
      if (calcArr[pos] === '+'){
          val = calcAdd(calcArr[pos-1],calcArr[pos+1]);
      } else {
        val = calcSubtract(calcArr[pos-1],calcArr[pos+1]);
      }
    }
    calcArr.splice(pos-1,3,val);
    runCalc();
  } else {
    //return calculation

    //check for infinity and rework as ERR
    if (calcArr[0] === Infinity){
      calcArr[0] = 'err';
    }
    $('.display').text(calcArr[0]);
    return calcArr[0];
  }
}

function clearCalc(){
  canDecimal = true;
  calcPressed = false;
  if ($(this).text() === 'AC'){
    calcArr = [];
    $('.display').text('0');
  } else {
    calcArr.pop();
    if (calcArr.length >= 1) {
        $('.display').text(calcArr.join(' '));
    } else {
      $('.display').text('0');
    }

  }
}

function checkMultiplyOrDivide(element){
  return element === '/' || element === 'x';
}

function checkAddOrSubtract(element){
  return element === '+' || element === '-';
}

function calcExponent(num1,num2){
  return Math.pow(num1,num2);
}

function calcMultiply(num1,num2){
  return num1 * num2;
}

function calcDivide(num1,num2){
  return num1 / num2;
}

function calcAdd(num1,num2){
  return Number(num1) + Number(num2);
}

function calcSubtract(num1,num2){
  return num1 - num2;
}


function handleKeyInput(){
  switch (event.charCode){
    case 65: // AC - 'A'
    case 97: // AC - 'a'
      $('.calc-body .row:nth-child(2) .clr:first-child').click();
      break;
    case 67: // C - 'C'
    case 99: // C - 'c'
      $('.calc-body .row:nth-child(2) .clr:nth-child(2)').click();
      break;
    case 94: // ^
      $('.secondary-body .row:last-child .op:first-child').click();
      break;
    case 47: // /
      $('.calc-body .row:nth-child(2) .op:nth-child(4)').click();
      break;
    case 55: // 7
      $('.calc-body .row:nth-child(3) .num:first-child').click();
      break;
    case 56: // 8
      $('.calc-body .row:nth-child(3) .num:nth-child(2)').click();
      break;
    case 57: // 9
      $('.calc-body .row:nth-child(3) .num:nth-child(3)').click();
      break;
    case 88: // X
    case 120: // x X *
    case 42: // x X *
      $('.calc-body .row:nth-child(3) .op').click();
      break;
    case 52: // 4
      $('.calc-body .row:nth-child(4) .num:first-child').click();
      break;
    case 53: // 5
      $('.calc-body .row:nth-child(4) .num:nth-child(2)').click();
      break;
    case 54: // 6
      $('.calc-body .row:nth-child(4) .num:nth-child(3)').click();
      break;
    case 43: // +
      $('.calc-body .row:nth-child(4) .op').click();
      break;
    case 49: // 1
      $('.calc-body .row:nth-child(5) .num:first-child').click();
      break;
    case 50: // 2
      $('.calc-body .row:nth-child(5) .num:nth-child(2)').click();
      break;
    case 51: // 3
      $('.calc-body .row:nth-child(5) .num:nth-child(3)').click();
      break;
    case 45: // -
      $('.calc-body .row:nth-child(5) .op').click();
      break;
    case 60: // +/- - '<'
      $('.calc-body .row:nth-child(6) .flip').click();
      break;
    case 48: // 0
      $('.calc-body .row:nth-child(6) .num').click();
      break;
    case 46: // .
      $('.calc-body .row:nth-child(6) .dec').click();
      break;
    case 13: // =
    case 61: // =
      $('.calc-body .row:nth-child(6) .calc').click();
      break;
  }
}


function routeInputClicks(){
  $('.num').on('click',handleNumClicks);
  $('.op').on('click',handleOpClicks);
  $('.dec').on('click',handleDecClicks);
  $('.calc').on('click',handleCalc);
  $('.flip').on('click',handleFlip);
  $('.clr').on('click',clearCalc);
  $('.ext').on('click',function(){
    if ($('.secondary-body').css('visibility') === 'hidden'){
      $(this).text('>>');
      $('.secondary-body').css({'visibility':'visible','opacity':'1'});
      $('.history-container').css({'visibility':'visible','opacity':'1'});
    } else {
      $(this).text('<<');
      $('.secondary-body').css({'visibility':'hidden','opacity':'0'});
      $('.history-container').css({'visibility':'hidden','opacity':'0'});
    }
  });

  $('.h-row.button').dblclick(loadFromHistory);
  $('body').on('keypress',handleKeyInput);
}

function loadFromHistory(){
  var item = $(this).text();
  console.log(item);
  calcArr = item.split(' ');
  $('.display').text(item);
}

function buildHistory(){
  for (var i = 2; i < 9; i++){
    if (i > calcHistory.length+1){
      break;
    }
    $('.h-row:nth-child('+i+')').text(calcHistory[i-2]);
  }
}
