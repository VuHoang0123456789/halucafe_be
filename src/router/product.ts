const express = require('express');
const router = express.Router();
const productControlller = require('../app/controller/product');

router.get('/get-trademarks/:category_id', productControlller.GetTradeMarks);
router.get('/get-trademarks', productControlller.GetTradeMarks);
router.get('/get-products/', productControlller.GetProducts);
router.get('/get-hot-products/', productControlller.GetHotProducts);
router.get('/get-product/:slug', productControlller.GetProduct);
router.post('/get-load-home/:category_name/', productControlller.LoadProductOfHome);
router.get('/get-products/:category_name/', productControlller.GetProductsByCategoryName);
router.get('/fillter-product/', productControlller.FillterProduct);
router.get('/get-colection-category', productControlller.GetColectionCategory);
router.get('/search/:product_name', productControlller.SearchProducts);
router.get('/load-typical-products/', productControlller.LoadTypicalProducts);
router.get('/get-related-product/', productControlller.GetRelatedProduct);
router.get('/sort/', productControlller.Sort);

module.exports = router;

export {};
