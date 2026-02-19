import { Queue, QueueEvents  } from "bullmq";
import redis from "../../config/redis.js";


/**
 * AI Queue
 * 
 * This queue stores all AI processing jobs.
 * Express adds jobs here.
 * Worker consumes jobs from here.
 */

export const aiQueue = new Queue("ai-processing", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
    removeOnComplete: true,
    removeOnFail: false
  }
});

// Queue events (for monitoring)
export const aiQueueEvents = new QueueEvents("ai-processing", {
  connection: redis
});
