import { createClient } from "redis";
let connect;
const redisClient = createClient();
if (!connect) {
  redisClient.connect().then(() => {
    console.log("redis connected");
    connect = true;
  });
}
export { redisClient };
