//import dotenv from 'dotenv';
//import OpenAI from 'openai';


// server.js
//dotenv.config();
require('dotenv').config();
const OpenAI = require('openai');

const express = require('express');
const cors = require('cors');
//const { Configuration, OpenAIApi } = require('openai');
const OpenAI_Api = process.env.OPENAI_API_KEY || 'Mykey';

const openai = new OpenAI({
  apiKey: OpenAI_Api
});


const app = express();
app.use(cors());
app.use(express.json());

//const configuration = new Configuration({
//  apiKey: process.env.OPENAI_API_KEY,
//});
//const openai = new OpenAIApi(configuration);

//app.post('/api/chat', async (req, res) => {
//  try {
//    const { userPrompt } = req.body;
//    const response = await openai.createChatCompletion({
//      model: 'gpt-3.5-turbo',
//      messages: [
//        { role: 'system', content: 'You are a helpful assistant.' },
//        { role: 'user', content: userPrompt }
//      ],
//    });
//    res.json({ aiResponse: response.data.choices[0].message.content });
//  } catch (error) {
//    console.error(error);
//    res.status(500).json({ error: error.message });
//  }
//});
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
    //console.log(chatCompletion.choices[0].message);
  } catch (error) {
    //console.error('Error creating chat completion:', error);
    res.status(500).json({ error: error.message });
  }
});

//const createChatCompletion = async () => {
//  try {
//    const chatCompletion = await openai.chat.completions.create({
//      model: 'gpt-3.5-turbo',
//      messages: [
//        { role: 'system', content: 'You are a helpful assistant.' },
//        { role: 'user', content: userPrompt }
//      ],
//    });
//    console.log(chatCompletion.choices[0].message);
//  } catch (error) {
//    console.error('Error creating chat completion:', error);
//  }
//};

//createChatCompletion();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('Server listening on ' + PORT));
