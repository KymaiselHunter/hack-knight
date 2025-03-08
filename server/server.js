require('dotenv').config() // get my api keys

const express = require('express');
const cors = require('cors');

// Official OpenAI library (modern approach uses Configuration/OpenAIApi classes)
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const Configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(Configuration);

// Example endpoint to handle AI requests
app.post('/api/chat', async (req, res) => {
  try {
    const { userPrompt } = req.body;
    
    // Make a ChatCompletion request to GPT-3.5-turbo (or whichever model you prefer)
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: userPrompt }
      ]
    });

    // The AI's reply is typically in response.data.choices[0].message.content
    const aiMessage = response.data.choices[0].message.content;
    res.json({ aiResponse: aiMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});