const { ReturnItems, ReturnItem, ChangeItem } = require('../../../until/method');

interface Order {
    orderId?: string;
    createAt: string;
    deliveryDate: string;
    payStatus: boolean;
    transportStatus: boolean;
    customerId?: number;
    deliveryCost: number;
    payTypeId: number;
    email: string;
    slug: string;
    note: string;
    products: {
        count: number;
        price: number;
        productId: string;
    }[];
}

class OrderModel {
    async GetPayTypes() {
        try {
            const queryStr = `select * from pay_type`;
            const errorMsg = 'OrderModel/GetPayTypes';

            return await ReturnItems(queryStr, errorMsg);
        } catch (error) {
            console.log(error);
        }
    }

    async GetOrders(customerId: number) {
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

            return await ReturnItems(queryStr, errorMsg);
        } catch (error) {
            return null;
        }
    }

    async GetOrderInfo(customerId: number, order_id?: string, slug?: string) {
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

            const order = await ReturnItem(queryOder, errorMsg);

            const queryInfo = `
            select product_name, count, product_of_order.price, url_images_large, url_images_small, slug
            from product_of_order 
                join product on product_of_order.product_id = product.product_id 
            where order_id = ${order.order_id};
            `;

            const order_info = await ReturnItems(queryInfo, errorMsg);

            return {
                order: order,
                orderInfo: order_info,
            };
        } catch (error) {
            return null;
        }
    }

    async AddNewOrder(order: Order) {
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

            return await ChangeItem(queryOder, errorMsg);
        } catch (error) {
            return null;
        }
    }

    async DeleteOrder(orderId: number) {
        try {
            const errorMsg = 'OrderModel/DeleteOrder';
            const queryStr = `call delete_order(${orderId})`;

            return await ChangeItem(queryStr, errorMsg);
        } catch (error) {
            return null;
        }
    }
}

module.exports = new OrderModel();

export {};
