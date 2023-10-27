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
const AccountModel = require('../../model/account');
const promisify = require('util').promisify;
const bcrypt = require('bcrypt');
const hash = promisify(bcrypt.hash).bind(bcrypt);
const randToken = require('rand-token');
const { CreateToken } = require('../../../auth/authMethods');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const axios = require('axios');
class accountController {
    //[GET]: /get-account
    GetAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield AccountModel.GetUserInfoByEmail(req.body.email);
                if (!user)
                    return res.status(204).json({ msg: 'no content' });
                return res.status(200).json(user);
            }
            catch (error) {
                console.log(`error in accountController/GetAccount: ${error}`);
                return res.status(500).json({ msg: error });
            }
        });
    }
    //[POST]: /register || /register-external-account/?type_login=?
    Register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user;
                let token = req.header('access_token') || undefined;
                const typeLogin = req.query.type_login;
                if (req.body.email && req.body.showName && req.body.passWord) {
                    user = {
                        email: req.body.email,
                        showName: req.body.showName,
                        passWord: yield hash(req.body.passWord, 10), // Mã hóa mật khẩu
                    };
                }
                if (typeLogin === 'facebook') {
                    const resData = yield axios.get(`https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`);
                    user = {
                        email: resData.data.email,
                        showName: resData.data.name,
                        passWord: '',
                    };
                }
                if (typeLogin === 'google') {
                    const resData = yield axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
                    user = {
                        email: resData.data.email,
                        showName: resData.data.name,
                        passWord: '',
                    };
                }
                if (!user)
                    return;
                //Kiểm tra xem địa chỉ email đã sử dụng để tạo tài khoản chưa
                const account = yield AccountModel.GetAccountByEmail(user.email);
                //Với loại tài khoản liên kết với các mạng xã hội
                if (typeLogin === 'facebook' || typeLogin === 'google') {
                    if (!account) {
                        const isAdd = yield AccountModel.AddNewAccount(user);
                        //Kiểm tra xem tại khoản có tọa thành công hay không
                        if (!isAdd)
                            return res.status(400).json({ msg: 'Tạo mới tài khoản không thành công!' });
                    }
                    //kiểm tra resfreshtoken xem đã có chưa nếu chưa thì tạo vào thêm vào database
                    let refreshToken = account.refresh_token;
                    if (!refreshToken) {
                        const newRefreshToken = randToken.generate(16);
                        refreshToken = newRefreshToken;
                        const isUpdate = yield AccountModel.UpdateAccount(Object.assign(Object.assign({}, user), { refreshToken: newRefreshToken }));
                        //báo lỗi khi chưa lưu thành công
                        if (!isUpdate)
                            return res.status(500).json({ msg: 'Đăng nhập không thành công, vui lòng thử lại!' });
                    }
                    const payload = {
                        email: user.email,
                    };
                    const accessToken = yield CreateToken(payload, process.env.SERERT_KEY_ACCESS_TOKEN, process.env.TOKEN_LIFE);
                    res.cookie('_user', accessToken, { maxAge: 10 * 24 * 60 * 60 * 1000 });
                    res.cookie('_token', refreshToken, { maxAge: 10 * 24 * 60 * 60 * 1000 });
                    return res.status(201).json({ msg: 'Tạo tài khoản thành công' });
                }
                if (account)
                    return res.status(400).json({ msg: 'Địa chỉ email đã tồn tại, vui lòng chọn địa chỉ email khác!' });
                //tạo mới tài khoản khi dữ liệu đã hợp lệ
                const isAdd = yield AccountModel.AddNewAccount(user);
                //Kiểm tra xem tại khoản có tọa thành công hay không
                if (!isAdd)
                    return res.status(400).json({ msg: 'Tạo mới tài khoản không thành công!' });
                return res.status(201).json({ msg: 'Tạo tài khoản thành công' });
            }
            catch (error) {
                console.log(`error in accountController/Register: ${error}`);
                return res.status(500).json({ msg: error });
            }
        });
    }
    //[PORT]: /login
    Login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield AccountModel.VerifyAccount(req.body.email, req.body.passWord); // kiểm tra thông tin người dùng nhập có đúng không?
                let refreshToken = user.refreshToken;
                if (!user)
                    return res.status(400).json({ msg: 'Vui lòng kiểm tra lại tên đăng nhập và mật khẩu!' }); //Thông báo thông tin người dùng nhập không đúng.
                //Khi hoàn thành khâu xác minh thì tạo vào lưu refresh token vào database nếu tài khoản chưa có refresh token
                if (!refreshToken) {
                    const newRefreshToken = randToken.generate(16);
                    refreshToken = newRefreshToken;
                    const isUpdate = yield AccountModel.UpdateAccount(Object.assign(Object.assign({}, user), { refreshToken: newRefreshToken }));
                    //báo lỗi khi chưa lưu thành công
                    if (!isUpdate)
                        return res.status(500).json({ msg: 'Đăng nhập không thành công, vui lòng thử lại!' });
                }
                // tạo access token và gửi về cho client
                const payload = {
                    email: user.email,
                };
                const accessToken = yield CreateToken(payload, process.env.SERERT_KEY_ACCESS_TOKEN, process.env.TOKEN_LIFE);
                res.cookie('_user', accessToken, { maxAge: 10 * 24 * 60 * 60 * 1000 });
                res.cookie('_token', refreshToken, { maxAge: 10 * 24 * 60 * 60 * 1000 });
                return res.status(200).json({ access_token: accessToken });
            }
            catch (error) {
                console.log(`error in accountController/login: ${error}`);
                return res.status(500).json({ msg: error });
            }
        });
    }
    //[PUT]: /change-password
    ChangePassWord(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield AccountModel.VerifyAccount(req.body.email, req.body.passWord); // kiểm tra thông tin người dùng nhập có đúng không?
                if (!user)
                    return res.status(400).json({ msg: 'Vui lòng kiểm tra lại mật khẩu!' }); //Thông báo thông tin người dùng nhập không đúng.
                user.passWord = yield hash(req.body.newPassword, 10);
                const isUpdate = yield AccountModel.UpdateAccount(user);
                //báo lỗi khi chưa lưu thành công
                if (!isUpdate)
                    return res.status(400).json({ msg: 'Thay đổi mật không thành công, vui lòng thử lại!' });
                return res.status(200).json({ msg: 'Thay đổi mật thành công' });
            }
            catch (error) {
                console.log(`error in accountController/ChangePassWord: ${error}`);
                return res.status(500).json({ msg: error });
            }
        });
    }
    //[POST]: /forgot-password
    ForgotPassWord(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminEmail = process.env.ADMIN_EMAIL_ADDRESS; //Địa chỉ email gửi
                const clientEmail = req.body.email; //địa chỉ email khách hàng
                //kiểm tra xem emailcos hợp lệ hay không
                const user = yield AccountModel.GetAccountByEmail(clientEmail);
                console.log(user);
                if (!user)
                    return res.status(400).json({ msg: 'Vui lòng kiểm tra lại địa chỉ email!' });
                //tạo new password
                const newPassWord = randToken.generate(16);
                //Cập nhật lại mật khẩu
                const isUpdate = yield AccountModel.UpdateAccount({
                    email: user.email,
                    passWord: yield hash(newPassWord, 10),
                    typeAccount: user.type_account,
                    refreshToken: user.refresh_token,
                    showName: user.show_name,
                });
                if (!isUpdate)
                    return res.status(400).json({ msg: 'Lấy mật khẩu không thành công, vui lòng thử lại!' });
                //Gửi mật khẩu qua email
                const msg = {
                    to: clientEmail,
                    from: adminEmail,
                    subject: 'Hallu coffe',
                    text: `Mật khẩu của bạn là: ${newPassWord}`,
                    html: `<h1 style="font-size:16px; color:red;">Mật khẩu của bạn là: ${newPassWord}</h1>`,
                };
                yield sgMail.send(msg);
                return res.status(200).json({ msg: 'Mật khẩu đã gửi qua email của bạn' });
            }
            catch (error) {
                console.log(`error in accountController/ForgotPassWord: ${error}`);
                return res.status(500).json({ msg: error });
            }
        });
    }
}
module.exports = new accountController();
