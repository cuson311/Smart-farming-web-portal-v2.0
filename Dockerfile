# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app
COPY . .

# Declare the build argument for the API endpoint
# ARG NEXT_PUBLIC_API_ENDPOINT

# Set the environment variable for Next.js to use at build time
# ENV NEXT_PUBLIC_API_ENDPOINT=${NEXT_PUBLIC_API_ENDPOINT}

# Install deps and build
RUN npm install --legacy-peer-deps
RUN npm run build

# Stage 2: Run
FROM node:18-alpine

WORKDIR /app

# Copy the standalone build output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Expose the port Next.js runs on
EXPOSE 3002

# Start the production server (entrypoint is usually index.js)
CMD ["node", "server.js"]
