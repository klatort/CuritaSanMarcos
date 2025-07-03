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
const connection = mysqlConsultas.createConnection({
  host: process.env.MYSQL_DB_HOST,
  user: process.env.MYSQL_DB_USER,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DB_NAME
});

connection.connect((err) => {
  if (err) throw err
  console.log('Conexion establecida exitosamente!')
});

module.exports = connection