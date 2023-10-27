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
const { ReturnItems, ReturnItem } = require('../../../until/method');
class ProductModel {
    //Lấy ra danh sách product liên quan
    GetRelatedProduct(category_id, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let queryStr = `
                select                 
                    description, original_number, price, product_id, product_name, 
                    quantity_sold, sale_percent, sale_status, product.slug, 
                    trademark, url_images_large, url_images_small
                from product 
                where category_id = ${category_id}
                order by quantity_sold desc
                limit ${limit}
            `;
                const errorMsg = 'productModel/GetRelatedProduct'; //Địa chỉ có lỗi
                return ReturnItems(queryStr, errorMsg); //trả về dữ liệu
            }
            catch (error) {
                return null;
            }
        });
    }
    //Lấy ra danh sách trademark
    GetProductTrademarks(category_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let queryStr = '';
                if (category_id !== ' ') {
                    queryStr = `
                    SELECT DISTINCT(trademark) as key, trademark as value
                    from product 
                    where category_id in (${category_id}) and trademark not in ('Đang cập nhật')
                `; //câu truy vấn
                }
                else {
                    queryStr = `
                    SELECT DISTINCT(trademark) as key, trademark as value
                    from product 
                    where trademark not in ('Đang cập nhật')
                `; //câu truy vấn
                }
                const errorMsg = 'productModel/GetProductTrademarks'; //Địa chỉ có lỗi
                return ReturnItems(queryStr, errorMsg); //trả về dữ liệu
            }
            catch (error) {
                return null;
            }
        });
    }
    //Lấy tất cả sản phẩm
    GetProducts(startIndex, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryStr = `
            select                 
                category.category_id, category_name, 
                original_number, price, product_id, product_name, 
                quantity_sold, sale_percent, sale_status, product.slug, 
                trademark, url_images_large, url_images_small, description, (
                    select 
                        count(product_id) 
                    from 
                        product
                    ) as max_row 
            from 
                product join category on category.category_id = product.category_id
            ORDER by product_name asc 
            limit  ${limit} offset ${startIndex}`; //câu truy vấn
                const errorMsg = 'productModel/GetProducts'; //Địa chỉ có lỗi
                return ReturnItems(queryStr, errorMsg); //trả về dữ liệu
            }
            catch (error) {
                return null;
            }
        });
    }
    //Lấy tất cả sản phẩm hot
    GetHotProducts(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryStr = `
            select                 
                description, original_number, price, product_id, product_name, 
                quantity_sold, sale_percent, sale_status, product.slug, 
                trademark, url_images_large, url_images_small
            from product 
            order by product.quantity_sold desc
            limit ${limit};
            `; //câu truy vấn
                const errorMsg = 'productModel/GetHotProducts'; //Địa chỉ có lỗi
                return ReturnItems(queryStr, errorMsg); //trả về dữ liệu
            }
            catch (error) {
                return null;
            }
        });
    }
    //Lấy tất cả sản phẩm với category_name
    GetProductsByCategoryName(startIndex, limit, categoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryStr = `
            select                 
                category.category_id, category_name, description, 
                original_number, price, product_id, product_name, 
                quantity_sold, sale_percent, sale_status, product.slug, 
                trademark, url_images_large, url_images_small, 
                    (
                        select count(product_id)
                        from product 
                        where category_id = (
                            select category_id 
                            from category 
                            where slug = '${categoryName}'
                        )
                    ) as max_row
            from product 
                join category on category.category_id = product.category_id
            where category.slug = '${categoryName}'
            limit ${limit} offset ${startIndex}
            `; //câu truy vấn
                const errorMsg = 'productModel/GetProductsByCategoryName'; //Địa chỉ có lỗi
                return ReturnItems(queryStr, errorMsg); //trả về dữ liệu
            }
            catch (error) {
                return null;
            }
        });
    }
    //Lấy nhiều sản phẩm dựa vào slug
    GetProductBySlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errorMsg = 'productModel/GetProductByID'; //Địa chỉ có lỗi
                const queryProduct = `
            SELECT                
                category.category_id, category_name, description, 
                original_number, price, product_id, product_name, 
                quantity_sold, sale_percent, sale_status, product.slug, 
                trademark, url_images_large, url_images_small, category.slug as category_slug
            FROM product join category on product.category_id = category.category_id 
            where product.slug = '${slug}'`;
                const product = yield ReturnItem(queryProduct, errorMsg);
                const queryTopping = `
            select *
            from topping 
            where topping_id in (
                select topping_id from products_and_topping where product_id = '${product.product_id}'
            );`;
                const toppings = yield ReturnItems(queryTopping, errorMsg);
                return {
                    product: product,
                    toppings: toppings,
                }; //trả về dữ liệu
            }
            catch (error) {
                return null;
            }
        });
    }
    // Lấy ra 1 sản phẩm với category_name
    LoadProductCoffeeOfHome(categoryName, productNames, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const NewProductNames = productNames.map((item) => {
                    return `'${item}'`;
                });
                const queryStr = `
            select 
                category.category_id, category_name, description, 
                original_number, price, product_id, product_name, 
                quantity_sold, sale_percent, sale_status, product.slug, 
                trademark, url_images_large, url_images_small
            from product 
                join category on category.category_id = product.category_id
            where 
                category.category_name = '${categoryName}' and 
                product_name in (${NewProductNames})
            limit ${limit}
            `;
                const errorMsg = 'productModel/LoadProductCoffeeOfHome'; //Địa chỉ có lỗi
                return ReturnItems(queryStr, errorMsg); //trả về dữ liệu
            }
            catch (error) {
                return null;
            }
        });
    }
    // Lấy ra 1 sản phẩm với category_name
    FillterProduct(page, limit, category_id, trademark, maxPrice, minPrice) {
        return __awaiter(this, void 0, void 0, function* () {
            const trademarks = trademark === null || trademark === void 0 ? void 0 : trademark.split(',');
            const trademarkStr = trademarks === null || trademarks === void 0 ? void 0 : trademarks.map((item) => `'${item}'`);
            let whereStr;
            if (trademark && category_id && minPrice && maxPrice)
                whereStr = `where trademark in (${trademarkStr}) and category.category_id in ( ${category_id}) and price >= (${minPrice}) and price < ( ${maxPrice})`;
            else if (trademark && category_id && minPrice && !maxPrice)
                whereStr = `where trademark in (${trademarkStr}) and category.category_id in ( ${category_id}) and price >= (${minPrice})`;
            else if (trademark && category_id)
                whereStr = `where trademark in (${trademarkStr}) and category.category_id in ( ${category_id})`;
            else if (trademark && minPrice && maxPrice)
                whereStr = `where trademark in (${trademarkStr}) and price >= (${minPrice}) and price < ( ${maxPrice})`;
            else if (trademark && minPrice && !maxPrice)
                whereStr = `where trademark in (${trademarkStr}) and price >= (${minPrice})`;
            else if (category_id && minPrice && maxPrice)
                whereStr = `where category.category_id in ( ${category_id}) and price >= (${minPrice}) and price < ( ${maxPrice})`;
            else if (category_id && minPrice && !maxPrice)
                whereStr = `where category.category_id in ( ${category_id}) and price >= (${minPrice})`;
            else if (category_id)
                whereStr = `where category.category_id in ( ${category_id})`;
            else if (minPrice && maxPrice)
                whereStr = `where price >= (${minPrice}) and price < ( ${maxPrice})`;
            else if (minPrice && !maxPrice)
                whereStr = `where price >= (${minPrice})`;
            else if (trademark)
                whereStr = `where trademark in  (${trademarkStr})`;
            try {
                const queryStr = `
            select                 
                category.category_id, category_name, original_number, price, product_id, product_name, 
                quantity_sold, sale_percent, sale_status, product.slug, 
                trademark, url_images_large, url_images_small, description,(
                    select count(product_id) 
                    from product
                    ${whereStr}
                ) as max_row
            from product join category on product.category_id = category.category_id
            ${whereStr}
            limit ${limit} offset ${page}`;
                const errorMsg = 'productModel/FillterProduct'; //Địa chỉ có lỗi
                return ReturnItems(queryStr, errorMsg); //trả về dữ liệu
            }
            catch (error) {
                return null;
            }
        });
    }
    // Lấy ra danh mục đồ uống tiêu biểu
    GetColectionCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryStr = `select * from category order by category_id asc`;
                const errorMsg = 'productModel/GetColectionCategory'; //Địa chỉ có lỗi
                let colectionCategorys = [];
                const categorys = (yield ReturnItems(queryStr, errorMsg));
                for (let i = 0; i < categorys.length; i++) {
                    const queryStr1 = `
                select product_name, slug
                from product 
                where category_id = ${categorys[i].category_id}
                order by product.quantity_sold desc
                limit 5
            `;
                    const products = (yield ReturnItems(queryStr1, errorMsg));
                    const colectionCategory = {
                        slug: categorys[i].slug,
                        category_name: categorys[i].category_name,
                        lv2Item: products,
                    };
                    colectionCategorys.push(colectionCategory);
                }
                return colectionCategorys; //trả về dữ liệu
            }
            catch (error) {
                return null;
            }
        });
    }
    // Lấy ra sản phẩm với tên sản phẩm
    SearchProduct(product_name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryStr = `
                select 
                    description, original_number, price, product_id, product_name, 
                    quantity_sold, sale_percent, sale_status, product.slug, 
                    trademark, url_images_large, url_images_small
                from product 
                where lower(unaccent_string(product_name)) like lower(unaccent_string('%${product_name}%'))
            `;
                const errorMsg = 'productModel/SearchProduct'; //Địa chỉ có lỗi
                return yield ReturnItems(queryStr, errorMsg);
            }
            catch (error) {
                return null;
            }
        });
    }
    //Load typical products
    LoadTypicalProducts(categoryString) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errorMsg = 'productModel/LoadTypicalProducts'; //Địa chỉ có lỗi
                const queryStr = `
                select * 
                from category 
                where category_name in (${categoryString}) 
                order by category_id
            `;
                const categorys = (yield ReturnItems(queryStr, errorMsg));
                let results = [];
                for (let i = 0; i < categorys.length; i++) {
                    const query = `
                    select                     
                        description, original_number, price, product_id, product_name, 
                        quantity_sold, sale_percent, sale_status, product.slug, 
                        trademark, url_images_large, url_images_small
                    from product 
                    where category_id = ${categorys[i].category_id}
                    order by quantity_sold desc
                    limit 4
                `;
                    const product = yield ReturnItems(query, errorMsg);
                    results.push({
                        categorys: categorys[i],
                        product,
                    });
                }
                return results;
            }
            catch (error) {
                return null;
            }
        });
    }
    //sort
    Sort(type, key, page, limit, slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = slug !== 'all'
                ? `
            select                 
                product_id, product_name, quantity_sold, 
                sale_percent, sale_status, product.slug, 
                trademark, url_images_large, url_images_small, 
                description, original_number, price, category.category_id, category_name,
                (
                    select count(product_id) 
                    from product
                ) as max_row 
            from product join category on product.category_id = category.category_id
            where category.slug = '${slug}'
            order by ${key} ${type}
            limit ${limit} offset ${page}
        `
                : `
        select                 
            product_id, product_name, quantity_sold, 
            sale_percent, sale_status, product.slug, 
            trademark, url_images_large, url_images_small, 
            description, original_number, price,category.category_id, category_name,
            (
                select count(product_id) 
                from product
            ) as max_row 
        from product join category on product.category_id = category.category_id
        order by ${key} ${type}
        limit ${limit} offset ${page}
    `;
            const err = 'Error in productModel/Sort';
            return yield ReturnItems(query, err);
        });
    }
}
module.exports = new ProductModel();
