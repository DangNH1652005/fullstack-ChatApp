import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';

config();

cloudinary.config({
    cloud_name: process.env.CLOUDY_CLOUD_NAME,
    api_key: process.env.CLOUDY_API_KEY,
    api_secret: process.env.CLOUDY_API_SECRET,
});

export { cloudinary };