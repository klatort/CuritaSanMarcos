FROM node:18-bullseye-slim AS bot

WORKDIR /app

# Copiar archivos de dependencias primero para aprovechar la caché de Docker
COPY package*.json ./

# Instalar dependencias y preparar directorios
RUN npm i && \
    mkdir -p /tmp/bot_sessions && \
    chmod -R 777 /tmp/bot_sessions && \
    chown -R node:node /app

# Copiar el resto del código fuente
COPY . .

USER node

CMD ["npm", "start"]
