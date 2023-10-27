import { Request, Response } from 'express';
const CartModel = require('../../model/cart');

class CartController {
    //[GET]: /cart/get-cart/:customer_id
    async GetCart(req: Request, res: Response) {
        try {
            const customer_id = req.params.customer_id;
            const cartItems = await CartModel.getCart(customer_id);

            if (cartItems.length === 0) return res.status(204).json({ msg: 'no content' });

            return res.status(200).json(cartItems);
        } catch (error) {
            return res.status(500).json('Internal Server');
        }
    }

    // [POST] : /cart/add-new-item
    async AddNewCartItem(req: Request, res: Response) {
        try {
            const carts = req.body;
            const isValid = await CartModel.AddNewCartItem(carts);

            if (!isValid) return res.status(400).json({ msg: 'Thêm mới phần tử không thành công.' });

            return res.status(201).json({ msg: 'Thêm mới phần tử thành công.' });
        } catch (error) {
            return res.status(500).json('Internal Server');
        }
    }
}

module.exports = new CartController();

export {};
