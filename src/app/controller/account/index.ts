import { Request, Response } from 'express';
import 'dotenv/config';
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
    async GetAccount(req: Request, res: Response) {
        try {
            const user = await AccountModel.GetUserInfoByEmail(req.body.email);
            if (!user) return res.status(204).json({ msg: 'no content' });

            return res.status(200).json(user);
        } catch (error) {
            console.log(`error in accountController/GetAccount: ${error}`);
            return res.status(500).json({ msg: error });
        }
    }
    //[POST]: /register || /register-external-account/?type_login=?
    async Register(req: Request, res: Response) {
        try {
            let user;

            let token = req.header('access_token') || undefined;
            const typeLogin = req.query.type_login;

            if (req.body.email && req.body.showName && req.body.passWord) {
                user = {
                    email: req.body.email,
                    showName: req.body.showName,
                    passWord: await hash(req.body.passWord, 10), // Mã hóa mật khẩu
                };
            }

            if (typeLogin === 'facebook') {
                const resData = await axios.get(
                    `https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`,
                );

                user = {
                    email: resData.data.email,
                    showName: resData.data.name,
                    passWord: '',
                };
            }

            if (typeLogin === 'google') {
                const resData = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);

                user = {
                    email: resData.data.email,
                    showName: resData.data.name,
                    passWord: '',
                };
            }

            if (!user) return;

            //Kiểm tra xem địa chỉ email đã sử dụng để tạo tài khoản chưa
            const account = await AccountModel.GetAccountByEmail(user.email);

            //Với loại tài khoản liên kết với các mạng xã hội
            if (typeLogin === 'facebook' || typeLogin === 'google') {
                if (!account) {
                    const isAdd = await AccountModel.AddNewAccount(user);

                    //Kiểm tra xem tại khoản có tọa thành công hay không
                    if (!isAdd) return res.status(400).json({ msg: 'Tạo mới tài khoản không thành công!' });
                }

                //kiểm tra resfreshtoken xem đã có chưa nếu chưa thì tạo vào thêm vào database
                let refreshToken = account.refresh_token;
                if (!refreshToken) {
                    const newRefreshToken = randToken.generate(16);
                    refreshToken = newRefreshToken;
                    const isUpdate = await AccountModel.UpdateAccount({ ...user, refreshToken: newRefreshToken });

                    //báo lỗi khi chưa lưu thành công
                    if (!isUpdate)
                        return res.status(500).json({ msg: 'Đăng nhập không thành công, vui lòng thử lại!' });
                }

                const payload = {
                    email: user.email,
                };
                const accessToken = await CreateToken(
                    payload,
                    process.env.SERERT_KEY_ACCESS_TOKEN,
                    process.env.TOKEN_LIFE,
                );

                res.cookie('_user', accessToken, { maxAge: 10 * 24 * 60 * 60 * 1000 });
                res.cookie('_token', refreshToken, { maxAge: 10 * 24 * 60 * 60 * 1000 });

                return res.status(201).json({ msg: 'Tạo tài khoản thành công' });
            }

            if (account)
                return res.status(400).json({ msg: 'Địa chỉ email đã tồn tại, vui lòng chọn địa chỉ email khác!' });

            //tạo mới tài khoản khi dữ liệu đã hợp lệ
            const isAdd = await AccountModel.AddNewAccount(user);

            //Kiểm tra xem tại khoản có tọa thành công hay không
            if (!isAdd) return res.status(400).json({ msg: 'Tạo mới tài khoản không thành công!' });

            return res.status(201).json({ msg: 'Tạo tài khoản thành công' });
        } catch (error) {
            console.log(`error in accountController/Register: ${error}`);
            return res.status(500).json({ msg: error });
        }
    }

    //[PUT]: //account/update/avatar
    async UpdateAvatar(req: Request, res: Response) {
        try {
            if (!req.params.customer_id) return res.status(404).json({ msg: 'Không tìm thấy id' });

            if (!req.file) return res.status(404).json({ msg: 'Không tìm thấy file!' });

            const result = await AccountModel.UpdateAvatar(req.params.customer_id, req.file.path);

            if (!result) return res.status(400).json({ msg: 'Cập nhật không thành công!' });

            return res.status(200).json({ msg: 'Cập nhật thành công!', url: req.file.path });
        } catch (error) {
            console.log(`error in accountController/UpdateAvatar: ${error}`);
            return res.status(500).json({ msg: error });
        }
    }

    //[PORT]: /login
    async Login(req: Request, res: Response) {
        try {
            const user = await AccountModel.VerifyAccount(req.body.email, req.body.passWord); // kiểm tra thông tin người dùng nhập có đúng không?
            let refreshToken = user.refreshToken;

            if (!user) return res.status(400).json({ msg: 'Vui lòng kiểm tra lại tên đăng nhập và mật khẩu!' }); //Thông báo thông tin người dùng nhập không đúng.

            //Khi hoàn thành khâu xác minh thì tạo vào lưu refresh token vào database nếu tài khoản chưa có refresh token
            if (!refreshToken) {
                const newRefreshToken = randToken.generate(16);
                refreshToken = newRefreshToken;
                const isUpdate = await AccountModel.UpdateAccount({ ...user, refreshToken: newRefreshToken });

                //báo lỗi khi chưa lưu thành công
                if (!isUpdate) return res.status(500).json({ msg: 'Đăng nhập không thành công, vui lòng thử lại!' });
            }

            // tạo access token và gửi về cho client
            const payload = {
                email: user.email,
            };
            const accessToken = await CreateToken(payload, process.env.SERERT_KEY_ACCESS_TOKEN, process.env.TOKEN_LIFE);

            res.cookie('_user', accessToken, { maxAge: 10 * 24 * 60 * 60 * 1000 });
            res.cookie('_token', refreshToken, { maxAge: 10 * 24 * 60 * 60 * 1000 });
            return res.status(200).json({ access_token: accessToken });
        } catch (error) {
            console.log(`error in accountController/login: ${error}`);
            return res.status(500).json({ msg: error });
        }
    }

    //[PUT]: /change-password
    async ChangePassWord(req: Request, res: Response) {
        try {
            const user = await AccountModel.VerifyAccount(req.body.email, req.body.passWord); // kiểm tra thông tin người dùng nhập có đúng không?
            if (!user) return res.status(400).json({ msg: 'Vui lòng kiểm tra lại mật khẩu!' }); //Thông báo thông tin người dùng nhập không đúng.

            user.passWord = await hash(req.body.newPassword, 10);
            const isUpdate = await AccountModel.UpdateAccount(user);

            //báo lỗi khi chưa lưu thành công
            if (!isUpdate) return res.status(400).json({ msg: 'Thay đổi mật không thành công, vui lòng thử lại!' });

            return res.status(200).json({ msg: 'Thay đổi mật thành công' });
        } catch (error) {
            console.log(`error in accountController/ChangePassWord: ${error}`);
            return res.status(500).json({ msg: error });
        }
    }

    //[POST]: /forgot-password
    async ForgotPassWord(req: Request, res: Response) {
        try {
            const adminEmail = process.env.ADMIN_EMAIL_ADDRESS; //Địa chỉ email gửi
            const clientEmail = req.body.email; //địa chỉ email khách hàng

            //kiểm tra xem emailcos hợp lệ hay không
            const user = await AccountModel.GetAccountByEmail(clientEmail);
            console.log(user);
            if (!user) return res.status(400).json({ msg: 'Vui lòng kiểm tra lại địa chỉ email!' });

            //tạo new password
            const newPassWord = randToken.generate(16);

            //Cập nhật lại mật khẩu
            const isUpdate = await AccountModel.UpdateAccount({
                email: user.email,
                passWord: await hash(newPassWord, 10),
                typeAccount: user.type_account,
                refreshToken: user.refresh_token,
                showName: user.show_name,
            });

            if (!isUpdate) return res.status(400).json({ msg: 'Lấy mật khẩu không thành công, vui lòng thử lại!' });

            //Gửi mật khẩu qua email
            const msg = {
                to: clientEmail,
                from: adminEmail,
                subject: 'Hallu coffe',
                text: `Mật khẩu của bạn là: ${newPassWord}`,
                html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en" style="padding:0;Margin:0">
                 <head>
                  <meta charset="UTF-8">
                  <meta content="width=device-width, initial-scale=1" name="viewport">
                  <meta name="x-apple-disable-message-reformatting">
                  <meta http-equiv="X-UA-Compatible" content="IE=edge">
                  <meta content="telephone=no" name="format-detection">
                  <title>New Template</title><!--[if (mso 16)]>
                    <style type="text/css">
                    a {text-decoration: none;}
                    </style>
                    <![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
                <xml>
                    <o:OfficeDocumentSettings>
                    <o:AllowPNG></o:AllowPNG>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                    </o:OfficeDocumentSettings>
                </xml>
                <![endif]-->
                  <style type="text/css">
                #outlook a {
                    padding:0;
                }
                .ExternalClass {
                    width:100%;
                }
                .ExternalClass,
                .ExternalClass p,
                .ExternalClass span,
                .ExternalClass font,
                .ExternalClass td,
                .ExternalClass div {
                    line-height:100%;
                }
                .es-button {
                    mso-style-priority:100!important;
                    text-decoration:none!important;
                }
                a[x-apple-data-detectors] {
                    color:inherit!important;
                    text-decoration:none!important;
                    font-size:inherit!important;
                    font-family:inherit!important;
                    font-weight:inherit!important;
                    line-height:inherit!important;
                }
                .es-desk-hidden {
                    display:none;
                    float:left;
                    overflow:hidden;
                    width:0;
                    max-height:0;
                    line-height:0;
                    mso-hide:all;
                }
                .es-button-border:hover a.es-button, .es-button-border:hover button.es-button {
                    background:#ffffff!important;
                }
                .es-button-border:hover {
                    background:#ffffff!important;
                    border-style:solid solid solid solid!important;
                    border-color:#3d5ca3 #3d5ca3 #3d5ca3 #3d5ca3!important;
                }
                @media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120%!important } h1 { font-size:20px!important; text-align:center } h2 { font-size:16px!important; text-align:left } h3 { font-size:20px!important; text-align:center } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:20px!important } h2 a { text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:16px!important } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:10px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:12px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button, button.es-button { font-size:14px!important; display:block!important; border-left-width:0px!important; border-right-width:0px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; max-height:inherit!important } }
                </style>
                 </head>
                 <body style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
                  <div dir="ltr" class="es-wrapper-color" lang="en" style="background-color:#FAFAFA"><!--[if gte mso 9]>
                            <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                                <v:fill type="tile" color="#fafafa"></v:fill>
                            </v:background>
                        <![endif]-->
                   <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FAFAFA">
                     <tr style="border-collapse:collapse">
                      <td valign="top" style="padding:0;Margin:0">
                       <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
                         <tr style="border-collapse:collapse">
                          <td class="es-adaptive" align="center" style="padding:0;Margin:0">
                           <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                             <tr style="border-collapse:collapse">
                              <td align="left" style="padding:10px;Margin:0">
                               <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                 <tr style="border-collapse:collapse">
                                  <td valign="top" align="center" style="padding:0;Margin:0;width:580px">
                                   <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                     <tr style="border-collapse:collapse">
                                      <td align="center" class="es-infoblock" style="padding:0;Margin:0;line-height:14px;font-size:12px;color:#CCCCCC"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:14px;color:#CCCCCC;font-size:12px">Put your preheader text here. <a href="https://viewstripo.email" class="view" target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;color:#CCCCCC;font-size:12px">View in browser</a></p></td>
                                     </tr>
                                   </table></td>
                                 </tr>
                               </table></td>
                             </tr>
                           </table></td>
                         </tr>
                       </table>
                       <table cellpadding="0" cellspacing="0" class="es-header" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
                         <tr style="border-collapse:collapse">
                          <td class="es-adaptive" align="center" style="padding:0;Margin:0">
                           <table class="es-header-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#3d5ca3;width:600px" cellspacing="0" cellpadding="0" bgcolor="#3d5ca3" align="center">
                             <tr style="border-collapse:collapse">
                              <td style="Margin:0;padding-top:10px;padding-bottom:10px;padding-left:20px;padding-right:20px;background-color:#422b1d" bgcolor="#3d5ca3" align="left"><!--[if mso]><table style="width:560px" cellpadding="0">
                                        cellspacing="0"><tr><td style="width:270px" valign="top"><![endif]-->
                                <div style="display: flex; align-items: center;">
                                    <img src="https://bizweb.dktcdn.net/100/351/580/themes/714586/assets/logo.png?1676704948776" alt="halucafe" style="width: 60px; height: 60px;"/>
                                    <h1 style="margin-left: 20px; color: #fff;">halucafe</h1>
                                </div>
                               <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                                 <tr style="border-collapse:collapse">
                                  <td class="es-m-p20b" align="left" style="padding:0;Margin:0;width:270px">
                                   <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                     <tr style="border-collapse:collapse">
                                      <td align="center" style="padding:0;Margin:0;display:none"></td>
                                     </tr>
                                   </table></td>
                                 </tr>
                               </table><!--[if mso]></td><td style="width:20px"></td><td style="width:270px" valign="top"><![endif]-->
                               <table class="es-right" cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                                 <tr style="border-collapse:collapse">
                                  <td align="left" style="padding:0;Margin:0;width:270px">
                                   <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                     <tr style="border-collapse:collapse">
                                      <td align="center" style="padding:0;Margin:0;display:none"></td>
                                     </tr>
                                   </table></td>
                                 </tr>
                               </table><!--[if mso]></td></tr></table><![endif]--></td>
                             </tr>
                           </table></td>
                         </tr>
                       </table>
                       <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
                         <tr style="border-collapse:collapse">
                          <td style="padding:0;Margin:0;background-color:#fafafa" bgcolor="#fafafa" align="center">
                           <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
                             <tr style="border-collapse:collapse">
                              <td style="padding:0;Margin:0;padding-left:20px;padding-right:20px;padding-top:40px;background-color:transparent;background-position:left top" bgcolor="transparent" align="left">
                               <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                 <tr style="border-collapse:collapse">
                                  <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                                   <table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-position:left top" width="100%" cellspacing="0" cellpadding="0">
                                     <tr style="border-collapse:collapse">
                                      <td align="center" style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;font-size:0"><img src="https://fccjwfe.stripocdn.email/content/guids/CABINET_dd354a98a803b60e2f0411e893c82f56/images/23891556799905703.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="175"></td>
                                     </tr>
                                     <tr style="border-collapse:collapse">
                                      <td align="center" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px"><h1 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#333333"><strong>FORGOT YOUR </strong></h1><h1 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#333333"><strong>&nbsp;PASSWORD?</strong></h1></td>
                                     </tr>
                                     <tr style="border-collapse:collapse">
                                      <td align="left" style="padding:0;Margin:0;padding-left:40px;padding-right:40px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;color:#666666;font-size:16px;text-align:center">HI,&nbsp;${clientEmail}</p></td>
                                     </tr>
                                     <tr style="border-collapse:collapse">
                                      <td align="center" style="padding:0;Margin:0;padding-right:35px;padding-left:40px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;color:#666666;font-size:16px">Your new password is ${newPassWord}, click on the login button to login to your account</p></td>
                                     </tr>
                                     <tr style="border-collapse:collapse">
                                      <td align="center" style="Margin:0;padding-left:10px;padding-right:10px;padding-top:40px;padding-bottom:40px"><span class="es-button-border" style="border-style:solid;border-color:#3D5CA3;background:#FFFFFF;border-width:2px;display:inline-block;border-radius:10px;width:auto"><a href="http://localhost:3000/account/login" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#3D5CA3;font-size:14px;display:inline-block;background:#FFFFFF;border-radius:10px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:bold;font-style:normal;line-height:17px;width:auto;text-align:center;padding:15px 20px 15px 20px;mso-padding-alt:0;mso-border-alt:10px solid #FFFFFF">Login</a></span></td>
                                     </tr>
                                   </table></td>
                                 </tr>
                               </table></td>
                             </tr>
                           </table></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table>
                  </div>
                 </body>
                </html>`,
            };
            await sgMail.send(msg);
            return res.status(200).json({ msg: 'Mật khẩu đã gửi qua email của bạn' });
        } catch (error) {
            console.log(`error in accountController/ForgotPassWord: ${error}`);
            return res.status(500).json({ msg: error });
        }
    }
}

module.exports = new accountController();
