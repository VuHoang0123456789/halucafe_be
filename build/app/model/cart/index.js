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
const { ChangeItem, ReturnItems } = require('../../../until/method');
class CartModel {
    getCart(customer_id) {
        return __awaiter(this, void 0, void 0, function* () {
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
                return yield ReturnItems(query, error);
            }
            catch (error) {
                console.log('Error in CartModel/getCart');
                return null;
            }
        });
    }
    AddNewCartItem(cart) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cartStr = cart.products.map((item) => `('${item.product_id}', ${item.count}, ${item.price})`);
                const query = `call add_new_cart_item(${cart.customer_id}, Array[${[...cartStr]}]::cart_item_type[])`;
                const error = 'Error in CartModel/AddNewCartItem';
                return ChangeItem(query, error);
            }
            catch (error) {
                console.log('Error in CartModel/AddNewCartItem');
                return null;
            }
        });
    }
}
module.exports = new CartModel();
