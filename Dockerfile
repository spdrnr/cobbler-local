# Multi-stage Dockerfile for Cobbler CRM Full-Stack Application with MySQL
# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder

# Set working directory
WORKDIR /app

# Copy frontend package files
COPY package*.json ./
COPY vite.config.ts ./
COPY tsconfig.app.json ./
COPY tsconfig.node.json ./

# Install frontend dependencies
RUN npm ci

# Copy frontend source code
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./

# Build frontend
RUN npm run build

# Stage 2: Build Backend
FROM node:18-alpine AS backend-builder

# Set working directory
WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

# Install backend dependencies
RUN npm ci

# Copy backend source code
COPY backend/src/ ./src/
COPY backend/tsconfig.json ./

# Build backend TypeScript
RUN npm run build

# Stage 3: Production Runtime with MySQL
FROM mysql:8.0 AS mysql-base

# Stage 4: Final Runtime
FROM node:18-alpine AS production

# Install dumb-init, MySQL client, and other dependencies
RUN apk add --no-cache dumb-init mysql-client bash

# Copy MySQL binaries from mysql-base
COPY --from=mysql-base /usr/bin/mysqld /usr/bin/
COPY --from=mysql-base /usr/bin/mysql /usr/bin/
COPY --from=mysql-base /usr/bin/mysqladmin /usr/bin/
COPY --from=mysql-base /usr/lib/mysql* /usr/lib/
COPY --from=mysql-base /usr/share/mysql* /usr/share/

# Create MySQL data directory and user
RUN addgroup -g 1001 -S mysql && \
    adduser -S mysql -u 1001 -G mysql && \
    mkdir -p /var/lib/mysql && \
    chown -R mysql:mysql /var/lib/mysql

# Create app user for security
RUN addgroup -g 1002 -S nodejs && \
    adduser -S nodejs -u 1002 -G nodejs

# Set working directory
WORKDIR /app

# Copy built backend from builder stage
COPY --from=backend-builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=backend-builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=backend-builder --chown=nodejs:nodejs /app/package*.json ./

# Copy built frontend from builder stage
COPY --from=frontend-builder --chown=nodejs:nodejs /app/dist ./public

# Create logs directory
RUN mkdir -p logs && chown nodejs:nodejs logs

# Create startup script that handles everything
RUN echo '#!/bin/bash\n\
\n\
# Set default environment variables\n\
export NODE_ENV=${NODE_ENV:-production}\n\
export PORT=${PORT:-3001}\n\
export DB_HOST=${DB_HOST:-localhost}\n\
export DB_PORT=${DB_PORT:-3306}\n\
export DB_USER=${DB_USER:-root}\n\
export DB_PASSWORD=${DB_PASSWORD:-cobbler_password}\n\
export DB_NAME=${DB_NAME:-cobbler_crm}\n\
export X_TOKEN_SECRET=${X_TOKEN_SECRET:-cobbler_super_secret_token_2024}\n\
\n\
# Initialize MySQL data directory if empty\n\
if [ ! -f /var/lib/mysql/mysql/user.frm ]; then\n\
    echo "Initializing MySQL data directory..."\n\
    mysqld --initialize-insecure --user=mysql --datadir=/var/lib/mysql\n\
fi\n\
\n\
# Start MySQL server in background\n\
echo "Starting MySQL server..."\n\
mysqld --user=mysql --datadir=/var/lib/mysql --socket=/tmp/mysql.sock &\n\
MYSQL_PID=$!\n\
\n\
# Wait for MySQL to be ready\n\
echo "Waiting for MySQL to be ready..."\n\
sleep 10\n\
\n\
# Create database and user\n\
echo "Setting up database..."\n\
mysql -u root -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"\n\
mysql -u root -e "CREATE USER IF NOT EXISTS '\''$DB_USER'\''@'\''%'\'' IDENTIFIED BY '\''$DB_PASSWORD'\'';"\n\
mysql -u root -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '\''$DB_USER'\''@'\''%'\'';"\n\
mysql -u root -e "FLUSH PRIVILEGES;"\n\
echo "Database setup complete!"\n\
\n\
# Start the application\n\
echo "Starting Cobbler CRM application..."\n\
exec node dist/app.js\n\
' > /app/start.sh && chmod +x /app/start.sh

# Switch to non-root user
USER nodejs

# Expose port (backend serves both API and frontend)
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application with dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["/app/start.sh"]
