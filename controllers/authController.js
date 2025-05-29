const jwt = require('jsonwebtoken');
const pool = require('../db');
const { JWT_SECRET } = require('../auth'); // Importar la clave secreta

const login = async (req, res) => {
    const { nombre, contrasena } = req.body;

    try {
        const [rows] = await pool.query('SELECT id, nombre, rol FROM usuarios WHERE nombre = ? AND contrasena = ?', [nombre, contrasena]);

        if (rows.length > 0) {
            const user = rows[0];
            // Generar un token JWT
            const token = jwt.sign({ id: user.id, nombre: user.nombre, rol: user.rol }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ message: 'Inicio de sesión exitoso', token });
        } else {
            res.status(401).json({ message: 'Credenciales inválidas' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor al intentar iniciar sesión' });
    }
};

module.exports = {
    login
};