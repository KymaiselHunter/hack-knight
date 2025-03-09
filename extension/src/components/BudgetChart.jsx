import React, { useEffect, useState } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa"; // Import Font Awesome icons

const API_KEY = ""; // Replace with your Nessie API Key

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
  const [paycheck, setPaycheck] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    paycheckAmount: ""
  });

  useEffect(() => {
    const savedCustomer = JSON.parse(localStorage.getItem("customer"));
    if (savedCustomer) {
      setFormData(savedCustomer);
      setPaycheck(savedCustomer.paycheckAmount);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const depositPaycheck = async (amount) => {
    try {
      const response = await fetch("YOUR_BACKEND_API_ENDPOINT/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paycheck: amount }),
      });

      if (response.ok) {
        console.log("Paycheck deposited successfully");
      } else {
        console.error("Failed to deposit paycheck");
      }
    } catch (error) {
      console.error("Error depositing paycheck:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://api.nessieisreal.com/customers?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: formData.firstName,
            last_name: formData.lastName,
            address: { street_number: formData.address },
          }),
        }
      );
      const customer = await response.json();
      alert("Customer created successfully!");

      const customerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        paycheckAmount: parseFloat(formData.paycheckAmount),
      };

      localStorage.setItem("customer", JSON.stringify(customerData));

      setPaycheck(parseFloat(formData.paycheckAmount));
      depositPaycheck(parseFloat(formData.paycheckAmount));
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create customer:", error);
    }
  };

  useEffect(() => {
    if (paycheck > 0) {
      setLoading(false);
    }
  }, [paycheck]);

  if (loading) {
    return (
      <div>
        <div>Loading paycheck...</div>
        <button onClick={() => setShowForm(true)}>Create Customer</button>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="paycheckAmount"
              placeholder="Last Paycheck Amount"
              value={formData.paycheckAmount}
              onChange={handleInputChange}
              required
            />
            <button type="submit">Submit</button>
          </form>
        )}
      </div>
    );
  }

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
      <div style={{ marginBottom: "20px", fontSize: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Suggested Savings</span>
          <span style={{ color: "#42c982" }}>
            ${parseFloat(suggestedSavings).toLocaleString()}
          </span>
        </div>
      </div>
  
      {/* Display Actual Savings */}
      <div style={{ fontSize: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Actual Savings</span>
          <span style={{ color: actualSavingsColor }}>
            ${parseFloat(actualSavings).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
  
};

export default BudgetProgress;
