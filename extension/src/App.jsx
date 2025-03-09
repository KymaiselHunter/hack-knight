import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'


import BudgetProgress from './components/BudgetChart';

import './App.css'

function App() {
  const [tabURL, setTabURL] = useState()
  const [productName, setProductName] = useState()
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [isAmazonProductPage, setIsAmazonProductPage] = useState(false);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const url = tabs[0].url;
        setTabURL(url);//dont really need this? do i remove?

        if (url.includes("amazon.com") && (url.includes("/dp/") || url.includes("/gp/product/"))) {
          setIsAmazonProductPage(true);

          // Run a script inside the Amazon page to get product details
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => {
              const getText = (selector) => {
                const el = document.querySelector(selector);
                return el ? el.innerText.trim() : null;
              };

              const title = getText("#productTitle") || "No product title found";

              // Try multiple locations for description
              const description = getText("#productDescription") ||
                                  getText("#feature-bullets") ||
                                  getText("#productOverview_feature_div") ||
                                  "No description available";

              // Get price from different possible locations
              const price = getText("#priceblock_ourprice") ||
                            getText("#priceblock_dealprice") ||
                            getText(".a-price .a-offscreen") ||
                            "Price not found";

              return { title, description, price};
            }
          }, (results) => {
            if (results && results[0] && results[0].result) {
              setProductName(results[0].result.title);
              setProductDescription(results[0].result.description);
              setProductPrice(results[0].result.price);
            }
          });

        } else {
          setIsAmazonProductPage(false);
        }
      }
    });
  }, []);


  const [chatResponse, setChatResponse] = useState("No GPT")
  async function callGPT() {
    try {
      // The user’s prompt (could come from an input field in your popup)
      const userPrompt = 'Hello, GPT from Chrome extension!';
  
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userPrompt })
      });
  
      const data = await response.json();
      if (data.aiResponse) {
        console.log('AI response:', data.aiResponse);
        setChatResponse(data.aiResponse)
      } else {
        console.error('Error from server:', data.error);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }
  const [currentCustomer, setCurrentCustomer] = useState("67cb4ca29683f20dd518d06c")
  const [customersData, setCustomersData] = useState([])
  const [currentAccounts, setCurrentAccounts] = useState([])
  const [currentDeposits, setCurrentDeposits] = useState([])
  const [currentPurchases, setCurrentPurchases] = useState([])
  
  const [currentTotalDeposit, setCurrentTotalDeposit] = useState(0)
  const [currentSaved, setCurrentSaved] = useState(0)

  function resetCustomerData()
  {
    setCurrentTotalDeposit(0)
    setCurrentSaved(0)
  }
  
  async function callNessieCustomers() {
    try {
      const response = await fetch('http://localhost:3001/api/nessie/customers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.customers) {
        console.log('Customers data:', data.customers);
        // Update your UI or state with the fetched customer data
        setCustomersData(data.customers);
      } else {
        console.error('No data returned from Nessie endpoint.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  } 
  

  async function callNessieAccounts(userID) {
    try {
      // Make sure you pass the ID in the URL, no body needed for a GET
      const response = await fetch(`http://localhost:3001/api/nessie/customers/${userID}/accounts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // If the server responded with an error (e.g., 500), handle it
      if (!response.ok) {
        console.error('Server error:', response.status, response.statusText);
        return;
      }

      const data = await response.json();
      if (data.accounts) {
        console.log('Accounts data:', data.accounts);
        setCurrentAccounts(data.accounts);
      } else {
        console.error('No data returned from Nessie endpoint.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }
  
  
  
    async function callNessieDeposits(accountID) {
      try {
        // Make sure you pass the ID in the URL, no body needed for a GET
        const response = await fetch(`http://localhost:3001/api/nessie/accounts/${accountID}/deposits`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        // If the server responded with an error (e.g., 500), handle it
        if (!response.ok) {
          console.error('Server error:', response.status, response.statusText);
          return;
        }
  
        const data = await response.json();
        if (data.deposits) {
          console.log('Deposits data:', data.deposits);
          setCurrentDeposits(data.deposits);
        } else {
          console.error('No data returned from Nessie endpoint.');
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
    }
  

async function callNessiePurchases(accountID) {
  try {
    const response = await fetch(`http://localhost:3001/api/nessie/accounts/${accountID}/purchases`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Server error:', response.status, response.statusText);
      return;
    }

    const data = await response.json();
    if (data.purchases) {
      console.log('Purchases data:', data.purchases);
      setCurrentPurchases(data.purchases);
    } else {
      console.error('No data returned from Nessie endpoint.');
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}


  return (
    <>
    
          <BudgetProgress />
      <div>
        <button onClick={()=>callNessieCustomers()}></button>
        <button onClick={()=>callNessieAccounts("67cb4ca29683f20dd518d06c")}></button>
        <button onClick={()=>callNessieDeposits("67cb5dd99683f20dd518d13b")}></button>
        <button onClick={()=>callNessiePurchases("67cb5dd99683f20dd518d13b")}></button>
      </div>
      <div>
        <ChatBot chatResponse={chatResponse}></ChatBot>
      </div>
      <h1>======</h1>

      <button onClick={callGPT}>
        activate gpt
      </button>
    </>
  )
}

function ChatBot(props)
{
  return(
    <>
       <h1>{props.chatResponse}</h1>
    </>
  )
}



export default App


//kyle's reference code
//const [count, setCount] = useState(0)

//const colorButton = async () => {
//  let [tab] = await chrome.tabs.query({active: true});
//  chrome.scripting.executeScript({
//    target: {tabId: tab.id},
//    func: () => {
//      alert('fdsoigjodg')
//    }
//  });
//}

