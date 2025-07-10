<<<<<<< HEAD
/*

Se establece la conexión de la aplicación Node.js con la base de datos MySQL
El objeto connection se exporta a fin de que pueda ser reutilizado en otras partes de la aplicación.

A fin de realizar una consulta:

const mysqlConsultas = require('mysql2')
=======
/*const mysqlConsultas = require('mysql2')
>>>>>>> 4d9b45adaab7f2eacecc665ab17c78527854a5fe
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

<<<<<<< HEAD
const mysqlConsultas = require('mysql2')
const connection = mysqlConsultas.createConnection({
  host: 'localhost',
  user: 'root',
  password: '4819508Mysql.',
  database: 'curitasanmarcos'
=======
require('dotenv').config()
const mysqlConsultas = require('mysql2')
const connection = mysqlConsultas.createConnection({
  host: process.env.MYSQL_DB_HOST,
  user: process.env.MYSQL_DB_USER,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DB_NAME
>>>>>>> 4d9b45adaab7f2eacecc665ab17c78527854a5fe
});

connection.connect((err) => {
  if (err) throw err
  console.log('Conexion establecida exitosamente!')
});

module.exports = connection