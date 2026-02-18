import Knowledge from "../models/Knowledge.model.js";
import { createEmbedding } from "../services/ai/embedding.service.js";
import { chunkText } from "../utils/chunkText.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");// For extracting text from PDF

export const uploadKnowledge = async (req, res) => {
  try {
    const { businessId, content } = req.body;

    //  Business ID is mandatory
    if (!businessId) {
      return res.status(400).json({ message: "Business ID required" });
    }

    let textContent = content;

    //  If file uploaded via multer, extract text
    
    if (req.file) {
      const pdfData = await pdf(req.file.buffer);
      textContent = pdfData.text;
    }

    //  Ensure we have content to process
    if (!textContent) {
      return res.status(400).json({ message: "No content provided" });
    }

    //  Chunk the text (Production RAG improvement)
   
    const chunks = chunkText(textContent);

    console.log("Total chunks created:", chunks.length);

    const knowledgeEntries = [];

    //  Create embedding for EACH chunk
    
    for (const chunk of chunks) {
      const embedding = await createEmbedding(chunk);

      knowledgeEntries.push({
        business: businessId,
        content: chunk,
        embedding
      });
    }

   // Insert all chunks into DB
    await Knowledge.insertMany(knowledgeEntries);

    res.json({
      message: "Knowledge uploaded successfully",
      chunksStored: knowledgeEntries.length
    });

  } catch (err) {
    console.error("Knowledge upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};
