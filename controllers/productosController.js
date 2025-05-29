const productoService = require('../services/productoService');

const getProductos = async (req, res) => {
    try {
        const productos = await productoService.getAllProductos();
        res.json(productos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

const getProducto = async (req, res) => {
    try {
        const codigo = req.params.codigo;
        const producto = await productoService.getProductoByCodigo(codigo);
        if (producto) {
            res.json(producto);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al buscar producto' });
    }
};

const searchProductos = async (req, res) => {
    try {
        const termino = req.params.termino;
        const productos = await productoService.searchProductos(termino);
        res.json(productos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en la búsqueda' });
    }
};

const getStock = async (req, res) => {
    try {
        const { id, sucursalId } = req.params;
        const stock = await productoService.getStockBySucursal(id, sucursalId);
        if (stock) {
            res.json({ cantidad: stock.cantidad });
        } else {
            res.status(404).json({ error: 'Stock no encontrado' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener stock' });
    }
};

const updateProductStock = async (req, res) => {
    try {
        const { id, sucursalId } = req.params;
        const { cantidad } = req.body;

        if (typeof cantidad !== 'number') {
            return res.status(400).json({ error: 'Cantidad debe ser un número' });
        }

        const updatedStock = await productoService.updateStock(id, sucursalId, cantidad);
        res.json({
            mensaje: `Stock actualizado. Nueva cantidad: ${updatedStock.cantidad}`,
            producto_id: updatedStock.producto_id,
            sucursal_id: updatedStock.sucursal_id,
            cantidad: updatedStock.cantidad
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar stock' });
    }
};

const updateProductPrice = async (req, res) => {
    try {
        const id = req.params.id;
        const { precio } = req.body;

        if (typeof precio === 'undefined' || precio === null) {
            return res.status(400).json({ error: 'El campo "precio" es requerido' });
        }

        const precioNum = parseFloat(precio);
        if (isNaN(precioNum)) {
            return res.status(400).json({ error: 'Precio debe ser un número válido' });
        }

        const result = await productoService.updatePrecio(id, precioNum);
        if (!result) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json({
            mensaje: 'Precio actualizado',
            precio_actual: result.precio_actual,
            fecha_actualizacion: result.fecha_actualizacion
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar precio' });
    }
};

const addProducto = async (req, res) => {
    try {
        const { num_serial, marca, codigo, nombre, categoria, precio } = req.body;

        if (!codigo || !nombre || !marca || !precio) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const newProduct = await productoService.createProducto({ num_serial, marca, codigo, nombre, categoria, precio });
        if (newProduct.error) {
            return res.status(400).json({ error: newProduct.error });
        }

        res.status(201).json({
            mensaje: 'Producto creado exitosamente',
            producto: newProduct
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear producto' });
    }
};

const removeProducto = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedProduct = await productoService.deleteProducto(id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({
            mensaje: 'Producto eliminado exitosamente',
            producto: deletedProduct
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
};

const getLowStockProducts = async (req, res) => {
    try {
        const maxStock = parseInt(req.query.max) || 5;
        const products = await productoService.getProductosBajoStock(maxStock);
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener productos con bajo stock' });
    }
};

const getProductPriceHistory = async (req, res) => {
    try {
        const codigo = req.params.codigo;
        const historial = await productoService.getHistorialPrecios(codigo);
        if (!historial) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({
            codigo_producto: codigo,
            historial_precios: historial
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener historial de precios' });
    }
};

const getPricesByDate = async (req, res) => {
    try {
        const fecha = req.query.fecha;
        if (!fecha) {
            return res.status(400).json({ error: 'Parámetro "fecha" es requerido (YYYY-MM-DD)' });
        }
        const productos = await productoService.getPreciosPorFecha(fecha);
        res.json(productos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener precios por fecha' });
    }
};

module.exports = {
    getProductos,
    getProducto,
    searchProductos,
    getStock,
    updateProductStock,
    updateProductPrice,
    addProducto,
    removeProducto,
    getLowStockProducts,
    getProductPriceHistory,
    getPricesByDate
};