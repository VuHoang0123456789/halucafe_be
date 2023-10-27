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
const { ChangeItem } = require('../../../until/method');
class TableModel {
    BookTable(book) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                insert into book_table (full_name, phone, booking_date, booking_time, note) 
                values ('${book.full_name}', '${book.phone}', '${book.date}', '${book.time}', '${book.note}')
            `;
                const error = 'Error in BookTable/BookTable';
                return yield ChangeItem(query, error);
            }
            catch (error) {
                console.log('Error in TableModel/BookTable');
                return null;
            }
        });
    }
}
module.exports = new TableModel();
