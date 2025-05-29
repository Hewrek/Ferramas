const express = require('express');
const router = express.Router();
const conversionService = require('../services/conversionService');

router.get('/convert', async (req, res) => {
    try {
        const { amount, from, to, date } = req.query;
        
        // Validación corregida (paréntesis cerrado)
        if (!amount || isNaN(amount)) {
            return res.status(400).json({ 
                success: false,
                error: 'El parámetro "amount" es requerido y debe ser numérico' 
            });
        }
        
        if (!from || !to) {
            return res.status(400).json({ 
                success: false,
                error: 'Los parámetros "from" y "to" son requeridos' 
            });
        }

        const result = await conversionService.convertPrice(
            parseFloat(amount),
            from.toUpperCase(),
            to.toUpperCase(),
            date
        );

        if (result.success) {
            res.json({
                success: true,
                convertedAmount: result.data.convertedAmount,
                rateUsed: result.data.rateUsed,
                rateDate: result.data.rateDate
            });
        } else {
            res.status(400).json({ 
                success: false,
                error: result.error 
            });
        }

    } catch (error) {
        console.error('Error en /api/conversion/convert:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error interno del servidor al realizar la conversión' 
        });
    }
});

module.exports = router;