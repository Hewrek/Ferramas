// server.js
const express = require('express');
const cors = require('cors');
require('./db');
const logger = require('./middlewares/logger');
const path = require('path'); // Nuevo: para manejar rutas de vistas

// Importar rutas
const productosRoutes = require('./routes/productosRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const sucursalesRoutes = require('./routes/sucursalesRoutes');
const facturasRoutes = require('./routes/facturasRoutes');
const consultasRoutes = require('./routes/consultasRoutes');
const authRoutes = require('./routes/authRoutes');
const webpayRoutes = require('./routes/webpayRoutes');
const indicadoresRoutes = require('./routes/indicadoresRoutes');
const conversionRoutes = require('./routes/conversionRoutes');

const app = express();

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
    methods: 'GET',
    allowedHeaders: 'Content-Type'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Necesario para recibir datos de formularios (como el de Transbank)

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Establece dónde están tus archivos EJS

// Middleware global para log
app.use(logger);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡API de Ferremas funcionando!');
});

// Usar las rutas
app.use('/api/productos', productosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/sucursales', sucursalesRoutes);
app.use('/api/facturas', facturasRoutes);
app.use('/api/consultas', consultasRoutes);
app.use('/api', authRoutes); 
app.use('/api/webpay', webpayRoutes); 
app.use('/api/indicadores', indicadoresRoutes);
app.use('/api/conversion', conversionRoutes);


// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});