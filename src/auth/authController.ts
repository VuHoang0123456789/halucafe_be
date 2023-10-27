import { Request, Response } from 'express';
import 'dotenv/config';
const { CreateToken, DecodeToken, VerifyToken } = require('./authMethods');
const AccountModel = require('../app/model/account');

class AuthController {
    async RefreshToken(req: Request, res: Response) {
        try {
            const accessToken = req.body.access_token; //access token cũ
            const refreshToken = req.body.refresh_token; //refresh token người dùng gửi lên

            //kiểm tra token có hợp lệ không
            const isValidToken = await DecodeToken(accessToken, process.env.SERERT_KEY_ACCESS_TOKEN);
            if (!isValidToken) return res.status(400).json({ msg: 'Access token không hợp lệ!' });

            //kiểm tra refresh token xem có đúng không
            const isRefreshToken = await AccountModel.GetAccountByRereshToken(refreshToken);
            if (!isRefreshToken) return res.status(400).json({ msg: 'Refresh token không hợp lệ!' });

            //Kiểm tra token hết hạn chưa nếu chưa trả về token cũ
            const isTokenExp = await VerifyToken(accessToken, process.env.SERERT_KEY_ACCESS_TOKEN);

            if (isTokenExp) {
                return res.status(200).json({ access_token: accessToken });
            }

            //Tạo mới access token
            const payload = {
                email: isValidToken.payload.email,
            };

            const newAccessToken = await CreateToken(
                payload,
                process.env.SERERT_KEY_ACCESS_TOKEN,
                process.env.TOKEN_LIFE,
            );

            if (!newAccessToken)
                return res.status(500).json({ msg: 'Tạo mới  access token không thành công, vui lòng thử lại' });

            const d = new Date();
            res.cookie('_user', newAccessToken, { maxAge: d.getTime() + 10 * 24 * 60 * 60 * 1000 });
            return res.status(200).json({ access_token: newAccessToken });
        } catch (error) {
            console.log(`Error in authController/RefreshToken: ${error}`);
            return res.status(500).json(error);
        }
    }
}

module.exports = new AuthController();
