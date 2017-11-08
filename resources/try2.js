$(document).ready(initialize);

var calcArr = [];
var canDecimal = true;

function initialize(){
  $('.num').on('click',handleNumClicks);
  $('.op').on('click',handleOpClicks);
  $('.calc').on('click',runCalc);
  $('.clr').on('click',clearCalc);
}

function handleNumClicks(){

  if (calcArr[0]){
    if (!isNaN(calcArr[calcArr.length-1]) || calcArr[calcArr.length-1][calcArr[calcArr.length-1].length-1] === '.'){
      calcArr[calcArr.length-1] += $(this).text();
    } else {
      calcArr.push($(this).text());
    }
  } else {
    calcArr.push($(this).text());
  }
  $('.display').text(calcArr.join(' '));
}

function handleOpClicks(){
  if (calcArr[0]){
    if (isNaN(calcArr[calcArr.length-1])){
      calcArr[calcArr.length-1] = $(this).text();
    } else {
      calcArr.push($(this).text());
    }
  }
  $('.display').text(calcArr.join(' '));
}




function runCalc(){
  var pos;
  var val;
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
    console.log('Calc-step: ' + calcArr)
    runCalc();
  } else {
    $('.display').text(calcArr[0]);
    console.log('Final output: ' + calcArr[0]);
    return calcArr[0];
  }

}

function clearCalc(){
  console.log('<----Calc cleared---->');
  calcArr = [];
  $('.display').empty();
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
