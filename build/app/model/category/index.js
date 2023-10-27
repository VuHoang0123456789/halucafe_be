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
const { ReturnItems } = require('../../../until/method');
class CategoryModel {
    //Lấy toàn bộ category
    GetCategorys() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryStr = 'select category_id as key, category_name as value from category;';
                const errorMsg = 'CategoryModel/GetCategorys';
                return yield ReturnItems(queryStr, errorMsg);
            }
            catch (error) {
                console.log(`Error in CategoryModel/GetCategorys: ${error}`);
                return null;
            }
        });
    }
}
module.exports = new CategoryModel();
