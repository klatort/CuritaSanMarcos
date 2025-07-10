# Use Node.js 21 LTS Alpine as per BuilderBot documentation
FROM node:21-alpine3.18 AS builder

# Enable Corepack and prepare for PNPM installation to increase performance
RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME=/usr/local/bin

# Set working directory
WORKDIR /app

# Install system dependencies
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
    wget

# Set Puppeteer to use the installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY . .

# Create session directory with proper permissions
RUN mkdir -p /app/bot_sessions && chmod 755 /app/bot_sessions

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