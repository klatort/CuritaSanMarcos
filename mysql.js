/*const mysqlConsultas = require('mysql2')
const connection = mysqlConsultas.createConnection({
  host: 'localhost',
  user: 'root',
  password: '********', // Password removed for security
  database: 'curitasanmarcos'
});

connection.connect((err)=>{
  if(err) throw err
  console.log('Conexion establecida exitosamente!')
});

connection.query('Select * from medicos', (err, rows)=> {
    if(err) throw err
    console.log('Los datos solicitados son:')
    console.log(rows)
  })

connection.end()
*/

//require('dotenv').config()
require('dotenv').config({ path: '.env.local' })
const mysqlConsultas = require('mysql2')

// Función para intentar conectar con reintentos
let connectionAttempts = 0;
const MAX_RETRIES = 5;

function createConnection() {
  console.log(`Intento de conexión a MySQL #${connectionAttempts + 1}...`);
  
  // Crear conexión simple para facilitar la depuración
  const connection = mysqlConsultas.createConnection({
    host: process.env.MYSQL_DB_HOST,
    user: process.env.MYSQL_DB_USER,
    password: process.env.MYSQL_DB_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
    port: process.env.MYSQL_DB_PORT || 3306,
    connectTimeout: 20000,
  });
//mysql.js
  // Manejar eventos de error y reconexión
  connection.on('error', function(err) {
    console.error('Error de MySQL:', err.message);
    
    // Si perdimos la conexión, intentar reconectar
    if (err.code === 'PROTOCOL_CONNECTION_LOST' && connectionAttempts < MAX_RETRIES) {
      connectionAttempts++;
      console.log(`Reconectando (${connectionAttempts}/${MAX_RETRIES})...`);
      setTimeout(createConnection, 2000); // Esperar 2 segundos antes de reconectar
    }
  });

  return connection;
}

// Crear la conexión
const connection = createConnection();

// Exportar la conexión
module.exports = connection;