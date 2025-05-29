const consultaService = require('../services/consultaService');

const addConsulta = async (req, res) => {
    try {
        const { usuario_id, asunto, mensaje } = req.body;
        if (!usuario_id || !asunto || !mensaje) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }
        const newConsulta = await consultaService.createConsulta(usuario_id, asunto, mensaje);
        if (newConsulta.error) {
            return res.status(400).json({ error: newConsulta.error });
        }
        res.status(201).json({
            mensaje: 'Consulta creada exitosamente',
            consulta_id: newConsulta.id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear consulta' });
    }
};

const getConsultas = async (req, res) => {
    try {
        const consultas = await consultaService.getAllConsultas();
        res.json(consultas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener consultas' });
    }
};

const getConsultaEstado = async (req, res) => {
    try {
        const id = req.params.id;
        const consulta = await consultaService.getConsultaEstado(id);
        if (!consulta) {
            return res.status(404).json({ error: 'Consulta no encontrada' });
        }
        res.json({
            consulta_id: id,
            estado: consulta.estado
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener estado de consulta' });
    }
};

const removeConsulta = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedConsulta = await consultaService.deleteConsulta(id);
        if (!deletedConsulta) {
            return res.status(404).json({ error: 'Consulta no encontrada' });
        }
        res.json({ mensaje: 'Consulta eliminada exitosamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar consulta' });
    }
};

module.exports = {
    addConsulta,
    getConsultas,
    getConsultaEstado,
    removeConsulta
};