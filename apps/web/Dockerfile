# ===============================
# Stage 1: Build
# ===============================
FROM node:20-alpine AS builder

# Carpeta real de trabajo
WORKDIR /app

# Copiamos solo package files primero (mejor cache)
COPY package*.json ./

# Instalación limpia y determinística
RUN npm ci

# Copiamos el resto del proyecto
COPY . .

# Build
RUN npm run build


# ===============================
# Stage 2: Static server
# ===============================
FROM node:20-alpine

WORKDIR /app

# Servidor estático ligero
RUN npm install -g serve

# Solo copiamos el build final
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
