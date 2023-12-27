const db = require('../../../config/db');
const promisify = require('util').promisify;
const bcrypt = require('bcrypt');
const compare = promisify(bcrypt.compare).bind(bcrypt);
import 'dotenv/config';

interface account {
    email: string;
    passWord: string;
    typeAccount: string;
    showName: string;
    avater: string;
    refreshToken?: string;
}

class AccountModel {
    async GetUserInfoByEmail(email: string) {
        try {
            const client = await db();
            let queryStr = `
                select
                    account.email, show_name, customer.customer_id, refresh_token,
                    CONCAT(address_info, ', ', ward_name, ', ', district_name, ', ', province_name) address_full, avatar
                from
                    account join customer on account.email = customer.email
                    join address on address.customer_id = customer.customer_id
                where 
                    is_default = true and account.email = '${email}'`;

            let data = await client.query(queryStr);

            if (!data.rows[0])
                queryStr = `
                select
                    account.email, show_name, customer.customer_id, refresh_token,
                    CONCAT('Chưa có địa chỉ cụ thể, vui lòng cài đặt địa chỉ để nhận hàng!') address_full, avatar
                from
                    account join customer on account.email = customer.email
                where
                    account.email = '${email}'`;

            data = await client.query(queryStr);

            await client.end();
            return data.rows[0];
        } catch (error) {
            console.log(`Error in accountModel/GetUserInfoByEmail: ${error}`);
        }
    }

    async GetAccountByEmail(email: string) {
        try {
            const client = await db();
            const queryStr = `Select * from account where email = '${email}'`;

            const data = await client.query(queryStr);
            await client.end();
            return data.rows[0];
        } catch (error) {
            console.log(`Error in accountModel/GetAccountByEmail: ${error}`);
        }
    }

    async GetAccountByRereshToken(refreshToken: string) {
        try {
            const client = await db();
            const queryStr = `Select * from account where refresh_token = '${refreshToken}'`;

            const data = await client.query(queryStr);
            await client.end();
            return data.rows[0];
        } catch (error) {
            console.log(`Error in accountModel/GetAccountByEmail: ${error}`);
        }
    }

    async VerifyAccount(email: string, passWord: string) {
        try {
            const client = await db();
            const queryStr = `Select * from account where email = '${email}'`;

            const data = await client.query(queryStr);
            const account = data.rows[0];
            await client.end();

            if (!account) return false;

            if (!(await compare(passWord, account.pass_word))) return false;

            return {
                email: account.email,
                passWord: account.pass_word,
                showName: account.show_name,
                typeAccount: account.type_account,
                refreshToken: account.refresh_token,
            };
        } catch (error) {
            console.log(`Error in accountModel/VerifyAccount: ${error}`);
        }
    }

    async AddNewAccount({ email, passWord, typeAccount = 'user', refreshToken, showName }: account) {
        try {
            const client = await db(); // biến kết nối databse
            const queryStr = `
            call add_new_account(row('${email}', '${passWord}', '${typeAccount}', ${
                refreshToken ? `'${refreshToken}'` : null
            }, '${showName}'))`; // chuỗi lệnh thêm mới 1 hàng vào database

            await client.query(queryStr); // chạy lệnh thêm mới dữ liệu vào database
            await client.end(); //Đóng kêt nối database

            return 'Tạo mới tài khoản thành công!';
        } catch (error) {
            console.log(`Error in accountModel/AddNewAccount: ${error}`);
            return null;
        }
    }

    async AddNewExternalAccount({ email, passWord, typeAccount = 'user', refreshToken, showName }: account) {
        try {
            const client = await db(); // biến kết nối databse
            const queryStr = `
            insert into 
            account
                (email, pass_word, type_account, refresh_token, show_name) 
            values 
                ('${email}', '${passWord}', 
                '${typeAccount}', ${refreshToken ? `'${refreshToken}'` : null}, '${showName}')`; // chuỗi lệnh thêm mới 1 hàng vào database

            await client.query(queryStr); // chạy lệnh thêm mới dữ liệu vào database
            await client.end(); //Đóng kêt nối database

            return 'Tạo mới tài khoản thành công!';
        } catch (error) {
            console.log(`Error in accountModel/AddNewAccount: ${error}`);
            return null;
        }
    }

    async UpdateAccount({ email, passWord, typeAccount = 'user', refreshToken, showName }: account) {
        try {
            const client = await db();
            const queryStr = `
                update account set
                    pass_word = '${passWord}', refresh_token = '${refreshToken}', 
                    type_account = '${typeAccount}', show_name = '${showName}' 
                where 
                    email = '${email}'`;

            const data = await client.query(queryStr);
            await client.end();

            return data || false;
        } catch (error) {
            console.log(`Error in accountModel/UpdateAccount: ${error}`);
            return null;
        }
    }

    async UpdateAvatar(customer_id: string, avatar: string) {
        try {
            const client = await db();
            const queryStr = `
                update account set avatar = '${avatar}' 
                where email = (
                    select email from customer where customer_id = ${customer_id}
                )`;
            const data = await client.query(queryStr);
            await client.end();

            return data || false;
        } catch (error) {
            console.log(`Error in accountModel/UpdateAvatar: ${error}`);
            return null;
        }
    }
}

module.exports = new AccountModel();

export {};
