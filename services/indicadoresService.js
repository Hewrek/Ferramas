// services/indicadoresService.js
const axios = require('axios');
require('dotenv').config();

const BCCH_API_BASE_URL = 'https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx';
const BCCH_API_USER = process.env.BCCH_API_USER;
const BCCH_API_PASS = process.env.BCCH_API_PASS;

const INDICADORES_BCCH = {
    dolar: 'F073.TCO.PRE.Z.D',
    uf: 'F072.UF.Z.D',
    euro: 'F075.EUR.PRE.Z.D',
};

const validateDate = (fecha) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(fecha)) {
        return { valid: false, error: 'Formato de fecha inválido. Use YYYY-MM-DD.' };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(`${fecha}T00:00:00`);
    
    if (isNaN(inputDate.getTime())) {
        return { valid: false, error: 'Fecha proporcionada es inválida.' };
    }

    if (inputDate > today) {
        return { valid: false, error: 'No se pueden consultar fechas futuras.' };
    }

    return { valid: true, date: fecha };
};

const getIndicadorBCCH = async (indicador, fecha = '') => {
    const seriesId = INDICADORES_BCCH[indicador.toLowerCase()];
    
    if (!seriesId) {
        return { 
            success: false, 
            status: 400,
            error: `Indicador '${indicador}' no reconocido. Indicadores disponibles: ${Object.keys(INDICADORES_BCCH).join(', ')}` 
        };
    }

    // Si no se proporciona fecha, usar hoy
    if (!fecha) {
        const today = new Date();
        fecha = today.toISOString().split('T')[0];
    }

    const validation = validateDate(fecha);
    if (!validation.valid) {
        return { 
            success: false, 
            status: 400,
            error: validation.error 
        };
    }

    try {
        const response = await axios.get(BCCH_API_BASE_URL, {
            params: {
                user: BCCH_API_USER,
                pass: BCCH_API_PASS,
                firstdate: fecha,
                lastdate: fecha,
                timeseries: seriesId,
                function: "GetSeries"
            },
            timeout: 5000 // timeout de 5 segundos
        });

        const jsonResponse = response.data;
        const serieObs = jsonResponse?.Series?.Obs;

        if (jsonResponse?.Codigo === 0 && jsonResponse?.Descripcion === "Success" && serieObs && serieObs.length > 0) {
            const dataPoint = serieObs[0];
            const valor = parseFloat(dataPoint.value);
            const fechaDatoApi = dataPoint.indexDateString;

            if (isNaN(valor)) {
                return { 
                    success: false, 
                    status: 404,
                    error: `El Banco Central no registra un valor numérico para ${indicador.toUpperCase()} el ${fechaDatoApi}.` 
                };
            }

            return {
                success: true,
                data: {
                    moneda: indicador.toUpperCase(),
                    fecha: fechaDatoApi,
                    valor: valor,
                    unidad_medida: indicador.toLowerCase() === 'uf' ? 'CLF' : 'CLP'
                }
            };
        } else if (jsonResponse?.Codigo === -1) {
            return { 
                success: false, 
                status: 400,
                error: `Fecha no válida o no disponible: ${fecha}` 
            };
        } else if (!serieObs || serieObs.length === 0) {
            return { 
                success: false, 
                status: 404,
                error: `No hay datos para ${indicador.toUpperCase()} el ${fecha}.` 
            };
        } else {
            return { 
                success: false, 
                status: 502,
                error: `Respuesta inesperada del Banco Central.` 
            };
        }
    } catch (error) {
        console.error(`Error al obtener ${indicador}:`, error.message);
        console.error('Detalles del error:', {
            indicador,
            fecha,
            error: error.response ? error.response.data : error.message,
            url: `${BCCH_API_BASE_URL}?user=${BCCH_API_USER}&pass=***&firstdate=${fecha}&lastdate=${fecha}&timeseries=${seriesId}`
        });
        
        if (error.code === 'ECONNABORTED') {
            return { 
                success: false, 
                status: 504,
                error: 'Tiempo de espera agotado al conectar con el Banco Central.' 
            };
        } else if (error.response) {
            return { 
                success: false, 
                status: 502,
                error: `Error en la API del Banco Central: ${error.response.status}` 
            };
        } else {
            return { 
                success: false, 
                status: 500,
                error: `Error al conectar con el Banco Central: ${error.message}` 
            };
        }
    }
};

module.exports = {
    getIndicadorBCCH,
};