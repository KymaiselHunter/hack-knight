import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import BudgetProgress from './components/BudgetChart';
import './App.css';

function App() {
  // Amazon product state
  const [tabURL, setTabURL] = useState();
  const [productName, setProductName] = useState();
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [isAmazonProductPage, setIsAmazonProductPage] = useState(false);

  // GPT state
  const [chatResponse, setChatResponse] = useState("No GPT");

  // Nessie state
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [currentAccounts, setCurrentAccounts] = useState([]);
  const [currentTotalDeposit, setCurrentTotalDeposit] = useState(0);
  const [currentSaved, setCurrentSaved] = useState(0);
  const [spentNeeds, setSpentNeeds] = useState(0);
  const [spentWants, setSpentWants] = useState(0);
  
  const [essentialBudget, setEssentialBudget] = useState(0);
  const [nonEssentialBudget, setNonEssentialBudget] = useState(0);

  // const [allCustomers, setAllCustomers] = useState([]);

  
  // Chrome extension: get Amazon product details
  useEffect(() => {
    if(currentCustomer == null)
    {
      grabNewCustomer("67cb4ca29683f20dd518d06c")
      console.log('Customer:', currentCustomer);
      console.log('Accounts:', currentAccounts);
      console.log('Total deposits:', currentTotalDeposit);
      console.log('Spent (needs):', spentNeeds);
      console.log('Spent (wants):', spentWants);
      console.log('Saved:', currentSaved);
    }
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const url = tabs[0].url;
        setTabURL(url);

        if (url.includes("amazon.com") && (url.includes("/dp/") || url.includes("/gp/product/"))) {
          setIsAmazonProductPage(true);

          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => {
              const getText = (selector) => {
                const el = document.querySelector(selector);
                return el ? el.innerText.trim() : null;
              };
              const title = getText("#productTitle") || "No product title found";
              const description = getText("#productDescription") ||
                                  getText("#feature-bullets") ||
                                  getText("#productOverview_feature_div") ||
                                  "No description available";
              const price = getText("#priceblock_ourprice") ||
                            getText("#priceblock_dealprice") ||
                            getText(".a-price .a-offscreen") ||
                            "Price not found";
              return { title, description, price };
            }
          }, (results) => {
            if (results && results[0] && results[0].result) {
              setProductName(results[0].result.title);
              setProductDescription(results[0].result.description);
              setProductPrice(results[0].result.price);
              callGPT();
            }
          });
        } else {
          setIsAmazonProductPage(false);
        }
      }
    });
  }, []);
  
  
  useEffect(() => {
    callGPT();
  }, [currentCustomer]);
  

  // --- GPT Function ---
  async function callGPT() {
    const userPrompt = `I make ${currentTotalDeposit} per month. I found a product called '${productName}' on Amazon costing ${productPrice}. The description says: '${productDescription}'.
      Here's my budget breakdown:
      - Essential Budget: ${essentialBudget} (Spent: ${spentNeeds})
      - Non-Essential Budget: ${nonEssentialBudget} (Spent: ${spentWants})
      Is this an essential item or not? Should I buy this based on my budget? Please give a short answer (max 4 sentences)`;

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt })
      });

      const data = await response.json();
      if (data.aiResponse) {
        console.log('AI response:', data.aiResponse);
        setChatResponse(data.aiResponse);
      } else {
        console.error('Error from server:', data.error);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }

  // --- Nessie "get" functions: they return data directly ---
  async function getNessieCustomers() {
    try {
      const response = await fetch('http://localhost:3001/api/nessie/customers', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data.customers || [];
    } catch (err) {
      console.error('Fetch error (customers):', err);
      return [];
    }
  }

  async function getNessieCustomer(customerID) {
    try {
      const response = await fetch(`http://localhost:3001/api/nessie/customers/${customerID}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data.customer || null;
    } catch (err) {
      console.error('Fetch error (customer):', err);
      return null;
    }
  }

  async function getNessieAccounts(customerID) {
    try {
      const response = await fetch(`http://localhost:3001/api/nessie/customers/${customerID}/accounts`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data.accounts || [];
    } catch (err) {
      console.error('Fetch error (accounts):', err);
      return [];
    }
  }

  async function getNessieDeposits(accountID) {
    try {
      const response = await fetch(`http://localhost:3001/api/nessie/accounts/${accountID}/deposits`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data.deposits || [];
    } catch (err) {
      console.error('Fetch error (deposits):', err);
      return [];
    }
  }

  async function getNessiePurchases(accountID) {
    try {
      const response = await fetch(`http://localhost:3001/api/nessie/accounts/${accountID}/purchases`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data.purchases || [];
    } catch (err) {
      console.error('Fetch error (purchases):', err);
      return [];
    }
  }

  // Helper: reset local state
  function resetCustomerData() {
    setCurrentTotalDeposit(0);
    setCurrentSaved(0);
    setSpentNeeds(0);
    setSpentWants(0);
    setCurrentAccounts([]);
    setCurrentCustomer(null);

    setEssentialBudget(0)
    setNonEssentialBudget(0)
  }

  // --- Master function: fetch customer info, accounts, deposits & purchases, then calculate totals ---
  async function grabNewCustomer(customerID) {
    try { 
      resetCustomerData();

      // 1. Fetch the customer and accounts
      const customer = await getNessieCustomer(customerID);
      const accounts = await getNessieAccounts(customerID);

      // 2. Prepare local counters
      let totalDeposits = 0;
      let totalSpentNeeds = 0;
      let totalSpentWants = 0;
      let totalPurchases = 0;

      // 3. Loop through each account and fetch deposits and purchases
      for (const account of accounts) {
        const deposits = await getNessieDeposits(account._id);
        deposits.forEach(d => {
          totalDeposits += d.amount;
        });

        const purchases = await getNessiePurchases(account._id);
        purchases.forEach(p => {
          totalPurchases += p.amount;
          if (p.description.includes('essential')) {
            totalSpentNeeds += p.amount;
          } else if (p.description.includes('non-essential')) {
            totalSpentWants += p.amount;
          }
        });
      }

      // 4. Calculate the "saved" amount (total deposits minus total purchases)
      const saved = totalDeposits - totalPurchases;

      const eb = totalDeposits *.5
      const neb = totalDeposits * .3

      // 5. Update React state once with all the data
      setCurrentCustomer(customer);
      setCurrentAccounts(accounts);
      setCurrentTotalDeposit(totalDeposits);
      setCurrentSaved(saved);
      setSpentNeeds(totalSpentNeeds);
      setSpentWants(totalSpentWants);

      setEssentialBudget(eb)
      setNonEssentialBudget(neb)

      console.log('Customer:', customer);
      console.log('Accounts:', accounts);
      console.log('Total deposits:', totalDeposits);
      console.log('Spent (needs):', totalSpentNeeds);
      console.log('Spent (wants):', totalSpentWants);
      console.log('Saved:', saved);
    } catch (error) {
      console.error('Error in grabNewCustomer:', error);
    }
  }

  // useEffect(() => {
  //   async function loadCustomers() {
  //     const customers = await getNessieCustomers();  // Assuming getNessieCustomers() is defined and returns an array
  //     setAllCustomers(customers);
  //   }
  //   loadCustomers();
  // }, []);

  // --- UI Rendering ---
  return (
    <>
      <BudgetProgress currentTotalDeposit={currentTotalDeposit} spentNeeds={spentNeeds} spentWants={spentWants} />
      <div>
        <ChatBot chatResponse={chatResponse}></ChatBot>
      </div>

    </>
  );
}

// // New CustomerList component
// function CustomerList({ customers, onSelectCustomer }) {
//   return (
//     <div style={{ margin: '20px 0' }}>
//       <h2>Customers</h2>
//       <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//         {customers.map(customer => (
//           <div
//             key={customer._id}
//             style={{
//               border: '1px solid #ccc',
//               borderRadius: '4px',
//               padding: '8px',
//               cursor: 'pointer',
//               width: '100%',
//               //backgroundColor: '#f9f9f9'
//             }}
//             onClick={() => onSelectCustomer(customer._id)}
//           >
//             {customer.name}dssgfs
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


function ChatBot(props) {
  return (
    <>
      <p>{props.chatResponse}</p>
    </>
  );
}

export default App;
