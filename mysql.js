/*

Se establece la conexión de la aplicación Node.js con la base de datos MySQL
El objeto connection se exporta a fin de que pueda ser reutilizado en otras partes de la aplicación.

A fin de realizar una consulta:

const mysqlConsultas = require('mysql2')
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

const mysqlConsultas = require('mysql2')
const connection = mysqlConsultas.createConnection({
  host: 'localhost',
  user: 'root',
  password: '4819508Mysql.',
  database: 'curitasanmarcos'
});

connection.connect((err) => {
  if (err) throw err
  console.log('Conexion establecida exitosamente!')
});

module.exports = connection