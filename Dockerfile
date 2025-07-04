FROM node:18-bullseye-slim AS bot
# Update system packages to reduce vulnerabilities
RUN apt-get update && apt-get upgrade -y && apt-get clean
WORKDIR /app

# Copiar archivos de dependencias primero para aprovechar la caché de Docker
COPY package*.json ./

# Instalar dependencias
RUN npm i

# Copiar el resto del código fuente
COPY . .

# Crear directorios necesarios y establecer permisos
RUN mkdir -p bot_sessions && \
    chmod 755 /app/bot_sessions && \
    chown -R node:node /app

USER node

CMD ["npm", "start"]
