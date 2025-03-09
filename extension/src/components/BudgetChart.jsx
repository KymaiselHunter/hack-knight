import React, { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";
import DataRow from "./DataRow";

const data = [
  { 
    category: "Essential Budget", 
    percentage: 50, // 50% for Essential
    color: "#f99bab" 
  },
  { 
    category: "Non-Essential Budget", 
    percentage: 30, // 30% for Non-Essential
    color: "#f99bab" 
  },
];

const BudgetProgress = () => {
  const [paycheck, setPaycheck] = useState({
    firstName: "",
    lastName: "",
    address: "",
    paycheckAmount: ""
  });


  // Calculate amounts
  const essentialBudget = (paycheck * 0.5).toFixed(2); // 50% of paycheck
  const nonEssentialBudget = (paycheck * 0.3).toFixed(2); // 30% of paycheck
  const suggestedSavings = (paycheck * 0.2).toFixed(2); // 20% of paycheck

  // Calculate spent and remaining for Essential and Non-Essential Budgets
  const spentEssential = (essentialBudget * 1.1).toFixed(2); // Spent 40% of Essential Budget
  const remainingEssential = (essentialBudget - spentEssential).toFixed(2);
  const spentNonEssential = (nonEssentialBudget * 0.7).toFixed(2); // Spent 40% of Non-Essential Budget
  const remainingNonEssential = (nonEssentialBudget - spentNonEssential).toFixed(2);

  // Calculate actual savings
  const actualSavings = (paycheck - (parseFloat(spentEssential) + parseFloat(spentNonEssential))).toFixed(2);

  // Determine the color for actual savings
  const actualSavingsColor = parseFloat(actualSavings) < 0 ? "red" : "#42c982"; // Red for negative savings, green for positive

  return (
    <div style={{ width: "100%", padding: "1px" }}>
      <div style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>
        Last Paycheck: ${paycheck.toLocaleString()}
      </div>
  
      <ProgressBar 
        category={data[0].category} 
        spent={spentEssential} 
        totalAmount={essentialBudget}
        color={data[0].color}
        remaining={remainingEssential}  
      ></ProgressBar>
      
      <ProgressBar 
        category={data[1].category} 
        spent={spentNonEssential} 
        totalAmount={nonEssentialBudget}
        color={data[1].color}
        remaining={remainingNonEssential}  
      ></ProgressBar>
  
      {/* Display Suggested Savings */}
      <div style={{ marginBottom: "20px" }}>
        <DataRow title={"Suggested Savings"} money={suggestedSavings}></DataRow>
      </div>  
  
      {/* Display Actual Savings */}
      <div style={{ fontSize: "16px" }}>
        <DataRow title={"Actual Savings"} money={actualSavings}></DataRow>
      </div>
    </div>
  );
};



export default BudgetProgress;
