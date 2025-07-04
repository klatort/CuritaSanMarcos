const { createBot, createProvider, createFlow } = require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MySQLAdapter = require('@bot-whatsapp/database/mysql')
require('dotenv').config()
const path = require('path')
const fs = require('fs')
const qrcode = require('qrcode-terminal')

/**
 * Obtenemos las variables de entorno para la conexión MySQL
 */
const MYSQL_DB_HOST = process.env.MYSQL_DB_HOST
const MYSQL_DB_USER = process.env.MYSQL_DB_USER
const MYSQL_DB_PASSWORD = process.env.MYSQL_DB_PASSWORD
const MYSQL_DB_NAME = process.env.MYSQL_DB_NAME
const MYSQL_DB_PORT = process.env.MYSQL_DB_PORT

const SESSION_DIR = path.join('/tmp', 'bot_sessions'); // Use /tmp which typically has universal write permissions

// const flowSaludar = require('./flujos/flowSaludar')
// const flowWelcome = require('./flujos/flowWelcome')
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
            // flowSaludar, 
            // flowWelcome, 
            // menuFlow, 
            // flowConsultas, 
            // flowReservar, 
            // flowVerCitas
        ])
        const adapterProvider = createProvider(BaileysProvider, {
            sessionDir: SESSION_DIR,
            qrMobileUrl: true,
            // Add custom QR handling
            customQrHandler: async (qrCode) => {
                console.log('\n\n🔄 Nuevo código QR generado! 🔄\n');
                
                // Display QR in console
                qrcode.generate(qrCode, { small: true });
                
                // Also save to file for debugging
                try {
                    const qrPath = path.join(SESSION_DIR, 'latest-qr.txt');
                    fs.writeFileSync(qrPath, qrCode);
                    console.log(`✅ QR code text saved to ${qrPath}`);
                } catch (err) {
                    console.log('❌ Error saving QR code to file:', err);
                }
                
                console.log('\n📱 Escanea el código QR con WhatsApp');
                console.log(`🌐 O visita http://localhost:3000 en tu navegador\n`);
            }
        })

        createBot({
            flow: adapterFlow,
            provider: adapterProvider,
            database: adapterDB, // Ahora usa MySQL en lugar de MockAdapter
        })

        // Configurar el portal web con opciones para mayor accesibilidad
        const portalOptions = { 
            port: 3000, 
            host: '0.0.0.0',
            qrOptions: {
                scale: 10,           // Higher scale for better visibility
                margin: 4,           // Margin around the QR
                color: {
                    dark: '#000000', // QR dark color
                    light: '#ffffff' // QR light color
                }
            }
        }
        
        console.log('⚡ Iniciando portal web para QR en http://localhost:3000');
        console.log('⚠️ Si el QR no aparece en la web, revisa los logs del contenedor');
        
        QRPortalWeb(portalOptions);
    } catch (error) {
        console.error('Error en la función main:', error)
    }
}

main().catch(error => {
    console.error('Error no manejado:', error)
})
