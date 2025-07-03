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

## Estructura del Proyecto

- `app.js` - Punto de entrada principal
- `mysql.js` - Configuración de conexión a base de datos
- `bd/` - Scripts SQL y datos
- `Imagenes/` - Recursos visuales del bot
- `bot_sessions/` - Datos de sesión (generados automáticamente)
