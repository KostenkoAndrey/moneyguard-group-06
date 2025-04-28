import { ALLOWED_CATEGORIES } from '../constants/index.js';

export const totalExspensesIncome = (transactions) => {
  const iSummary = { "income": 0, "totalIncome": 0 };
  const eSummary = { "expenses": ALLOWED_CATEGORIES
    .filter( category => category !== 'income',)
    .reduce((acc, category) => { acc[category] = 0;
        return acc;
    }, {}),
    "totalExpenses": 0,
  };

  transactions.reduce((_, { category, sum }) => {
    if (category === 'income') {
      iSummary.income += sum;
      iSummary.totalIncome += sum;
    } else if ( Object.prototype.hasOwnProperty.call(eSummary.expenses, category)) {
      eSummary.expenses[category] += sum;
      eSummary.totalExpenses += sum;
    }
  }, null);

  return {
    iSummary,
    eSummary
  };
};
