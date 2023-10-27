const router = require('express').Router();
const AddressController = require('../app/controller/address');
const { auth } = require('../auth/authMiddleware');

router.get('/get-address-default', auth, AddressController.GetAddressDefault);
router.get('/get-address', auth, AddressController.GetAddress);
router.post('/add-new-address', auth, AddressController.AddNewAddress);
router.post('/change-address', auth, AddressController.ChangeAddress);
router.put('/update-address', auth, AddressController.UpdateAddress);
router.delete('/delete-address/:addressid', auth, AddressController.DeleteAddress);

module.exports = router;

export {};
