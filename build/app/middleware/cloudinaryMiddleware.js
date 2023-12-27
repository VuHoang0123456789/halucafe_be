"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');
const cloudinary = require('../../config/cloudinary/index');
dotenv.config();
const storage = new CloudinaryStorage({
    cloudinary,
    params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
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
    }),
});
const uploadCloud = multer({ storage });
module.exports = uploadCloud;
