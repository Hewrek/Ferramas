// routes/webpayRoutes.js
const express = require('express');
const router = express.Router();
const webpayController = require('../controllers/webpayController');

// Ruta principal para mostrar el formulario de pago
router.get('/', webpayController.renderPaymentForm); // Esta ruta podría estar en otra parte si tu frontend es SPA

// Ruta para iniciar el proceso de pago
router.post('/pay', webpayController.initiatePayment);

// Ruta de retorno de Transbank después de que el usuario interactúa
// ¡IMPORTANTE!: Permite POST y GET para el endpoint /result
router.post('/result', webpayController.handlePaymentResult);
router.get('/result', webpayController.handlePaymentResult); // <--- ¡AÑADE ESTA LÍNEA!

module.exports = router;