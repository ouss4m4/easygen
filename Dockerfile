# --------- Stage 1: Build frontend ---------
FROM node:20-slim AS web-builder

WORKDIR /frontend

COPY eg_app/package.json eg_app/pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

COPY eg_app ./
ENV VITE_API_URL=
RUN pnpm build


# --------- Stage 2: Build API ---------
FROM node:20-slim AS api-builder

WORKDIR /app

# Install API dependencies with npm (no pnpm needed here)
COPY eg_api/package.json eg_api/package-lock.json ./
RUN npm install

# Copy API source
COPY eg_api ./


# Copy built frontend into public folder of API
COPY --from=web-builder /frontend/client ./client

# Run build (includes copying public into dist and prisma)
RUN npm run build

# --------- Final Image: Runtime only (copy final output and npm install deps) ---------
FROM node:20-slim

WORKDIR /app

# Install prod deps
COPY eg_api/package.json eg_api/package-lock.json ./
RUN npm install --omit=dev

# Copy final backend dist (which includes frontend inside dist/public)
COPY --from=api-builder /app/dist ./dist
COPY --from=api-builder /app/client ./dist/client

CMD ["node", "dist/index.js"]