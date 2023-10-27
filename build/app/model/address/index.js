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
const db = require('../../../config/db');
const { ReturnItem } = require('../../../until/method');
class AddressModel {
    GetAddressAddressId(addressId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryStr = `select * from address where address_id = ${addressId}`;
                const errorMsg = 'AddressModel/GetAddressAddressId';
                return yield ReturnItem(queryStr, errorMsg);
            }
            catch (error) {
                return null;
            }
        });
    }
    GetAddressDefault(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryStr = `            
            select * from address 
            where customer_id = (select customer_id from customer where email = '${email}') and is_default = true`;
                const errorMsg = 'AddressModel/GetAddressAddressId';
                return yield ReturnItem(queryStr, errorMsg);
            }
            catch (error) {
                return null;
            }
        });
    }
    GetAddressByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield db();
                const queryStr = `
            select * from address 
            where customer_id = (
                select customer_id 
                from customer 
                where email = '${email}')
            order by address_id asc`;
                const data = yield client.query(queryStr);
                yield client.end();
                return data.rows;
            }
            catch (error) {
                console.log(`Error in AddressModel/GetAddressByEmail: ${error}`);
                return null;
            }
        });
    }
    AddNewAddress(address, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield db(); //tao biến kết nối database
                //Chuỗi query
                const queryStr = `
            insert into 
            address (full_name, phone, address_info, country_name, 
                    province_name, district_name, ward_name, zip_id, customer_id, is_default)
            values ('${address.fullName}', '${address.phone}', '${address.addressInfo}', 
                   '${address.countryName}', '${address.provinceName}', '${address.districtName}', 
                   '${address.wardName}','${address.zipId}', 
                   (select customer_id from customer where email = '${email}'), ${address.isDefault})`;
                //thực thi thêm mới
                const data = yield client.query(queryStr);
                yield client.end(); //Đóng kết nối
                return data;
            }
            catch (error) {
                console.log(`Error in AddressModel/AddNewAddress: ${error}`);
                return null;
            }
        });
    }
    UpdateAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield db(); //tao biến kết nối database
                //Chuỗi query
                const queryStr = `     
            do $$
            begin 
                if ${address.isDefault} then
                    update address set is_default = false where customer_id = ${address.customerId} and is_default = true;
                end if;

                update address 
                set full_name = '${address.fullName}', phone = '${address.phone}', address_info = '${address.addressInfo}', 
                    country_name = '${address.countryName}', province_name= '${address.provinceName}', district_name = '${address.districtName}', 
                    ward_name = '${address.wardName}', zip_id = '${address.zipId}', customer_id = ${address.customerId}, is_default=${address.isDefault}
                where 
                    address_id = ${address.addressId};
            end;
            $$;`;
                //thực thi thêm mới
                const data = yield client.query(queryStr);
                yield client.end(); //Đóng kết nối
                return data;
            }
            catch (error) {
                console.log(`Error in AddressModel/UpdateAddress: ${error}`);
                return null;
            }
        });
    }
    DeleteAddress(addressId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield db(); //tao biến kết nối database
                //Chuỗi query
                const queryStr = `delete from address where address_id = ${addressId}`;
                //thực thi thêm mới
                const data = yield client.query(queryStr);
                yield client.end(); //Đóng kết nối
                return data.rowCount > 0;
            }
            catch (error) {
                console.log(`Error in AddressModel/DeleteAddress: ${error}`);
                return null;
            }
        });
    }
}
module.exports = new AddressModel();
