import { kv } from '@vercel/kv';

export default async function handler(request, response) {
    const POLL_KEY = 'teletool_waitlist_count';

    try {
        if (request.method === 'GET') {
            const count = await kv.get(POLL_KEY) || 124; // Fallback to initial seed
            return response.status(200).json({ count: Number(count) });
        }

        if (request.method === 'POST') {
            const { action } = request.body;
            if (action === 'vote') {
                const newCount = await kv.incr(POLL_KEY);
                return response.status(200).json({ count: Number(newCount) });
            }
            return response.status(400).json({ error: 'Invalid action' });
        }

        return response.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('KV Error:', error);
        // Fallback for when KV isn't configured yet
        return response.status(200).json({ count: 124, warning: 'KV not configured' });
    }
}
