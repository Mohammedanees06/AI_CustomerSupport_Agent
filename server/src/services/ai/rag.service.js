import Knowledge from "../../models/Knowledge.model.js";

/**
 * Simple cosine similarity
 */
const cosineSimilarity = (a, b) => {
  if (!a || !b || a.length !== b.length) {
    console.warn("Invalid embeddings for similarity calculation");
    return 0;
  }
  
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  
  if (magA === 0 || magB === 0) return 0;
  
  return dot / (magA * magB);
};

/**
 * Find most relevant business knowledge
 */
export const findRelevantKnowledge = async (businessId, queryEmbedding, topK = 3) => {
  try {
    console.log(`🔍 Searching knowledge base for business: ${businessId}`);

    // 1️⃣ Get all knowledge for this business
    const documents = await Knowledge.find({ business: businessId });

    if (!documents || documents.length === 0) {
      console.log("❌ No knowledge base found for this business");
      return "No business information available. Please ask the business owner to upload knowledge base documents.";
    }

    console.log(`✅ Found ${documents.length} knowledge documents`);

    // 2️⃣ Rank by similarity
    const ranked = documents
      .filter(doc => doc.embedding && doc.embedding.length > 0)
      .map(doc => ({
        title: doc.title || "Untitled",
        content: doc.content,
        score: cosineSimilarity(queryEmbedding, doc.embedding)
      }))
      .filter(doc => doc.score > 0); // Remove invalid scores

    if (ranked.length === 0) {
      console.log("❌ No valid embeddings found");
      return "Knowledge base exists but embeddings are missing. Please re-upload documents.";
    }

    // 3️⃣ Sort highest score first
    ranked.sort((a, b) => b.score - a.score);

    // Log top matches
    console.log("📊 Top matches:");
    ranked.slice(0, topK).forEach((doc, i) => {
      console.log(`  ${i + 1}. ${doc.title} (score: ${doc.score.toFixed(3)})`);
    });

    // 4️⃣ Check if best match meets threshold
    const threshold = 0.3; // Lowered from 0.0 (adjust based on your needs)
    
    if (ranked[0].score < threshold) {
      console.log(`⚠️ Best match score ${ranked[0].score.toFixed(3)} below threshold ${threshold}`);
      return "I couldn't find relevant information in our knowledge base for your question.";
    }

    // 5️⃣ Return top K matches as formatted context
    const topMatches = ranked.slice(0, topK);
    
    const context = topMatches
      .map(doc => `**${doc.title}** (Relevance: ${(doc.score * 100).toFixed(1)}%)\n${doc.content}`)
      .join('\n\n---\n\n');

    console.log(`✅ Returning ${topMatches.length} relevant documents`);
    
    return context;

  } catch (error) {
    console.error("❌ Error finding relevant knowledge:", error);
    return "Error retrieving business information. Please try again.";
  }
};