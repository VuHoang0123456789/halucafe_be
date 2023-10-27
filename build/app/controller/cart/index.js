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
const CartModel = require('../../model/cart');
class CartController {
    //[GET]: /cart/get-cart/:customer_id
    GetCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customer_id = req.params.customer_id;
                const cartItems = yield CartModel.getCart(customer_id);
                if (cartItems.length === 0)
                    return res.status(204).json({ msg: 'no content' });
                return res.status(200).json(cartItems);
            }
            catch (error) {
                return res.status(500).json('Internal Server');
            }
        });
    }
    // [POST] : /cart/add-new-item
    AddNewCartItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const carts = req.body;
                const isValid = yield CartModel.AddNewCartItem(carts);
                if (!isValid)
                    return res.status(400).json({ msg: 'Thêm mới phần tử không thành công.' });
                return res.status(201).json({ msg: 'Thêm mới phần tử thành công.' });
            }
            catch (error) {
                return res.status(500).json('Internal Server');
            }
        });
    }
}
module.exports = new CartController();
