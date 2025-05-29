const pool = require('../db'); // Acceso directo a la base de datos aquí, o podrías tener una capa DAL/repository dedicada.

const getAllProductos = async () => {
    const [rows] = await pool.query('SELECT * FROM productos');
    return rows;
};

const getProductoByCodigo = async (codigo) => {
    const [rows] = await pool.query('SELECT * FROM productos WHERE codigo = ?', [codigo]);
    return rows[0];
};

const searchProductos = async (termino) => {
    const searchTerm = `%${termino.toLowerCase()}%`;
    const [rows] = await pool.query(
        'SELECT * FROM productos WHERE LOWER(nombre) LIKE ? OR LOWER(marca) LIKE ? OR LOWER(categoria) LIKE ?',
        [searchTerm, searchTerm, searchTerm]
    );
    return rows;
};

const getStockBySucursal = async (productoId, sucursalId) => {
    const [rows] = await pool.query(
        'SELECT cantidad FROM stock_sucursal WHERE producto_id = ? AND sucursal_id = ?',
        [productoId, sucursalId]
    );
    return rows[0];
};

const updateStock = async (productoId, sucursalId, cantidad) => {
    const [check] = await pool.query(
        'SELECT * FROM stock_sucursal WHERE producto_id = ? AND sucursal_id = ?',
        [productoId, sucursalId]
    );

    if (check.length === 0) {
        await pool.query(
            'INSERT INTO stock_sucursal (producto_id, sucursal_id, cantidad) VALUES (?, ?, ?)',
            [productoId, sucursalId, cantidad]
        );
    } else {
        await pool.query(
            'UPDATE stock_sucursal SET cantidad = ? WHERE producto_id = ? AND sucursal_id = ?',
            [cantidad, productoId, sucursalId]
        );
    }
    return { producto_id: productoId, sucursal_id: sucursalId, cantidad };
};

const updatePrecio = async (id, precio) => {
    const [producto] = await pool.query('SELECT historial_precio FROM productos WHERE id = ?', [id]);
    if (producto.length === 0) {
        return null; // Producto no encontrado
    }

    const precioRedondeado = Math.round(parseFloat(precio) * 100) / 100;
    const historial = producto[0].historial_precio ?
        `${producto[0].historial_precio}|${new Date().toISOString()}:${precioRedondeado}` :
        `${new Date().toISOString()}:${precioRedondeado}`;

    await pool.query(
        'UPDATE productos SET precio = ?, fecha_precio = ?, historial_precio = ? WHERE id = ?',
        [precioRedondeado, new Date(), historial, id]
    );
    return { precio_actual: precioRedondeado, fecha_actualizacion: new Date().toISOString() };
};

const createProducto = async ({ num_serial, marca, codigo, nombre, categoria, precio }) => {
    const [existe] = await pool.query('SELECT id FROM productos WHERE codigo = ?', [codigo]);
    if (existe.length > 0) {
        return { error: 'El código de producto ya existe' };
    }

    const [result] = await pool.query(
        'INSERT INTO productos (num_serial, marca, codigo, nombre, categoria, fecha_precio, precio, historial_precio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
            num_serial || '',
            marca,
            codigo,
            nombre,
            categoria || '',
            new Date(),
            precio,
            `${new Date().toISOString()}:${precio}`
        ]
    );
    const [nuevoProducto] = await pool.query('SELECT * FROM productos WHERE id = ?', [result.insertId]);
    return nuevoProducto[0];
};

const deleteProducto = async (id) => {
    const [producto] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
    if (producto.length === 0) {
        return null; // Producto no encontrado
    }
    await pool.query('DELETE FROM productos WHERE id = ?', [id]);
    return producto[0];
};

const getProductosBajoStock = async (maxStock) => {
    const [rows] = await pool.query(`
        SELECT p.id, p.codigo, p.nombre, p.marca, p.precio,
               ss.sucursal_id, s.nombre as sucursal_nombre, ss.cantidad
        FROM productos p
        JOIN stock_sucursal ss ON p.id = ss.producto_id
        JOIN sucursales s ON ss.sucursal_id = s.id
        WHERE ss.cantidad <= ?
        ORDER BY ss.cantidad ASC
    `, [maxStock]);
    return rows;
};

const getHistorialPrecios = async (codigo) => {
    const [producto] = await pool.query('SELECT historial_precio FROM productos WHERE codigo = ?', [codigo]);
    if (producto.length === 0) {
        return null; // Producto no encontrado
    }

    const historial = producto[0].historial_precio
        ? producto[0].historial_precio.split('|').map(item => {
            const [fecha, precio] = item.split(':');
            return { fecha, precio: parseFloat(precio) };
        })
        : [];
    return historial;
};

const getPreciosPorFecha = async (fecha) => {
    const [productos] = await pool.query(`
        SELECT id, codigo, nombre, precio, fecha_precio
        FROM productos
        WHERE DATE(fecha_precio) = ?
    `, [fecha]);
    return productos;
};


module.exports = {
    getAllProductos,
    getProductoByCodigo,
    searchProductos,
    getStockBySucursal,
    updateStock,
    updatePrecio,
    createProducto,
    deleteProducto,
    getProductosBajoStock,
    getHistorialPrecios,
    getPreciosPorFecha
};