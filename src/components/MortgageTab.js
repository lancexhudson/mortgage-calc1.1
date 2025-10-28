// src/components/MortgageTab.js
import React, { useEffect } from 'react';
import { formatCurrency } from '../utils/currency';
import { calculateMortgage } from '../utils/mortgage';
import '../styles/Tabs.css';

const MortgageTab = ({ formData, updateForm, setActiveTab }) => {
  const {
    affordableHome,
    income,
    homeValue,
    downPayment,
    loanAmount,
    interestRate,
    loanDuration,
    resultText,
  } = formData;

  useEffect(() => {
    if (homeValue && downPayment) {
      updateForm({ loanAmount: homeValue - downPayment });
    }
  }, [homeValue, downPayment]);

  const handleCalculate = () => {
    const result = calculateMortgage({
      homeValue: homeValue || affordableHome,
      downPayment,
      loanAmount: loanAmount || homeValue - downPayment,
      interestRate: interestRate || 6.5,
      loanDuration: loanDuration || 30,
    });

    const plainText = `With an annual income of ${formatCurrency(
      income.annual || 0
    )} and an interest rate of ${
      interestRate || 6.5
    }%, you can afford a home up to ${formatCurrency(
      result.homeValue
    )}. Your monthly payment would be ${formatCurrency(
      result.monthlyPayment
    )}.`;

    updateForm({ ...result, resultText: plainText });
  };

  return (
    <div>
      <div className="highlight-card">
        <p>Based on 28% rule:</p>
        <p className="big-price">{formatCurrency(affordableHome)}</p>
        <p className="small">Max home you can afford</p>
      </div>

      <div className="card">
        <CurrencyInput
          label="Home Value"
          value={homeValue}
          onChange={(v) => updateForm({ homeValue: v })}
        />
        <CurrencyInput
          label="Down Payment"
          value={downPayment}
          onChange={(v) => updateForm({ downPayment: v })}
        />
        <CurrencyInput label="Loan Amount" value={loanAmount} readOnly />

        <NumberInput
          label="Interest Rate %"
          value={interestRate}
          onChange={(v) => updateForm({ interestRate: v })}
          placeholder="6.5"
        />
        <NumberInput
          label="Loan Duration (years)"
          value={loanDuration}
          onChange={(v) => updateForm({ loanDuration: v })}
          placeholder="30"
        />

        <button onClick={handleCalculate} className="btn-primary full-width">
          Calculate
        </button>

        {resultText && (
          <div className="result-box animate-in">
            <p>{resultText}</p>
            <button
              onClick={() => setActiveTab('finder')}
              className="btn-success full-width mt-3"
            >
              Find My Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable: Currency fields with $ formatting
const CurrencyInput = ({ label, value, onChange, readOnly, placeholder }) => {
  const display =
    value !== '' && value !== undefined ? formatCurrency(value) : '';

  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        type="text"
        value={display}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^0-9.]/g, '');
          onChange(raw ? parseFloat(raw) : '');
        }}
        readOnly={readOnly}
        placeholder={placeholder || '$0'}
        className={`input ${readOnly ? 'readonly' : ''}`}
      />
    </div>
  );
};

// Reusable: Non-currency number fields (no $)
const NumberInput = ({ label, value, onChange, placeholder }) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        type="number"
        step="any"
        value={value || ''}
        onChange={(e) =>
          onChange(e.target.value ? parseFloat(e.target.value) : '')
        }
        placeholder={placeholder}
        className="input"
      />
    </div>
  );
};

export default MortgageTab;
