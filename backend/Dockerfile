# Production-ready backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Kopiraj package.json in package-lock.json
COPY package*.json ./

# Instaliraj samo production odvisnosti
RUN npm ci --only=production && npm cache clean --force

# Ustvari non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001

# Kopiraj source code
COPY . .

# Spremeni lastništvo datotek
RUN chown -R nodeuser:nodejs /app
USER nodeuser

EXPOSE 5000

# Uporabi production command
CMD ["npm", "start"]
