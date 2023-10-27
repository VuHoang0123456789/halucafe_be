const Router = require('express').Router();
const CartController = require('../app/controller/cart');
const { auth } = require('../auth/authMiddleware');

Router.get('/get-cart/:customer_id', auth, CartController.GetCart);
Router.post('/add-new-item', auth, CartController.AddNewCartItem);

module.exports = Router;

export {};
