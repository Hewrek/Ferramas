const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { authenticateJWT, isAdmin } = require('../auth');

router.get('/', authenticateJWT, isAdmin, usuariosController.getUsers);
router.post('/', authenticateJWT, isAdmin, usuariosController.addUser);
router.put('/:id', authenticateJWT, isAdmin, usuariosController.updateUser);
router.delete('/:id', authenticateJWT, isAdmin, usuariosController.removeUser);

module.exports = router;