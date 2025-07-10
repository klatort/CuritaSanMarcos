# CuritaSanMarcos
Proyecto de Taller de Aplicaciones Sociales

## Instalación y Configuración

### Usando Docker Compose (Recomendado)

El proyecto está configurado para ejecutarse fácilmente usando Docker Compose, lo que incluye tanto el bot de WhatsApp como la base de datos MySQL.

#### Requisitos
- Docker
- Docker Compose

#### Pasos para iniciar
1. Clonar este repositorio
2. Crear archivo `.env` copiando el ejemplo (ya viene con valores predeterminados funcionales):

   ```bash
   # En Linux/Mac:
   cp .env.example .env
   
   # En Windows:
   copy .env.example .env
   ```

3. Ejecutar el siguiente comando:

   ```bash
   docker-compose up -d
   ```

4. El bot se iniciará automáticamente y se conectará a la base de datos MySQL

5. **IMPORTANTE**: Para escanear el código QR y conectar WhatsApp:
   - Accede a la interfaz web del QR en: http://localhost:3000
   - Escanea el código QR con tu aplicación de WhatsApp para conectar el bot
   - La interfaz web estará disponible mientras el bot esté iniciando y esperando conexión

#### Comandos útiles
- Ver logs: `docker-compose logs -f`
- Detener servicios: `docker-compose down`
- Reiniciar servicios: `docker-compose restart`

### Instalación Local (Sin Docker)

Si prefieres ejecutar el proyecto localmente sin Docker:

1. Instalar Node.js (versión 18 recomendada)
2. Instalar y configurar MySQL
3. Crear archivo `.env` basado en `.env.example`
4. Ejecutar:
   ```bash
   npm install
   npm start
   ```

## Portal QR Code Mejorado

### Problema Identificado y Solución

El problema principal era que el portal web del QR code mostraba una imagen placeholder en lugar del código QR real. Esto ocurría porque:

1. **Generación del QR**: El provider de Baileys no estaba generando el archivo QR en la ubicación correcta
2. **Servicio del QR**: El servidor HTTP no estaba sirviendo el archivo QR correctamente
3. **Configuración para producción**: Las URLs estaban hardcodeadas para `localhost`

### Solución Implementada

**1. Generación manual del QR code:**
- Agregada dependencia `qrcode` al proyecto
- Implementado listener del evento `qr` que genera el archivo `bot.qr.png`
- El QR se guarda en el directorio raíz del proyecto

**2. Servidor HTTP personalizado:**
- Implementado manejo de rutas para servir el QR code
- Página principal con interfaz mejorada (`http://localhost:3000/`)
- Ruta directa al QR (`http://localhost:3000/qr.png`)
- Auto-refresh cada 30 segundos para QR codes nuevos

**3. Configuración flexible para producción:**
- Variables de entorno para `SERVER_IP` y `SERVER_DOMAIN`
- URLs dinámicas basadas en la configuración
- Soporte para HTTPS en producción

### Nuevas Características del Portal QR

- **Interfaz mejorada**: Página web con diseño moderno y responsive
- **Auto-refresh**: El QR se actualiza automáticamente cada 30 segundos
- **Fallback inteligente**: Si no hay QR disponible, muestra mensaje de "generando..."
- **Botón de actualización manual**: Para refrescar el QR cuando sea necesario
- **Instrucciones claras**: Guía al usuario sobre cómo usar el QR

### Acceso al Portal QR

1. **Desarrollo local**: `http://localhost:3000`
2. **Producción**: `http://YOUR_SERVER_IP:3000` o `https://YOUR_DOMAIN`
3. **QR directo**: Agrega `/qr.png` a cualquiera de las URLs anteriores

### Variables de Entorno Actualizadas

```env
# Server Configuration
SERVER_HOST=0.0.0.0          # Host del servidor (0.0.0.0 para Docker)
SERVER_IP=YOUR_SERVER_IP     # IP pública del servidor
SERVER_DOMAIN=YOUR_DOMAIN    # Dominio si tienes uno configurado
PORT=3000                    # Puerto principal
HEALTH_PORT=3001             # Puerto para health check
```

### Comandos de Verificación

```bash
# Verificar que el QR se genera correctamente
ls -la bot.qr.png

# Verificar que el servidor está funcionando
curl http://localhost:3000

# Verificar que el QR se sirve correctamente
curl -I http://localhost:3000/qr.png

# Verificar health check
curl http://localhost:3001/health
```

### Dockerfile Mejorado

El proyecto utiliza un Dockerfile optimizado basado en las mejores prácticas de BuilderBot:

- **Imagen base**: `node:18-alpine` para menor tamaño
- **Seguridad**: Ejecuta como usuario no-root (`builderbot`)
- **Dependencias**: Incluye Chromium y dependencias necesarias para WhatsApp Web
- **Health Check**: Endpoint de salud en el puerto 3001
- **Optimización**: Capas de imagen minimizadas y cache de npm limpio

### Características del Dockerfile

```dockerfile
# Optimizaciones implementadas:
- Imagen Alpine Linux (menor tamaño)
- Usuario no-root para mayor seguridad
- Health check integrado
- Manejo adecuado de señales
- Dependencias de Chromium pre-instaladas
- Permisos de directorio configurados correctamente
```

### Puertos Expuestos

- **3000**: Portal web para código QR
- **3001**: Endpoint de health check
- **3306**: MySQL (solo internamente entre contenedores)

### Variables de Entorno

El proyecto utiliza las siguientes variables de entorno:

```env
MYSQL_DB_HOST=mysql          # Host de la base de datos
MYSQL_DB_USER=your_user      # Usuario MySQL
MYSQL_DB_PASSWORD=your_pass  # Contraseña MySQL
MYSQL_DB_NAME=your_db        # Nombre de la base de datos
MYSQL_DB_PORT=3306           # Puerto MySQL
NODE_ENV=production          # Entorno de Node.js
```

### Comandos Docker Útiles

```bash
# Construir imagen manualmente
docker build -t curita-bot .

# Ejecutar contenedor individual
docker run -p 3000:3000 -p 3001:3001 curita-bot

# Ver logs del contenedor
docker logs curita-bot

# Acceder al contenedor
docker exec -it curita-bot sh

# Verificar health check
curl http://localhost:3001/health
```

## Estructura del Proyecto

- `app.js` - Punto de entrada principal
- `mysql.js` - Configuración de conexión a base de datos
- `bd/` - Scripts SQL y datos
- `Imagenes/` - Recursos visuales del bot
- `bot_sessions/` - Datos de sesión (generados automáticamente)
- `.github/workflows/` - Configuración de GitHub Actions para despliegue automatizado

## Despliegue Automatizado

Este proyecto incluye un workflow de GitHub Actions que automatiza el despliegue a un servidor privado. El workflow:

- Se ejecuta automáticamente en pushes a la rama `main`
- Puede ejecutarse manualmente desde la pestaña Actions
- Copia archivos al servidor excluyendo `node_modules`, `bot_sessions` y `.env`
- Despliega usando docker-compose
- Verifica que el despliegue sea exitoso

Para configurar el despliegue, consulta `.github/workflows/README.md` para obtener información detallada sobre los secretos requeridos y la configuración del servidor.

test