import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import AffordabilityTab from './components/AffordabilityTab';
// import MortgageTab from './components/MortgageTab';
import HomeFinder from './components/HomeFinder';
// import { formatCurrency } from './utils/currency';
import './styles/App.css';

const TABS = {
  AFFORD: 'afford',
  MORTGAGE: 'mortgage',
  FINDER: 'finder',
};

function App() {
  const [activeTab, setActiveTab] = useState(TABS.AFFORD);
  const [formData, setFormData] = useState({
    income: { value: '', frequency: 'monthly', annual: 0 },
    affordableHome: 0,
    homeValue: '',
    downPayment: '',
    loanAmount: '',
    interestRate: '',
    loanDuration: '30',
    monthlyPayment: 0,
    resultText: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('mortgageData');
    if (saved) setFormData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('mortgageData', JSON.stringify(formData));
  }, [formData]);

  const updateForm = useCallback((updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []); // ← Empty array: only create once

  return (
    <div className="app-container">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {activeTab === TABS.AFFORD && (
          <AffordabilityTab
            formData={formData}
            updateForm={updateForm}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === TABS.FINDER && <HomeFinder formData={formData} />}
      </main>
    </div>
  );
}

export default App;
