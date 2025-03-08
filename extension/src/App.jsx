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
              setAsin(results[0].result.asin);
            }
          });

        } else {
          setIsAmazonProductPage(false);
        }
      }
    });
  }, []);
  
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <h1>test {isAmazonProductPage ? "product" : "not product"}</h1>
      {isAmazonProductPage && 
      <ul>
        {[productName, productDescription, productPrice].map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
  }    
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={colorButton}>
          count is {count}
        </button>
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

export default App
