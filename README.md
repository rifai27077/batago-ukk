# ✈️ BataGo — Helps You Live & Travel

**BataGo** adalah platform pemesanan perjalanan (travel booking) full-stack dengan Next.js 16 (App Router) dan Go/Gin (Backend API). Fitur utama termasuk pemesanan tiket pesawat, reservasi hotel, dashboard manajemen partner, panel admin, serta integrasi Midtrans.

---

## 🛠️ Prasyarat

Pastikan Anda sudah menginstal:
- **Node.js** >= 18.x
- **Go** >= 1.21
- **MySQL** >= 8.0 (lokal)
- **Git**

---

## 🚀 Langkah-langkah Setup & Menjalankan Proyek (Clone to Run)

Ikuti langkah-langkah berikut untuk menjalankan proyek dari nol hingga berjalan sempurna:

### 1. Clone Repository & Setup Database
Pertama, clone proyek ke komputer Anda dan buat database di MySQL:
```bash
git clone https://github.com/rifai27077/batago.git
cd batago

# Masuk ke MySQL dan buat database
mysql -u root -p
CREATE DATABASE batago;
EXIT;
```

### 2. Setup & Jalankan Backend (Terminal 1)
Buka terminal dan jalankan perintah berikut untuk menginisialisasi backend:
```bash
cd batago/backend

# Download dependensi Go
go mod tidy

# Buat file konfigurasi environment
cp .env.example .env 
# (Sesuaikan kredensial DATABASE_URL di file .env jika menggunakan password MySQL selain default)

# Menjalankan server backend (Ini akan otomatis melakukan migrasi database)
go run cmd/api/main.go
```
*GORM akan secara otomatis membuat tabel-tabel saat server pertama kali berjalan.*

### 3. Seed Database (Terminal 2)
Buka terminal baru (*jangan tutup terminal backend*), lalu jalankan perintah ini untuk memasukkan data awal dummy (Admin, Bandara, Hotel, Penerbangan, dsb.):
```bash
cd batago/backend
go run cmd/seed/main.go
```

**🔑 Kredensial Akun Default:**
- **Admin**: `admin@batago.com` / Password: `password`

### 4. Setup & Jalankan Frontend (Terminal 3)
Buka terminal baru di folder utama batago, lalu jalankan aplikasi frontend:
```bash
cd batago

# Install dependensi Node.js
npm install

# Buat file .env frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:8080" > .env

# Jalankan server Next.js
npm run dev
```

### 5. Selesai! 🎉
Akses aplikasi melalui browser:
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: berjalan di `http://localhost:8080/v1`

---

## 🔗 Endpoint & Tech Stack

**Frontend**: Next.js 16, TailwindCSS v4, Lucide Icons, Leaflet Maps
**Backend**: Go (Gin, GORM), JWT Auth, GoMail, Midtrans SDK Go
**Database**: MySQL Relational

### Role Permission
Terdapat 3 role utama yang menangani akses dalam sistem:
1. **User**: Pelanggan biasa untuk booking & review.
2. **Partner**: Mitra perusahaan maskapai penerbangan & hotel, memiliki dashboard (CMS) khusus.
3. **Admin**: Administrator pemilik platform BataGo dengan akses panel super-admin. 

---
> Projek ini dibangun dengan sepenuh hati❤.
