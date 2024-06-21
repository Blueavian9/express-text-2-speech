require('dotenv').config();
const cors = require("cors");
const express = require('express');
const { Polly } = require("@aws-sdk/client-polly");
const { getSynthesizeSpeechUrl } = require("@aws-sdk/polly-request-presigner");

const app = express();
const port = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

const client = new Polly({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

const speechParams = {
  OutputFormat: "mp3",
  Text: "Hello From Polly",  // Default text
  TextType: "text",
  VoiceId: "Matthew",
};

const speakText = async (text) => {
  try {
    let params = { ...speechParams, Text: text };
    let url = await getSynthesizeSpeechUrl({
      client,
      params,
    });
    console.log(url);  // Log the URL to verify correctness
    return url;
  } catch (err) {
    console.log("Error", err);
    throw new Error("Failed to generate speech URL");
  }
};

// Handle GET request for /



// Original get()
// app.get('/', async (req, res) => {
  //   const audioUrl = await speakText();
  //   res.send(`<audio controls src=${JSON.stringify(audioUrl)}></audio>`); // TODO: Change this line
  // });
  

  app.get('/', async (req, res) => {
    try {
      const audioUrl = await speakText("I Am a Fish, and hello Cesar");
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Text to Speech</title>
        </head>
        <body>
          <audio controls>
            <source src="${audioUrl}" type="audio/mpeg">
            Your browser does not support the audio element.
          </audio>
        </body>
        </html>
      `);
    } catch (err) {
      res.status(500).send("An error occurred while generating the speech URL.");
    }
  });
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  
