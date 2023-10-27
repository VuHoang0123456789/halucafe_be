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
const AddressModel = require('../../model/address');
class AddressController {
    //[GET]: get-address-default
    GetAddressDefault(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const address = yield AddressModel.GetAddressDefault(req.body.email);
                if (!address)
                    return res.status(204).json({ msg: 'no content' });
                if (address.length === 0)
                    return res.status(204).json({ msg: 'no content' });
                return res.status(200).json(address);
            }
            catch (error) {
                console.log(`Error in AddressController/GetAddressDefault: ${error}`);
                return res.status(500).json(error);
            }
        });
    }
    //[GET]: /get-address
    GetAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const address = yield AddressModel.GetAddressByEmail(req.body.email);
                if (!address)
                    return res.status(500).json({ msg: 'Internal Server Error' });
                if (address.length === 0)
                    return res.status(204).json({ msg: 'no content' });
                return res.status(200).json(address);
            }
            catch (error) {
                console.log(`Error in AddressController/GetAddress: ${error}`);
                return res.status(500).json(error);
            }
        });
    }
    //[POST]: /add-new-address
    AddNewAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const address = {
                    fullName: req.body.full_name,
                    phone: req.body.phone,
                    addressInfo: req.body.address_info,
                    countryName: 'Việt Nam',
                    provinceName: req.body.province_name,
                    districtName: req.body.district_name,
                    wardName: req.body.ward_name,
                    zipId: req.body.zip_id,
                    isDefault: req.body.is_default,
                };
                const isInsert = yield AddressModel.AddNewAddress(address, email);
                if (!isInsert)
                    return res.status(400).json({ msg: 'Thêm mới không thành công, vui lòng kiểm tra lại thông tin.' });
                return res.status(201).json({ msg: 'Thêm mới thành công' });
            }
            catch (error) {
                console.log(`Error in AddressController/AddNewAddress: ${error}`);
                return res.status(500).json(error);
            }
        });
    }
    //[POST]: /change-address
    ChangeAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const address = {
                    addressId: req.body.address_id,
                    fullName: req.body.full_name,
                    phone: req.body.phone,
                    addressInfo: req.body.address_info,
                    countryName: req.body.country_name,
                    provinceName: req.body.province_name,
                    districtName: req.body.district_name,
                    wardName: req.body.ward_name,
                    zipId: req.body.zip_id,
                    customerId: req.body.customer_id,
                    isDefault: req.body.is_default,
                };
                const addressInDb = yield AddressModel.GetAddressAddressId(address.addressId);
                let isSuccessfull;
                if (addressInDb)
                    isSuccessfull = yield AddressModel.UpdateAddress(address);
                else
                    isSuccessfull = yield AddressModel.AddNewAddress(address, req.body.email);
                if (!isSuccessfull)
                    return res.status(400).json({ msg: 'Thay đổi không thành công.' });
                return res.status(200).json({ msg: 'Thêm mới thành công' });
            }
            catch (error) {
                console.log(`Error in AddressController/AddNewAddress: ${error}`);
                return res.status(500).json(error);
            }
        });
    }
    //[PUT]: /update-address
    UpdateAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const address = {
                    addressId: req.body.address_id,
                    fullName: req.body.full_name,
                    phone: req.body.phone,
                    addressInfo: req.body.address_info,
                    countryName: req.body.country_name,
                    provinceName: req.body.province_name,
                    districtName: req.body.district_name,
                    wardName: req.body.ward_name,
                    zipId: req.body.zip_id,
                    customerId: req.body.customer_id,
                    isDefault: req.body.is_default,
                };
                const Address = yield AddressModel.GetAddressAddressId(address.addressId);
                if (!Address)
                    return res.status(404).json({ msg: 'not found' });
                const isUpdate = yield AddressModel.UpdateAddress(address);
                if (!isUpdate)
                    return res.status(400).json({ msg: 'Cập nhật không thành công, vui lòng kiểm tra lại thông tin.' });
                return res.status(200).json({ msg: 'Cập nhật thành công' });
            }
            catch (error) {
                console.log(`Error in AddressController/UpdateAddress: ${error}`);
                return res.status(500).json(error);
            }
        });
    }
    //[Delete]: /delete-address/:addressid
    DeleteAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isDelete = yield AddressModel.DeleteAddress(req.params.addressid);
                if (!isDelete)
                    return res.status(400).json({ msg: 'Xóa không thành công, vui lòng kiểm tra lại thông tin.' });
                return res.status(200).json({ msg: 'Xóa thành công' });
            }
            catch (error) {
                console.log(`Error in AddressController/DeleteAddress: ${error}`);
                return res.status(500).json(error);
            }
        });
    }
}
module.exports = new AddressController();
