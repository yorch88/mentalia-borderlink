# ===============================
# Stage 1: Build
# ===============================
FROM node:20 AS builder

WORKDIR /app/node_modules

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# ===============================
# Stage 2: Static server
# ===============================
FROM node:20

WORKDIR /app/node_modules

# Servidor estático ligero
RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
