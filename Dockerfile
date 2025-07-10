# Use Node.js 18 LTS Alpine for better compatibility
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies and create user
RUN apk add --no-cache \
    ca-certificates \
    chromium \
    freetype \
    freetype-dev \
    g++ \
    harfbuzz \
    make \
    nss \
    python3 \
    ttf-freefont \
    wget \
    && addgroup -g 1001 -S nodejs \
    && adduser -S builderbot -u 1001 -G nodejs

# Set Puppeteer to use the installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copy package files and install dependencies as root
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY . .

# Create directories and set proper permissions
RUN mkdir -p /app/bot_sessions \
    && mkdir -p /app/baileys_auth_info \
    && chown -R builderbot:nodejs /app \
    && chmod -R 755 /app/bot_sessions \
    && chmod -R 755 /app/baileys_auth_info

# Switch to non-root user
USER builderbot

# Expose ports (3000 for QR portal, 3001 for health check)
EXPOSE 3000 3001

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Health check - Use node for better compatibility
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => { process.exit(1) })" || exit 1

# Use exec form for better signal handling
CMD ["node", "app.js"]