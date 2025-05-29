const sucursalService = require('../services/sucursalService');

const getSucursales = async (req, res) => {
    try {
        const sucursales = await sucursalService.getAllSucursales();
        res.json(sucursales);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener sucursales' });
    }
};

const addSucursal = async (req, res) => {
    try {
        const { nombre, direccion } = req.body;
        if (!nombre || !direccion) {
            return res.status(400).json({ error: 'Nombre y dirección son requeridos' });
        }
        const newSucursal = await sucursalService.createSucursal(nombre, direccion);
        res.status(201).json({
            mensaje: 'Sucursal creada exitosamente',
            sucursal: newSucursal
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear sucursal' });
    }
};

const updateSucursal = async (req, res) => {
    try {
        const id = req.params.id;
        const { nombre, direccion } = req.body;
        const updatedSucursal = await sucursalService.updateSucursal(id, nombre, direccion);
        if (!updatedSucursal) {
            return res.status(404).json({ error: 'Sucursal no encontrada' });
        }
        res.json({ mensaje: 'Sucursal actualizada exitosamente', sucursal: updatedSucursal });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar sucursal' });
    }
};

const removeSucursal = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedSucursal = await sucursalService.deleteSucursal(id);
        if (!deletedSucursal) {
            return res.status(404).json({ error: 'Sucursal no encontrada' });
        }
        res.json({ mensaje: 'Sucursal eliminada exitosamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar sucursal' });
    }
};

module.exports = {
    getSucursales,
    addSucursal,
    updateSucursal,
    removeSucursal
};