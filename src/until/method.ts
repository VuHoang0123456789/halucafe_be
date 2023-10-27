const db = require('../config/db');

exports.ReturnItems = async function (query: string, errorMsg: string) {
    try {
        const queryStr = query; //câu truy vấn

        const client = await db(); // biến kết nối database
        const data = await client.query(queryStr); //giá trị lấy ra được từ database
        await client.end(); //đóng kết nối

        return data.rows; //trả về dữ liệu
    } catch (error) {
        console.log(`error in ${errorMsg}: ${error}`);
        return null;
    }
};

exports.ReturnItem = async function (query: string, errorMsg: string) {
    try {
        const queryStr = query; //câu truy vấn

        const client = await db(); // biến kết nối database
        const data = await client.query(queryStr); //giá trị lấy ra được từ database
        await client.end(); //đóng kết nối

        return data.rows[0]; //trả về dữ liệu
    } catch (error) {
        console.log(`error in ${errorMsg}: ${error}`);
        return null;
    }
};

exports.ChangeItem = async function (query: string, errorMsg: string) {
    try {
        const queryStr = query; //câu truy vấn

        const client = await db(); // biến kết nối database
        await client.query(queryStr); //giá trị lấy ra được từ database
        await client.end(); //đóng kết nối

        return true; //trả về dữ liệu
    } catch (error) {
        console.log(`error in ${errorMsg}: ${error}`);
        return null;
    }
};

exports.FormmatDate = function (date: Date) {
    return [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('/');
};

exports.removeAccents = function (str: string) {
    const newStr = str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');

    const strs = newStr.toLowerCase().split(' ');
    return strs.join('-');
};
export {};
