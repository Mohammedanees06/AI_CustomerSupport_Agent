import Knowledge from "../models/Knowledge.model.js";
import { createEmbedding } from "../services/ai/embedding.service.js";
import { chunkText } from "../utils/chunkText.js";
import { createRequire } from "module";
import axios from "axios";
import * as cheerio from "cheerio";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

/**
 * Helper: process text into chunks + embeddings + save
 */
const processAndStore = async (businessId, textContent) => {
  const chunks = chunkText(textContent);
  console.log("Total chunks created:", chunks.length);

  const knowledgeEntries = [];
  for (const chunk of chunks) {
    const embedding = await createEmbedding(chunk);
    knowledgeEntries.push({ business: businessId, content: chunk, embedding });
  }

  await Knowledge.insertMany(knowledgeEntries);
  return knowledgeEntries.length;
};

/**
 * ============================================
 * UPLOAD KNOWLEDGE (PDF or plain text)
 * ============================================
 */
export const uploadKnowledge = async (req, res) => {
  try {
    const { businessId, content } = req.body;

    if (!businessId) {
      return res.status(400).json({ message: "Business ID required" });
    }

    let textContent = content;

    if (req.file) {
      const pdfData = await pdf(req.file.buffer);
      textContent = pdfData.text;
    }

    if (!textContent) {
      return res.status(400).json({ message: "No content provided" });
    }

    const chunksStored = await processAndStore(businessId, textContent);

    res.json({ message: "Knowledge uploaded successfully", chunksStored });
  } catch (err) {
    console.error("Knowledge upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};

/**
 * ============================================
 * SCRAPE WEBSITE
 * ============================================
 */
export const scrapeWebsite = async (req, res) => {
  try {
    const { businessId, url } = req.body;

    if (!businessId || !url) {
      return res.status(400).json({ message: "Business ID and URL required" });
    }

    console.log("Scraping URL:", url);

    const response = await axios.get(url, {
      timeout: 10000,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; AI-Support-Bot/1.0)" },
    });

    const $ = cheerio.load(response.data);

    // Remove script, style, nav, footer tags
    $("script, style, nav, footer, header, noscript").remove();

    // Extract meaningful text
    const textContent = $("body").text().replace(/\s+/g, " ").trim();

    if (!textContent || textContent.length < 50) {
      return res.status(400).json({ message: "Could not extract meaningful content from URL" });
    }

    console.log("Extracted text length:", textContent.length);

    const chunksStored = await processAndStore(businessId, textContent);

    res.json({
      message: "Website scraped and stored successfully",
      url,
      chunksStored,
    });
  } catch (err) {
    console.error("Scrape error:", err.message);
    if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
      return res.status(400).json({ message: "Could not reach the URL. Please check it and try again." });
    }
    res.status(500).json({ message: "Scraping failed" });
  }
};

/**
 * ============================================
 * BULK FAQ UPLOAD
 * Format: Q: ... A: ... (one per line pair)
 * ============================================
 */
export const uploadFAQ = async (req, res) => {
  try {
    const { businessId, faqs } = req.body;

    // faqs = [{ question: "...", answer: "..." }]
    if (!businessId || !faqs || !Array.isArray(faqs) || faqs.length === 0) {
      return res.status(400).json({ message: "Business ID and FAQs array required" });
    }

    const knowledgeEntries = [];

    for (const faq of faqs) {
      if (!faq.question || !faq.answer) continue;

      const text = `Q: ${faq.question}\nA: ${faq.answer}`;
      const embedding = await createEmbedding(text);

      knowledgeEntries.push({
        business: businessId,
        content: text,
        embedding,
      });
    }

    if (knowledgeEntries.length === 0) {
      return res.status(400).json({ message: "No valid FAQ entries found" });
    }

    await Knowledge.insertMany(knowledgeEntries);

    res.json({
      message: "FAQs uploaded successfully",
      chunksStored: knowledgeEntries.length,
    });
  } catch (err) {
    console.error("FAQ upload error:", err);
    res.status(500).json({ message: "FAQ upload failed" });
  }
};

/**
 * ============================================
 * DELETE ALL KNOWLEDGE FOR A BUSINESS
 * ============================================
 */
export const clearKnowledge = async (req, res) => {
  try {
    const { businessId } = req.params;

    await Knowledge.deleteMany({ business: businessId });

    res.json({ message: "Knowledge base cleared successfully" });
  } catch (err) {
    console.error("Clear knowledge error:", err);
    res.status(500).json({ message: "Failed to clear knowledge base" });
  }
};