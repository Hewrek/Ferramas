const pool = require('../db');

const createConsulta = async (usuario_id, asunto, mensaje) => {
    const [usuario] = await pool.query('SELECT id FROM usuarios WHERE id = ?', [usuario_id]);
    if (usuario.length === 0) {
        return { error: 'Usuario no encontrado' };
    }

    const [result] = await pool.query(
        'INSERT INTO consultas (usuario_id, asunto, mensaje) VALUES (?, ?, ?)',
        [usuario_id, asunto, mensaje]
    );
    return { id: result.insertId };
};

const getAllConsultas = async () => {
    const [rows] = await pool.query(`
        SELECT c.id, c.asunto, c.mensaje, c.fecha, c.estado,
               u.nombre as usuario_nombre
        FROM consultas c
        JOIN usuarios u ON c.usuario_id = u.id
        ORDER BY c.fecha DESC
    `);
    return rows;
};

const getConsultaEstado = async (id) => {
    const [consulta] = await pool.query('SELECT estado FROM consultas WHERE id = ?', [id]);
    return consulta[0]; // Retorna el objeto {estado: 'activo'} o undefined
};

const deleteConsulta = async (id) => {
    const [consulta] = await pool.query('SELECT id FROM consultas WHERE id = ?', [id]);
    if (consulta.length === 0) {
        return null; // Consulta no encontrada
    }
    await pool.query('DELETE FROM consultas WHERE id = ?', [id]);
    return { id };
};

module.exports = {
    createConsulta,
    getAllConsultas,
    getConsultaEstado,
    deleteConsulta
};