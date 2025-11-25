import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Calculator.css';

const Calculator = () => {
  const navigate = useNavigate();
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [newNumber, setNewNumber] = useState(true);

  const handleNumber = (num) => {
    if (newNumber) {
      setDisplay(String(num));
      setNewNumber(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const handleDecimal = () => {
    if (newNumber) {
      setDisplay('0.');
      setNewNumber(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (op) => {
    const currentValue = parseFloat(display);
    
    if (previousValue === null) {
      setPreviousValue(currentValue);
    } else if (operation) {
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }
    
    setOperation(op);
    setNewNumber(true);
  };

  const calculate = (a, b, op) => {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '×':
        return a * b;
      case '÷':
        return b !== 0 ? a / b : 'Error';
      case '%':
        return a % b;
      default:
        return b;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const currentValue = parseFloat(display);
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const handleDelete = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
      setNewNumber(true);
    }
  };

  const handlePlusMinus = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const formatDisplay = (value) => {
    if (value === 'Error') return value;
    const num = parseFloat(value);
    if (isNaN(num)) return '0';
    if (value.includes('.') && value.endsWith('.')) return value;
    if (value.includes('.') && !value.split('.')[1]) return value;
    return num.toLocaleString('id-ID', { maximumFractionDigits: 8 });
  };

  return (
    <div className="calculator-container">
      {/* Header */}
      <div className="calculator-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">←</button>
        <h1>Calculator</h1>
      </div>

      {/* Calculator Body */}
      <div className="calculator-body">
        {/* Display */}
        <div className="calculator-display">
          <div className="display-operation">{operation ? `${previousValue} ${operation}` : ''}</div>
          <div className="display-value">{formatDisplay(display)}</div>
        </div>

        {/* Buttons */}
        <div className="calculator-buttons">
          {/* Row 1 */}
          <button onClick={handleClear} className="btn btn-function">C</button>
          <button onClick={handleDelete} className="btn btn-function">⌫</button>
          <button onClick={() => handleOperation('%')} className="btn btn-function">%</button>
          <button onClick={() => handleOperation('÷')} className="btn btn-operator">÷</button>

          {/* Row 2 */}
          <button onClick={() => handleNumber(7)} className="btn btn-number">7</button>
          <button onClick={() => handleNumber(8)} className="btn btn-number">8</button>
          <button onClick={() => handleNumber(9)} className="btn btn-number">9</button>
          <button onClick={() => handleOperation('×')} className="btn btn-operator">×</button>

          {/* Row 3 */}
          <button onClick={() => handleNumber(4)} className="btn btn-number">4</button>
          <button onClick={() => handleNumber(5)} className="btn btn-number">5</button>
          <button onClick={() => handleNumber(6)} className="btn btn-number">6</button>
          <button onClick={() => handleOperation('-')} className="btn btn-operator">−</button>

          {/* Row 4 */}
          <button onClick={() => handleNumber(1)} className="btn btn-number">1</button>
          <button onClick={() => handleNumber(2)} className="btn btn-number">2</button>
          <button onClick={() => handleNumber(3)} className="btn btn-number">3</button>
          <button onClick={() => handleOperation('+')} className="btn btn-operator">+</button>

          {/* Row 5 */}
          <button onClick={handlePlusMinus} className="btn btn-number">±</button>
          <button onClick={() => handleNumber(0)} className="btn btn-number">0</button>
          <button onClick={handleDecimal} className="btn btn-number">.</button>
          <button onClick={handleEquals} className="btn btn-equals">=</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
