-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-07-2025 a las 02:48:46
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ferramax`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `consultas`
--

CREATE TABLE `consultas` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `asunto` varchar(255) NOT NULL,
  `mensaje` text NOT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  `estado` enum('pendiente','respondida') DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `consultas`
--

INSERT INTO `consultas` (`id`, `usuario_id`, `asunto`, `mensaje`, `fecha`, `estado`) VALUES
(2, 1, 'Producto defectuoso', 'El taladro no enciende', '2025-05-28 23:26:00', 'pendiente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `factura`
--

CREATE TABLE `factura` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `precio_compra` decimal(10,2) NOT NULL,
  `fecha_compra` date NOT NULL,
  `sucursal_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `num_serial` varchar(20) NOT NULL,
  `marca` varchar(100) NOT NULL,
  `codigo` varchar(20) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `categoria` varchar(100) NOT NULL,
  `fecha_precio` date NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `historial_precio` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `num_serial`, `marca`, `codigo`, `nombre`, `categoria`, `fecha_precio`, `precio`, `historial_precio`) VALUES
(1, 'FER-001', 'Bosch', 'BOS-123', 'Taladro Inalámbrico', 'Herramientas Manuales', '2025-05-28', 85000.00, '2025-05-28T00:02:44.230Z:85000.5|2025-05-28T00:03:22.190Z:233|2025-05-28T01:17:40.666Z:85000.5|2025-05-28T02:08:02.431Z:234|2025-05-29T00:19:48.713Z:85000.5|2025-05-29T02:39:31.920Z:85000.5'),
(2, 'FER-002', 'Stanley', 'STA-456', 'Martillo de Uña', 'Herramientas Manuales', '2023-05-15', 15990.00, NULL),
(3, 'FER-003', 'Makita', 'MAK-789', 'Sierra Circular 1200W', 'Herramientas Manuales', '2023-06-10', 124990.00, NULL),
(4, 'FER-004', '3M', '3M-321', 'Guantes Anticorte', 'Equipos de Seguridad', '2023-04-20', 8990.00, NULL),
(5, 'FER-005', 'Bosch', 'BOS-456', 'Lijadora Orbital', 'Herramientas Manuales', '2023-06-05', 34990.00, NULL),
(6, 'FER-006', 'Sika', 'SIK-987', 'Silicona Transparente', 'Fijaciones y Adhesivos', '2023-05-12', 4990.00, NULL),
(7, 'FER-007', 'DeWalt', 'DEW-741', 'Destornillador Eléctrico', 'Herramientas Manuales', '2023-07-01', 68990.00, NULL),
(8, 'FER-008', 'Hilti', 'HIL-222', 'Medidor Láser 40m', 'Equipos de Medición', '2023-06-15', 99990.00, NULL),
(9, 'FER-009', 'Ceresita', 'CER-678', 'Pintura Látex Blanca', 'Materiales Básicos', '2023-04-01', 24990.00, NULL),
(10, 'FER-010', 'Truper', 'TRU-321', 'Llave Inglesa 12\"', 'Herramientas Manuales', '2023-06-18', 19990.00, NULL),
(13, '', 'Bosch', 'NUEVO011', 'Taladro Profesional', 'Herramientas Eléctricas', '2025-05-28', 89000.00, '2025-05-29T02:41:44.385Z:89.99'),
(14, 'test', 'Bosch', 'NUEVO021', 'Taladro Profesional', 'Herramientas Eléctricas', '2025-05-28', 10000.00, '2025-05-29T02:43:06.324Z:89.99');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `stock_sucursal`
--

CREATE TABLE `stock_sucursal` (
  `id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `sucursal_id` int(11) NOT NULL,
  `cantidad` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `stock_sucursal`
--

INSERT INTO `stock_sucursal` (`id`, `producto_id`, `sucursal_id`, `cantidad`) VALUES
(11, 1, 2, 2),
(12, 2, 2, 10),
(13, 3, 2, 10),
(14, 4, 2, 10),
(15, 5, 2, 10),
(16, 6, 2, 10),
(17, 7, 2, 10),
(18, 8, 2, 10),
(19, 9, 2, 10),
(20, 10, 2, 10),
(21, 1, 3, 10),
(22, 2, 3, 10),
(23, 3, 3, 10),
(24, 4, 3, 10),
(25, 5, 3, 10),
(26, 6, 3, 10),
(27, 7, 3, 10),
(28, 8, 3, 10),
(29, 9, 3, 10),
(30, 10, 3, 10),
(31, 1, 4, 10),
(32, 2, 4, 10),
(33, 3, 4, 10),
(34, 4, 4, 10),
(35, 5, 4, 10),
(36, 6, 4, 10),
(37, 7, 4, 10),
(38, 8, 4, 10),
(39, 9, 4, 10),
(40, 10, 4, 10),
(41, 1, 5, 10),
(42, 2, 5, 10),
(43, 3, 5, 10),
(44, 4, 5, 10),
(45, 5, 5, 10),
(46, 6, 5, 10),
(47, 7, 5, 10),
(48, 8, 5, 10),
(49, 9, 5, 10),
(50, 10, 5, 10),
(51, 1, 6, 10),
(52, 2, 6, 10),
(53, 3, 6, 10),
(54, 4, 6, 10),
(55, 5, 6, 10),
(56, 6, 6, 10),
(57, 7, 6, 10),
(58, 8, 6, 10),
(59, 9, 6, 10),
(60, 10, 6, 10),
(61, 1, 7, 10),
(62, 2, 7, 10),
(63, 3, 7, 10),
(64, 4, 7, 10),
(65, 5, 7, 10),
(66, 6, 7, 10),
(67, 7, 7, 10),
(68, 8, 7, 10),
(69, 9, 7, 10),
(70, 10, 7, 10),
(71, 1, 8, 10),
(72, 2, 8, 10),
(73, 3, 8, 10),
(74, 4, 8, 10),
(75, 5, 8, 10),
(76, 6, 8, 10),
(77, 7, 8, 10),
(78, 8, 8, 10),
(79, 9, 8, 10),
(80, 10, 8, 10),
(81, 1, 9, 10),
(82, 2, 9, 10),
(83, 3, 9, 10),
(84, 4, 9, 10),
(85, 5, 9, 10),
(86, 6, 9, 10),
(87, 7, 9, 10),
(88, 8, 9, 10),
(89, 9, 9, 10),
(90, 10, 9, 10),
(91, 1, 10, 10),
(92, 2, 10, 10),
(93, 3, 10, 10),
(94, 4, 10, 10),
(95, 5, 10, 10),
(96, 6, 10, 10),
(97, 7, 10, 10),
(98, 8, 10, 10),
(99, 9, 10, 10),
(100, 10, 10, 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sucursales`
--

CREATE TABLE `sucursales` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `direccion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sucursales`
--

INSERT INTO `sucursales` (`id`, `nombre`, `direccion`) VALUES
(2, 'Sucursal Norte', 'Calle 5 N°12, Antofagasta'),
(3, 'Sucursal Sur', 'Ruta 40 km 20, Puerto Montt'),
(4, 'Sucursal Oriente', 'Av. Los Leones 543, Providencia'),
(5, 'Sucursal Occidente', 'Camino del Mar 111, Viña del Mar'),
(6, 'Sucursal Maipú', 'Av. Pajaritos 300, Maipú'),
(7, 'Sucursal Ñuñoa', 'Irarrázaval 800, Ñuñoa'),
(8, 'Sucursal Valdivia', 'Bueras 210, Valdivia'),
(9, 'Sucursal Chillán', 'Libertad 456, Chillán'),
(10, 'Sucursal Temuco', 'Manuel Montt 99, Temuco'),
(11, 'Sucursal Centro', 'Av. Principal 456');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `contrasena` varchar(100) NOT NULL,
  `rol` enum('cliente','admin') DEFAULT 'cliente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `contrasena`, `rol`) VALUES
(1, 'admin', 'admin123', 'admin'),
(2, 'nuevo_usuario', 'clave123', 'cliente');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `consultas`
--
ALTER TABLE `consultas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `factura`
--
ALTER TABLE `factura`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `producto_id` (`producto_id`),
  ADD KEY `sucursal_id` (`sucursal_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `stock_sucursal`
--
ALTER TABLE `stock_sucursal`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `producto_id` (`producto_id`,`sucursal_id`),
  ADD KEY `sucursal_id` (`sucursal_id`);

--
-- Indices de la tabla `sucursales`
--
ALTER TABLE `sucursales`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `consultas`
--
ALTER TABLE `consultas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `factura`
--
ALTER TABLE `factura`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `stock_sucursal`
--
ALTER TABLE `stock_sucursal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT de la tabla `sucursales`
--
ALTER TABLE `sucursales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `consultas`
--
ALTER TABLE `consultas`
  ADD CONSTRAINT `consultas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `factura`
--
ALTER TABLE `factura`
  ADD CONSTRAINT `factura_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `factura_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `factura_ibfk_3` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `stock_sucursal`
--
ALTER TABLE `stock_sucursal`
  ADD CONSTRAINT `stock_sucursal_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `stock_sucursal_ibfk_2` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
