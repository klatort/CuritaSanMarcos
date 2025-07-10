const { createBot, createProvider, createFlow } = require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
// Esto me ayudo: npm install @bot-whatsapp/database@latest
// https://chatgpt.com/share/67cd1fbd-eae0-800c-bd4b-f78c41c13c1c
const MySQLAdapter = require('@bot-whatsapp/database/mysql')
const http = require('http')
require('dotenv').config()

/**
 * Obtenemos las variables de entorno para la conexión MySQL
 */
const MYSQL_DB_HOST = process.env.MYSQL_DB_HOST
const MYSQL_DB_USER = process.env.MYSQL_DB_USER
const MYSQL_DB_PASSWORD = process.env.MYSQL_DB_PASSWORD
const MYSQL_DB_NAME = process.env.MYSQL_DB_NAME
const MYSQL_DB_PORT = process.env.MYSQL_DB_PORT


const flowSaludar = require('./flujos/flowSaludar')
const flowWelcome = require('./flujos/flowWelcome')
// const flowVerCitas = require('./flujos/flowVerCitas')
// const flowReservar = require('./flujos/flowReservar')
// const flowConsultas = require('./flujos/flowConsultas')
// const menuFlow = require('./flujos/menuFlow')



const main = async () => {
    try {
        // Configurar la base de datos MySQL
        const adapterDB = new MySQLAdapter({
            host: MYSQL_DB_HOST,
            user: MYSQL_DB_USER,
            database: MYSQL_DB_NAME,
            password: MYSQL_DB_PASSWORD,
            port: MYSQL_DB_PORT,
        })

        const adapterFlow = createFlow([
            flowSaludar, 
            flowWelcome
            // menuFlow, 
            // flowConsultas, 
            // flowReservar, 
            // flowVerCitas
        ])
        const adapterProvider = createProvider(BaileysProvider, {
          sessionDir: SESSION_DIR
        })

        // Add QR code event handler for better visibility
        adapterProvider.on('qr', (qr) => {
            console.log('📱 Código QR generado. Escanéalo con WhatsApp.')
            console.log('🌐 También puedes verlo en: http://localhost:3000')
        })

        adapterProvider.on('ready', () => {
            console.log('✅ WhatsApp conectado correctamente!')
        })

        adapterProvider.on('auth_failure', (error) => {
            console.error('❌ Error de autenticación:', error)
        })

        createBot({
            flow: adapterFlow,
            provider: adapterProvider,
            database: adapterDB, // Ahora usa MySQL en lugar de MockAdapter
        })

        // Configurar el portal web con opciones para mayor accesibilidad
        const portalOptions = { 
            port: 3000, 
            host: '0.0.0.0' // Permite acceso desde cualquier IP
        }
        
        // Iniciar el portal web
        console.log('⚡ Iniciando portal web para QR en http://localhost:3000')
        QRPortalWeb(portalOptions)

        // Start health check server on port 3001
        healthServer.listen(3001, '0.0.0.0', () => {
            console.log('🏥 Health check server running on port 3001')
        })
    } catch (error) {
        console.error('Error en la función main:', error)
    }
}

main().catch(error => {
    console.error('Error no manejado:', error)
})
