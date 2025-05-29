// controllers/webpayController.js
const webpayService = require('../services/webpayService');

// Controlador para renderizar el formulario de pago
const renderPaymentForm = (req, res) => {
    res.render('index', { amount: 1000 }); // Renderiza la vista EJS con un monto por defecto
};

// Controlador para iniciar el pago
const initiatePayment = async (req, res) => {
    const { amount, buyOrder } = req.body;

    // TODO: La URL de retorno DEBE ser HTTPS y accesible públicamente (ej. con ngrok en desarrollo)
    // En producción, usa la URL real de tu dominio.
    const returnUrl = 'https://da3b-201-189-213-230.ngrok-free.app/api/webpay/result'; // ¡ACTUALIZA ESTA URL!

    if (!amount || isNaN(amount) || parseInt(amount) <= 0) {
        return res.status(400).render('failure', { error: 'Monto de pago inválido.' });
    }

    try {
        const { success, response, error } = await webpayService.createTransaction(amount, buyOrder, returnUrl);

        if (success) {
            // console.log('WebPay Response:', response); // Para depuración
            res.redirect(response.url + '?token_ws=' + response.token); // Redirige a WebPay
        } else {
            res.status(500).render('failure', { error: error });
        }
    } catch (err) {
        console.error('Error en initiatePayment:', err);
        res.status(500).render('failure', { error: 'Error interno al iniciar el pago.' });
    }
};

// Controlador para manejar el resultado del pago
const handlePaymentResult = async (req, res) => {
    // CAMBIO CLAVE: Obtener token_ws de req.body (para POST) o req.query (para GET)
    // Usamos esta lógica para ser más explícitos y manejar ambos casos
    let token_ws;
    if (req.method === 'POST') {
        token_ws = req.body.token_ws;
    } else if (req.method === 'GET') {
        token_ws = req.query.token_ws;
    }

    // Como una medida de seguridad adicional, aunque menos común para este flujo,
    // podríamos buscar en req.params si el token se pasara como parte de la ruta.
    // Aunque para Transbank usualmente es body o query.
    // if (!token_ws && req.params.token_ws) {
    //     token_ws = req.params.token_ws;
    // }

    if (!token_ws) {
        // Añadimos un console.error para depuración, para saber por qué no se encontró el token
        console.error('Error: Token_ws no recibido en la solicitud.');
        console.error('Método HTTP:', req.method);
        console.error('req.body:', req.body);
        console.error('req.query:', req.query);
        return res.status(400).render('failure', { error: 'Token de transacción no recibido. Por favor, intente de nuevo.' });
    }

    try {
        const { success, result, error } = await webpayService.commitTransaction(token_ws);

        if (success) {
            console.log('Pago confirmado:', result);
            if (result.status === 'AUTHORIZED') {
                // Aquí podrías guardar la factura en tu DB, actualizar stock, etc.
                res.render('success', { result }); // Renderiza la vista de éxito
            } else {
                res.render('failure', { error: 'Pago rechazado por Transbank.' });
            }
        } else {
            res.status(500).render('failure', { error: error });
        }
    } catch (err) {
        console.error('Error en handlePaymentResult durante commitTransaction:', err); // Log más específico
        res.status(500).render('failure', { error: 'Error interno al confirmar el pago.' });
    }
};

module.exports = {
    renderPaymentForm,
    initiatePayment,
    handlePaymentResult
};