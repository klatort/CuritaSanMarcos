FROM node:18-bullseye-slim AS bot

# Argumentos para controlar UID/GID del usuario node
ARG UID=1000
ARG GID=1000

# Update system packages to reduce vulnerabilities
RUN apt-get update && apt-get upgrade -y && apt-get clean && \
    # Aseguramos que el usuario node tenga el UID y GID correctos
    groupmod -g "${GID}" node && \
    usermod -u "${UID}" -g "${GID}" node

WORKDIR /app

# Copiar archivos de dependencias primero para aprovechar la caché de Docker
COPY package*.json ./

# Instalar dependencias
RUN npm i

# Copiar el resto del código fuente
COPY . .

# Crear directorios necesarios y establecer permisos
# Este directorio será sobrescrito por el volumen, pero aseguramos que exista y tenga permisos correctos
RUN mkdir -p bot_sessions && \
    chmod -R 777 /app/bot_sessions && \
    chown -R node:node /app && \
    chown -R node:node /app/bot_sessions && \
    # Crear un archivo baileys_store.json vacío con los permisos adecuados
    echo "{}" > /app/bot_sessions/baileys_store.json && \
    chmod 777 /app/bot_sessions/baileys_store.json && \
    # Verificar permisos (debug)
    ls -la /app/bot_sessions

USER node

CMD ["npm", "start"]
