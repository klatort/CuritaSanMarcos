const { createBot, createProvider, createFlow } = require('@bot-whatsapp/bot')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
// Esto me ayudo: npm install @bot-whatsapp/database@latest
// https://chatgpt.com/share/67cd1fbd-eae0-800c-bd4b-f78c41c13c1c
const MySQLAdapter = require('@bot-whatsapp/database/mysql')
const QRPortalWeb = require('@bot-whatsapp/portal')
const http = require('http')
const path = require('path')
require('dotenv').config()

/**
 * Obtenemos las variables de entorno para la conexión MySQL
 */
const MYSQL_DB_HOST = process.env.MYSQL_DB_HOST
const MYSQL_DB_USER = process.env.MYSQL_DB_USER
const MYSQL_DB_PASSWORD = process.env.MYSQL_DB_PASSWORD
const MYSQL_DB_NAME = process.env.MYSQL_DB_NAME
const MYSQL_DB_PORT = process.env.MYSQL_DB_PORT

/**
 * Variables de configuración del servidor
 */
const PORT = process.env.PORT || 3000
const HEALTH_PORT = process.env.HEALTH_PORT || 3001
const SERVER_HOST = process.env.SERVER_HOST || '0.0.0.0'
const SERVER_IP = process.env.SERVER_IP || 'localhost'
const SERVER_DOMAIN = process.env.SERVER_DOMAIN || null

const SESSION_DIR = path.join('/tmp', 'bot_sessions'); // Use /tmp which typically has universal write permissions

// Create simple health check server
const healthServer = http.createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }))
    } else {
        res.writeHead(404)
        res.end('Not Found')
    }
})

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
            
            // Determinar la URL del portal QR
            let portalUrl = `http://${SERVER_HOST}:${PORT}`
            
            if (SERVER_DOMAIN) {
                portalUrl = `https://${SERVER_DOMAIN}`
            } else if (SERVER_IP && SERVER_IP !== 'localhost') {
                portalUrl = `http://${SERVER_IP}:${PORT}`
            }
            
            console.log(`🌐 También puedes verlo en: ${portalUrl}`)
            console.log('📋 BuilderBot genera el QR automáticamente')
        })

        adapterProvider.on('ready', () => {
            console.log('✅ WhatsApp conectado correctamente!')
        })

        adapterProvider.on('auth_failure', (error) => {
            console.error('❌ Error de autenticación:', error)
        })

        const { handleCtx } = await createBot({
            flow: adapterFlow,
            provider: adapterProvider,
            database: adapterDB, // Ahora usa MySQL en lugar de MockAdapter
        })

        // Start QR Portal Web - Following BuilderBot official pattern
        QRPortalWeb(adapterProvider, PORT)

        // Bot is ready
        console.log('⚡ Bot iniciado')
        
        // Mostrar URLs apropiadas basadas en la configuración
        let portalUrl = `http://${SERVER_HOST}:${PORT}`
        let healthUrl = `http://${SERVER_HOST}:${HEALTH_PORT}`
        
        if (SERVER_DOMAIN) {
            portalUrl = `https://${SERVER_DOMAIN}`
            healthUrl = `https://${SERVER_DOMAIN}:${HEALTH_PORT}`
        } else if (SERVER_IP && SERVER_IP !== 'localhost') {
            portalUrl = `http://${SERVER_IP}:${PORT}`
            healthUrl = `http://${SERVER_IP}:${HEALTH_PORT}`
        }
        
        console.log(`📱 Portal web para QR disponible en: ${portalUrl}`)
        console.log(`🏥 Health check disponible en: ${healthUrl}/health`)

        // Start health check server on configured port
        healthServer.listen(HEALTH_PORT, SERVER_HOST, () => {
            console.log(`🏥 Health check server running on ${SERVER_HOST}:${HEALTH_PORT}`)
        })
        
        // También crear un mensaje de ayuda para el usuario
        console.log('\n📋 Instrucciones:')
        console.log('1. Abre tu navegador web y ve a:', portalUrl)
        console.log('2. Escanea el código QR con WhatsApp')
        console.log('3. ¡El bot estará listo para recibir mensajes!')
        console.log('\n🔧 Para desarrollo:')
        console.log('- Health check:', healthUrl + '/health')
        console.log('- El QR se sirve automáticamente en la página principal')
        
    } catch (error) {
        console.error('Error en la función main:', error)
    }
}

main().catch(error => {
    console.error('Error no manejado:', error)
})
