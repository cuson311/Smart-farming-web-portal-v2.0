# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build

# Stage 2: Run
FROM node:18-alpine

WORKDIR /app

# Copy only the standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package.json ./package.json

# You don't need node_modules if using standalone
EXPOSE 3002
CMD ["node", "server.js"]
