FROM node:18-bullseye as bot
WORKDIR /app

COPY package*.json ./
RUN npm i && \
    mkdir -p node_modules && \
    chown -R node:node /app

USER node

CMD ["npm", "start"]
