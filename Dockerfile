# Stage 1: Install dependencies
FROM node:22-alpine AS deps

WORKDIR /app/web

COPY web/package*.json ./
RUN npm ci

# Stage 2: Build Next.js standalone bundle
FROM node:22-alpine AS build

WORKDIR /app/web

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/web/node_modules ./node_modules
COPY web/ ./
RUN npm run build

# Stage 3: Runtime
FROM node:22-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOST=0.0.0.0 \
    PORT=3000

COPY --from=build /app/web/.next/standalone ./
COPY --from=build /app/web/.next/static ./.next/static
COPY --from=build /app/web/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
