// server.js
require('dotenv').config();
const OpenAI = require('openai');

const express = require('express');
const cors = require('cors');

const fetch = require('node-fetch'); // This module lets Node.js make HTTP requests

//set up express
const app = express();
app.use(cors());
app.use(express.json());

// GPT Key
const OpenAI_Api = process.env.OPENAI_API_KEY || 'Mykey';

const openai = new OpenAI({
  apiKey: OpenAI_Api
});

//GPT posts
app.post('/api/chat', async (req, res) => {
  try {
      const { userPrompt } = req.body;
      const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: userPrompt }
      ],
    });
    res.json({ aiResponse: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



//Nessie Key
const nessieApiKey = process.env.NESSIE_API_KEY;
const nessieBaseUrl = 'http://api.nessieisreal.com';

//Nessie Gets
// Route to fetch account data from the Nessie API
app.get('/api/nessie/customers', async (req, res) => {
  try {
    // Build the URL with your API key as a query parameter
    const url = `${nessieBaseUrl}/customers?key=${nessieApiKey}`;
    // Use node-fetch to send a GET request to the Nessie API endpoint
    const response = await fetch(url);
    const data = await response.json();

    // Return the fetched data to the client
    res.json({customers: data});
  } catch (error) {
    // Handle any errors that occur during the fetch operation
    res.status(500).json({ error: error.message });
  }
});

// GET /api/nessie/customers/:id/accounts
app.get('/api/nessie/customers/:id/accounts', async (req, res) => {
  try {
    // Extract the customer ID from the route parameters
    const userID = req.params.id;

    // Build the Nessie URL with your API key
    // e.g., https://api.nessieisreal.com/customers/{id}/accounts?key=YOUR_KEY
    const url = `${nessieBaseUrl}/customers/${userID}/accounts?key=${nessieApiKey}`;

    // Fetch the accounts data from Nessie
    const response = await fetch(url);
    
    // If the remote service returned a non-2xx status, throw an error
    if (!response.ok) {
      throw new Error(`Nessie API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Return the fetched accounts data to the client
    res.json({ accounts: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// GET /api/nessie/customers/:id/accounts
app.get('/api/nessie/accounts/:id/deposits', async (req, res) => {
  try {
    // Extract the customer ID from the route parameters
    const accountID = req.params.id;

    // Build the Nessie URL with your API key
    // e.g., https://api.nessieisreal.com/customers/{id}/accounts?key=YOUR_KEY
    const url = `${nessieBaseUrl}/accounts/${accountID}/deposits?key=${nessieApiKey}`;

    // Fetch the accounts data from Nessie
    const response = await fetch(url);
    
    // If the remote service returned a non-2xx status, throw an error
    if (!response.ok) {
      throw new Error(`Nessie API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Return the fetched accounts data to the client
    res.json({ deposits: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// GET /api/nessie/accounts/:id/purchases
app.get('/api/nessie/accounts/:id/purchases', async (req, res) => {
  try {
    // Extract the account ID from the route parameters
    const accountID = req.params.id;
    
    // Build the Nessie URL (e.g., https://api.nessieisreal.com/accounts/{id}/purchases?key=YOUR_KEY)
    const url = `${nessieBaseUrl}/accounts/${accountID}/purchases?key=${nessieApiKey}`;

    // Fetch the purchases data from Nessie
    const response = await fetch(url);

    // If the remote service returned a non-2xx status, throw an error
    if (!response.ok) {
      throw new Error(`Nessie API request failed: ${response.status} ${response.statusText}`);
    }

    // Parse the JSON response from Nessie
    const data = await response.json();

    // Return the fetched purchases data to the client
    res.json({ purchases: data });
  } catch (error) {
    // Return a 500 if anything goes wrong
    res.status(500).json({ error: error.message });
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('Server listening on ' + PORT));


////Kyle's reference code
//// A map of "assistantStyle" => system messages
//const systemMessages = {
//  default: 'You are a helpful assistant.',
//  british: 'You are a helpful British assistant.',
//  // ...
//};

//app.post('/api/chat', async (req, res) => {
//  try {
//    const { userPrompt, assistantStyle } = req.body;

//    // If assistantStyle is not recognized, default to "default" or throw an error
//    const systemMessage = systemMessages[assistantStyle] || systemMessages.default;

//    const response = await openai.chat.completions.create({
//      model: 'gpt-3.5-turbo',
//      messages: [
//        { role: 'system', content: systemMessage },
//        { role: 'user', content: userPrompt }
//      ],
//    });

//    res.json({ aiResponse: response.choices[0].message.content });
//  } catch (error) {
//    res.status(500).json({ error: error.message });
//  }
//});

//async function callGPT(userPrompt, assistantStyle = 'default') {
//  try {
//    const response = await fetch('http://localhost:3001/api/chat', {
//      method: 'POST',
//      headers: {
//        'Content-Type': 'application/json'
//      },
//      body: JSON.stringify({ userPrompt, assistantStyle })
//    });

//    const data = await response.json();
//    if (data.aiResponse) {
//      console.log('AI response:', data.aiResponse);
//      // Optionally update your UI with the received response:
//      setChatResponse(data.aiResponse);
//    } else {
//      console.error('Error from server:', data.error);
//    }
//  } catch (err) {
//    console.error('Fetch error:', err);
//  }
//}