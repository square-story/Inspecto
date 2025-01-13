import { createClient } from "redis";
import appConfig from "./app.config";

const redisClient = createClient({
    url: `redis://${appConfig.redisHost}:${appConfig.redisPort}`,
})

redisClient.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
    await redisClient.connect()
})();

export default redisClient;