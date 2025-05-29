const pool = require('../db');

const createFactura = async (usuario_id, producto_id, precio_compra, sucursal_id) => {
    // Validar existencia de referencias (esto también podría ir en el controlador)
    const [usuario] = await pool.query('SELECT id FROM usuarios WHERE id = ?', [usuario_id]);
    const [producto] = await pool.query('SELECT id FROM productos WHERE id = ?', [producto_id]);
    const [sucursal] = await pool.query('SELECT id FROM sucursales WHERE id = ?', [sucursal_id]);

    if (usuario.length === 0 || producto.length === 0 || sucursal.length === 0) {
        return { error: 'Usuario, producto o sucursal no encontrados' };
    }

    const [result] = await pool.query(
        'INSERT INTO factura (usuario_id, producto_id, precio_compra, fecha_compra, sucursal_id) VALUES (?, ?, ?, CURDATE(), ?)',
        [usuario_id, producto_id, precio_compra, sucursal_id]
    );
    return { id: result.insertId };
};

const getAllFacturas = async () => {
    const [rows] = await pool.query(`
        SELECT f.id, f.fecha_compra, f.precio_compra,
               u.nombre as cliente, p.nombre as producto, s.nombre as sucursal
        FROM factura f
        JOIN usuarios u ON f.usuario_id = u.id
        JOIN productos p ON f.producto_id = p.id
        JOIN sucursales s ON f.sucursal_id = s.id
        ORDER BY f.fecha_compra DESC
    `);
    return rows;
};

const deleteFactura = async (id) => {
    const [factura] = await pool.query('SELECT id FROM factura WHERE id = ?', [id]);
    if (factura.length === 0) {
        return null; // Factura no encontrada
    }
    await pool.query('DELETE FROM factura WHERE id = ?', [id]);
    return { id };
};

module.exports = {
    createFactura,
    getAllFacturas,
    deleteFactura
};