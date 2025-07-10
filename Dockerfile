# Use Node.js 18 LTS Alpine for smaller image size
FROM node:18-alpine AS bot

# Set working directory
WORKDIR /app

# Install dependencies, create user, and set up directories in a single layer
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
    && adduser -S builderbot -u 1001 \
    && mkdir -p /tmp/bot_sessions \
    && chmod -R 755 /tmp/bot_sessions \
    && rm -rf /var/cache/apk/*

# Set Puppeteer to use the installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copy package files
COPY package*.json ./

# Install dependencies and clean cache
RUN npm ci --only=production \
    && npm cache clean --force \
    && chown -R builderbot:nodejs /app \
    && chown -R builderbot:nodejs /tmp/bot_sessions

# Copy application code
COPY . .

# Switch to non-root user
USER builderbot

# Expose ports (3000 for web portal, 3001 for health check)
EXPOSE 3000 3001

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Use exec form for better signal handling
CMD ["node", "app.js"]