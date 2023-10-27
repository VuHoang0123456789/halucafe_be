import { Request, Response } from 'express';

const productModel = require('../../model/product');
const dotenv = require('dotenv');
dotenv.config();

interface Message {
    statusCode: number;
    content?: any;
    error?: any;
}

let Message = {} as Message;

class ProductController {
    //Làm phân trang
    //[GET]: /product/get-product/:slug
    async GetProduct(req: any, res: any) {
        try {
            const slug = req.params.slug;
            const product = await productModel.GetProductBySlug(slug);
            if (!product) return res.status(204).json({ content: 'no content' });

            return res.status(200).json(product);
        } catch (error) {
            return res.status(500).json({ msg: 'Internal Server Error' });
        }
    }

    //[GET]: /product/get-products?page=?&limit=?
    async GetProducts(req: any, res: any) {
        try {
            const startIndex = req.query.page; //Giá trị bắt đầu
            const limit = req.query.limit; //Giới hạn lấy

            const products = await productModel.GetProducts(startIndex, limit);
            if (products.length === 0) return res.status(204).json({ msg: 'no content' });

            return res.status(200).json({ products, max_page: Math.ceil(products[0].max_row / limit) });
        } catch (error) {
            return res.status(500).json({ msg: 'Internal Server Error' });
        }
    }

    //[GET]: /product/get-hot-products?limit=?
    async GetHotProducts(req: any, res: any) {
        try {
            const limit = req.query.limit;

            const products = await productModel.GetHotProducts(limit);
            if (products.length === 0) return res.status(204).json({ msg: 'no content' });

            return res.status(200).json(products);
        } catch (error) {
            return res.status(500).json({ msg: 'Internal Server Error' });
        }
    }

    //[GET]: /products/get-products/:category_name?page=?&limit=?
    async GetProductsByCategoryName(req: any, res: any) {
        try {
            const startIndex = req.query.page;
            const limit = req.query.limit;
            const categoryName = req.params.category_name;

            const products = await productModel.GetProductsByCategoryName(startIndex, limit, categoryName);
            if (products.length === 0) return res.status(204).json({ msg: 'no content' });

            return res.status(200).json({ products, max_page: Math.ceil(products[0].max_row / limit) });
        } catch (error) {
            return res.status(500).json({ msg: 'Internal Server Error' });
        }
    }

    //[GET]: /product/get-load-home/:category_name?limit=?
    async LoadProductOfHome(req: any, res: any) {
        try {
            const category_name = req.params.category_name;
            const productNames = req.body.productNames;
            const limit = req.query.limit;

            const products = await productModel.LoadProductCoffeeOfHome(category_name, productNames, limit);
            if (products.length === 0) return res.status(204).json({ msg: 'no content' });

            return res.status(200).json(products);
        } catch (error) {
            return res.status(500).json({ msg: 'Internal Server Error' });
        }
    }

    //[GET]: /fillter-product?category_id=?&trademark=?&min_price=?&max_price=?&?page=?&limit=?
    async FillterProduct(req: any, res: any) {
        try {
            const category_id = req.query.category_id;
            const trademark = req.query.trademark;
            const limit = req.query.limit;
            const minPrice = req.query.min_price;
            const maxPrice = req.query.max_price;
            const page = req.query.page;

            const products = await productModel.FillterProduct(page, limit, category_id, trademark, maxPrice, minPrice);
            if (products.length === 0) return res.status(204).json({ msg: 'no content' });

            return res.status(200).json({ products, max_page: Math.ceil(products[0].max_row / limit) });
        } catch (error) {
            return res.status(500).json({ msg: 'Internal Server Error' });
        }
    }

    //[GET]: /get-trademarks/:category_id
    async GetTradeMarks(req: any, res: any) {
        try {
            const category_id = req.params.category_id;

            const trademarks = await productModel.GetProductTrademarks(category_id);

            if (trademarks.length === 0) return res.status(204).json({ msg: 'no content' });

            return res.status(200).json(trademarks);
        } catch (error) {
            return res.status(500).json({ msg: 'Internal Server Error' });
        }
    }

    //[GET]: /get-fillter-category
    async GetFillterCategorys(req: any, res: any) {
        try {
            const category_id = req.params.category_id || ' ';

            const trademarks = await productModel.GetProductTrademarks(category_id);

            if (trademarks.length === 0) return res.status(204).json({ msg: 'no content' });

            return res.status(200).json(trademarks);
        } catch (error) {
            return res.status(500).json({ msg: 'Internal Server Error' });
        }
    }

    //[GET]: /get-colection-category
    async GetColectionCategory(req: any, res: any) {
        try {
            const ColectionCategorys = await productModel.GetColectionCategory();

            if (ColectionCategorys.length === 0) return res.status(204).json({ msg: 'no content' });

            return res.status(200).json(ColectionCategorys);
        } catch (error) {
            return res.status(500).json({ msg: 'Internal Server Error' });
        }
    }

    //[GET]: /search/:product_name
    async SearchProducts(req: any, res: any) {
        try {
            const product_name = req.params.product_name || ' ';
            const products = await productModel.SearchProduct(product_name);

            if (products.length === 0) return res.status(204).json({ msg: 'no content' });

            return res.status(200).json(products);
        } catch (error) {
            return res.status(500).json({ msg: 'Internal Server Error' });
        }
    }

    //[GET]: /load-typical-products?category_names=?
    async LoadTypicalProducts(req: any, res: any) {
        try {
            const categoryString = req.query.category_names;
            const results = await productModel.LoadTypicalProducts(categoryString);

            if (results.length === 0) return res.status(204).json({ msg: 'no content' });

            return res.status(200).json(results);
        } catch (error) {
            return res.status(500).json({ msg: 'Internal Server Error' });
        }
    }

    //[GET]: /get-related-product?category_id=?&limit=?
    async GetRelatedProduct(req: any, res: any) {
        try {
            const category_id = req.query.category_id;
            const limit = req.query.limit;

            const results = await productModel.GetRelatedProduct(category_id, limit);

            if (results.length === 0) return res.status(204).json({ msg: 'no content' });

            return res.status(200).json(results);
        } catch (error) {
            return res.status(500).json({ msg: 'Internal Server Error' });
        }
    }
    //[GET]: /sort
    async Sort(req: Request, res: Response) {
        try {
            const type = req.query.type;
            const key = req.query.key;
            const page = req.query.page;
            const limit = req.query.limit;
            const slug = req.query.category_name;

            const result = await productModel.Sort(type, key, page, limit, slug);

            if (result.length === 0) return res.status(204).json({ msg: 'no content' });

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ msg: 'Internal Server Error' });
        }
    }
}

module.exports = new ProductController();

export {};
