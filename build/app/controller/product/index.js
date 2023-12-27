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
const productModel = require('../../model/product');
const dotenv = require('dotenv');
dotenv.config();
let Message = {};
class ProductController {
    //Làm phân trang
    //[GET]: /product/get-product/:slug
    GetProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const slug = req.params.slug;
                const product = yield productModel.GetProductBySlug(slug);
                if (!product)
                    return res.status(204).json({ content: 'no content' });
                return res.status(200).json(product);
            }
            catch (error) {
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        });
    }
    //[GET]: /product/get-products?page=?&limit=?
    GetProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startIndex = req.query.page; //Giá trị bắt đầu
                const limit = req.query.limit; //Giới hạn lấy
                const products = yield productModel.GetProducts(startIndex, limit);
                if (products.length === 0)
                    return res.status(204).json({ msg: 'no content' });
                return res.status(200).json({ products, max_page: Math.ceil(products[0].max_row / limit) });
            }
            catch (error) {
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        });
    }
    //[GET]: /product/get-hot-products?limit=?
    GetHotProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = req.query.limit;
                const products = yield productModel.GetHotProducts(limit);
                if (products.length === 0)
                    return res.status(204).json({ msg: 'no content' });
                return res.status(200).json(products);
            }
            catch (error) {
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        });
    }
    //[GET]: /products/get-products/:category_name?page=?&limit=?
    GetProductsByCategoryName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startIndex = req.query.page;
                const limit = req.query.limit;
                const categoryName = req.params.category_name;
                const products = yield productModel.GetProductsByCategoryName(startIndex, limit, categoryName);
                if (products.length === 0)
                    return res.status(204).json({ msg: 'no content' });
                return res.status(200).json({ products, max_page: Math.ceil(products[0].max_row / limit) });
            }
            catch (error) {
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        });
    }
    //[GET]: /product/get-load-home/:category_name?limit=?
    LoadProductOfHome(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category_name = req.params.category_name;
                const productNames = req.body.productNames;
                const limit = req.query.limit;
                const products = yield productModel.LoadProductCoffeeOfHome(category_name, productNames, limit);
                if (products.length === 0)
                    return res.status(204).json({ msg: 'no content' });
                return res.status(200).json(products);
            }
            catch (error) {
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        });
    }
    //[GET]: /fillter-product?category_id=?&trademark=?&min_price=?&max_price=?&?page=?&limit=?
    FillterProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category_id = req.query.category_id;
                const trademark = req.query.trademark;
                const limit = req.query.limit;
                const minPrice = req.query.min_price;
                const maxPrice = req.query.max_price;
                const page = req.query.page;
                const products = yield productModel.FillterProduct(page, limit, category_id, trademark, maxPrice, minPrice);
                if (products.length === 0)
                    return res.status(204).json({ msg: 'no content' });
                return res.status(200).json({ products, max_page: Math.ceil(products[0].max_row / limit) });
            }
            catch (error) {
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        });
    }
    //[GET]: /get-trademarks/:category_id
    GetTradeMarks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category_id = req.params.category_id;
                const trademarks = yield productModel.GetProductTrademarks(category_id);
                if (trademarks.length === 0)
                    return res.status(204).json({ msg: 'no content' });
                return res.status(200).json(trademarks);
            }
            catch (error) {
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        });
    }
    //[GET]: /get-fillter-category
    GetFillterCategorys(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category_id = req.params.category_id || ' ';
                const trademarks = yield productModel.GetProductTrademarks(category_id);
                if (trademarks.length === 0)
                    return res.status(204).json({ msg: 'no content' });
                return res.status(200).json(trademarks);
            }
            catch (error) {
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        });
    }
    //[GET]: /get-colection-category
    GetColectionCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ColectionCategorys = yield productModel.GetColectionCategory();
                if (ColectionCategorys.length === 0)
                    return res.status(204).json({ msg: 'no content' });
                return res.status(200).json(ColectionCategorys);
            }
            catch (error) {
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        });
    }
    //[GET]: /search/:product_name
    SearchProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product_name = req.params.product_name || ' ';
                const products = yield productModel.SearchProduct(product_name);
                if (products.length === 0)
                    return res.status(204).json({ msg: 'no content' });
                return res.status(200).json(products);
            }
            catch (error) {
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        });
    }
    //[GET]: /load-typical-products?category_names=?
    LoadTypicalProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryString = req.query.category_names;
                const results = yield productModel.LoadTypicalProducts(categoryString);
                if (results.length === 0)
                    return res.status(204).json({ msg: 'no content' });
                return res.status(200).json(results);
            }
            catch (error) {
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        });
    }
    //[GET]: /get-related-product?category_id=?&limit=?
    GetRelatedProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category_id = req.query.category_id;
                const limit = req.query.limit;
                const results = yield productModel.GetRelatedProduct(category_id, limit);
                if (results.length === 0)
                    return res.status(204).json({ msg: 'no content' });
                return res.status(200).json(results);
            }
            catch (error) {
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        });
    }
    //[GET]: /sort
    Sort(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const type = req.query.type;
                const key = req.query.key;
                const page = req.query.page;
                const limit = req.query.limit;
                const slug = req.query.category_name;
                const result = yield productModel.Sort(type, key, page, limit, slug);
                if (result.length === 0)
                    return res.status(204).json({ msg: 'no content' });
                return res.status(200).json(result);
            }
            catch (error) {
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        });
    }
}
module.exports = new ProductController();
