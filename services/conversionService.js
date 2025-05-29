// services/conversionService.js
const indicadoresService = require('./indicadoresService');

const convertPrice = async (monto, fromCurrency, toCurrency, fecha = '') => {
  try {
    // Validación básica
    if (isNaN(monto) || monto <= 0) {
      throw new Error('El monto debe ser un número positivo');
    }

    // Normalizar códigos de moneda
    fromCurrency = fromCurrency.toUpperCase();
    toCurrency = toCurrency.toUpperCase();

    // Paso 1: Obtener tasas de conversión con metadatos
    const rates = {};
    
    if (fromCurrency !== 'CLP') {
      rates[fromCurrency] = await getRateWithMetadata(fromCurrency, fecha);
    }
    if (toCurrency !== 'CLP') {
      rates[toCurrency] = await getRateWithMetadata(toCurrency, fecha);
    }

    // Paso 2: Realizar conversión
    const conversionResult = convertWithMetadata(monto, fromCurrency, toCurrency, rates);

    // Paso 3: Preparar respuesta detallada
    return {
      success: true,
      data: {
        originalAmount: parseFloat(monto.toFixed(2)),
        fromCurrency,
        toCurrency,
        convertedAmount: parseFloat(conversionResult.amount.toFixed(2)),
        rateUsed: conversionResult.rateUsed.valor,
        rateDate: conversionResult.rateUsed.fecha,
        lastUpdated: new Date().toISOString(),
        source: 'BCCH'
      }
    };

  } catch (error) {
    console.error(`Error en convertPrice: ${error.message}`);
    return {
      success: false,
      error: error.message,
      details: {
        monto,
        fromCurrency,
        toCurrency,
        fecha
      }
    };
  }
};

const getRateWithMetadata = async (currency, fecha) => {
  const currencyMap = {
    'USD': 'dolar',
    'EUR': 'euro',
    'CLF': 'uf'
  };

  const indicador = currencyMap[currency];
  if (!indicador) throw new Error(`Moneda no soportada: ${currency}`);

  const { success, data, error } = await indicadoresService.getIndicadorBCCH(indicador, fecha);
  if (!success) throw new Error(error);

  return {
    valor: parseFloat(data.valor),
    fecha: data.fecha,
    moneda: data.moneda,
    fuente: 'BCCH'
  };
};

const convertWithMetadata = (monto, from, to, rates) => {
  // Convertir a CLP primero si es necesario
  const inCLP = from === 'CLP' ? monto : monto * rates[from].valor;
  
  // Convertir a moneda destino
  const amount = to === 'CLP' ? inCLP : inCLP / rates[to].valor;

  // Determinar qué tasa se usó para mostrar en la respuesta
  const rateUsed = from !== 'CLP' ? rates[from] : rates[to];

  return {
    amount,
    rateUsed
  };
};

// Función adicional para conversión múltiple
const convertMultiple = async (conversions) => {
  const results = await Promise.all(
    conversions.map(async (conv) => {
      try {
        const result = await convertPrice(conv.amount, conv.from, conv.to, conv.date);
        return {
          ...conv,
          success: result.success,
          result: result.success ? result.data : { error: result.error }
        };
      } catch (error) {
        return {
          ...conv,
          success: false,
          error: error.message
        };
      }
    })
  );

  return results;
};

module.exports = {
  convertPrice,
  convertMultiple
};