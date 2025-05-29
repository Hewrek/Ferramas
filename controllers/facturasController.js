const facturaService = require('../services/facturaService');

const addFactura = async (req, res) => {
    try {
        const { usuario_id, producto_id, precio_compra, sucursal_id } = req.body;
        if (!usuario_id || !producto_id || !precio_compra || !sucursal_id) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }
        const newFactura = await facturaService.createFactura(usuario_id, producto_id, precio_compra, sucursal_id);
        if (newFactura.error) {
            return res.status(400).json({ error: newFactura.error });
        }
        res.status(201).json({
            mensaje: 'Factura creada exitosamente',
            factura_id: newFactura.id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear factura' });
    }
};

const getFacturas = async (req, res) => {
    try {
        const facturas = await facturaService.getAllFacturas();
        res.json(facturas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener facturas' });
    }
};

const removeFactura = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedFactura = await facturaService.deleteFactura(id);
        if (!deletedFactura) {
            return res.status(404).json({ error: 'Factura no encontrada' });
        }
        res.json({ mensaje: 'Factura eliminada exitosamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar factura' });
    }
};

module.exports = {
    addFactura,
    getFacturas,
    removeFactura
};