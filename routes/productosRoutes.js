const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const { authenticateJWT, isAdmin } = require('../auth');

router.get('/', productosController.getProductos);
router.get('/:codigo', productosController.getProducto);
router.get('/buscar/:termino', productosController.searchProductos);
router.get('/:id/stock/:sucursalId', productosController.getStock);
router.put('/:id/stock/:sucursalId', productosController.updateProductStock);
router.put('/:id/precio', authenticateJWT, isAdmin, productosController.updateProductPrice);
router.post('/', authenticateJWT, isAdmin, productosController.addProducto);
router.delete('/:id', authenticateJWT, isAdmin, productosController.removeProducto);
router.get('/stock/bajo', productosController.getLowStockProducts);
router.get('/:codigo/precios', productosController.getProductPriceHistory);
router.get('/precios/fecha', productosController.getPricesByDate);


module.exports = router;