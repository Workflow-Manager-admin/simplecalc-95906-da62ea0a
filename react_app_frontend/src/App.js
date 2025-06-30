import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * The main App component for the calculator.
 * A minimalistic, light-themed, responsive calculator with basic operations.
 */
function App() {
  // Calculator state
  const [display, setDisplay] = useState('0'); // What is shown on the calculator display
  const [firstOperand, setFirstOperand] = useState(null); // First inputted number
  const [operator, setOperator] = useState(null); // Chosen operator (+, -, *, /)
  const [waitingForOperand, setWaitingForOperand] = useState(false); // Is the calculator ready for new number input after an operation
  const [errorMsg, setErrorMsg] = useState(''); // Error message for invalid operations

  useEffect(() => {
    // Always reset error if display or state changes
    setErrorMsg('');
  }, [display, firstOperand, operator]);

  // PUBLIC_INTERFACE
  /** Handles number and dot input */
  function inputDigit(digit) {
    if (waitingForOperand) {
      setDisplay(digit === '.' ? '0.' : digit);
      setWaitingForOperand(false);
    } else {
      if (digit === '.' && display.includes('.')) return;
      if (display.length >= 14) return; // Prevent overflow
      setDisplay(display === '0' && digit !== '.' ? digit : display + digit);
    }
  }

  // PUBLIC_INTERFACE
  /** Handles operator input */
  function inputOperator(nextOperator) {
    let inputValue = parseFloat(display);
    if (operator && waitingForOperand) {
      setOperator(nextOperator);
      return;
    }
    if (firstOperand == null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = performCalculation(firstOperand, inputValue, operator);
      if (result.error) {
        setErrorMsg(result.error);
        setDisplay('0');
        setFirstOperand(null);
        setOperator(null);
        setWaitingForOperand(false);
        return;
      }
      setDisplay(String(result.value));
      setFirstOperand(result.value);
    }
    setOperator(nextOperator);
    setWaitingForOperand(true);
  }

  // PUBLIC_INTERFACE
  /** Performs calculation on "=" press */
  function inputEquals() {
    let inputValue = parseFloat(display);
    if (operator && firstOperand != null) {
      const result = performCalculation(firstOperand, inputValue, operator);
      if (result.error) {
        setErrorMsg(result.error);
        setDisplay('0');
      } else {
        setDisplay(String(result.value));
      }
      setFirstOperand(null);
      setOperator(null);
      setWaitingForOperand(false);
    }
  }

  // PUBLIC_INTERFACE
  /** Calculation helper */
  function performCalculation(a, b, operator) {
    let value = 0;
    let error;
    switch (operator) {
      case '+':
        value = a + b;
        break;
      case '-':
        value = a - b;
        break;
      case '*':
        value = a * b;
        break;
      case '/':
        if (b === 0) error = "Can't divide by zero!";
        else value = a / b;
        break;
      default:
        value = b;
    }
    return error ? { error } : { value: parseFloat(value.toPrecision(12)) };
  }

  // PUBLIC_INTERFACE
  /** Resets calculator to initial state */
  function clearAll() {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForOperand(false);
    setErrorMsg('');
  }

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        inputDigit(e.key);
      }
      if (['+', '-', '*', '/'].includes(e.key)) {
        inputOperator(e.key);
      }
      if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        inputEquals();
      }
      if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        clearAll();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line
  });

  // Layout: calculator button configuration
  const buttons = [
    [{ label: 'C', onClick: clearAll, className: 'accent' }, { label: '', disabled: true }, { label: '', disabled: true }, { label: '÷', onClick: () => inputOperator('/'), className: 'primary' }],
    [{ label: '7', onClick: () => inputDigit('7') }, { label: '8', onClick: () => inputDigit('8') }, { label: '9', onClick: () => inputDigit('9') }, { label: '×', onClick: () => inputOperator('*'), className: 'primary' }],
    [{ label: '4', onClick: () => inputDigit('4') }, { label: '5', onClick: () => inputDigit('5') }, { label: '6', onClick: () => inputDigit('6') }, { label: '−', onClick: () => inputOperator('-'), className: 'primary' }],
    [{ label: '1', onClick: () => inputDigit('1') }, { label: '2', onClick: () => inputDigit('2') }, { label: '3', onClick: () => inputDigit('3') }, { label: '+', onClick: () => inputOperator('+'), className: 'primary' }],
    [{ label: '0', onClick: () => inputDigit('0'), className: 'zero' }, { label: '.', onClick: () => inputDigit('.') }, { label: '=', onClick: inputEquals, className: 'accent wide' }]
  ];

  return (
    <div className="App">
      <div className="calculator-background">
        <div className="calculator-container" role="main" aria-label="Calculator">
          <div className="calc-title">Simple Calculator</div>
          <div
            className={`calc-display${errorMsg ? " error" : ""}`}
            aria-live="polite"
            aria-atomic="true"
            tabIndex={0}
          >
            {errorMsg || display}
          </div>
          <div className="calc-ops-row">
            {buttons.map((row, i) => (
              <div className="calc-row" key={i}>
                {row.map((btn, j) =>
                  btn.label ? (
                    <button
                      key={j}
                      className={
                        [
                          'calc-btn',
                          btn.className || '',
                          (operator && btn.label === toSymbol(operator) && !btn.disabled) ? 'active-op' : ''
                        ].join(' ')
                      }
                      onClick={btn.onClick}
                      disabled={!!btn.disabled}
                      tabIndex={btn.disabled ? -1 : 0}
                      aria-label={btn.label}
                    >
                      {btn.label}
                    </button>
                  ) : (
                    <div className="calc-btn empty" key={j}></div>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Footer credit */}
      <div className="calc-footer">
        <span>
          <a href="https://reactjs.org/" rel="noopener noreferrer" target="_blank" className="calc-footer-link">
            React SimpleCalc
          </a>
        </span>
      </div>
    </div>
  );
}

// Helper to display symbols for operators
function toSymbol(op) {
  if (op === '*') return '×';
  if (op === '/') return '÷';
  if (op === '+') return '+';
  if (op === '-') return '−';
  return op;
}

export default App;
