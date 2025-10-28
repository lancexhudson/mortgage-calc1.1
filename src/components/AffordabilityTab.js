import React from 'react';
import { formatCurrency } from '../utils/currency';
import '../styles/Tabs.css';

const AffordabilityTab = ({ formData, updateForm, setActiveTab }) => {
  const { income } = formData;

  const calculateAffordability = () => {
    const annual =
      income.frequency === 'weekly'
        ? income.value * 52
        : income.frequency === 'monthly'
        ? income.value * 12
        : income.value;

    const monthlyAllowed = (annual * 0.28) / 12;
    const affordableHome = monthlyAllowed * 240; // 30yr @ ~6%

    updateForm({
      affordableHome,
      income: { ...income, annual },
      resultText: `With an income of ${formatCurrency(
        annual
      )} per year, you can afford a home up to ${formatCurrency(
        affordableHome
      )}.`,
    });
    setActiveTab('mortgage');
  };

  return (
    <div className="card animate-in">
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
        className="btn-primary half-width"
      >
        Calculate Home Affordability
      </button>
    </div>
  );
};

export default AffordabilityTab;
