// server.js
require('dotenv').config();
const OpenAI = require('openai');

const express = require('express');
const cors = require('cors');

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


//TEMP MOCK CUSTOMER DATA
app.get('/api/nessie/customers', async (req, res) => {
  try {
    // Mock customer data since Nessie API has no data
    const mockCustomerData = [
      {
        firstName: 'John',
        lastName: 'Doe',
        paycheck: 2000,
        essentialBudget: 1000,
        nonEssentialBudget: 600,
        spentEssential: 700,
        spentNonEssential: 300
      }
    ];

    // Return mock data
    res.json({ customers: mockCustomerData });
  } catch (error) {
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

// GET /api/nessie/customers/:id
app.get('/api/nessie/customers/:id', async (req, res) => {
  try {
    // Extract the customer ID from the route parameters
    const customerID = req.params.id;

    // Build the Nessie URL (e.g., https://api.nessieisreal.com/customers/{id}?key=YOUR_KEY)
    const url = `${nessieBaseUrl}/customers/${customerID}?key=${nessieApiKey}`;

    // Fetch the customer data from Nessie
    const response = await fetch(url);

    // If the remote service returned a non-2xx status, throw an error
    if (!response.ok) {
      throw new Error(`Nessie API request failed: ${response.status} ${response.statusText}`);
    }

    // Parse the JSON response from Nessie
    const data = await response.json();

    // Return the fetched customer data to the client
    res.json({ customer: data });
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
