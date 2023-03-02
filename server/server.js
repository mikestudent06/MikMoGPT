import * as dotenv from "dotenv";
//This line above imports the dotenv library, which allows us to load environment variables from a .env file.

import cors from 'cors';
//This line above imports the cors middleware, which allows Cross-Origin Resource Sharing (CORS) between different domains.

import { Configuration, OpenAIApi } from 'openai';
//This line above imports the Configuration and OpenAIApi classes from the openai library. These classes will be used to interact with the OpenAI API.

import express from "express";
//This above is our backend framework express

dotenv.config();
//This line above loads environment variables from a .env file located in the root directory of the project.

// Creating a new OpenAI configuration object with API key from environment variables
const openAiKey = "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";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
console.log( process.env.OPENAI_API_KEY);
// Creating a new OpenAI API object with the provided configuration
const openai = new OpenAIApi(configuration);

// Creating a new Express application
const app = express();

//Middlewares:
// Enabling CORS (Cross-Origin Resource Sharing) middleware to allow access from other domains
app.use(cors());

// Parsing JSON bodies from incoming requests, this allows us to parse JSON from front-end to the backend
app.use(express.json());

//Routes
// Creating a route for handling HTTP GET requests at the root URL '/'
app.get('/', async (req, res) => {
  // Sending a JSON response with a simple greeting message
  res.status(200).send({
    message: 'Hello from MikMoGPT'
  })
})

// Creating a route for handling HTTP POST requests at the root URL '/'
app.post('/', async (req, res) => {
  try {
    // Extracting the 'prompt' field from the JSON body of the request
    const prompt = req.body.prompt;

    // Sending the prompt to the OpenAI API and awaiting the response
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0.7,
      max_tokens: 64,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // Extracting the generated text from the response and sending it back as the bot's response
    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    // Handling any errors that occur during the API request or response
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

// Starting the Express app and listening for incoming requests on port 5000
app.listen(5000, () => console.log('AI server started on http://localhost:5000'))

// // Overall, this code sets up an HTTP server using the Express framework,
// which responds to HTTP GET and POST requests at the root URL /.
// The GET request returns a simple greeting message, while the POST
//  request sends a prompt to the OpenAI API to generate text using
//   a pre-trained language model.
// The generated text is then sent back as the bot's response in the HTTP response body.