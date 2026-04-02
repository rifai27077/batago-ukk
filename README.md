# ✈️ BataGo — Helps You Live & Travel

**BataGo** adalah platform pemesanan perjalanan (travel booking) full-stack yang memungkinkan pengguna mencari dan memesan penerbangan, hotel, serta pengalaman wisata dengan harga terbaik. Dibangun menggunakan **Next.js 16** (Frontend) dan **Go/Gin** (Backend API), dengan integrasi pembayaran **Midtrans**.

---

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Arsitektur Proyek](#-arsitektur-proyek)
- [Prasyarat](#-prasyarat)
- [Instalasi & Setup](#-instalasi--setup)
- [Menjalankan Proyek](#-menjalankan-proyek)
- [Struktur Database](#-struktur-database)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#-environment-variables)
- [Screenshots](#-screenshots)
- [Lisensi](#-lisensi)

---

## 🚀 Fitur Utama

### 👤 Pengguna (User)
- **Autentikasi** — Register, Login, Verifikasi Email, Lupa & Reset Password
- **Pencarian Penerbangan** — Cari penerbangan berdasarkan rute, tanggal, dan kelas
- **Pencarian Hotel** — Cari hotel berdasarkan kota, tanggal check-in/out, dan jumlah tamu
- **Pemesanan** — Booking penerbangan & hotel dengan alur pembayaran terintegrasi
- **Pembayaran Midtrans** — Snap payment gateway (QRIS, Transfer Bank, E-Wallet, dll.)
- **E-Ticket & Voucher** — Download tiket elektronik dan voucher hotel setelah pembayaran
- **Profil & Avatar** — Kelola profil akun dengan upload avatar
- **Favourites** — Simpan hotel/penerbangan favorit
- **Notifikasi** — Notifikasi real-time untuk status pemesanan
- **Riwayat Booking** — Lihat dan kelola semua riwayat pemesanan
- **Review & Rating** — Berikan ulasan setelah perjalanan selesai

### 🏢 Partner Dashboard
- **Registrasi Partner** — Daftar sebagai mitra (hotel/maskapai)
- **Manajemen Listing** — CRUD hotel/penerbangan dengan upload gambar
- **Fleet Management** — Kelola armada pesawat (untuk mitra penerbangan)
- **Route Management** — Kelola rute penerbangan
- **Calendar & Availability** — Atur ketersediaan kamar/kursi dan blokir tanggal
- **Booking Management** — Pantau pesanan masuk dari pelanggan
- **Promosi** — Buat dan kelola kode promo/diskon
- **Finance & Payout** — Pantau pendapatan, pengaturan payout, dan request pencairan
- **Analytics & Insights** — Dashboard statistik, grafik pendapatan, dan tren booking
- **Staff Management** — Kelola staf/anggota tim partner
- **Review Management** — Lihat dan balas ulasan dari pelanggan

### 🛡️ Admin Panel
- **Dashboard Statistik** — Ringkasan total user, partner, booking, dan pendapatan
- **Manajemen User** — Lihat, aktifkan, nonaktifkan akun pengguna
- **Manajemen Partner** — Approve/reject/suspend partner
- **Manajemen Booking** — Pantau semua transaksi pemesanan
- **Finance & Payouts** — Kelola payout partner dan laporan keuangan
- **Content Management** — CRUD destinasi, banner, dan artikel
- **Account Management** — Kelola akun admin
- **Activity Log** — Log aktivitas admin untuk audit trail
- **Laporan** — Generate laporan pemesanan dan keuangan

---

## 🛠️ Tech Stack

### Frontend
| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| **Next.js** | 16.1.6 | React Framework (App Router) |
| **React** | 19.2.3 | UI Library |
| **TypeScript** | 5.9.3 | Type-safe JavaScript |
| **TailwindCSS** | 4.2.0 | Utility-first CSS |
| **Leaflet** | 1.9.4 | Peta interaktif |
| **Recharts** | 3.7.0 | Grafik & chart data |
| **Lucide React** | 0.563.0 | Icon library |
| **date-fns** | 4.1.0 | Utilitas tanggal |
| **react-hot-toast** | 2.6.0 | Notifikasi toast |

### Backend
| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| **Go** | 1.25 | Bahasa pemrograman backend |
| **Gin** | 1.11.0 | HTTP Web Framework |
| **GORM** | 1.31.1 | ORM untuk PostgreSQL |
| **PostgreSQL** | — | Database relasional (Neon) |
| **JWT** | 5.3.1 | Autentikasi token |
| **golang-migrate** | 4.19.1 | Database migration tool |
| **Midtrans Go** | 1.3.8 | Payment gateway SDK |
| **gomail** | 2.0 | Email sending (SMTP) |
| **gofpdf** | 2.17.3 | Generate PDF (e-ticket) |

### Infrastruktur
| Layanan | Deskripsi |
|---------|-----------|
| **Neon PostgreSQL** | Serverless PostgreSQL database |
| **Midtrans** | Payment gateway (Sandbox/Production) |
| **ngrok** | Tunneling untuk webhook development |

---

## 📁 Arsitektur Proyek

```
batago/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Halaman autentikasi
│   │   ├── login/                # Login
│   │   ├── register/             # Register
│   │   ├── verify-code/          # Verifikasi email
│   │   ├── forgot-password/      # Lupa password
│   │   └── reset-password/       # Reset password
│   ├── about/                    # Halaman tentang
│   ├── account/                  # Pengaturan akun
│   ├── admin/                    # Admin panel
│   │   ├── bookings/             # Kelola booking
│   │   ├── content/              # CMS (banner, artikel, destinasi)
│   │   ├── finance/              # Keuangan & payout
│   │   ├── partners/             # Kelola partner
│   │   ├── reports/              # Laporan
│   │   ├── settings/             # Pengaturan
│   │   └── users/                # Kelola user
│   ├── become-partner/           # Halaman registrasi partner
│   ├── booking/                  # Detail pemesanan
│   ├── contact/                  # Kontak
│   ├── faq/                      # FAQ
│   ├── favourites/               # Daftar favorit
│   ├── flights/                  # Pencarian & hasil penerbangan
│   ├── my-bookings/              # Riwayat pemesanan
│   ├── notifications/            # Notifikasi
│   ├── partner/                  # Partner dashboard
│   │   └── dashboard/
│   │       ├── analytics/        # Analitik partner
│   │       ├── bookings/         # Booking partner
│   │       ├── calendar/         # Kalender ketersediaan
│   │       ├── finance/          # Keuangan partner
│   │       ├── fleet/            # Armada pesawat
│   │       ├── insights/         # Insight data
│   │       ├── listings/         # Listing hotel/flight
│   │       ├── promotions/       # Promo partner
│   │       ├── reviews/          # Ulasan
│   │       ├── routes/           # Rute penerbangan
│   │       ├── settings/         # Pengaturan partner
│   │       └── staff/            # Manajemen staf
│   ├── privacy/                  # Kebijakan privasi
│   ├── profile/                  # Profil pengguna
│   ├── promotions/               # Promosi publik
│   ├── stays/                    # Pencarian & hasil hotel
│   └── terms/                    # Syarat & ketentuan
│
├── components/                   # React Components
│   ├── admin/                    # Komponen admin panel
│   ├── auth/                     # Komponen autentikasi
│   ├── bookings/                 # Komponen booking
│   ├── favourites/               # Komponen favorit
│   ├── flights/                  # Komponen penerbangan
│   ├── notifications/            # Komponen notifikasi
│   ├── partner/                  # Komponen partner dashboard
│   ├── reviews/                  # Komponen review
│   ├── stays/                    # Komponen hotel
│   ├── ui/                       # Komponen UI reusable
│   ├── Header.tsx                # Navigation header
│   ├── Footer.tsx                # Footer
│   ├── Hero.tsx                  # Hero section
│   ├── SearchForm.tsx            # Form pencarian
│   ├── GlobalSearch.tsx          # Pencarian global
│   ├── Destinations.tsx          # Destinasi populer
│   └── ...
│
├── lib/
│   └── api.ts                    # API client & helper functions
│
├── backend/                      # Go Backend API
│   ├── cmd/
│   │   ├── api/main.go           # Entry point server
│   │   ├── migrate/main.go       # Migration CLI tool
│   │   ├── seed/                 # Database seeder
│   │   └── ...
│   ├── internal/
│   │   ├── config/               # Konfigurasi aplikasi
│   │   ├── database/             # Koneksi & migrasi database
│   │   ├── handlers/             # Request handlers (controller)
│   │   ├── middleware/           # Auth, CORS, Admin middleware
│   │   ├── models/               # GORM models
│   │   ├── repository/           # Data access layer
│   │   ├── routes/               # Route definitions
│   │   ├── service/              # Business logic layer
│   │   └── testutil/             # Testing utilities
│   ├── migrations/               # SQL migration files
│   └── uploads/                  # File uploads (gambar, dll.)
│
├── public/                       # Static assets
├── db.sql                        # Database schema (DBML)
├── package.json                  # Frontend dependencies
└── next.config.ts                # Next.js configuration
```

---

## 📦 Prasyarat

Pastikan Anda sudah menginstal:

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Go** >= 1.21
- **PostgreSQL** (atau gunakan layanan cloud seperti [Neon](https://neon.tech))
- **Git**

---

## ⚙️ Instalasi & Setup

### 1. Clone Repository

```bash
git clone https://github.com/rifai27077/batago.git
cd batago
```

### 2. Setup Frontend

```bash
# Install dependencies
npm install
```

### 3. Setup Backend

```bash
cd backend

# Download Go modules
go mod tidy
```

### 4. Konfigurasi Environment Variables

**Frontend** — Buat file `.env` di root proyek:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**Backend** — Buat file `backend/.env`:
```env
PORT=8080
ENV=development
DATABASE_URL=postgresql://user:password@host:port/dbname?sslmode=require
JWT_SECRET=your-jwt-secret-key
MIDTRANS_SERVER_KEY=your-midtrans-server-key
MIDTRANS_CLIENT_KEY=your-midtrans-client-key
MIDTRANS_ENV=sandbox
```

### 5. Migrasi Database

Database akan otomatis dimigrasi saat backend pertama kali dijalankan (GORM AutoMigrate). Atau jalankan manual:

```bash
cd backend
go run cmd/migrate/main.go -action=up
```

---

## 🏃 Menjalankan Proyek

### Terminal 1 — Backend API

```bash
cd backend
go run cmd/api/main.go
```

Backend akan berjalan di `http://localhost:8080`

### Terminal 2 — Frontend

```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

### Terminal 3 — ngrok (Opsional, untuk Webhook Midtrans)

```bash
ngrok http 8080
```

Gunakan URL ngrok untuk konfigurasi webhook Midtrans di dashboard Midtrans → Settings → Payment Notification URL:
```
https://your-ngrok-url.ngrok-free.app/v1/payments/webhook
```

---

## 🗄️ Struktur Database

Proyek ini menggunakan **PostgreSQL** dengan tabel-tabel utama:

| Tabel | Deskripsi |
|-------|-----------|
| `users` | Data pengguna (user & admin) |
| `partners` | Mitra bisnis (hotel & maskapai) |
| `partner_staffs` | Staf/tim mitra |
| `flights` | Data penerbangan |
| `flight_bookings` | Detail booking penerbangan |
| `passengers` | Data penumpang |
| `airports` | Data bandara |
| `hotels` | Data hotel |
| `hotel_images` | Gambar hotel |
| `room_types` | Tipe kamar hotel |
| `room_images` | Gambar kamar |
| `cities` | Data kota |
| `facilities` | Fasilitas hotel |
| `availabilities` | Ketersediaan kamar |
| `bookings` | Data pemesanan |
| `payments` | Data pembayaran |
| `e_tickets` | E-ticket penerbangan |
| `hotel_vouchers` | Voucher hotel |
| `reviews` | Ulasan pengguna |
| `favourites` | Data favorit |
| `promotions` | Kode promo/diskon |
| `notifications` | Notifikasi pengguna |
| `banners` | Banner konten |
| `articles` | Artikel konten |
| `bank_accounts` | Rekening bank admin |
| `payout_settings` | Pengaturan payout partner |
| `admin_activity_logs` | Log aktivitas admin |

Skema lengkap dapat dilihat di file [`db.sql`](db.sql) (format DBML).

---

## 🔌 API Endpoints

Base URL: `http://localhost:8080/v1`

### Publik (Tanpa Autentikasi)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/auth/register` | Registrasi user baru |
| `POST` | `/auth/login` | Login user |
| `POST` | `/auth/verify` | Verifikasi email |
| `POST` | `/auth/verify/resend` | Kirim ulang kode verifikasi |
| `POST` | `/auth/password/forgot` | Lupa password |
| `POST` | `/auth/password/reset` | Reset password |
| `POST` | `/auth/partner/register` | Registrasi partner |
| `GET` | `/flights` | Cari penerbangan |
| `GET` | `/flights/:id` | Detail penerbangan |
| `GET` | `/airports` | Daftar bandara |
| `GET` | `/hotels` | Cari hotel |
| `GET` | `/hotels/:id` | Detail hotel |
| `GET` | `/cities` | Daftar kota |
| `GET` | `/promotions` | Promosi publik |
| `POST` | `/payments/webhook` | Webhook Midtrans |

### User (JWT Required)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/profile` | Lihat profil |
| `PUT` | `/profile` | Update profil |
| `POST` | `/profile/avatar` | Upload avatar |
| `POST` | `/bookings/flight` | Booking penerbangan |
| `POST` | `/bookings/hotel` | Booking hotel |
| `GET` | `/bookings` | Riwayat booking |
| `GET` | `/bookings/:id` | Detail booking |
| `DELETE` | `/bookings/:id` | Batalkan booking |
| `GET` | `/bookings/:id/ticket` | Download tiket |
| `POST` | `/payments/token` | Buat token pembayaran |
| `POST` | `/reviews` | Buat review |
| `POST` | `/favourites/toggle` | Toggle favorit |
| `GET` | `/favourites` | Daftar favorit |
| `GET` | `/notifications` | Daftar notifikasi |

### Partner (JWT Required)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/partner/dashboard` | Statistik dashboard |
| `GET/POST/PUT/DELETE` | `/partner/listings` | CRUD listing |
| `GET/POST/PUT/DELETE` | `/partner/promotions` | CRUD promosi |
| `GET/POST/PUT/DELETE` | `/partner/fleet` | CRUD armada pesawat |
| `GET/POST/DELETE` | `/partner/routes` | CRUD rute penerbangan |
| `GET` | `/partner/bookings` | Daftar booking |
| `GET` | `/partner/finance` | Data keuangan |
| `GET/PUT` | `/partner/finance/settings` | Pengaturan payout |
| `POST` | `/partner/finance/payout` | Request pencairan |
| `GET` | `/partner/analytics` | Data analitik |
| `GET/POST/DELETE` | `/partner/staff` | Kelola staf |
| `GET/POST` | `/partner/availability` | Ketersediaan |
| `GET` | `/partner/reviews` | Ulasan pelanggan |

### Admin (JWT + Admin Role Required)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/admin/stats` | Statistik admin |
| `GET` | `/admin/users` | Daftar user |
| `PUT` | `/admin/users/:id/status` | Update status user |
| `GET` | `/admin/partners` | Daftar partner |
| `PUT` | `/admin/partners/:id/status` | Update status partner |
| `GET` | `/admin/bookings` | Semua booking |
| `GET` | `/admin/finance/stats` | Statistik keuangan |
| `GET` | `/admin/finance/payouts` | Daftar payout |
| `PUT` | `/admin/finance/payouts/:id` | Proses payout |
| `CRUD` | `/admin/destinations` | Kelola destinasi |
| `CRUD` | `/admin/banners` | Kelola banner |
| `CRUD` | `/admin/articles` | Kelola artikel |
| `CRUD` | `/admin/accounts` | Kelola akun admin |
| `GET` | `/admin/activity-log` | Log aktivitas |
| `GET` | `/admin/reports` | Laporan |

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Deskripsi | Contoh |
|----------|-----------|--------|
| `PORT` | Port server API | `8080` |
| `ENV` | Environment mode | `development` / `production` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `JWT_SECRET` | Secret key untuk JWT token | `random-uuid-string` |
| `MIDTRANS_SERVER_KEY` | Midtrans server key | `Mid-server-xxxxx` |
| `MIDTRANS_CLIENT_KEY` | Midtrans client key | `Mid-client-xxxxx` |
| `MIDTRANS_ENV` | Midtrans environment | `sandbox` / `production` |

---

## 📸 Screenshots

> *Coming soon* — Screenshots halaman utama, pencarian, booking, partner dashboard, dan admin panel.

---

## 👤 Author

**Ahmad Rifai** — [@rifai27077](https://github.com/rifai27077)

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan pendidikan dan pengembangan pribadi.
