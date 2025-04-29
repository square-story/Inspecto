import { createClient } from "redis";
import appConfig from "./app.config";

const redisClient = createClient({
    url: `redis://${appConfig.redisHost}:${appConfig.redisPort}`,
    socket: {
        reconnectStrategy: (retries) => {
            // Maximum retry delay is 10 seconds
            return Math.min(retries * 50, 10000);
        }
    }
})

redisClient.on("error", (err) => console.error("Redis Client Error", err));

// Connect with retry logic
const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (error) {
        console.error('Failed to connect to Redis, retrying in 5 seconds...', error);
        setTimeout(connectRedis, 5000);
    }
};

connectRedis();

export default redisClient;