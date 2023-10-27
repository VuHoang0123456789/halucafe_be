import { Request, Response } from 'express';
const CategoryModel = require('../../model/category');

class CategoryController {
    // [GET]: /category/get-categorys
    async GetAllCategory(req: Request, res: Response) {
        try {
            const category = await CategoryModel.GetCategorys();

            if (category.length === 0) return res.status(204).json({ msg: 'no content' });

            return res.status(200).json(category);
        } catch (error) {
            return res.status(500).json({ msg: 'Internal Server Error' });
        }
    }
}

module.exports = new CategoryController();
