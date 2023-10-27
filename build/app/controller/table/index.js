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
const TableModel = require('../../model/table');
class TableController {
    //[POST]: /table/book-table
    BookTable(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const book = req.body;
                const isValid = yield TableModel.BookTable(book);
                if (!isValid)
                    return res.status(400).json({ msg: 'bad quest' });
                return res.status(200).json({ msg: 'successfull' });
            }
            catch (error) {
                console.log('Error in TableController/BookTable');
                return res.status(500).json('Internal Server');
            }
        });
    }
}
module.exports = new TableController();
