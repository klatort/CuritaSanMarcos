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

require('dotenv').config()
const mysqlConsultas = require('mysql2')

// Crear pool de conexiones en lugar de una conexión única
const pool = mysqlConsultas.createPool({
  host: process.env.MYSQL_DB_HOST,
  user: process.env.MYSQL_DB_USER,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000,
  acquireTimeout: 60000,
  // Configurar la reconexión automática en caso de error
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
});

// Verificar la conexión
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error al conectar a MySQL:', err.message);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Conexión a la base de datos perdida');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('La base de datos tiene demasiadas conexiones');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Conexión rechazada por la base de datos');
    }
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Acceso denegado: revisar credenciales');
    }
  } else {
    console.log('Conexión establecida exitosamente a MySQL!');
    connection.release();
  }
});

// Exportar el pool en lugar de una sola conexión
module.exports = pool.promise();