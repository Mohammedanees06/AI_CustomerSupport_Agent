/**
 * Split large text into smaller chunks
 * Default size: 800 characters
 * Overlap: 100 characters (improves retrieval quality)
 */
export const chunkText = (text, chunkSize = 800, overlap = 100) => {
  const chunks = [];

  let start = 0;

  while (start < text.length) {
    const end = start + chunkSize;
    chunks.push(text.slice(start, end));
    start += chunkSize - overlap;
  }

  return chunks;
};
