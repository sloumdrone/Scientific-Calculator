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
  this.historyType = 'ans';

  this.handleOpClicks = function(event){
    this.calcPressed = false;
    if (this.calcArr[0]){
      if (isNaN(this.calcArr[this.calcArr.length-1]) && this.calcArr[0] !== 'ERROR'){
          this.calcArr[this.calcArr.length-1] = $(event.target).text();
      } else if (this.calcArr[0] !== 'ERROR'){
          this.calcArr[this.calcArr.length-1] = Number(this.calcArr[this.calcArr.length-1]);
          this.calcArr.push($(event.target).text());
      }
      view.updateDisplay(this.calcArr.join(' '));
    } else {
      view.updateDisplay('0');
    }
    this.canDecimal = true;
  }

  this.handleNumClicks = function(event) {
    //start new calc if num was pressed after equals without an op first
    if (this.calcPressed){
      this.calcArr = [];
    }
    this.calcPressed = false;

    var specialNumPressed = false;
    var currentNum = $(event.target).text();
    if (currentNum === 'π'){
      currentNum = Math.PI;
      specialNumPressed = true;
    } else if (currentNum === 'E'){
      currentNum = Math.E;
      specialNumPressed = true;
    }


    if (this.calcArr[0]){
      if (!isNaN(this.calcArr[this.calcArr.length-1]) || this.calcArr[this.calcArr.length-1][this.calcArr[this.calcArr.length-1].length-1] === '.'){
        if (specialNumPressed){
          this.calcArr.push('x');
          this.calcArr.push(currentNum);
        } else {
          this.calcArr[this.calcArr.length-1] += currentNum;
        }
      } else {
        this.calcArr.push(currentNum);
      }
    } else {
      this.calcArr.push(currentNum);
    }
    view.updateDisplay(this.calcArr.join(' '));
  }

  this.handleFunctions = function(event){
    this.calcPressed = false;

    if (!isNaN(this.calcArr[this.calcArr.length-1])){
      this.calcArr[this.calcArr.length-1] = $(event.target).text();
    } else {
      this.calcArr.push($(event.target).text());
    }
    view.updateDisplay(this.calcArr.join(' '));

    this.canDecimal = true;
  }

  this.handleFlip = function(event){
    if (this.calcArr[0]){
        if (!isNaN(this.calcArr[this.calcArr.length-1])){
          this.calcArr[this.calcArr.length-1] = Number(this.calcArr[this.calcArr.length-1]) * -1;
        }
    }
    view.updateDisplay(this.calcArr.join(' '));
  }


  this.handleDecClicks = function(event){
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

  this.handleHistoryType = function(event){
    if (this.historyType === 'calc'){
      this.historyType = 'ans';
      $(event.target).text('Ans');
      view.buildAnswerHistory();
    } else {
      this.historyType = 'calc';
      $(event.target).text('Calc');
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
    if (this.calcArr.length > 0){
      var historyItem = [this.calcArr.join(' ')]
      this.calcHistory.unshift(historyItem);
    }

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
        pos = this.calcArr.slice().reverse().findIndex(controller.checkFunctions);
        pos = this.calcArr.length - 1 - pos;
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
      this.calcHistory[0].push(this.calcArr[0]);
      if (this.historyType === 'calc'){
          view.buildCalcHistory();
      } else {
          view.buildAnswerHistory();
      }

      view.updateDisplay(this.calcArr[0]);
      return this.calcArr[0];
    }
  }


  this.clearCalc = function(event){
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
      $('#info-button2').on('click',this.model.handleHistoryType.bind(this.model));
      $('.flip').on('click',this.model.handleFlip.bind(this.model));
      $('body').on('keypress',this.handleKeyInput);
      $('.ext').on('click',function(event){
        if ($('.secondary-body').css('visibility') === 'hidden'){
          $(event.target).text('>>');
          $('#info-button').css({'visibility':'visible','left':'33px'});
          $('#info-button2').css({'visibility':'visible','right':'33px'});
          $('.secondary-body').css({'visibility':'visible','left':'0px'});
          $('.history-container').css({'visibility':'visible','left':'0px'});
        } else {
          $(event.target).text('<<');
          $('#info-button').css({'visibility':'hidden','left':'233px'});
          $('#info-button2').css({'visibility':'hidden','right':'233px'});
          $('.secondary-body').css({'visibility':'hidden','left':'200px'});
          $('.history-container').css({'visibility':'hidden','left':'-200px'});
        }
      });

      $('.h-row.button').dblclick(view.loadFromHistory.bind(view));
      $('#info-button').click(function(event){
        $('.modal-curtain').slideDown('slow');
        $('.modal-body').slideDown('slow');
      });
      $('.modal-close').click(function(event){
        $('.modal-body').slideUp('slow');
        $('.modal-curtain').slideUp('slow');

      });
    }

    this.handleKeyInput = function(){
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
        case 102: // +/- - 'f'
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
        case 60:
        case 62: // expand calc body - < or >
          $('.calc-body .row:nth-child(6) .ext').click();
          break;
        case 115: //sin - s
          $('.secondary-body .row:nth-child(1) .fun:nth-child(1)').click();
          break;
        case 100: // cos - c
          $('.secondary-body .row:nth-child(1) .fun:nth-child(2)').click();
          break;
        case 116: //tan - t
          $('.secondary-body .row:nth-child(2) .fun:nth-child(1)').click();
          break;
        case 113: // sqrt - q
          $('.secondary-body .row:nth-child(2) .fun:nth-child(2)').click();
          break;
        case 112: //pi - p
          $('.secondary-body .row:nth-child(3) .num:nth-child(1)').click();
          break;
        case 101: // E - e
          $('.secondary-body .row:nth-child(3) .num:nth-child(2)').click();
          break;
        case 108: // log - l
          $('.secondary-body .row:nth-child(4) .fun').click();
          break;
        case 63: // user info - ?
          $('#info-button').click();
          break;
        case 91: // close user info - [
          $('.modal-close').click();
          break;
        case 104: // toggle hishtory mode - h
          $('#info-button2').click();
          break;
        case 161: // double click top history item - alt-1
          $('.history-container div:nth-child(2)').dblclick();
          break;
      }
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

    this.loadFromHistory = function(event){
      var item = $(event.target).text();
      if (item.length > 0){
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
