Guía de Ejecución
En una terminal, ejecuta npm install express. Si encuentras errores de dependencias, usa el siguiente comando para instalarlas todas: npm install cors dotenv ejs express jsonwebtoken mysql2 transbank-sdk

Bash

npm install cors dotenv ejs express jsonwebtoken mysql2 transbank-sdk xml2js
Instala Ngrok ejecutando en la terminal: choco install ngrok.

Abre XAMPP y enciende "Apache" y "MySQL". En la línea de "MySQL", haz clic en "Admin" y crea una base de datos con el nombre ferramax.

Importa el archivo ferramax.sql dentro de la base de datos ferramax que acabas de crear.

En una terminal diferente, ejecuta: ngrok http 3000.

Copia la URL de "Forwarding". Debería verse similar a esto: https://b014-201-189-208-24.ngrok-free.app.

Ve al archivo webpayController.js y cambia la línea número 20 por la URL copiada, siguiendo este formato: TuUrlCopiadaAqui/api/webpay/result.

En la terminal, ejecuta el comando node server.js.

¡La API ya debería estar funcionando!

Nota: Si deseas probar la página, necesitarás una extensión en Visual Studio Code como "Live Server" o una similar para el host de tu parte front-end.

En el archivo "Datos.txt" se encuentran los datos necesarios para simular la transaccion de Webpay de manera correcta.
