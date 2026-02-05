FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies
RUN npm ci

# Copy source code
COPY apps/api ./apps/api
COPY packages/shared ./packages/shared

# Build shared package
WORKDIR /app/packages/shared
RUN npm run build

# Generate Prisma client PRIMERO
WORKDIR /app/apps/api
RUN npx prisma generate

# Build API DESPUÉS (necesita los tipos de Prisma)
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
