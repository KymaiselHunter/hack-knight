// 1) Load environment variables from .env into process.env
require('dotenv').config(); 

// 2) Import the Express library for creating HTTP endpoints
const express = require('express');

// 3) Import cors (Cross-Origin Resource Sharing) to allow requests from your extension
const cors = require('cors');

// 4) Import the older usage of the openai library
const openai = require('openai');

// 5) Create an Express application
const app = express();

// 6) Apply the cors middleware so we can accept requests from different origins (like your Chrome extension)
app.use(cors());

// 7) Parse JSON request bodies automatically
app.use(express.json());

// 8) Set the API key from your .env file
openai.apiKey = process.env.OPENAI_API_KEY;

// 9) Define a POST endpoint at /api/chat for AI requests
app.post('/api/chat', async (req, res) => {
  try {
    // 9a) Extract "userPrompt" from the incoming JSON body
    const { userPrompt } = req.body;

    // 9b) Use the openai library to call ChatCompletion (ChatGPT style)
    const response = await openai.ChatCompletion.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: userPrompt }
      ],
    });

    // 9c) Extract the AI's text response
    const aiMessage = response.choices[0].message.content;

    // 9d) Send it back to the caller as JSON
    res.json({ aiResponse: aiMessage });
  } catch (error) {
    // 9e) On any error, log it and return an error message
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// 10) Choose a port from .env or default to 3001
const PORT = process.env.PORT || 3001;

// 11) Start the server listening
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
