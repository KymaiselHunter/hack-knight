import React from 'react';
import BudgetProgress from './components/BudgetChart';
import ChatBox from './components/ChatBox';

const Popup = () => {
  return (
    <div style={{ width: '400px', padding: '20px' }}>
      <h2>Budget Breakdown</h2>
      <BudgetProgress />
      <ChatBox />
    </div>
  );
};

export default Popup;
