import dotenv from 'dotenv';
import { createClient } from 'redis';
dotenv.config();

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: 6379,
  },
});

redisClient.on('error', (err) => console.error('Redis error:', err));

(async () => {
  await redisClient.connect();
})();

export default redisClient;
