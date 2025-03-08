import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const colorButton = async () => {
    let [tab] = await chrome.tabs.query({active: true});
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      func: () => {
        alert('fdsoigjodg')
      }
    });
  }

  const [tabURL, setTabURL] = useState()
  const [productName, setProductName] = useState()
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [isAmazonProductPage, setIsAmazonProductPage] = useState(false);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const url = tabs[0].url;
        setTabURL(url);

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
        // Use data.aiResponse in your UI
      } else {
        console.error('Error from server:', data.error);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }

  const [chatResponse, setChatResponse] = useState("No GPT")
  
  return (
    <>
      <div>
        <ChatBot chatResponse={chatResponse}></ChatBot>
      </div>
      <h1>======</h1>

      <button onClick={callGPT}>
        activate gpt
      </button>

      <AmazonItem 
        isAmazonProductPage={isAmazonProductPage}
        productName={productName} 
        productDescription={productDescription} 
        productPrice={productPrice}>
      </AmazonItem>
      <div className="card">

        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
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

function AmazonItem(props)
{
  const productMessage = 
  <>
    <h1>product detected</h1>
    <ul>
      {[props.productName, props.productDescription, props.productPrice].map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  
  </>

  const noProductMessage = <h1>no product detected</h1>
  return(props.isAmazonProductPage ? productMessage : noProductMessage )
}

export default App
