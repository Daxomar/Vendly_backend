
// database/reddis.js
import { Redis } from '@upstash/redis'
import { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } from '../config/env.js';    

const redis = new Redis({
    url: UPSTASH_REDIS_REST_URL,
    token: UPSTASH_REDIS_REST_TOKEN,
})

await redis.set("foo", "bar");
await redis.get("foo");

export default redis;  // <- Add this line