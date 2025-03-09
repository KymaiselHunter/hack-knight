import React, { useEffect, useState } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa"; // Import Font Awesome icons

const API_KEY = "f16bc2e1472450db774a644673f06a3f"; // Replace with your Nessie API Key

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

  // Calculate progress bar width for spent and remaining
  const getProgressWidth = (spent, budget) => {
    return (spent / budget) * 100; // Calculate percentage of spent amount
  };

  const getRemainingProgressWidth = (remaining, budget) => {
    return (remaining / budget) * 100; // Calculate percentage of remaining amount
  };

  // Determine if thumbs up or thumbs down should be shown
  const getThumbsIcon = (spent, budget) => {
    const iconStyle = {
      color: spent > budget ? "red" : "green",
      fontSize: "20px",
      position: "relative",
      top: "-25px", // Adjust for alignment
    };

    if (spent > budget) {
      return <FaThumbsDown style={iconStyle} />;
    }
    return <FaThumbsUp style={iconStyle} />;
  };

  return (
    <div style={{ width: "100%", padding: "1px" }}>
      <div style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>
        Last Paycheck: ${paycheck.toLocaleString()}
      </div>
  
      {data.map((item) => {
        let totalAmount = 0;
        let spent = 0;
        let remaining = 0;
  
        if (item.category === "Essential Budget") {
          totalAmount = essentialBudget;
          spent = spentEssential;
          remaining = remainingEssential;
        } else if (item.category === "Non-Essential Budget") {
          totalAmount = nonEssentialBudget;
          spent = spentNonEssential;
          remaining = remainingNonEssential;
        }
  
        return (
          <div key={item.category} style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "16px", marginBottom: "5px" }}>
              {item.category}
            </div>
  
            {/* Progress bar for spent amount */}
            <div
              style={{
                width: "90%",
                backgroundColor: "#cbffde",
                borderRadius: "10px",
                height: "20px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${getProgressWidth(parseFloat(spent), parseFloat(totalAmount))}%`,
                  backgroundColor: item.color,
                  height: "100%",
                  borderRadius: "10px 0 0 10px",
                  transition: "width 0.5s ease-in-out",
                }}
              />
            </div>
  
            {/* Spent and Remaining on the same line */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "14px",
                marginTop: "5px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ color: "#f99bab" }}>
                  Spent: ${parseFloat(spent).toLocaleString()}
                </span>
              </div>
  
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ color: "#42c982" }}>
                  Remaining: ${parseFloat(remaining).toLocaleString()}
                </span>
              </div>
  
              {/* Align thumbs icon */}
              <div style={{ marginLeft: "10px", alignSelf: "center" }}>
                {getThumbsIcon(parseFloat(spent), parseFloat(totalAmount))}
              </div>
            </div>
          </div>
        );
      })}
  
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

function DataRow(props)
{
  return(
    <>
      <div style={{ display: "flex", justifyContent: "space-between",fontSize: "16px" }}>
          <span>{props.title}</span>
          <span style={{ color: "#42c982" }}>
            ${parseFloat(props.money).toLocaleString()}
          </span>
        </div>
    </>

  )
}
export default BudgetProgress;
