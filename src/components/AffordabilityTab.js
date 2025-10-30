// src/components/AffordabilityTab.js
import React, { useState, useRef, useEffect } from 'react';
import { formatCurrency } from '../utils/currency';
import { calculateMortgage } from '../utils/mortgage';
import '../styles/Tabs.css';

const AffordabilityTab = ({ formData, updateForm, setActiveTab }) => {
  const { income } = formData;
  const [showResult, setShowResult] = useState(false);
  const [showMortgage, setShowMortgage] = useState(false);

  // Refs for scrolling
  const resultRef = useRef(null);
  const mortgageRef = useRef(null);

  // Auto-scroll to section when it appears
  useEffect(() => {
    if (showResult && resultRef.current) {
      resultRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [showResult]);

  useEffect(() => {
    if (showMortgage && mortgageRef.current) {
      mortgageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [showMortgage]);

  const calculateAffordability = () => {
    const annual =
      income.frequency === 'weekly'
        ? income.value * 52
        : income.frequency === 'monthly'
        ? income.value * 12
        : income.value;

    const monthlyAllowed = (annual * 0.28) / 12;
    const affordableHome = Math.round(monthlyAllowed * 240);

    updateForm({
      affordableHome,
      income: { ...income, annual },
    });
    setShowResult(true);
  };

  const calculateMortgageDetails = () => {
    const result = calculateMortgage({
      homeValue: formData.affordableHome,
      downPayment: formData.affordableHome * 0.2,
      interestRate: 6.8,
      loanDuration: 30,
    });

    updateForm({
      downPayment: result.downPayment,
      loanAmount: result.loanAmount,
      monthlyPayment: result.monthlyPayment,
      interestRate: 6.8,
      loanDuration: 30,
    });

    setShowMortgage(true);
  };

  return (
    <div className="space-y-8">
      {/* 1. Income Input */}
      <div className="card">
        <h2 className="card-title">What Can I Afford?</h2>

        <div className="form-group">
          <label>Income</label>
          <div className="income-input">
            <input
              type="text"
              value={income.value !== '' ? formatCurrency(income.value) : ''}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9.]/g, '');
                updateForm({
                  income: { ...income, value: raw ? parseFloat(raw) : '' },
                });
              }}
              placeholder="$0"
              className="input"
            />
            <div className="freq-buttons">
              {['weekly', 'monthly', 'annually'].map((freq) => (
                <button
                  key={freq}
                  onClick={() =>
                    updateForm({ income: { ...income, frequency: freq } })
                  }
                  className={`freq-btn ${
                    income.frequency === freq ? 'active' : ''
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={calculateAffordability}
          disabled={!income.value}
          className="btn-primary full-width"
        >
          Calculate Home Affordability
        </button>
      </div>

      {/* 2. Max Home Result */}
      {showResult && (
        <div ref={resultRef}>
          <div className="highlight-card">
            <p>Based on 28% rule:</p>
            <p className="big-price">
              {formatCurrency(formData.affordableHome)}
            </p>
            <p className="small">Max home you can afford</p>
          </div>

          <button
            onClick={calculateMortgageDetails}
            className="btn-primary full-width"
          >
            Calculate Mortgage
          </button>
        </div>
      )}

      {/* 3. Mortgage Summary */}
      {showMortgage && (
        <div ref={mortgageRef}>
          <div className="card">
            <h3 className="card-title">Mortgage Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">
                  Required Down Payment (20%) =&nbsp;
                </span>
                <span className="font-bold text-lg text-indigo-600">
                  {formatCurrency(formData.downPayment)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">
                  Monthly Payment =&nbsp;
                </span>
                <span className="font-bold text-xl text-green-600">
                  {formatCurrency(formData.monthlyPayment)}
                </span>
              </div>
              <p className="text-sm text-gray-500 italic">
                *Assumes 6.8% interest rate (30-year fixed)
              </p>
            </div>

            <button
              onClick={() => setActiveTab('finder')}
              className="btn-primary full-width mt-5"
            >
              Find My Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AffordabilityTab;
