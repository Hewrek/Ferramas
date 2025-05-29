// services/webpayService.js
const { WebpayPlus, Options, Environment, IntegrationCommerceCodes, IntegrationApiKeys } = require('transbank-sdk');

// Configuración de WebPay Plus (Sandbox)
// Idealmente, estas credenciales deberían venir de variables de entorno (process.env.TRANSBANK_COMMERCE_CODE, etc.)
const tx = new WebpayPlus.Transaction(
    new Options(
        IntegrationCommerceCodes.WEBPAY_PLUS,
        IntegrationApiKeys.WEBPAY,
        Environment.Integration // Ambiente Sandbox
    )
);

const createTransaction = async (amount, buyOrder, returnUrl) => {
    try {
        const response = await tx.create(
            buyOrder || `order-${Date.now()}`,
            `session-${Date.now()}`, // Puedes generar un sessionId más robusto si lo necesitas
            parseInt(amount),
            returnUrl
        );
        return { success: true, response };
    } catch (error) {
        console.error('Error al crear transacción en Transbank:', error);
        return { success: false, error: error.message || 'Error al iniciar el pago con Transbank.' };
    }
};

const commitTransaction = async (token_ws) => {
    try {
        const result = await tx.commit(token_ws);
        return { success: true, result };
    } catch (error) {
        console.error('Error al confirmar transacción en Transbank:', error);
        return { success: false, error: error.message || 'Error al confirmar el pago con Transbank.' };
    }
};

module.exports = {
    createTransaction,
    commitTransaction
};