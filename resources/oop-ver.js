$(document).ready(initialize);
var calc;
var controller;
var view;

function initialize(){
  calc = new Model();
  controller = new Controller(calc);
  view = new View(calc);
  controller.routeInputClicks()
}

  ///////////////////////////////////////////////////
 // Model : Data storage, input-parse to storage ///
///////////////////////////////////////////////////

var Model = function(){
  this.calcArr = [];
  this.memory = [];
  this.calcHistory = [];
  this.canDecimal = true;
  this.calcPressed = false;
  this.historyType = 'calc';

  this.handleOpClicks = function(){
    this.calcPressed = false;
    if (this.calcArr[0]){
      if (isNaN(this.calcArr[this.calcArr.length-1]) && this.calcArr[0] !== 'ERROR'){
        this.calcArr[this.calcArr.length-1] = $(event.target).text();
      } else if (this.calcArr[0] !== 'ERROR'){
        this.calcArr.push($(event.target).text());
      }
      view.updateDisplay(this.calcArr.join(' '));
    } else {
      view.updateDisplay('0');
    }
    this.canDecimal = true;
  }

  this.handleNumClicks = function() {
    //start new calc if num was pressed after equals without an op first
    if (this.calcPressed){
      this.calcArr = [];
    }
    this.calcPressed = false;

    var currentNum = $(event.target).text();
    if (currentNum === 'π'){
      currentNum = Math.PI;
    } else if (currentNum === 'E'){
      currentNum = Math.E;
    }

    if (this.calcArr[0]){
      if (!isNaN(this.calcArr[this.calcArr.length-1]) || this.calcArr[this.calcArr.length-1][this.calcArr[this.calcArr.length-1].length-1] === '.'){
        this.calcArr[this.calcArr.length-1] += currentNum;
      } else {
        this.calcArr.push(currentNum);
      }
    } else {
      this.calcArr.push(currentNum);
    }
    view.updateDisplay(this.calcArr.join(' '));
  }

  this.handleFunctions = function(){
    this.calcPressed = false;

    if (!isNaN(this.calcArr[this.calcArr.length-1])){
      this.calcArr[this.calcArr.length-1] = $(event.target).text();
    } else {
      this.calcArr.push($(event.target).text());
    }
    view.updateDisplay(this.calcArr.join(' '));

    this.canDecimal = true;
  }

  this.handleFlip = function(){
    if (this.calcArr[0]){
        if (!isNaN(this.calcArr[this.calcArr.length-1])){
          this.calcArr[this.calcArr.length-1] = Number(this.calcArr[this.calcArr.length-1]) * -1;
        }
    }
    view.updateDisplay(this.calcArr.join(' '));
  }


  this.handleDecClicks = function(){
    this.calcPressed = false;
    if (!isNaN(this.calcArr[this.calcArr.length-1]) && this.canDecimal){
      this.calcArr[this.calcArr.length-1] += '.';
      this.canDecimal = false;
    } else if (this.canDecimal){
      this.calcArr.push('0.');
      this.canDecimal = false;
    }
    view.updateDisplay(this.calcArr.join(' '));
  }

  this.handleHistoryType = function(){
    if (this.historyType === 'calc'){
      this.historyType = 'ans';
      $(event.target).text('ans');
      view.buildAnswerHistory();
    } else {
      this.historyType = 'calc';
      $(event.target).text('calc');
      view.buildCalcHistory();
    }
  }

  this.handleCalc = function(){
    this.canDecimal = true;


    //Allow for repeat = operation
    if (!this.calcPressed){
      this.memory = this.calcArr.slice(this.calcArr.length - 2,this.calcArr.length);
      if (isNaN(this.memory[this.memory.length-1])){
        this.memory = this.memory.reverse();
      }
      this.calcPressed = true;
    } else {
      this.calcArr = this.calcArr.concat(this.memory);
    }

    //Allow for terminal operator
    if (isNaN(this.calcArr[this.calcArr.length-1])){
      this.calcArr = this.calcArr.concat(this.calcArr.slice(0,this.calcArr.length-1));
    }

    //write to history
    var historyItem = [[this.calcArr.join(' ')],[]]
    this.calcHistory.unshift(historyItem);

    return this.runCalc();
  }


  this.runCalc = function(){
    var pos;
    var val;
    var func = false;

    //begin recursive calculation
    if (this.calcArr.length >= 2){
      if (this.calcArr.findIndex(controller.checkFunctions) >= 0){
        func = true;
        pos = this.calcArr.findIndex(controller.checkFunctions);
        if (this.calcArr[pos] === 'sin:'){
          val = controller.calcSin(this.calcArr[pos+1]);
        } else if (this.calcArr[pos] === 'cos:'){
          val = controller.calcCos(this.calcArr[pos+1]);
        } else if (this.calcArr[pos] === 'tan:'){
          val = controller.calcTan(this.calcArr[pos+1]);
        } else if (this.calcArr[pos] === '√:'){
          val = controller.calcSqrt(this.calcArr[pos+1]);
        } else if (this.calcArr[pos] === 'log:'){
          val = controller.calcLog(this.calcArr[pos+1]);
        }
      } else if (this.calcArr.indexOf('^') >= 0){
        pos = this.calcArr.indexOf('^');
        val = controller.calcExponent(this.calcArr[pos-1],this.calcArr[pos+1]);
      } else if (this.calcArr.findIndex(controller.checkMultiplyOrDivide) >= 0){
        pos = this.calcArr.findIndex(controller.checkMultiplyOrDivide);
        if (this.calcArr[pos] === 'x'){
          val = controller.calcMultiply(this.calcArr[pos-1],this.calcArr[pos+1]);
        } else {
          val = controller.calcDivide(this.calcArr[pos-1],this.calcArr[pos+1]);
        }
      } else if (this.calcArr.findIndex(controller.checkAddOrSubtract) >= 0){
        pos = this.calcArr.findIndex(controller.checkAddOrSubtract);
        if (this.calcArr[pos] === '+'){
          val = controller.calcAdd(this.calcArr[pos-1],this.calcArr[pos+1]);
        } else {
          val = controller.calcSubtract(this.calcArr[pos-1],this.calcArr[pos+1]);
        }
      }
      if (func){
        this.calcArr.splice(pos,2,val);
      } else {
        this.calcArr.splice(pos-1,3,val);
      }
      return this.runCalc();
    } else {
      //return calculation

      //check for infinity and rework as ERR
      if (this.calcArr[0] === Infinity){
        this.calcArr[0] = 'ERROR';
      }
      this.calcHistory[0][1].push(this.calcArr[0]);
      if (this.historyType === 'calc'){
          view.buildCalcHistory();
      } else {
          view.buildAnswerHistory();
      }

      view.updateDisplay(this.calcArr[0]);
      return this.calcArr[0];
    }
  }


  this.clearCalc = function(){
    this.canDecimal = true;
    this.calcPressed = false;
    if ($(event.target).text() === 'AC'){
      this.calcArr = [];
      view.updateDisplay('0');
    } else {
      this.calcArr.pop();
      if (this.calcArr.length >= 1) {
        view.updateDisplay(this.calcArr.join(' '));
      } else {
        view.updateDisplay('0');
      }
    }
  }
}

  /*------------------------------~~~~----------------------------------*/

  //////////////////////////////////////////////////////////////////////
 // Controller : Click handlers, math processing, op order decisions //
//////////////////////////////////////////////////////////////////////

  var Controller = function(obj){
    this.model = obj;
    this.routeInputClicks = function(){
      $('.num').on('click',this.model.handleNumClicks.bind(this.model));
      $('.op').on('click',this.model.handleOpClicks.bind(this.model));
      $('.dec').on('click',this.model.handleDecClicks.bind(this.model));
      $('.calc').on('click',this.model.handleCalc.bind(this.model));
      $('.clr').on('click',this.model.clearCalc.bind(this.model));
      $('.fun').on('click',this.model.handleFunctions.bind(this.model));
      $('div span').on('click',this.model.handleHistoryType.bind(this.model));
      $('.flip').on('click',this.model.handleFlip.bind(this.model));
      $('.ext').on('click',function(){
        if ($('.secondary-body').css('visibility') === 'hidden'){
          $(event.target).text('>>');
          $('.secondary-body').css({'visibility':'visible','opacity':'1'});
          $('.history-container').css({'visibility':'visible','opacity':'1'});
        } else {
          $(event.target).text('<<');
          $('.secondary-body').css({'visibility':'hidden','opacity':'0'});
          $('.history-container').css({'visibility':'hidden','opacity':'0'});
        }
      });

      $('.h-row.button').dblclick(view.loadFromHistory.bind(view));
    }



    this.checkAddOrSubtract = function(element){
      return element === '+' || element === '-';
    }

    this.calcAdd = function(num1,num2){
      return Number(num1) + Number(num2);
    }

    this.calcSubtract = function(num1,num2){
      return num1 - num2;
    }

    this.calcSin = function(num1){
      return Math.sin(num1);
    }

    this.calcCos = function(num1){
      return Math.cos(num1);
    }

    this.calcTan = function(num1){
      return Math.tan(num1);
    }

    this.calcSqrt = function(num1){
      return Math.sqrt(num1);
    }

    this.calcLog = function(num1){
      return Math.log(num1);
    }

    this.calcExponent = function(num1,num2){
      return Math.pow(num1,num2);
    }

    this.calcMultiply = function(num1,num2){
      return num1 * num2;
    }

    this.calcDivide = function(num1,num2){
      return num1 / num2;
    }


    this.checkMultiplyOrDivide = function(element){
      return element === '/' || element === 'x';
    }

    this.checkAddOrSubtract = function(element){
      return element === '+' || element === '-';
    }

    this.checkFunctions = function(element){
      return element === 'sin:' || element === 'cos:' || element === 'tan:' || element === '√:' || element === 'log:';
    }
  }

  /*-------------------------------~~~~-----------------------------------*/

  ////////////////////////////////////////////////////////////////////////
 //// View : Display updating, page history build, load from history ////
////////////////////////////////////////////////////////////////////////

  var View = function(obj){
    this.model = obj;

    this.updateDisplay = function(value){
      $('.display').text(value);
    }

    this.loadFromHistory = function(){
      var item = $(event.target).text();
      if (this.model.historyType === 'calc'){
        this.model.calcArr = item.split(' ');
        this.updateDisplay(item);
      } else {
        if (isNaN(this.model.calcArr[this.model.calcArr.length - 1])){
          this.model.calcArr.push(item);
        } else {
          this.model.calcArr[this.model.calcArr.length - 1] = item;
        }
        view.updateDisplay(this.model.calcArr.join(' '));
      }

    }

    this.buildCalcHistory = function(){
      for (var i = 2; i < 9; i++){
        if (i > this.model.calcHistory.length+1){
          break;
        }
        $('.h-row:nth-child('+i+')').text(this.model.calcHistory[i-2][0]);
      }
    }

    this.buildAnswerHistory = function(){
      for (var i = 2; i < 9; i++){
        if (i > this.model.calcHistory.length+1){
          break;
        }
        $('.h-row:nth-child('+i+')').text(this.model.calcHistory[i-2][1]);
      }
    }
  }
