# Gunakan image Node.js yang berbasis Debian (bullseye) agar bisa install ffmpeg
FROM node:20-bullseye-slim

# Install ffmpeg dan openssl (dibutuhkan oleh Prisma)
RUN apt-get update -y && apt-get install -y openssl ffmpeg && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy file dependency
COPY package*.json ./

# Copy folder prisma agar postinstall (prisma generate) bisa jalan
COPY prisma ./prisma/

# Install dependency
RUN npm ci

# Copy seluruh source code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose port (biasanya Render akan membaca variabel PORT)
EXPOSE 3000

# Saat container berjalan: jalankan migrasi database lalu jalankan server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
