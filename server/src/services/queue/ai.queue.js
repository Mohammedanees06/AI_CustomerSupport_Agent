import { Queue } from "bullmq";
import redis from "../config/redis.js";

/**
 * AI Queue
 * 
 * This queue stores all AI processing jobs.
 * Express adds jobs here.
 * Worker consumes jobs from here.
 */

import { Queue } from "bullmq";
import redis from "../config/redis.js";

export const aiQueue = new Queue("ai-processing", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3, // retry 3 times if failed
    backoff: {
      type: "exponential",
      delay: 2000, // wait before retry
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});
