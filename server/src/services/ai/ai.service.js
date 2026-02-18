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

IMPORTANT:
Return your response strictly in JSON format like this:

{
  "answer": "your answer here",
  "confidence": 0.0 to 1.0
}

RULES:
- Answer ONLY using the business knowledge base
- If answer is not in knowledge base, say:
  "I don't have that information in our knowledge base. Let me connect you with a human agent who can help."
- Set confidence low (0.2–0.5) if unsure
- Set confidence high (0.7–1.0) if confident
- Do NOT return anything outside JSON
`;

  console.log("Gemini prompt:\n", prompt);

  try {
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    console.log("Gemini raw response:", rawText);

    // Try parsing JSON safely
    try {
      const parsed = JSON.parse(rawText);
      return parsed;
    } catch {
      // Fallback if Gemini doesn't return clean JSON
      return {
        answer: rawText,
        confidence: 0.5
      };
    }

  } catch (error) {
    console.error("Error generating AI reply:", error);

    if (error.status === 429) {
      throw new Error("Rate limit exceeded. Please try again in a moment.");
    }

    throw new Error(`AI generation failed: ${error.message}`);
  }
};
