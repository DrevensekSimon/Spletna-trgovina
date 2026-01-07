# Multi-stage build za produkcijo
FROM node:18-alpine AS builder

WORKDIR /app

# Kopiraj package.json in package-lock.json
COPY package*.json ./

# Instaliraj odvisnosti
RUN npm ci --only=production

# Kopiraj source code
COPY . .

# Zgradi aplikacijo
RUN npm run build

# Production stage z nginx
FROM nginx:alpine

# Kopiraj build iz builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Kopiraj nginx konfiguracija
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
