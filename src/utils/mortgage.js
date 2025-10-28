// src/utils/mortgage.js
export const calculateMortgage = ({
  homeValue = 0,
  downPayment = 0,
  loanAmount,
  interestRate = 6.5,
  loanDuration = 30,
}) => {
  const loan = loanAmount || homeValue - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const months = loanDuration * 12;

  let monthlyPayment = 0;
  if (monthlyRate > 0) {
    monthlyPayment =
      (loan * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
      (Math.pow(1 + monthlyRate, months) - 1);
  } else {
    monthlyPayment = loan / months;
  }

  return {
    homeValue,
    downPayment,
    loanAmount: loan,
    monthlyPayment: Math.round(monthlyPayment),
    interestRate,
    loanDuration,
  };
};
