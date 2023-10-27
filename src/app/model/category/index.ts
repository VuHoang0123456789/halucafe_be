const { ReturnItems } = require('../../../until/method');

class CategoryModel {
    //Lấy toàn bộ category
    async GetCategorys() {
        try {
            const queryStr = 'select category_id as key, category_name as value from category;';
            const errorMsg = 'CategoryModel/GetCategorys';

            return await ReturnItems(queryStr, errorMsg);
        } catch (error) {
            console.log(`Error in CategoryModel/GetCategorys: ${error}`);
            return null;
        }
    }
}

module.exports = new CategoryModel();

export {};
