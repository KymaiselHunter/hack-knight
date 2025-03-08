import React from "react";

const data = [
  { category: "Savings", percentage: 20, color: "#f99bab" },
  { category: "Needs", percentage: 50, color: "#f99bab" },
  { category: "Wants", percentage: 30, color: "#f99bab" },
];

const BudgetProgress = () => {
  return (
    <div style={{ width: "100%", padding: "1px" }}>
      {data.map((item) => (
        <div key={item.category} style={{ marginBottom: "15px" }}>
          <div style={{ fontSize: "16px", marginBottom: "5px" }}>{item.category}</div>
          <div style={{ width: "100%", backgroundColor: "#cbffde", borderRadius: "8px", height: "20px" }}>
            <div
              style={{
                width: `${item.percentage}%`,
                backgroundColor: item.color,
                height: "100%",
                borderRadius: "8px",
                transition: "width 0.5s ease-in-out",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default BudgetProgress;
