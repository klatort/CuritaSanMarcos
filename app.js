const { createBot, createProvider, createFlow } = require('@bot-whatsapp/bot')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
// Esto me ayudo: npm install @bot-whatsapp/database@latest
// https://chatgpt.com/share/67cd1fbd-eae0-800c-bd4b-f78c41c13c1c
const MySQLAdapter = require('@bot-whatsapp/database/mysql')
const http = require('http')
const path = require('path')
const fs = require('fs')
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
            console.log('📋 Ruta del QR: /qr.png')
            
            // Generar el QR code usando la librería QRCode
            try {
                const QRCode = require('qrcode')
                const qrPath = path.join(process.cwd(), 'bot.qr.png')
                QRCode.toFile(qrPath, qr, {
                    width: 256,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    }
                }, (err) => {
                    if (err) {
                        console.error('Error generando QR code:', err)
                    } else {
                        console.log('✅ QR code guardado en:', qrPath)
                    }
                })
            } catch (error) {
                console.error('Error al generar QR code:', error)
            }
        })

        adapterProvider.on('ready', () => {
            console.log('✅ WhatsApp conectado correctamente!')
        })

        adapterProvider.on('auth_failure', (error) => {
            console.error('❌ Error de autenticación:', error)
        })

        const { handleCtx, httpServer } = await createBot({
            flow: adapterFlow,
            provider: adapterProvider,
            database: adapterDB, // Ahora usa MySQL en lugar de MockAdapter
        })

        // Start HTTP server (includes QR portal)
        httpServer(PORT)

        // Create a custom HTTP server to handle QR code serving
        const customServer = http.createServer((req, res) => {
            // Enable CORS
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            
            if (req.method === 'OPTIONS') {
                res.writeHead(200)
                res.end()
                return
            }
            
            if (req.url === '/qr.png') {
                const qrPath = path.join(process.cwd(), 'bot.qr.png')
                
                // Check if QR file exists
                if (fs.existsSync(qrPath)) {
                    res.writeHead(200, { 'Content-Type': 'image/png' })
                    const qrImage = fs.readFileSync(qrPath)
                    res.end(qrImage)
                } else {
                    // Return placeholder if QR doesn't exist yet
                    res.writeHead(200, { 'Content-Type': 'text/html' })
                    res.end(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>QR Code</title>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <style>
                                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                                .container { max-width: 400px; margin: 0 auto; }
                                .loading { font-size: 18px; margin: 20px 0; }
                                .info { color: #666; margin-top: 20px; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <h1>🤖 CuritaSanMarcos Bot</h1>
                                <div class="loading">⏳ Generando código QR...</div>
                                <div class="info">
                                    <p>El código QR se está generando. Recarga la página en unos momentos.</p>
                                    <p>Una vez que aparezca el QR, escanéalo con WhatsApp.</p>
                                </div>
                                <script>
                                    setTimeout(() => {
                                        window.location.reload();
                                    }, 5000);
                                </script>
                            </div>
                        </body>
                        </html>
                    `)
                }
            } else if (req.url === '/') {
                // Serve main page
                res.writeHead(200, { 'Content-Type': 'text/html' })
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>CuritaSanMarcos Bot</title>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                            .container { max-width: 500px; margin: 0 auto; }
                            .qr-container { margin: 30px 0; }
                            .qr-container img { max-width: 100%; height: auto; border: 2px solid #ddd; border-radius: 10px; }
                            .info { color: #666; margin-top: 20px; }
                            .refresh-btn { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 10px; }
                            .refresh-btn:hover { background: #0056b3; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>🤖 CuritaSanMarcos Bot</h1>
                            <div class="qr-container">
                                <img src="/qr.png" alt="QR Code" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjE0Ij5RUiBDb2RlPC90ZXh0Pgo8L3N2Zz4='" />
                            </div>
                            <div class="info">
                                <p>📱 Escanea el código QR con WhatsApp para conectar el bot</p>
                                <p>🔄 El código se actualiza automáticamente cada 30 segundos</p>
                                <button class="refresh-btn" onclick="window.location.reload()">Actualizar QR</button>
                            </div>
                            <script>
                                setInterval(() => {
                                    const img = document.querySelector('img');
                                    img.src = '/qr.png?' + new Date().getTime();
                                }, 30000);
                            </script>
                        </div>
                    </body>
                    </html>
                `)
            } else {
                res.writeHead(404)
                res.end('Not Found')
            }
        })

        // Listen on the main PORT (3000) but on a different route
        // The BuilderBot httpServer will handle the main QR portal
        // This custom server will handle our enhanced QR serving

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
        console.log(`📋 QR directo disponible en: ${portalUrl}/qr.png`)
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
        console.log('- QR directo:', portalUrl + '/qr.png')
        
    } catch (error) {
        console.error('Error en la función main:', error)
    }
}

main().catch(error => {
    console.error('Error no manejado:', error)
})
