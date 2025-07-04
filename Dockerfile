FROM node:18-bullseye as bot
WORKDIR /app
COPY package*.json ./
RUN npm i && \
    mkdir -p /tmp/bot_sessions && \
    chmod -R 777 /tmp/bot_sessions
COPY . .
ARG RAILWAY_STATIC_URL
ARG PUBLIC_URL
ARG PORT
CMD ["npm", "start"]