const express = require('express');
const router = express.Router();
const consultasController = require('../controllers/consultasController');
const { authenticateJWT, isAdmin } = require('../auth'); // Solo para eliminar si es necesario

router.post('/', consultasController.addConsulta);
router.get('/', consultasController.getConsultas);
router.get('/:id/estado', consultasController.getConsultaEstado);
router.delete('/:id', authenticateJWT, isAdmin, consultasController.removeConsulta); // Admin solo para eliminar

module.exports = router;