const express = require('express');
const router = express.Router();
const facturasController = require('../controllers/facturasController');

router.post('/', facturasController.addFactura);
router.get('/', facturasController.getFacturas);
router.delete('/:id', facturasController.removeFactura);

module.exports = router;