import { GoogleGenerativeAI } from "@google/generative-ai";

export const createEmbedding = async (text) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Use the correct embedding model from your available models
    const model = genAI.getGenerativeModel({ 
      model: "models/gemini-embedding-001" 
    });
    
    const result = await model.embedContent(text);
    
    return result.embedding.values;
  } catch (error) {
    console.error('Error creating embedding:', error);
    throw new Error(`Failed to create embedding: ${error.message}`);
  }
};