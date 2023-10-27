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
const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;
const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);
const randToken = require('rand-token');
const dotenv = require('dotenv');
dotenv.config();
// Tạo mới  access token
exports.CreateToken = (payload, seret_key, token_life) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield sign({
            payload,
        }, seret_key, {
            algorithm: 'HS256',
            expiresIn: token_life,
        });
        return token;
    }
    catch (error) {
        console.log(`Error in generate access token: ${error}`);
        return null;
    }
});
// Tạo giải mã access token
exports.DecodeToken = (token, seret_key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield verify(token, seret_key, {
            ignoreExpiration: true,
        });
    }
    catch (error) {
        console.log(`Error in decode access token: ${error}`);
        return false;
    }
});
// Kiểm tra access token
exports.VerifyToken = (token, seret_key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield verify(token, seret_key);
    }
    catch (error) {
        console.log(`Error in verify access token: ${error}`);
        return false;
    }
});
// Tạo mới refresh token
exports.CreateRefreshToken = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return randToken.generate(process.env.REFRESH_TOKEN_SIZE);
    }
    catch (error) {
        console.log(`Error in generate refresh token: ${error}`);
        return null;
    }
});
