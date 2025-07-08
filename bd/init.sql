-- Script de inicialización de la base de datos (tabla básica)
USE curitasanmarcos;

-- Crear tabla básica para comprobar la conexión
CREATE TABLE IF NOT EXISTS test_connection (
    id INT PRIMARY KEY AUTO_INCREMENT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message VARCHAR(100) DEFAULT 'Conexión exitosa'
);

-- Insertar registro de prueba
INSERT INTO test_connection (message) VALUES ('Base de datos inicializada correctamente');
