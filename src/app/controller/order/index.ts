import { Request, Response } from 'express';
const { FormmatDate } = require('../../../until/method');
const OrderModel = require('../../model/order');

class OrderController {
    //[GET]: /get-pay-types
    async GetPayTypes(req: Request, res: Response) {
        try {
            const payTYpe = await OrderModel.GetPayTypes();

            if (payTYpe.length === 0) return res.status(204).json({ msg: 'no content' });

            return res.status(200).json(payTYpe);
        } catch (error) {
            return res.status(500).json({ msg: 'Internal Server Error' });
        }
    }
    //[GET]: /get-orders/:customer_id
    async LoadOrders(req: Request, res: Response) {
        try {
            const customerId = req.params.customer_id;
            const orders = await OrderModel.GetOrders(customerId);

            if (orders.length === 0) return res.status(204).json({ msg: 'no content' });

            return res.status(200).json(orders);
        } catch (error) {
            return res.status(500).json({ msg: 'Internal Server Error' });
        }
    }

    //[GET]: /get-order-info?slug=?&customer_id=?&order_id=?
    async LoadOrderInfo(req: Request, res: Response) {
        try {
            const slug = req.query.slug;
            const order_id = req.query.order_id;
            const customerId = req.query.customer_id;

            const orderInfo = await OrderModel.GetOrderInfo(customerId, order_id, slug);

            if (!orderInfo) return res.status(204).json({ msg: 'no content' });

            return res.status(200).json(orderInfo);
        } catch (error) {
            return res.status(500).json({ msg: 'Internal Server Error' });
        }
    }

    //[POST]: /add-new-order
    async AddNewOrder(req: Request, res: Response) {
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

            const isAdd = await OrderModel.AddNewOrder(order);

            if (!isAdd) return res.status(400).json({ msg: 'Bad Request' });

            return res.status(200).json({ msg: 'successfully!' });
        } catch (error) {
            return res.status(500).json({ msg: 'Internal Server Error' });
        }
    }

    //[PUT]: /delete-order
    async DeleteOrder(req: Request, res: Response) {
        try {
            const orderId = req.params.order_id;

            const isDelete = await OrderModel.DeleteOrder(orderId);

            if (!isDelete) return res.status(400).json({ msg: 'Bad Request' });

            return res.status(200).json({ msg: 'successfully!' });
        } catch (error) {
            return res.status(500).json({ msg: 'Internal Server Error' });
        }
    }
}

module.exports = new OrderController();
