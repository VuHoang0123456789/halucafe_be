const { ChangeItem } = require('../../../until/method');
import { BookTableType } from '../../../types/type_ob';

class TableModel {
    async BookTable(book: BookTableType) {
        try {
            const query = `
                insert into book_table (full_name, phone, booking_date, booking_time, note) 
                values ('${book.full_name}', '${book.phone}', '${book.date}', '${book.time}', '${book.note}')
            `;
            const error = 'Error in BookTable/BookTable';

            return await ChangeItem(query, error);
        } catch (error) {
            console.log('Error in TableModel/BookTable');
            return null;
        }
    }
}

module.exports = new TableModel();

export {};
