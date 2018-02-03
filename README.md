# Scientific Calculator

## Requirements
All that is required is an internet connection and a semi-recent browser. 
The calculator utilizes jQuery, JavaScript, HTML, CSS.

## Operation
This scientific calculator has been designed for both basic usage and scientific calculation. It is functions first (executing from right to left to allow for function nesting), and then follows p.e.m.d.a.s. from left to right.

### General
  * Advanced operations can be viewed by clicking **<<** and closed by clicking **>>**
  * Opening operators are not recognized, with the exception of functions
  * To swap sign (go from positive to negative or vice versa) enter a number and then press the **+/-** key
  * Decimals can only be pressed once per number, but can be used as the opening key press for a number
  * Pressing an operator key after an operator was just input will update the operator to the most recently pressed operator key
  * Pressing a function key after another function key will nest the most recent function inside of the previous function. The calculation will bubble from in to out.
  * Terminal operators will cause all calculations before the operator to be repeated after the operator as well and the total of all calculations will be returned.
### History
  * History has two modes. These modes can be toggled by clicking in the top right of the history box on either **calc** or **ans**
  * When in **calc** mode the history section will contain calculation strings that you have previously executed. Double clicking one will place it in the display and allow you to add to or change the calculation string
  * When in **ans** mode the history section will contain previous solutioins. If the last item in the display is an operator, double clicking on a history solution will add it after the operator. If the last item in the display is a number, double clicking on a history solution will replace the display number with the history solution number
  * Using the ans history recall allows for a form of parenthetical usage. For example: calculate **PI / 2** and get the result. Then press **sin:** and double click on the result of **PI / 2** in the history answers section. Pressing equals will give you a return value of 1 (the correct answer). While inputing **sin: PI / 2** will execute the function before the division, which is not generally the intended calculation. Good usage of the history will allow for most usage
  * History will store the last seven calculations with the most recent at the top

### Key Control
  * (**#**) The relevant number
  * (**A or a**) Clear all
  * (**C or c**) Clear last
  * (**X or x**) Multiply
  * (**/**) Divide
  * (**+**) Addition
  * (**-**) Subtraction
  * (**^**) Exponentiation
  * (**.**) Decimal
  * (**=**) Equals/Calculate
  * (**enter**) Equals/Calculate
  * (**<**) Open extended functionality
  * (**>**) Close extended functionality
  * (**s**) Sin
  * (**d**) Cos
  * (**t**) Tan
  * (**q**) Square Root
  * (**p**) PI
  * (**e**) E
  * (**l**) Log
  * (**?**) Open user Guide
  * (**\[**) Close user guide
  * (**h**) Toggle hishtory mode
  * (**alt-1**) Recall most recent history item (answer or problem, whichever is active)





