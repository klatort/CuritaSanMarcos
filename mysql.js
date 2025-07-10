/*const mysqlConsultas = require('mysql2')
const connection = mysqlConsultas.createConnection({
  host: 'localhost',
  user: 'root',
  password: '4819508Mysql.',
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

// Only establish connection if environment variables are properly set
const canConnect = process.env.MYSQL_DB_HOST && 
                  process.env.MYSQL_DB_USER && 
                  process.env.MYSQL_DB_PASSWORD && 
                  process.env.MYSQL_DB_NAME;

let connection;

if (canConnect) {
  connection = mysqlConsultas.createConnection({
    host: process.env.MYSQL_DB_HOST,
    user: process.env.MYSQL_DB_USER,
    password: process.env.MYSQL_DB_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
    port: process.env.MYSQL_DB_PORT || 3306
  });

  connection.connect((err) => {
    if (err) {
      console.error('❌ MySQL connection error:', err.message);
      console.log('⚠️  Bot will continue without database functionality');
      connection = null;
    } else {
      console.log('✅ MySQL connection established successfully!');
    }
  });
} else {
  console.log('⚠️  MySQL environment variables not set. Bot will run without database functionality.');
  connection = null;
}

module.exports = connection