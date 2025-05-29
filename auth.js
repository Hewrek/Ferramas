const jwt = require('jsonwebtoken');
const pool = require('./db');

// Clave secreta para JWT (¡cambiar por una más segura en producción!)
const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                console.error('Error al verificar JWT:', err);
                return res.sendStatus(403); // Prohibido
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401); // No autorizado
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.rol === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
    }
};

module.exports = {
    authenticateJWT,
    isAdmin,
    JWT_SECRET
};