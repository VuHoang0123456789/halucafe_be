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
const db = require('../config/db');
exports.ReturnItems = function (query, errorMsg) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const queryStr = query; //câu truy vấn
            const client = yield db(); // biến kết nối database
            const data = yield client.query(queryStr); //giá trị lấy ra được từ database
            yield client.end(); //đóng kết nối
            return data.rows; //trả về dữ liệu
        }
        catch (error) {
            console.log(`error in ${errorMsg}: ${error}`);
            return null;
        }
    });
};
exports.ReturnItem = function (query, errorMsg) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const queryStr = query; //câu truy vấn
            const client = yield db(); // biến kết nối database
            const data = yield client.query(queryStr); //giá trị lấy ra được từ database
            yield client.end(); //đóng kết nối
            return data.rows[0]; //trả về dữ liệu
        }
        catch (error) {
            console.log(`error in ${errorMsg}: ${error}`);
            return null;
        }
    });
};
exports.ChangeItem = function (query, errorMsg) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const queryStr = query; //câu truy vấn
            const client = yield db(); // biến kết nối database
            yield client.query(queryStr); //giá trị lấy ra được từ database
            yield client.end(); //đóng kết nối
            return true; //trả về dữ liệu
        }
        catch (error) {
            console.log(`error in ${errorMsg}: ${error}`);
            return null;
        }
    });
};
exports.FormmatDate = function (date) {
    return [
        date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`,
        date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`,
        date.getFullYear(),
    ].join('/');
};
exports.removeAccents = function (str) {
    const newStr = str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
    const strs = newStr.toLowerCase().split(' ');
    return strs.join('-');
};
