const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;
const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);
const randToken = require('rand-token');
const dotenv = require('dotenv');
dotenv.config();

// Tạo mới  access token
exports.CreateToken = async (payload: any, seret_key: string, token_life: string) => {
    try {
        const token = await sign(
            {
                payload,
            },
            seret_key,
            {
                algorithm: 'HS256',
                expiresIn: token_life,
            },
        );

        return token;
    } catch (error) {
        console.log(`Error in generate access token: ${error}`);
        return null;
    }
};

// Tạo giải mã access token
exports.DecodeToken = async (token: string, seret_key: string) => {
    try {
        return await verify(token, seret_key, {
            ignoreExpiration: true,
        });
    } catch (error) {
        console.log(`Error in decode access token: ${error}`);
        return false;
    }
};

// Kiểm tra access token
exports.VerifyToken = async (token: string, seret_key: string) => {
    try {
        return await verify(token, seret_key);
    } catch (error) {
        console.log(`Error in verify access token: ${error}`);
        return false;
    }
};

// Tạo mới refresh token
exports.CreateRefreshToken = async () => {
    try {
        return randToken.generate(process.env.REFRESH_TOKEN_SIZE);
    } catch (error) {
        console.log(`Error in generate refresh token: ${error}`);
        return null;
    }
};

export {};
