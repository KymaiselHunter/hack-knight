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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('Server listening on ' + PORT));
