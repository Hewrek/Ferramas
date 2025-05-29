const pool = require('../db');

const getAllSucursales = async () => {
    const [rows] = await pool.query('SELECT * FROM sucursales');
    return rows;
};

const createSucursal = async (nombre, direccion) => {
    const [result] = await pool.query(
        'INSERT INTO sucursales (nombre, direccion) VALUES (?, ?)',
        [nombre, direccion]
    );
    return { id: result.insertId, nombre, direccion };
};

const updateSucursal = async (id, nombre, direccion) => {
    const [sucursal] = await pool.query('SELECT id FROM sucursales WHERE id = ?', [id]);
    if (sucursal.length === 0) {
        return null; // Sucursal no encontrada
    }
    await pool.query(
        'UPDATE sucursales SET nombre = ?, direccion = ? WHERE id = ?',
        [nombre, direccion, id]
    );
    return { id, nombre, direccion };
};

const deleteSucursal = async (id) => {
    const [sucursal] = await pool.query('SELECT id FROM sucursales WHERE id = ?', [id]);
    if (sucursal.length === 0) {
        return null; // Sucursal no encontrada
    }
    await pool.query('DELETE FROM sucursales WHERE id = ?', [id]);
    return { id };
};

module.exports = {
    getAllSucursales,
    createSucursal,
    updateSucursal,
    deleteSucursal
};