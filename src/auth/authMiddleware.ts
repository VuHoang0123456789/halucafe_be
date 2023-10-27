import { Request, Response, NextFunction } from 'express';
import 'dotenv/config';
const { VerifyToken } = require('./authMethods');

exports.auth = async (req: Request, res: Response, next: NextFunction) => {
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

        const isValid = await VerifyToken(token, process.env.SERERT_KEY_ACCESS_TOKEN);

        if (!isValid) {
            return res.status(403).json({ content: 'Access token không hợp lệ!' });
        }

        req.body.email = isValid.payload.email;

        return next();
    } catch (error) {
        console.log(`Error in authMiddleware: ${error}`);
        return res.json({
            error: error,
        });
    }
};

export {};
