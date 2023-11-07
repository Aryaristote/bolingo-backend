const { Router } = require('express');
const stripeController = require('../controllers/stripeController');

const router = Router();

router.post('/payment', stripeController.create);
router.get('/all-payment', stripeController.read); 
router.post('/pay-cash', stripeController.payCash); 
//Paystack test
router.post('/initialize-payment', stripeController.createPayment);

module.exports = router;