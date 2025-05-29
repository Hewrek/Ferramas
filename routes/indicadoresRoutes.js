// routes/indicadoresRoutes.js
const express = require('express');
const router = express.Router();
const indicadoresService = require('../services/indicadoresService');

// Middleware para manejar errores de forma consistente
const handleResponse = (res, serviceResponse) => {
    if (serviceResponse.success) {
        res.status(200).json(serviceResponse.data);
    } else {
        res.status(serviceResponse.status || 500).json({ 
            error: serviceResponse.error 
        });
    }
};

router.get('/dolar', async (req, res) => {
    const { fecha } = req.query;
    const response = await indicadoresService.getIndicadorBCCH('dolar', fecha);
    handleResponse(res, response);
});

router.get('/euro', async (req, res) => {
    const { fecha } = req.query;
    const response = await indicadoresService.getIndicadorBCCH('euro', fecha);
    handleResponse(res, response);
});

router.get('/uf', async (req, res) => {
    const { fecha } = req.query;
    const response = await indicadoresService.getIndicadorBCCH('uf', fecha);
    handleResponse(res, response);
});

// Ruta para obtener todos los indicadores
router.get('/all', async (req, res) => {
    const { fecha } = req.query;
    
    try {
        const [dolar, uf, euro] = await Promise.all([
            indicadoresService.getIndicadorBCCH('dolar', fecha),
            indicadoresService.getIndicadorBCCH('uf', fecha),
            indicadoresService.getIndicadorBCCH('euro', fecha)
        ]);
        
        const result = {};
        if (dolar.success) result.dolar = dolar.data;
        if (uf.success) result.uf = uf.data;
        if (euro.success) result.euro = euro.data;
        
        if (Object.keys(result).length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ 
                error: 'No se pudieron obtener los indicadores para la fecha especificada.' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            error: 'Error al obtener los indicadores.' 
        });
    }
});

module.exports = router;