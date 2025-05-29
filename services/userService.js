const pool = require('../db');

const getAllUsers = async () => {
    const [rows] = await pool.query('SELECT id, nombre, rol FROM usuarios');
    return rows;
};

const createUser = async (nombre, contrasena, rol) => {
    const [existe] = await pool.query('SELECT id FROM usuarios WHERE nombre = ?', [nombre]);
    if (existe.length > 0) {
        return { error: 'El nombre de usuario ya existe' };
    }
    const [result] = await pool.query(
        'INSERT INTO usuarios (nombre, contrasena, rol) VALUES (?, ?, ?)',
        [nombre, contrasena, rol]
    );
    return { id: result.insertId, nombre, rol };
};

const updateUser = async (id, nombre, contrasena, rol) => {
    const [usuario] = await pool.query('SELECT id FROM usuarios WHERE id = ?', [id]);
    if (usuario.length === 0) {
        return null; // Usuario no encontrado
    }
    await pool.query(
        'UPDATE usuarios SET nombre = ?, contrasena = ?, rol = ? WHERE id = ?',
        [nombre, contrasena, rol, id]
    );
    return { id, nombre, contrasena, rol };
};

const deleteUser = async (id) => {
    const [usuario] = await pool.query('SELECT id FROM usuarios WHERE id = ?', [id]);
    if (usuario.length === 0) {
        return null; // Usuario no encontrado
    }
    await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
    return { id };
};

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
};