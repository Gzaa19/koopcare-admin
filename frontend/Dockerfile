# Gunakan Node.js versi LTS yang ringan
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json dan install dependency
COPY package*.json ./
RUN npm install

# Copy seluruh source code
COPY . .

# Expose port Vite default
EXPOSE 5173

# Perintah menjalankan Vite agar bisa diakses dari luar container (--host)
CMD ["npm", "run", "dev", "--", "--host"]