# Use Node.js 22.18.0 as specified in package.json volta
FROM node:22.18.0-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm@latest

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build stage
FROM base AS build

# Set NODE_ENV to production for build
ENV NODE_ENV=production

# Build the application
RUN pnpm run build

# Production stage
FROM node:22.18.0-alpine AS production

# Install pnpm in production image
RUN npm install -g pnpm@latest

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S adonisjs -u 1001

# Set working directory
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy the entire build directory to /app
COPY --from=build --chown=adonisjs:nodejs /app/build /app

# Copy package files for production dependencies
COPY --from=build --chown=adonisjs:nodejs /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/

# Install production dependencies
RUN pnpm install --frozen-lockfile && pnpm store prune

# Create necessary directories and set permissions
RUN mkdir -p /app/tmp /app/storage && \
    chown -R adonisjs:nodejs /app && \
    chmod -R 755 /app && \
    chmod -R 777 /app/tmp

# Switch to non-root user
USER adonisjs

# Expose port
EXPOSE 3333

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node bin/console.js healthcheck || exit 1

# Start the application
CMD ["node", "bin/server.js"]
