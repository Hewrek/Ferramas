// Variables globales
let productos = [];
let sucursales = [];
let token = null;

// Cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    cargarSucursales();
    cargarProductos();
    cargarValorDolar();
});

// ========== FUNCIONES PRINCIPALES ==========

// Cargar productos desde la API
async function cargarProductos() {
    try {
        mostrarLoading(true);
        
        const response = await fetch('http://localhost:3000/api/productos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        });

        if (!response.ok) throw new Error('Error al cargar productos');

        productos = await response.json();
        mostrarProductos(productos);
        
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cargar los productos: ' + error.message);
    } finally {
        mostrarLoading(false);
    }
}

// Cargar sucursales desde la API
async function cargarSucursales() {
    try {
        const response = await fetch('http://localhost:3000/api/sucursales');
        if (!response.ok) throw new Error('Error al cargar sucursales');
        
        sucursales = await response.json();
        llenarSelectSucursales();
    } catch (error) {
        console.error('Error cargando sucursales:', error);
    }
}

// Cargar valor del dólar
async function cargarValorDolar() {
    try {
        const hoy = new Date().toISOString().split('T')[0];
        const response = await fetch(`http://localhost:3000/api/indicadores/dolar?fecha=${hoy}`);
        
        if (!response.ok) throw new Error('Error al obtener valor del dólar');
        
        const data = await response.json();
        tasaDolar = data.valor;
        console.log('Tasa de Dólar:', tasaDolar); // Verificación
        document.getElementById('valor-dolar').textContent = `$${data.valor.toLocaleString('es-CL')} CLP`;
        
        // Actualizar precios si ya estaban en USD
        if (mostrarEnUSD) {
            mostrarProductos(productos);
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('valor-dolar').textContent = 'No disponible';
    }
}

// ========== FUNCIONES DE FILTRADO ==========

function filtrarProductos() {
    const filtro = document.getElementById('filtrado').value;
    const sucursalId = document.getElementById('sucursal').value;
    
    let productosFiltrados = [...productos];
    
    // Filtrar por sucursal (si hay stock)
    if (sucursalId !== "0") {
        productosFiltrados = productosFiltrados.filter(async p => {
            const stock = await obtenerStockProducto(p.id, sucursalId);
            return stock > 0;
        });
    }
    
    // Ordenar
    switch(filtro) {
        case 'menor-mayor':
            productosFiltrados.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
            break;
        case 'mayor-menor':
            productosFiltrados.sort((a, b) => parseFloat(b.precio) - parseFloat(a.precio));
            break;
    }
    
    mostrarProductos(productosFiltrados);
}

async function buscarProductos() {
    const busqueda = document.getElementById('busqueda').value.toLowerCase();
    
    if (!busqueda) {
        mostrarProductos(productos);
        return;
    }
    
    try {
        // Usamos el endpoint de búsqueda de la API
        const response = await fetch(`http://localhost:3000/api/productos/buscar/${encodeURIComponent(busqueda)}`);
        if (!response.ok) throw new Error('Error en búsqueda');
        
        const resultados = await response.json();
        mostrarProductos(resultados);
    } catch (error) {
        // Si falla la búsqueda API, hacemos búsqueda local
        console.error('Error en búsqueda API:', error);
        const resultados = productos.filter(producto => 
            producto.nombre.toLowerCase().includes(busqueda) ||
            (producto.codigo && producto.codigo.toLowerCase().includes(busqueda)) ||
            (producto.marca && producto.marca.toLowerCase().includes(busqueda))
        );
        mostrarProductos(resultados);
    }
}

// ========== FUNCIONES DE RENDERIZADO ==========

function mostrarProductos(productosMostrar) {
    const lista = document.getElementById('productos-lista');
    lista.innerHTML = '';

    if (productosMostrar.length === 0) {
        lista.innerHTML = '<li class="no-productos">No se encontraron productos</li>';
        return;
    }

    productosMostrar.forEach(async producto => {
        const li = document.createElement('li');
        li.className = 'producto-item';
        
        const sucursalId = document.getElementById('sucursal').value;
        const stock = sucursalId !== "0" ? await obtenerStockProducto(producto.id, sucursalId) : null;
        
        const precioCLP = parseFloat(producto.precio);
        const precioUSD = precioCLP / tasaDolar;
        const precioMostrar = mostrarEnUSD ? precioUSD : precioCLP;
        const moneda = mostrarEnUSD ? 'USD' : 'CLP';
        const clasePrecio = mostrarEnUSD ? 'precio-usd' : 'precio';
        
        li.innerHTML = `
            <div class="producto-imagen">
                <img src="img/productos/${producto.codigo}.jpg" alt="${producto.nombre}" 
                    onerror="this.parentElement.innerHTML = '<div class=\'nombre-sin-imagen\'>${producto.nombre}</div>'">
            </div>
            <div class="producto-info">
                <h3>${producto.nombre}</h3>
                <p class="marca">${producto.marca || 'Marca no especificada'}</p>
                <p class="codigo">Código: ${producto.codigo || 'N/A'}</p>
                <p class="${clasePrecio}">$${precioMostrar.toLocaleString('es-CL', {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${moneda}</p>
                ${stock !== null ? `<p class="stock">Stock: ${stock} unidades</p>` : ''}
                <p class="categoria">${producto.categoria || ''}</p>
                <button onclick="verDetalle('${producto.codigo}')">Ver Detalle</button>
            </div>
        `;
        lista.appendChild(li);
    });
}

function llenarSelectSucursales() {
    const select = document.getElementById('sucursal');
    select.innerHTML = '<option value="0">Todas</option>';
    
    sucursales.forEach(sucursal => {
        const option = document.createElement('option');
        option.value = sucursal.id;
        option.textContent = sucursal.nombre;
        select.appendChild(option);
    });
}

// ========== FUNCIONES AUXILIARES ==========

async function obtenerStockProducto(productoId, sucursalId) {
    try {
        const response = await fetch(`http://localhost:3000/api/productos/${productoId}/stock/${sucursalId}`);
        if (!response.ok) return 0;
        
        const data = await response.json();
        return data.cantidad || 0;
    } catch (error) {
        console.error('Error obteniendo stock:', error);
        return 0;
    }
}

function verDetalle(codigoProducto) {
    window.location.href = `detalle-producto.html?codigo=${codigoProducto}`;
}

function mostrarLoading(mostrar) {
    document.getElementById('loading').style.display = mostrar ? 'block' : 'none';
}

function mostrarError(mensaje) {
    const container = document.getElementById('productos-lista');
    container.innerHTML = `<li class="error">${mensaje}</li>`;
}

// Variable global para el estado de la moneda
let mostrarEnUSD = false;
let tasaDolar = 1;

// Modifica la función cargarValorDolar para guardar la tasa
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
        
        // Log para verificar la respuesta de la API

        if (!data.success) {
            throw new Error(data.error);
        }

        // Obtener la tasa de conversión del JSON
        tasaDolar = data.rateUsed;
        document.getElementById('valor-dolar').textContent = `$${tasaDolar.toLocaleString('es-CL')} CLP`;
        
        // Actualizar precios si ya estaban en USD
        if (mostrarEnUSD) {
            mostrarProductos(productos);
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('valor-dolar').textContent = 'No disponible';
    }
}

// Función para cambiar entre CLP y USD
function toggleCurrency() {
    mostrarEnUSD = !mostrarEnUSD;
    const boton = document.getElementById('toggle-currency');
    boton.textContent = mostrarEnUSD ? 'Mostrar precios en CLP' : 'Mostrar precios en USD';
    mostrarProductos(productos);
}

// Modifica la función mostrarProductos para manejar ambas monedas
function mostrarProductos(productosMostrar) {
    const lista = document.getElementById('productos-lista');
    lista.innerHTML = '';

    if (productosMostrar.length === 0) {
        lista.innerHTML = '<li class="no-productos">No se encontraron productos</li>';
        return;
    }

    // Mostrar productos
    productosMostrar.forEach(async producto => {
        const li = document.createElement('li');
        li.className = 'producto-item';
        
        const sucursalId = document.getElementById('sucursal').value;
        const stock = sucursalId !== "0" ? await obtenerStockProducto(producto.id, sucursalId) : null;
        
        // Calcular precio en USD si es necesario
        const precioCLP = parseFloat(producto.precio);
        const precioUSD = precioCLP / tasaDolar;
        const precioMostrar = mostrarEnUSD ? precioUSD : precioCLP;
        const moneda = mostrarEnUSD ? 'USD' : 'CLP';
        const clasePrecio = mostrarEnUSD ? 'precio-usd' : 'precio';
        
        li.innerHTML = `
            <div class="producto-imagen">
                <img src="img/productos/${producto.codigo}.jpg" alt="${producto.nombre}" 
                    onerror="this.parentElement.innerHTML = '<div class=\'nombre-sin-imagen\'>${producto.nombre}</div>'">
            </div>
            <div class="producto-info">
                <h3>${producto.nombre}</h3>
                <p class="marca">${producto.marca || 'Marca no especificada'}</p>
                <p class="codigo">Código: ${producto.codigo || 'N/A'}</p>
                <p class="${clasePrecio}">$${precioMostrar.toLocaleString('es-CL', {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${moneda}</p>
                ${stock !== null ? `<p class="stock">Stock: ${stock} unidades</p>` : ''}
                <p class="categoria">${producto.categoria || ''}</p>
                <button onclick="verDetalle('${producto.codigo}')">Ver Detalle</button>
            </div>
        `;
        lista.appendChild(li);
    });
}