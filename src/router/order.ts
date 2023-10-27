const router = require('express').Router();
const OrderController = require('../app/controller/order');
const { auth } = require('../auth/authMiddleware');

router.get('/get-pay-types', auth, OrderController.GetPayTypes);
router.get('/get-orders/:customer_id', auth, OrderController.LoadOrders);
router.get('/get-order-info/', auth, OrderController.LoadOrderInfo);
router.post('/add-order-info', auth, OrderController.AddNewOrder);
router.delete('/delete-order/:order_id', OrderController.DeleteOrder);

module.exports = router;

export {};
