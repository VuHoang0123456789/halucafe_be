import { Request } from 'express';
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');
const cloudinary = require('../../config/cloudinary/index');

dotenv.config();

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req: Request, file: any) => {
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1e9);
        const filenamePrefix = file.originalname.split('.')[0];
        const filenameSuffixes = file.originalname.split('.')[1];

        const filename = `${filenamePrefix}_${uniqueSuffix}.${filenameSuffixes}`;

        return {
            folder: 'dev',
            resource_type: 'auto',
            public_id: filename,
            raw_convert: 'google_speech',
        };
    },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
