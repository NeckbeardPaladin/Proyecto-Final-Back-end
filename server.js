const fs = require('fs');
const path = require('path');

const envPath = fs.existsSync(path.join(__dirname, '.env'))
  ? path.join(__dirname, '.env')
  : path.join(__dirname, 'server.env');

require('dotenv').config({ path: envPath });

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
  if (err) {
    console.error('No se pudo iniciar el servidor:', err.message);
    if (err.code === 'EADDRINUSE') {
      console.error(
        `El puerto ${PORT} ya está en uso. Cierra el otro proceso (o otra terminal con npm run dev) y vuelve a intentar.`
      );
    }
    process.exit(1);
    return;
  }
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
