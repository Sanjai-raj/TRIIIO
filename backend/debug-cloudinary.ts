import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import streamifier from 'streamifier';

// Load env from current directory
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const uploadFromBuffer = (buffer: Buffer): Promise<any> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'products' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
};

async function run() {
    try {
        // Use an absolute path or relative to backend root
        const filePath = 'C:\\Users\\sanja\\OneDrive\\Desktop\\TRIIIO\\frontend\\public\\logo.png';
        if (!fs.existsSync(filePath)) {
            console.error("File not found:", filePath);
            return;
        }
        const buffer = fs.readFileSync(filePath);
        console.log("Starting upload of logic.png...");
        console.log("Cloud Config:", {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            key_present: !!process.env.CLOUDINARY_API_KEY
        });

        const result = await uploadFromBuffer(buffer);
        console.log("--- CLOUDINARY RESULT ---");
        // Write to file to avoid console encoding issues
        fs.writeFileSync('cloudinary-result.json', JSON.stringify(result, null, 2));
        console.log("Result written to cloudinary-result.json");
    } catch (e) {
        console.error("Upload Error:", e);
    }
}

run();
