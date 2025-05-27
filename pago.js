document.addEventListener('DOMContentLoaded', async () => {
    // Obtener el ID del producto de la URL (ej: pago.html?productId=1)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');
    
    if (!productId) {
        mostrarError('No se ha especificado un producto');
        return;
    }

    try {
        // Obtener información del producto
        const producto = await obtenerProducto(productId);
        mostrarProducto(producto);
        
        // Configurar botón de pago
        configurarBotonPago(productId, producto.precio);
    } catch (error) {
        mostrarError(error.message);
    }
});

async function obtenerProducto(productId) {
    const response = await fetch(`http://localhost:3000/api/productos/${productId}`);
    if (!response.ok) {
        throw new Error('Error al obtener el producto');
    }
    return await response.json();
}

function mostrarProducto(producto) {
    const productoInfo = document.getElementById('producto-info');
    productoInfo.innerHTML = `
        <h3>${producto.nombre}</h3>
        <p class="text-muted">Código: ${producto.codigo}</p>
        <div class="producto-detalle">
            <p><strong>Marca:</strong> ${producto.marca}</p>
            <p><strong>Categoría:</strong> ${producto.categoria}</p>
            <p><strong>Stock disponible:</strong> ${producto.stock}</p>
            <h4 class="text-primary mt-3">Precio: $${producto.precio.toLocaleString('es-CL')}</h4>
        </div>
        <input type="hidden" id="productId" value="${producto.id}">
    `;
}

function configurarBotonPago(productId, precio) {
    const button = document.getElementById('webpayButton');
    
    button.addEventListener('click', async () => {
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        button.disabled = true;

        try {
            const response = await fetch('http://localhost:3000/api/webpay/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: productId,
                    amount: precio
                })
            });

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            // Guardar información temporal
            sessionStorage.setItem('currentProduct', JSON.stringify(data.product));
            window.location.href = data.url; // Redirigir a WebPay

        } catch (error) {
            mostrarError(error.message);
            button.innerHTML = '<i class="fas fa-credit-card"></i> Pagar con WebPay';
            button.disabled = false;
        }
    });
}

function mostrarError(mensaje) {
    const productoInfo = document.getElementById('producto-info');
    productoInfo.innerHTML = `
        <div class="alert alert-danger">
            <i class="fas fa-exclamation-triangle"></i> ${mensaje}
        </div>
        <a href="index.html" class="btn btn-primary mt-3">Volver a la tienda</a>
    `;
    document.getElementById('webpayButton').style.display = 'none';
}