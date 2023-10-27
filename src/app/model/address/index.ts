const db = require('../../../config/db');
const { ReturnItem } = require('../../../until/method');

interface Address {
    addressId?: number;
    fullName: string;
    phone: string;
    addressInfo: string;
    countryName: string;
    provinceName: string;
    districtName: string;
    wardName: string;
    zipId: string;
    customerId?: number;
    isDefault: boolean;
}

class AddressModel {
    async GetAddressAddressId(addressId: string) {
        try {
            const queryStr = `select * from address where address_id = ${addressId}`;
            const errorMsg = 'AddressModel/GetAddressAddressId';

            return await ReturnItem(queryStr, errorMsg);
        } catch (error) {
            return null;
        }
    }

    async GetAddressDefault(email: string) {
        try {
            const queryStr = `            
            select * from address 
            where customer_id = (select customer_id from customer where email = '${email}') and is_default = true`;
            const errorMsg = 'AddressModel/GetAddressAddressId';

            return await ReturnItem(queryStr, errorMsg);
        } catch (error) {
            return null;
        }
    }

    async GetAddressByEmail(email: string) {
        try {
            const client = await db();
            const queryStr = `
            select * from address 
            where customer_id = (
                select customer_id 
                from customer 
                where email = '${email}')
            order by address_id asc`;

            const data = await client.query(queryStr);
            await client.end();

            return data.rows;
        } catch (error) {
            console.log(`Error in AddressModel/GetAddressByEmail: ${error}`);
            return null;
        }
    }

    async AddNewAddress(address: Address, email: string) {
        try {
            const client = await db(); //tao biến kết nối database
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
            const data = await client.query(queryStr);
            await client.end(); //Đóng kết nối
            return data;
        } catch (error) {
            console.log(`Error in AddressModel/AddNewAddress: ${error}`);
            return null;
        }
    }

    async UpdateAddress(address: Address) {
        try {
            const client = await db(); //tao biến kết nối database
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
            const data = await client.query(queryStr);
            await client.end(); //Đóng kết nối
            return data;
        } catch (error) {
            console.log(`Error in AddressModel/UpdateAddress: ${error}`);
            return null;
        }
    }

    async DeleteAddress(addressId: number) {
        try {
            const client = await db(); //tao biến kết nối database
            //Chuỗi query
            const queryStr = `delete from address where address_id = ${addressId}`;

            //thực thi thêm mới

            const data = await client.query(queryStr);
            await client.end(); //Đóng kết nối
            return data.rowCount > 0;
        } catch (error) {
            console.log(`Error in AddressModel/DeleteAddress: ${error}`);
            return null;
        }
    }
}

module.exports = new AddressModel();

export {};
