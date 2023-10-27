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
const { FormmatDate } = require('../../../until/method');
const OrderModel = require('../../model/order');
class OrderController {
    //[GET]: /get-pay-types
    GetPayTypes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payTYpe = yield OrderModel.GetPayTypes();
                if (payTYpe.length === 0)
                    return res.status(204).json({ msg: 'no content' });
                return res.status(200).json(payTYpe);
            }
            catch (error) {
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        });
    }
    //[GET]: /get-orders/:customer_id
    LoadOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customerId = req.params.customer_id;
                const orders = yield OrderModel.GetOrders(customerId);
                if (orders.length === 0)
                    return res.status(204).json({ msg: 'no content' });
                return res.status(200).json(orders);
            }
            catch (error) {
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        });
    }
    //[GET]: /get-order-info?slug=?&customer_id=?&order_id=?
    LoadOrderInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const slug = req.query.slug;
                const order_id = req.query.order_id;
                const customerId = req.query.customer_id;
                const orderInfo = yield OrderModel.GetOrderInfo(customerId, order_id, slug);
                if (!orderInfo)
                    return res.status(204).json({ msg: 'no content' });
                return res.status(200).json(orderInfo);
            }
            catch (error) {
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        });
    }
    //[POST]: /add-new-order
    AddNewOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let products = [];
                for (let i = 0; i < req.body.products.length; i++) {
                    products.push({
                        count: req.body.products[i].count,
                        productId: req.body.products[i].product_id,
                        price: req.body.products[i].price,
                    });
                }
                const order = {
                    createAt: FormmatDate(new Date()),
                    deliveryDate: FormmatDate(new Date()),
                    payStatus: false,
                    transportStatus: false,
                    deliveryCost: req.body.deliveryCost,
                    payTypeId: req.body.payTypeId,
                    email: req.body.email,
                    products: products,
                    customerId: req.body.customerId,
                    note: req.body.note,
                    slug: req.body.slug,
                };
                const isAdd = yield OrderModel.AddNewOrder(order);
                if (!isAdd)
                    return res.status(400).json({ msg: 'Bad Request' });
                return res.status(200).json({ msg: 'successfully!' });
            }
            catch (error) {
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        });
    }
    //[PUT]: /delete-order
    DeleteOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderId = req.params.order_id;
                const isDelete = yield OrderModel.DeleteOrder(orderId);
                if (!isDelete)
                    return res.status(400).json({ msg: 'Bad Request' });
                return res.status(200).json({ msg: 'successfully!' });
            }
            catch (error) {
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        });
    }
}
module.exports = new OrderController();
