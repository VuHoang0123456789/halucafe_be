const { ChangeItem, ReturnItems } = require('../../../until/method');

interface dataBody {
    customer_id: number;

    products: {
        count: number;
        price: number;
        product_id: string;
    }[];
}

class CartModel {
    async getCart(customer_id: number) {
        try {
            const query = `
                select
                    category.category_id, category_name, description, 
                    original_number, cart_item.price, product.product_id, product_name, 
                    quantity_sold, sale_percent, sale_status, product.slug, 
                    trademark, url_images_large, url_images_small, category.slug as category_slug, count
                from 
                    cart join cart_item on cart.cart_id = cart_item.cart_id 
                    join product on product.product_id = cart_item.product_id
                    join category on category.category_id = product.category_id
                where 
                    cart.customer_id = ${customer_id}
            `;
            const error = 'Error in CartModel/getCart';

            return await ReturnItems(query, error);
        } catch (error) {
            console.log('Error in CartModel/getCart');
            return null;
        }
    }

    async AddNewCartItem(cart: dataBody) {
        try {
            const cartStr = cart.products.map((item) => `('${item.product_id}', ${item.count}, ${item.price})`);

            const query = `call add_new_cart_item(${cart.customer_id}, Array[${[...cartStr]}]::cart_item_type[])`;

            const error = 'Error in CartModel/AddNewCartItem';

            return ChangeItem(query, error);
        } catch (error) {
            console.log('Error in CartModel/AddNewCartItem');
            return null;
        }
    }
}

module.exports = new CartModel();

export {};
