require('dotenv').config();

const { Polly } = require("@aws-sdk/client-polly");
const { getSynthesizeSpeechUrl } = require("@aws-sdk/polly-request-presigner");

const client = new Polly({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

const speechParams = {
  OutputFormat: "mp3",
  Text: "I Am a Fish",  // Default text
  TextType: "text",
  VoiceId: "Matthew",
};

const speakText = async () => {
  try {
    let url = await getSynthesizeSpeechUrl({
      client,
      params: speechParams,
    });
    console.log(url);  // Log the URL to verify correctness
    return url;
  } catch (err) {
    console.log("Error", err);
    throw new Error("Failed to generate speech URL");
  }
};

// Call the speakText function when the script is executed
speakText();
