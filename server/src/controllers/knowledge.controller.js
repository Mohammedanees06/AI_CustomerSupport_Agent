import Knowledge from "../models/Knowledge.model.js";
import { createEmbedding } from "../services/ai/embedding.service.js";

export const uploadKnowledge = async (req, res) => {
  try {
    const { businessId, content } = req.body;

    if (!businessId || !content) {
      return res.status(400).json({ message: "Business ID and content required" });
    }

    const embedding = await createEmbedding(content);

    await Knowledge.create({
      business: businessId,
      content,
      embedding
    });

    res.json({ message: "Knowledge uploaded successfully" });
  } catch (err) {
    console.error("Knowledge upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};
