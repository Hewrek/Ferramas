let mostrarEnUSD = false;
let tasaDolar = 1;
let precioOriginal = 0;

document.addEventListener('DOMContentLoaded', function() {
    // Obtener el código del producto de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const codigoProducto = urlParams.get('codigo');
    
    if (!codigoProducto) {
        mostrarError('No se especificó un producto');
        return;
    }

    // Configurar botones
    document.getElementById('btn-volver').addEventListener('click', () => {
        window.location.href = '../index.html';
    });
    
    document.getElementById('btn-volver-error').addEventListener('click', () => {
        window.location.href = '../index.html';
    });

    // Configurar tabs
    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(link => {
        link.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            cambiarTab(tabId);
        });
    });

    // Cargar datos del producto
    cargarProducto(codigoProducto);
    document.getElementById('btn-comprar').addEventListener('click', iniciarPagoWebPay);

    cargarValorDolar();
    // Configurar botón de cambio de moneda
    document.getElementById('toggle-currency').addEventListener('click', function() {
        mostrarEnUSD = !mostrarEnUSD;
        actualizarPrecioMostrado();
    });
});

async function iniciarPagoWebPay() {
    try {
        // Mostrar loader o mensaje de procesamiento
        const btnComprar = document.getElementById('btn-comprar');
        btnComprar.disabled = true;
        btnComprar.textContent = 'Procesando...';

        // Obtener información del producto
        const codigoProducto = new URLSearchParams(window.location.search).get('codigo');
        const productoNombre = document.getElementById('producto-nombre').textContent;
        let productoPrecio = document.getElementById('producto-precio').textContent
            .replace('$', '').replace('.', '').replace(' CLP', '').replace(' USD', '').trim();

        // Verificar si el precio está en USD y usar el precio original si es necesario
        if (mostrarEnUSD) {
            // Usar el precio original en USD
            productoPrecio = precioOriginal;
            console.log('Precio en USD:', precioOriginal);
            console.log('Tasa de conversión:', tasaDolar);
            console.log('Precio original en USD:', productoPrecio);
        }

        // Validar precio
        if (isNaN(productoPrecio) || parseFloat(productoPrecio) <= 0) {
            throw new Error('Precio del producto no válido');
        }

        // Crear orden de compra única
        const shortId = Math.random().toString(36).substring(2, 8).toUpperCase();
        const buyOrder = `FMAX-${shortId}`;

        // Enviar datos al backend para iniciar WebPay
        const response = await fetch('http://localhost:3000/api/webpay/pay', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: parseFloat(productoPrecio).toFixed(2), // Asegurar que el precio sea un número válido con dos decimales
                buyOrder: buyOrder,
                producto: codigoProducto,
                nombre: productoNombre
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al iniciar el pago');
        }

        // Obtener la URL de redirección
        const data = await response.json();

        // Redirigir a WebPay
        window.location.href = data.url;

    } catch (error) {
        console.error('Error al iniciar pago:', error);
        alert('Error al iniciar el pago: ' + error.message);

        // Restaurar botón
        const btnComprar = document.getElementById('btn-comprar');
        btnComprar.disabled = false;
        btnComprar.textContent = 'Comprar';
    }
}
function cambiarTab(tabId) {
    // Ocultar todos los tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Desactivar todos los botones
    document.querySelectorAll('.tab-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Activar el tab seleccionado
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`.tab-link[data-tab="${tabId}"]`).classList.add('active');
}

async function cargarProducto(codigo) {
    try {
        // Cargar información básica del producto
        const responseProducto = await fetch(`http://localhost:3000/api/productos/${codigo}`);
        
        if (!responseProducto.ok) {
            throw new Error('Producto no encontrado');
        }
        
        const producto = await responseProducto.json();
        
        // Mostrar información básica
        mostrarInformacionProducto(producto);
        
        // Cargar stock en sucursales
        await cargarStockSucursales(producto.id);
        
        // Mostrar el contenedor del producto
        document.getElementById('producto-detalle').style.display = 'block';
        document.getElementById('loading').style.display = 'none';
        
    } catch (error) {
        console.error('Error:', error);
        mostrarError(error.message);
        document.getElementById('loading').style.display = 'none';
    }
}

function mostrarInformacionProducto(producto) {
    document.getElementById('producto-nombre').textContent = producto.nombre;
    document.getElementById('producto-marca').textContent = producto.marca || 'Marca no especificada';
    document.getElementById('producto-codigo').textContent = `Código: ${producto.codigo || 'N/A'}`;
    
    // Guarda el precio original y muestra según la moneda seleccionada
    precioOriginal = parseFloat(producto.precio);
    actualizarPrecioMostrado();
    
    document.getElementById('producto-categoria').textContent = producto.categoria || 'No especificada';
    
    const imagenContainer = document.getElementById('producto-imagen');
    imagenContainer.innerHTML = producto.nombre;
}

function actualizarPrecioMostrado() {
    const precioElement = document.getElementById('producto-precio');
    const botonMoneda = document.getElementById('toggle-currency');

    if (!precioElement) {
        console.error('Elemento de precio no encontrado');
        return;
    }

    if (mostrarEnUSD) {
        const precioUSD = precioOriginal / tasaDolar;
        precioElement.textContent = `$${precioUSD.toLocaleString('es-CL', {minimumFractionDigits: 2, maximumFractionDigits: 2})} USD`;
        precioElement.classList.add('precio-usd');
        botonMoneda.textContent = 'Mostrar en CLP';
    } else {
        precioElement.textContent = `$${precioOriginal.toLocaleString('es-CL')} CLP`;
        precioElement.classList.remove('precio-usd');
        botonMoneda.textContent = 'Mostrar en USD';
    }
}   
async function cargarStockSucursales(productoId) {
    try {
        // Primero cargar todas las sucursales
        const responseSucursales = await fetch('http://localhost:3000/api/sucursales');
        
        if (!responseSucursales.ok) {
            throw new Error('No se pudieron cargar las sucursales');
        }
        
        const sucursales = await responseSucursales.json();
        const stockList = document.getElementById('stock-sucursales');
        stockList.innerHTML = '';
        
        // Para cada sucursal, obtener el stock del producto
        for (const sucursal of sucursales) {
            try {
                const responseStock = await fetch(`http://localhost:3000/api/productos/${productoId}/stock/${sucursal.id}`);
                
                if (responseStock.ok) {
                    const stockData = await responseStock.json();
                    const cantidad = stockData.cantidad || 0;
                    
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <span>${sucursal.nombre}</span>
                        <span class="${cantidad > 0 ? 'stock-disponible' : 'stock-agotado'}">
                            ${cantidad > 0 ? `${cantidad} unidades` : 'Agotado'}
                        </span>
                    `;
                    stockList.appendChild(li);
                }
            } catch (error) {
                console.error(`Error cargando stock para sucursal ${sucursal.id}:`, error);
            }
        }
        
    } catch (error) {
        console.error('Error cargando stock:', error);
        document.getElementById('stock-sucursales').innerHTML = `
            <li>No se pudo cargar la información de stock: ${error.message}</li>
        `;
    }
}

function formatearFecha(fechaString) {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatearFechaCorta(fechaString) {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-CL', {
        month: 'short',
        day: 'numeric'
    });
}

function mostrarError(mensaje) {
    document.getElementById('error-message').style.display = 'block';
    document.getElementById('error-message').firstElementChild.textContent = mensaje;
}

function getTodayDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes comienza en 0
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

async function cargarValorDolar() {
    try {
        // Generar la fecha actual en el formato YYYY-MM-DD
        const hoy = getTodayDate();
        
        // Log para verificar la fecha generada
        console.log('Fecha generada:', hoy);

        // Nueva URL para obtener el valor del dólar
        const response = await fetch(`http://localhost:3000/api/conversion/convert?amount=1&from=USD&to=CLP&date=${hoy}`);
        

        if (!response.ok) throw new Error('Error al obtener valor del dólar');
        
        const data = await response.json();
        

        if (!data.success) {
            throw new Error(data.error);
        }

        // Obtener la tasa de conversión del JSON
        tasaDolar = data.rateUsed;
        document.getElementById('valor-dolar').textContent = `$${tasaDolar.toLocaleString('es-CL')} CLP`;
        
        // Actualizar precios si ya estaban en USD
        if (mostrarEnUSD) {
            actualizarPrecioMostrado();
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('valor-dolar').textContent = 'No disponible';
    }
}