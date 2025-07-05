Documentación de la API de Ferramax
Esta documentación detalla los endpoints de la API de Ferramax.

Endpoints
1. Obtener todos los productos
Descripción: Recupera una lista de todos los productos disponibles.

URL: http://localhost:3000/api/productos

Método: GET

2. Obtener un producto por código
Descripción: Recupera un producto individual por su código único.

URL: http://localhost:3000/api/productos/:codigo

Método: GET

Parámetros de URL:

codigo: El código único del producto (ej., BOS-123).

3. Buscar productos por término
Descripción: Busca productos basándose en un término dado en su nombre o categoría.

URL: http://localhost:3000/api/productos/buscar/:termino

Método: GET

Parámetros de URL:

termino: El término de búsqueda (ej., Equipos).

4. Obtener stock por sucursal
Descripción: Recupera la cantidad de stock de un producto específico en una sucursal dada.

URL: http://localhost:3000/api/productos/:idProducto/stock/:idSucursal

Método: GET

Parámetros de URL:

idProducto: El ID del producto (ej., 1).

idSucursal: El ID de la sucursal (ej., 1).

5. Productos con bajo stock
Descripción: Recupera una lista de productos que tienen un stock inferior a una cantidad máxima especificada.

URL: http://localhost:3000/api/productos/stock/bajo?max=:cantidad_maxima

Método: GET

Parámetros de Consulta (Query):

max: La cantidad máxima de stock a considerar como "bajo stock" (ej., 5).

6. Historial de precios de un producto
Descripción: Recupera los datos del historial de precios de un producto específico.

URL: http://localhost:3000/api/productos/:codigo/precios

Método: GET

Parámetros de URL:

codigo: El código del producto (ej., BOS-123).

7. Precios actualizados en una fecha
Descripción: Recupera productos cuyos precios fueron actualizados en una fecha específica.

URL: http://localhost:3000/api/productos/precios/fecha?fecha=:yyyy-mm-dd

Método: GET

Parámetros de Consulta (Query):

fecha: La fecha para la cual se desean recuperar los precios actualizados (ej., 2025-05-27).

8. Obtener todas las sucursales
Descripción: Recupera una lista de todas las sucursales disponibles.

URL: http://localhost:3000/api/sucursales

Método: GET

9. Autenticación
Descripción: Autentica a un usuario para obtener un token de acceso.

URL: http://localhost:3000/api/login

Método: POST

Cuerpo de la Solicitud (Request Body):
{
    "nombre": "admin",
    "contrasena": "admin123"
}

10. Actualizar precio (admin)
Descripción: Actualiza el precio de un producto. Requiere autenticación de administrador.

URL: http://localhost:3000/api/productos/:idProducto/precio

Método: PUT

Parámetros de URL:

idProducto: El ID del producto (ej., 1).

Autenticación: Bearer Token (rol de administrador requerido)

Cuerpo de la Solicitud (Request Body):
{
    "precio": 85000.50
}

11. Crear nuevo producto (admin)
Descripción: Crea un nuevo producto. Requiere autenticación de administrador.

URL: http://localhost:3000/api/productos

Método: POST

Autenticación: Bearer Token (rol de administrador requerido)

Cuerpo de la Solicitud (Request Body):
{
    "codigo": "NUEVO001",
    "nombre": "Taladro Profesional",
    "marca": "Bosch",
    "precio": 89.99,
    "categoria": "Herramientas Eléctricas"
}

12. Eliminar producto (admin)
Descripción: Elimina un producto por su ID. Requiere autenticación de administrador.

URL: http://localhost:3000/api/productos/:idProducto

Método: DELETE

Parámetros de URL:

idProducto: El ID del producto a eliminar (ej., 11).

Autenticación: Bearer Token (rol de administrador requerido)