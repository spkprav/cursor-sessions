const OpenAI = require('openai');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Load environment variables
const OPENAI_KEY = process.env.OPENAI_KEY;
const MP3_FILE_PATH = path.resolve(__dirname, 'Monologue.mp3');

// Configure OpenAI API clients
const openai = new OpenAI({
  apiKey: OPENAI_KEY,
});

// Function to convert mp3 to transcript using OpenAI Whisper
async function convertMp3ToTranscript(filePath) {
  const response = await openai.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: 'whisper-1'
  });

  return response.text;
}

// Function to extract valuable information using GPT-4
async function extractInformationFromTranscript(transcript) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: `Extract valuable information from the following transcript:\n\n${transcript}` }],
    max_tokens: 150
  });

  return response.choices[0].message.content.trim();
}

// Main function to run the application
async function main() {
  try {
    const transcript = await convertMp3ToTranscript(MP3_FILE_PATH);
    console.log('Transcript:', transcript);

    const valuableInfo = await extractInformationFromTranscript(transcript);
    console.log('Valuable Information:', valuableInfo);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
