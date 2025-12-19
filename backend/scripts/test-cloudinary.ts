import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('Testing Cloudinary Connection...');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key Present:', !!process.env.CLOUDINARY_API_KEY);
console.log('API Secret Present:', !!process.env.CLOUDINARY_API_SECRET);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

(async () => {
    try {
        // Attempt a ping (search with limit 1)
        console.log('Attempting to fetch resource...');
        const result = await cloudinary.api.resources({ max_results: 1 });
        console.log('SUCCESS: Cloudinary connection established!');
        console.log('Rate Limit Remaining:', result.rate_limit_remaining);
    } catch (error: any) {
        console.error('FAILURE: Cloudinary connection failed.');
        console.error('Error Code:', error.http_code || 'Unknown');
        console.error('Message:', error.message);
        if (error.http_code === 401) {
            console.error('>>> DIAGNOSIS: 401 Unauthorized means your API Key or Secret is wrong.');
        }
    }
})();
