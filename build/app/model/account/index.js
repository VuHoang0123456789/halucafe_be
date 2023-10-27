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
const db = require('../../../config/db');
const promisify = require('util').promisify;
const bcrypt = require('bcrypt');
const compare = promisify(bcrypt.compare).bind(bcrypt);
require("dotenv/config");
class AccountModel {
    GetUserInfoByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield db();
                let queryStr = `
                select
                    account.email, show_name, customer.customer_id, refresh_token,
                    CONCAT(address_info, ', ', ward_name, ', ', district_name, ', ', province_name) address_full
                from
                    account join customer on account.email = customer.email
                    join address on address.customer_id = customer.customer_id
                where 
                    is_default = true and account.email = '${email}'`;
                let data = yield client.query(queryStr);
                if (!data.rows[0])
                    queryStr = `
            select
                account.email, show_name, customer.customer_id, refresh_token,
                CONCAT('Chưa có địa chỉ cụ thể, vui lòng cài đặt địa chỉ để nhận hàng!') address_full
            from
                account join customer on account.email = customer.email
            where
                account.email = '${email}'`;
                data = yield client.query(queryStr);
                yield client.end();
                return data.rows[0];
            }
            catch (error) {
                console.log(`Error in accountModel/GetUserInfoByEmail: ${error}`);
            }
        });
    }
    GetAccountByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield db();
                const queryStr = `Select * from account where email = '${email}'`;
                const data = yield client.query(queryStr);
                yield client.end();
                return data.rows[0];
            }
            catch (error) {
                console.log(`Error in accountModel/GetAccountByEmail: ${error}`);
            }
        });
    }
    GetAccountByRereshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield db();
                const queryStr = `Select * from account where refresh_token = '${refreshToken}'`;
                const data = yield client.query(queryStr);
                yield client.end();
                return data.rows[0];
            }
            catch (error) {
                console.log(`Error in accountModel/GetAccountByEmail: ${error}`);
            }
        });
    }
    VerifyAccount(email, passWord) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield db();
                const queryStr = `Select * from account where email = '${email}'`;
                const data = yield client.query(queryStr);
                const account = data.rows[0];
                yield client.end();
                if (!account)
                    return false;
                if (!(yield compare(passWord, account.pass_word)))
                    return false;
                return {
                    email: account.email,
                    passWord: account.pass_word,
                    showName: account.show_name,
                    typeAccount: account.type_account,
                    refreshToken: account.refresh_token,
                };
            }
            catch (error) {
                console.log(`Error in accountModel/VerifyAccount: ${error}`);
            }
        });
    }
    AddNewAccount({ email, passWord, typeAccount = 'user', refreshToken, showName }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield db(); // biến kết nối databse
                const queryStr = `
            call add_new_account(row('${email}', '${passWord}', '${typeAccount}', ${refreshToken ? `'${refreshToken}'` : null}, '${showName}'))`; // chuỗi lệnh thêm mới 1 hàng vào database
                yield client.query(queryStr); // chạy lệnh thêm mới dữ liệu vào database
                yield client.end(); //Đóng kêt nối database
                return 'Tạo mới tài khoản thành công!';
            }
            catch (error) {
                console.log(`Error in accountModel/AddNewAccount: ${error}`);
                return null;
            }
        });
    }
    AddNewExternalAccount({ email, passWord, typeAccount = 'user', refreshToken, showName }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield db(); // biến kết nối databse
                const queryStr = `
            insert into 
            account
                (email, pass_word, type_account, refresh_token, show_name) 
            values 
                ('${email}', '${passWord}', 
                '${typeAccount}', ${refreshToken ? `'${refreshToken}'` : null}, '${showName}')`; // chuỗi lệnh thêm mới 1 hàng vào database
                yield client.query(queryStr); // chạy lệnh thêm mới dữ liệu vào database
                yield client.end(); //Đóng kêt nối database
                return 'Tạo mới tài khoản thành công!';
            }
            catch (error) {
                console.log(`Error in accountModel/AddNewAccount: ${error}`);
                return null;
            }
        });
    }
    UpdateAccount({ email, passWord, typeAccount = 'user', refreshToken, showName }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield db();
                const queryStr = `
            update account set
                pass_word = '${passWord}', refresh_token = '${refreshToken}', 
                type_account = '${typeAccount}', show_name = '${showName}' 
            where 
                email = '${email}'`;
                console.log(refreshToken);
                const data = yield client.query(queryStr);
                yield client.end();
                return data || false;
            }
            catch (error) {
                console.log(`Error in accountModel/UpdateAccount: ${error}`);
                return null;
            }
        });
    }
}
module.exports = new AccountModel();
