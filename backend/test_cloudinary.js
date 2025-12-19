
import path from 'path';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('Testing Cloudinary Configuration...');
const cloudName = process.env.CLOUDINARY_CLOUD_NAME ? process.env.CLOUDINARY_CLOUD_NAME.trim() : '';
const apiKey = process.env.CLOUDINARY_API_KEY ? process.env.CLOUDINARY_API_KEY.trim() : '';
const apiSecret = process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.trim() : '';

console.log('Cloud Name:', cloudName);
console.log('API Key:', apiKey ? '*****' + apiKey.slice(-4) : 'MISSING');
console.log('API Secret:', apiSecret ? 'PRESENT' : 'MISSING');

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
});

const testFilePath = path.join(__dirname, 'test_image.txt');
fs.writeFileSync(testFilePath, 'This is a test file for Cloudinary upload verification.');

console.log('Attempting upload of test file:', testFilePath);

cloudinary.uploader.upload(testFilePath, { resource_type: 'raw', folder: 'test_uploads' }, (error, result) => {
    if (error) {
        console.error('❌ Upload Failed:', error);
        process.exit(1);
    } else {
        console.log('✅ Upload Success!');
        console.log('Public ID:', result.public_id);
        console.log('URL:', result.secure_url);

        // Clean up
        fs.unlinkSync(testFilePath);

        // Attempt deletion to be clean
        cloudinary.uploader.destroy(result.public_id, { resource_type: 'raw' }, (delErr, delRes) => {
            if (delErr) console.error('⚠️ Cleanup delete failed:', delErr);
            else console.log('🗑️ Cleanup delete success:', delRes);
            process.exit(0);
        });
    }
});
