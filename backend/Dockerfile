# Gunakan Node.js versi LTS yang ringan
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json dan install dependency
COPY package*.json ./
RUN npm install

# Copy seluruh source code
COPY . .

# Expose port backend
EXPOSE 5000

# Perintah menjalankan server di mode development
CMD ["npm", "run", "dev"]