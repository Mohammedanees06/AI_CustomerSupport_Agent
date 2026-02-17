import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function checkModels() {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    );
    
    if (!response.ok) {
      console.error(`Error: ${response.status} ${response.statusText}`);
      return;
    }
    
    const data = await response.json();
    console.log("Available models:\n");
    
    data.models.forEach(model => {
      console.log(`Model: ${model.name}`);
      console.log(`Display Name: ${model.displayName}`);
      console.log(`Supported methods: ${model.supportedGenerationMethods?.join(', ')}`);
      console.log('---');
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
}

checkModels();