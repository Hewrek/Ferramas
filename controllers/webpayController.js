// controllers/webpayController.js
const webpayService = require('../services/webpayService');

// Controlador para renderizar el formulario de pago
const renderPaymentForm = (req, res) => {
    res.render('index', { amount: 1000 }); // Renderiza la vista EJS con un monto por defecto
};

// Controlador para iniciar el pago
const initiatePayment = async (req, res) => {
    try {
        const { amount, buyOrder } = req.body;

        // Validación del monto
        if (!amount || isNaN(amount)) {
            return res.status(400).json({ error: "Monto inválido" });
        }

        // URL de retorno 
        const returnUrl = "https://0cb6-201-189-206-9.ngrok-free.app/api/webpay/result";

        // Crear transacción en WebPay
        const { success, response, error } = await webpayService.createTransaction(
            amount, 
            buyOrder, 
            returnUrl
        );

        if (success) {
            res.json({ url: response.url + "?token_ws=" + response.token });
        } else {
            res.status(500).json({ error: error || "Error al crear transacción" });
        }
    } catch (err) {
        console.error("Error en initiatePayment:", err); // 👈 ¡Revisa este log!
        res.status(500).json({ error: "Error interno del servidor" });
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