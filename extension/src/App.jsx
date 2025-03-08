import React from 'react';
import BudgetChart from './BudgetChart';
import ChatGPTPopup from './ChatGPTPopup';

const App = () => {
  return (
    <div style={{ width: '400px', padding: '20px' }}>
      <h2>Budget Breakdown</h2>
      <BudgetChart />
      <h2>Chat with ChatGPT</h2>
      <ChatGPTPopup />
    </div>
  );
};

export default App;
