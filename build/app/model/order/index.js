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
const { ReturnItems, ReturnItem, ChangeItem } = require('../../../until/method');
class OrderModel {
    GetPayTypes() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryStr = `select * from pay_type`;
                const errorMsg = 'OrderModel/GetPayTypes';
                return yield ReturnItems(queryStr, errorMsg);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    GetOrders(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryStr = `
            select 
                orders.order_id, create_at, full_address, ( order_values + delivery_cost) as total, 
                pay_status, transport_status
            from orders
            join 
                (
                    select 
                        customer.customer_id, 
                        concat(ward_name, ', ', district_name, ', ', province_name, ', ', country_name) as full_address
                    from 
                        address join customer on address.customer_id = customer.customer_id
                    where 
                        customer.customer_id = ${customerId} and is_default = true
                ) as addressAlas on addressAlas.customer_id = orders.customer_id
            join 
            (
                select 
                    order_id, sum(price) as order_values
                from product_of_order
                group by order_id
            ) as orderValuesAlas on orderValuesAlas.order_id = orders.order_id
            order by order_id;`;
                const errorMsg = 'OrderModel/GetOrders';
                return yield ReturnItems(queryStr, errorMsg);
            }
            catch (error) {
                return null;
            }
        });
    }
    GetOrderInfo(customerId, order_id, slug) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errorMsg = 'OrderModel/GetOrderInfo';
                const queryOder = `
            select 
                orders.order_id, create_at, delivery_date, full_address, pay_status, 
                delivery_cost, transport_status, pay_type_name
            from orders
            join pay_type on pay_type.pay_type_id = orders.pay_type_id
            join 
                (
                    select 
                        customer.customer_id, 
                        concat(ward_name, ', ', district_name, ', ', province_name, ', ', country_name) as full_address
                    from 
                        address join customer on address.customer_id = customer.customer_id
                    where 
                        customer.customer_id = ${customerId} and is_default = true
                ) as addressAlas on addressAlas.customer_id = orders.customer_id
            where ${order_id ? `orders.order_id = '${order_id}'` : `slug = '${slug}'`};
            `;
                const order = yield ReturnItem(queryOder, errorMsg);
                const queryInfo = `
            select product_name, count, product_of_order.price, url_images_large, url_images_small, slug
            from product_of_order 
                join product on product_of_order.product_id = product.product_id 
            where order_id = ${order.order_id};
            `;
                const order_info = yield ReturnItems(queryInfo, errorMsg);
                return {
                    order: order,
                    orderInfo: order_info,
                };
            }
            catch (error) {
                return null;
            }
        });
    }
    AddNewOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errorMsg = 'OrderModel/AddNewOrder';
                const str = order.products.map((item) => `(${item.count}, ${item.price},'${item.productId}')`);
                const queryOder = `
            call Add_new_order(
                row('${order.createAt}', '${order.deliveryDate}', ${order.payStatus},
                ${order.transportStatus}, ${order.deliveryCost}, ${order.payTypeId}, 
                '${order.email}', '${order.slug}', '${order.note}', ${order.customerId}),
                ARRAY[${str}]::product_of_order_type[]
            );`;
                return yield ChangeItem(queryOder, errorMsg);
            }
            catch (error) {
                return null;
            }
        });
    }
    DeleteOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errorMsg = 'OrderModel/DeleteOrder';
                const queryStr = `call delete_order(${orderId})`;
                return yield ChangeItem(queryStr, errorMsg);
            }
            catch (error) {
                return null;
            }
        });
    }
}
module.exports = new OrderModel();
