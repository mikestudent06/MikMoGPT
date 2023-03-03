import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from 'openai';
import cors from 'cors';
import express from "express";
import axios from 'axios';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from MikMoGPT'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await axios({
      method: 'POST',
      url: 'https://api.openai.com/v1/engines/text-davinci-003/completions',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      data: {
        prompt: `${prompt}`,
        temperature: 0.7,
        max_tokens: 3000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      }
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error);
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log(`AI key ${process.env.OPENAI_API_KEY} server started on http://localhost:5000`));
