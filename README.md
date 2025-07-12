# Backend API - Arabicara

![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

Ini adalah backend REST API untuk aplikasi belajar bahasa, dibangun dengan Node.js, Express, TypeScript, dan Prisma. Proyek ini menyediakan fondasi yang kuat untuk otentikasi, otorisasi, dan manajemen konten aplikasi.

---

## Daftar Isi
- [Backend API - Arabicara](#backend-api---arabicara)
  - [Daftar Isi](#daftar-isi)
  - [Fitur Utama ✨](#fitur-utama-)
  - [Struktur Proyek 📂](#struktur-proyek-)
  - [Tumpukan Teknologi 🛠️](#tumpukan-teknologi-️)
  - [Prasyarat](#prasyarat)
  - [Panduan Instalasi 🚀](#panduan-instalasi-)
  - [Variabel Lingkungan](#variabel-lingkungan)
  - [Skrip yang Tersedia](#skrip-yang-tersedia)

---

## Fitur Utama ✨
-   **Otentikasi Pengguna:** Sistem registrasi dan login yang aman menggunakan JWT (JSON Web Tokens).
-   **Otorisasi Berbasis Peran:** Membedakan hak akses antara `student` dan `admin` menggunakan middleware.
-   **Manajemen Akun:** Pengguna dapat memperbarui profil dan menghapus akun mereka sendiri.
-   **Validasi Input:** Validasi request body yang kuat dan deklaratif menggunakan **Zod**.
-   **Setup Admin:** Sistem *seeding* untuk membuat akun admin pertama secara otomatis.
-   **Struktur Skalabel:** Arsitektur berlapis (Routes, Controllers, Services) untuk kemudahan pemeliharaan.
-   **Dukungan Google OAuth:** Skema database sudah siap untuk implementasi login dengan Google.

---

## Struktur Proyek 📂
Proyek ini menggunakan arsitektur berlapis untuk memisahkan tanggung jawab secara jelas:

-   `src/api`: Mendefinisikan semua rute/endpoint API.
-   `src/controllers`: Menangani logika `request` dan `response` HTTP.
-   `src/services`: Berisi semua logika bisnis utama aplikasi.
-   `src/schemas`: Mendefinisikan skema validasi Zod untuk request body.
-   `src/middlewares`: Berisi middleware untuk otentikasi (JWT) dan otorisasi (peran admin).
-   `prisma`: Berisi skema database, migrasi, dan skrip *seeding*.

---

## Tumpukan Teknologi 🛠️
-   **Runtime:** Node.js
-   **Framework:** Express.js
-   **Bahasa:** TypeScript
-   **ORM:** Prisma
-   **Database:** PostgreSQL (Menggunakan Supabase)
-   **Validasi:** Zod
-   **Otentikasi:** JSON Web Tokens (jsonwebtoken), bcryptjs

---

## Prasyarat
Sebelum memulai, pastikan Anda telah menginstal:
-   [Node.js](https://nodejs.org/en/) (v18 atau lebih baru)
-   [npm](https://www.npmjs.com/) atau [yarn](https://yarnpkg.com/)
-   Akses ke database PostgreSQL. Anda bisa menggunakan [Supabase](https://supabase.com/) untuk mendapatkan database gratis.

---

## Panduan Instalasi 🚀
Ikuti langkah-langkah berikut untuk menjalankan proyek ini secara lokal.

**1. Clone Repositori**
```bash
git clone https://github.com/arabicara-pkm/backend-arabicara.git
cd backend-arabicara
```

**2. Instal Dependensi**
```bash
npm install
```

**3. Konfigurasi Variabel Lingkungan**
Salin file `.env.example` (jika ada) atau buat file baru bernama `.env` di root proyek. Isi file tersebut dengan konfigurasi Anda.
```env
# URL koneksi ke database PostgreSQL Anda (Sangat direkomendasikan menggunakan URL dari connection pooler Supabase)
DATABASE_URL="postgresql://postgres.pooler:[PASSWORD_ANDA]@db.xxxxxxxx.supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.pooler:[PASSWORD_ANDA]@db.xxxxxxxx.supabase.co:6543/postgres"

# Password akun admin
ADMIN_PASSWORD="APA_AJA"

# Kunci rahasia untuk menandatangani JWT. Buat string yang panjang dan acak.
JWT_SECRET="KUNCI_RAHASIA_SUPER_AMAN_ANDA_YANG_TIDAK_BISA_DITEBAK"

# Port server (opsional, default 3000)
PORT=3000
```

**4. Migrasi & Seeding Database**
Perintah ini akan membuat semua tabel di database Anda dan mengisi data awal (seperti akun admin).
```bash
# Menerapkan migrasi skema ke database
npx prisma migrate dev

# Menjalankan skrip seed untuk membuat akun admin
npx prisma db seed
```

**5. Jalankan Server Development**
```bash
npm run dev
```
Server akan berjalan di `http://localhost:3000` (atau port yang Anda tentukan di `.env`).

---

## Variabel Lingkungan
Berikut adalah daftar variabel lingkungan yang dibutuhkan oleh aplikasi ini.

| Variabel     | Deskripsi                                                                               | Contoh                                                                       |
| :----------- | :-------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------- |
| `DATABASE_URL` | URL koneksi lengkap ke database PostgreSQL Anda.                                          | `postgresql://user:pass@host:port/db`       
| `DIRECT_URL` | URL koneksi lengkap ke direct database PostgreSQL Anda.                                          | `postgresql://user:pass@host:port/db`                                 |
| `JWT_SECRET` | Kunci rahasia yang digunakan untuk membuat dan memverifikasi JSON Web Tokens. | `string_acak_yang_sangat_panjang_dan_aman`                                   |
| `PORT`       | Port tempat server akan berjalan. (Opsional)                                         | `3000`                                                                       |

---

## Skrip yang Tersedia
-   `npm run dev`: Menjalankan server dalam mode development dengan `nodemon` untuk *hot-reloading*.
-   `npm run build`: Mengkompilasi kode TypeScript ke JavaScript di folder `dist`.
-   `npm run start`: Menjalankan server dari kode JavaScript yang sudah di-build (untuk produksi).
-   `npx prisma studio`: Membuka UI web untuk melihat dan mengedit data di database Anda.