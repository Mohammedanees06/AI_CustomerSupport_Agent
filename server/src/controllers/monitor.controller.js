import { aiQueue } from "../services/queue/ai.queue.js";

/**
 * Get queue stats
 */
export const getQueueStats = async (req, res) => {
  try {
    const waiting = await aiQueue.getWaitingCount();
    const active = await aiQueue.getActiveCount();
    const completed = await aiQueue.getCompletedCount();
    const failed = await aiQueue.getFailedCount();

    res.json({
      waiting,
      active,
      completed,
      failed
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch queue stats" });
  }
};
