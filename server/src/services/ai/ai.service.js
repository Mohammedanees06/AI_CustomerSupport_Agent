import { GoogleGenerativeAI } from "@google/generative-ai";

export const getAIReply = async (message, context, conversationHistory = []) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({
    model: "models/gemini-2.5-flash",
  });

  // Build conversation history
  const historyContext = conversationHistory.length > 0
    ? conversationHistory.map(msg => 
        `${msg.role === 'user' ? 'Customer' : 'Assistant'}: ${msg.content}`
      ).join('\n')
    : '';

  const prompt = `
You are a helpful customer support assistant for a business.

BUSINESS KNOWLEDGE BASE:
${context || "No business information available."}

${historyContext ? `CONVERSATION HISTORY:\n${historyContext}\n` : ''}

CURRENT CUSTOMER QUESTION:
${message}

INSTRUCTIONS:
- Answer ONLY using the business knowledge base provided above
- Be friendly, professional, and concise
- If the answer is not in the knowledge base, politely say: "I don't have that information in our knowledge base. Let me connect you with a human agent who can help."
- Do not make up or assume information
- Stay on topic and helpful
`;

  console.log("Gemini prompt:\n", prompt);

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    console.log("Gemini response:", response);
    
    return response;
  } catch (error) {
    console.error("Error generating AI reply:", error);
    
    // Handle rate limiting
    if (error.status === 429) {
      throw new Error("Rate limit exceeded. Please try again in a moment.");
    }
    
    throw new Error(`AI generation failed: ${error.message}`);
  }
};