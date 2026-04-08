import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://alumni-engagement-and-activity-report.onrender.com';
const WARMUP_URL = `${API_BASE_URL}/health`;

/**
 * Pings the backend to wake it up from Render's free tier sleep.
 */
export const warmupBackend = async () => {
    try {
        console.log('Warming up backend...');
        await axios.get(WARMUP_URL);
        console.log('Backend is awake!');
    } catch (error) {
        console.warn('Backend warmup ping failed (it might still be sleeping or starting up):', error.message);
    }
};
