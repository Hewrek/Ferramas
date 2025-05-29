const express = require('express');
const router = express.Router();
const sucursalesController = require('../controllers/sucursalesController');
const { authenticateJWT, isAdmin } = require('../auth');

router.get('/', sucursalesController.getSucursales);
router.post('/', authenticateJWT, isAdmin, sucursalesController.addSucursal);
router.put('/:id', authenticateJWT, isAdmin, sucursalesController.updateSucursal);
router.delete('/:id', authenticateJWT, isAdmin, sucursalesController.removeSucursal);

module.exports = router;