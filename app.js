const { createBot, createProvider, createFlow } = require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MySQLAdapter = require('@bot-whatsapp/database/mysql')
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




// Asegurar que el directorio para las sesiones del bot existe
const ensureDirectoryExists = (directory) => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
        console.log(`Directorio creado: ${directory}`);
    }
};

// Iniciar el bot con reintentos para la conexión a la base de datos
const main = async () => {
    // Asegurar directorios
    ensureDirectoryExists('./bot_sessions');
    
    try {
        console.log('Iniciando conexión a MySQL...');
        
        // Intentar conexión con reintentos
        const connectWithRetry = async (retries = 5, delay = 5000) => {
            try {
                // Configurar la base de datos MySQL
                const adapterDB = new MySQLAdapter({
                    host: MYSQL_DB_HOST,
                    user: MYSQL_DB_USER,
                    database: MYSQL_DB_NAME,
                    password: MYSQL_DB_PASSWORD,
                    port: MYSQL_DB_PORT,
                    connectTimeout: 60000,
                    waitForConnections: true
                });
                
                return adapterDB;
            } catch (err) {
                if (retries === 0) {
                    throw new Error('No se pudo conectar a MySQL después de varios intentos');
                }
                
                console.log(`Error al conectar a MySQL. Reintentando en ${delay/1000} segundos... (${retries} intentos restantes)`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return connectWithRetry(retries - 1, delay);
            }
        };
        
        const adapterDB = await connectWithRetry();
        console.log('Conexión a MySQL establecida correctamente');
        
        const adapterFlow = createFlow([])
        const adapterProvider = createProvider(BaileysProvider)

        createBot({
            flow: adapterFlow,
            provider: adapterProvider,
            database: adapterDB, // Ahora usa MySQL en lugar de MockAdapter
        })

        QRPortalWeb()
    } catch (error) {
        console.error('Error en la función main:', error)
    }
}

main().catch(error => {
    console.error('Error no manejado:', error)
})
