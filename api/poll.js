import { createClient } from 'redis';

let redis;

async function getRedis() {
    if (!redis) {
        redis = createClient({
            url: process.env.REDIS_URL
        });

        redis.on('error', (err) => {
            console.error('Redis Client Error', err);
        });

        await redis.connect();
    }

    return redis;
}

export default async function handler(req, res) {

    try {

        const client = await getRedis();

        const key = "teletool_waitlist_count";

        if (req.method === "GET") {

            let count = await client.get(key);

            if (!count) {
                await client.set(key, 124);
                count = 124;
            }

            return res.status(200).json({
                count: Number(count)
            });
        }

        if (req.method === "POST") {

            const count = await client.incr(key);

            return res.status(200).json({
                count: Number(count)
            });
        }

        return res.status(405).json({
            error: "Method not allowed"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: error.message
        });
    }
}
