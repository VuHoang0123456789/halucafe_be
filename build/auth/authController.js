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
const { CreateToken, DecodeToken, VerifyToken } = require('./authMethods');
const AccountModel = require('../app/model/account');
class AuthController {
    RefreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accessToken = req.body.access_token; //access token cũ
                const refreshToken = req.body.refresh_token; //refresh token người dùng gửi lên
                //kiểm tra token có hợp lệ không
                const isValidToken = yield DecodeToken(accessToken, process.env.SERERT_KEY_ACCESS_TOKEN);
                if (!isValidToken)
                    return res.status(400).json({ msg: 'Access token không hợp lệ!' });
                //kiểm tra refresh token xem có đúng không
                const isRefreshToken = yield AccountModel.GetAccountByRereshToken(refreshToken);
                if (!isRefreshToken)
                    return res.status(400).json({ msg: 'Refresh token không hợp lệ!' });
                //Kiểm tra token hết hạn chưa nếu chưa trả về token cũ
                const isTokenExp = yield VerifyToken(accessToken, process.env.SERERT_KEY_ACCESS_TOKEN);
                if (isTokenExp) {
                    return res.status(200).json({ access_token: accessToken });
                }
                //Tạo mới access token
                const payload = {
                    email: isValidToken.payload.email,
                };
                const newAccessToken = yield CreateToken(payload, process.env.SERERT_KEY_ACCESS_TOKEN, process.env.TOKEN_LIFE);
                if (!newAccessToken)
                    return res.status(500).json({ msg: 'Tạo mới  access token không thành công, vui lòng thử lại' });
                const d = new Date();
                res.cookie('_user', newAccessToken, { maxAge: d.getTime() + 10 * 24 * 60 * 60 * 1000 });
                return res.status(200).json({ access_token: newAccessToken });
            }
            catch (error) {
                console.log(`Error in authController/RefreshToken: ${error}`);
                return res.status(500).json(error);
            }
        });
    }
}
module.exports = new AuthController();
