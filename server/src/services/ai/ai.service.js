import { GoogleGenerativeAI } from "@google/generative-ai";

export const getAIReply = async (
  message,
  context,
  conversationHistory = [],
) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({
    model: "models/gemini-2.5-flash",
  });

  // ✅ Build formatted conversation history
  const formattedHistory =
    conversationHistory.length > 0
      ? conversationHistory
          .map(
            (msg) =>
              `${msg.role === "user" ? "Customer" : "Assistant"}: ${msg.content}`,
          )
          .join("\n")
      : "";

  // ✅ If conversationHistory exists, do NOT duplicate message
  const fullConversation = formattedHistory
    ? `${formattedHistory}\nCustomer: ${message}`
    : `Customer: ${message}`;

  const prompt = `
You are a helpful customer support assistant for a business.

BUSINESS KNOWLEDGE BASE:
${context || "No business information available."}

CONVERSATION:
${fullConversation}

IMPORTANT:
Return your response strictly in JSON format like this:

{
  "answer": "your answer here",
  "confidence": 0.0 to 1.0
}

RULES:
- If the customer greets (hello, hi) or ends the conversation (bye, thank you, thanks), respond politely and naturally.
- For business-related questions, answer ONLY using the business knowledge base.
- If a business-related answer is not in the knowledge base, say:
  "I don't have that information in our knowledge base. Let me connect you with a human agent who can help."
- Keep greetings and closing responses short and friendly.
- Set confidence low (0.2–0.5) if unsure.
- Set confidence high (0.7–1.0) if confident.
- Do NOT return anything outside JSON.
`;

  console.log("Gemini prompt:\n", prompt);

  try {
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    console.log("Gemini raw response:", rawText);

    try {
      // Removes markdown formatting if Gemini adds it
      let cleaned = rawText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleaned);
      return parsed;
    } catch {
      return {
        answer: rawText,
        confidence: 0.5,
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
