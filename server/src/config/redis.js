import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null // REQUIRED FOR BULLMQ
});

redis.on("connect", () => {
  console.log("Redis connected");
  
  // Keep Upstash free tier alive (ping every 12 hours)
  setInterval(async () => {
    try {
      await redis.ping();
      console.log("Redis keepalive ping sent");
    } catch (err) {
      console.error("Redis keepalive failed:", err);
    }
  }, 1000 * 60 * 60 * 12);
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

export default redis;