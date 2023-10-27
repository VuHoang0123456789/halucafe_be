import { Request, Response } from 'express';
import { BookTableType } from '../../../types/type_ob';
const TableModel = require('../../model/table');

class TableController {
    //[POST]: /table/book-table
    async BookTable(req: Request, res: Response) {
        try {
            const book = req.body as BookTableType;

            const isValid = await TableModel.BookTable(book);

            if (!isValid) return res.status(400).json({ msg: 'bad quest' });

            return res.status(200).json({ msg: 'successfull' });
        } catch (error) {
            console.log('Error in TableController/BookTable');
            return res.status(500).json('Internal Server');
        }
    }
}

module.exports = new TableController();

export {};
