import { useState, useEffect } from 'react';
import BudgetProgress from './components/BudgetChart';
import './App.css';

function App() {
  const [tabURL, setTabURL] = useState();
  const [productName, setProductName] = useState();
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [isAmazonProductPage, setIsAmazonProductPage] = useState(false);

  const [chatResponse, setChatResponse] = useState("Loading GPT Advice...");
  const [customersData, setCustomersData] = useState([]);

  useEffect(() => {
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
              const description = getText("#productDescription") || getText("#feature-bullets") || getText("#productOverview_feature_div") || "No description available";
              const price = getText("#priceblock_ourprice") || getText("#priceblock_dealprice") || getText(".a-price .a-offscreen") || "Price not found";

              return { title, description, price };
            }
          }, (results) => {
            if (results && results[0] && results[0].result) {
              setProductName(results[0].result.title);
              setProductDescription(results[0].result.description);
              setProductPrice(results[0].result.price);

              // Automatically call GPT once product is found
              callNessieCustomers().then(customer => {
                if (customer) {
                  callGPT(results[0].result.title, results[0].result.description, results[0].result.price, customer);
                }
              });
            }
          });

        } else {
          setIsAmazonProductPage(false);
        }
      }
    });
  }, []);

  async function callGPT(productName, productDescription, productPrice, customer) {
    const { paycheck, essentialBudget, nonEssentialBudget, spentEssential, spentNonEssential} = customer;

    const userPrompt = `I make ${paycheck} per month. I found a product called '${productName}' on Amazon costing ${productPrice}. The description says: '${productDescription}'.
      Here's my budget breakdown:
      - Essential Budget: ${essentialBudget} (Spent: ${spentEssential})
      - Non-Essential Budget: ${nonEssentialBudget} (Spent: ${spentNonEssential})
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

  async function callNessieCustomers() {
    try {
      const response = await fetch('http://localhost:3001/api/nessie/customers', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.customers) {
        console.log('Customers data:', data.customers);
        setCustomersData(data.customers);
        return data.customers[0]; // Return the first customer
      } else {
        console.error('No data returned from Nessie endpoint.');
        return null;
      }
    } catch (err) {
      console.error('Fetch error:', err);
      return null;
    }
  }

  return (
    <>
      <BudgetProgress />
      <div>
        <ChatBot chatResponse={chatResponse}></ChatBot>
      </div>
    </>
  );
}

function ChatBot(props) {
  return (
    <>
      <h2>AI Advisory</h2>
      <p>{props.chatResponse}</p>
    </>
  );
}

function AmazonItem(props) {
  const productMessage =
    <>
      <h1>Product Detected</h1>
      <ul>
        {[props.productName, props.productDescription, props.productPrice].map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </>;

  const noProductMessage = <h1>No Product Detected</h1>;

  return (props.isAmazonProductPage ? productMessage : noProductMessage);
}

export default App;
