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
require("dotenv/config");
const { VerifyToken } = require('./authMethods');
exports.auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const typeLogin = req.query.type_login;
        const token = req.header('access_token') || undefined;
        // if (!token) return res.status(401).json({ content: 'Không tin thấy acccess token!' });
        // if (typeLogin === 'facebook') {
        //     const resData = await axios.get(`https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`);
        //     req.body = {
        //         email: resData.data.email,
        //         showName: resData.data.name,
        //         passWord: '',
        //     };
        // } else if (typeLogin === 'google') {
        //     const resData = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
        //     req.body = {
        //         email: resData.data.email,
        //         showName: resData.data.name,
        //         passWord: '',
        //     };
        // } else {
        //     const isValid = await VerifyToken(token, process.env.SERERT_KEY_ACCESS_TOKEN);
        //     if (!isValid) {
        //         return res.status(403).json({ content: 'Access token không hợp lệ!' });
        //     }
        //     req.body.email = isValid.payload.email;
        // }
        const isValid = yield VerifyToken(token, process.env.SERERT_KEY_ACCESS_TOKEN);
        if (!isValid) {
            return res.status(403).json({ content: 'Access token không hợp lệ!' });
        }
        req.body.email = isValid.payload.email;
        return next();
    }
    catch (error) {
        console.log(`Error in authMiddleware: ${error}`);
        return res.json({
            error: error,
        });
    }
});
