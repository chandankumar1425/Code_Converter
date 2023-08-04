const express = require("express");
require("dotenv").config();
const path = require('path');
const cors = require("cors");
const app = express();
const port = 7455;
app.use(express.json());
app.use(cors());
const { Configuration, OpenAIApi } = require("openai");
async function generateCompletion(input) {
  try {
    const prompt = input;
    const maxTokens = 500;
    const n = 1;
    const configuration = new Configuration({
        apiKey: process.env.openAi,
      });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: maxTokens,
        n: n
      });
    const { choices } = response.data;
    if (choices && choices.length > 0) {
      const completion = choices[0].text.trim();
      return completion
    } else {
      return false
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
app.post('/convert', async (req, res) => {
  try {
    const {code, language } = req.body;
    
    let response = await generateCompletion(`Convert the following code:-  ${code} to:\n${language} code. \n if the code is incorrect or not complate please make gusses and complate it.`);
    res.json({ response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});
app.post('/debug', async (req, res) => {
  try {
    const {code} = req.body;
    let response = await generateCompletion(`Debug the following code:-  ${code} \n please check if there is any error and also correct it. also if it's correct provide steps what code is doing and how we can improve it`);
    res.json({ response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});
app.post('/quality', async (req, res) => {
  try {
    const {code} = req.body;
    let response = await generateCompletion(`Check the quality of the following code:-  ${code} \n please provide detailed info and also provide some tips to improve. provide in points`);
    res.json({ response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/', (req, res) => {
    res.send("Welcome to code generator")
  });

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});