# Dokumentasi Resmi Proyek: PortfolioTracker IDX Financial

Aplikasi manajemen dan pelacak portofolio saham Bursa Efek Indonesia (IDX) berbasis multi-peran (*Admin* dan *Client*), dilengkapi perbandingan harga beli vs harga pasar *real-time*, kalkulasi laba/rugi (*PnL*), grafik interaktif TradingView, serta katalog 150 emiten saham.

---

## 📌 1. Akun Pengujian Default (Testing Credentials)

| Peran (Role) | Username | Password | Deskripsi Akses |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | Kelola seluruh klien, setoran/penarikan kas, alokasi pembelian saham, dan pantau PnL klien. |
| **Client** | `teman` | `client123` | Pantau saldo kas pribadi, portofolio saham realtime, PnL, grafik TradingView, dan ajukan request saham. |

---

## 🏗️ 2. Arsitektur & Teknologi yang Digunakan

- **Backend Runtime:** Node.js, Express.js
- **Database & ORM:** PostgreSQL / Supabase / Neon, Sequelize ORM
- **Autentikasi & Keamanan:** JSON Web Token (JWT), Role-Based Access Control (RBAC), bcrypt password hashing
- **Frontend Template:** EJS (Embedded JavaScript Templates), Vanilla JavaScript ES6
- **Styling:** Tailwind CSS (dengan palet warna tematik: Biru untuk Admin, Hijau/Emerald untuk Client)
- **Data Pasar Modal Realtime:** `stockPriceService.js` (Live feed Yahoo Finance IDX dengan cache memori 60 detik)
- **Visualisasi Grafik:** Widget Interaktif TradingView (Bursa Efek Indonesia - IDX)

---

## 📂 3. Struktur Direktori Proyek

```text
portoTrackProduction/
├── api/
│   └── index.js                   # Entry point aplikasi & konfigurasi Express server
├── config/
│   └── db.js                      # Koneksi database Sequelize PostgreSQL
├── controller/
│   ├── authController.js          # Controller register, login, & kelola relasi klien
│   ├── depositController.js       # Controller setor kas & penarikan saldo tunai
│   ├── newsController.js          # Controller portal berita pasar modal
│   ├── portfolioController.js     # Controller transaksi saham & kalkulasi PnL realtime
│   ├── stockCatalogController.js  # Controller katalog 150 saham & metrik valuasi
│   └── stockPriceService.js       # Engine pengambil harga saham realtime dari IDX
├── middleware/
│   └── auth.js                    # Middleware verifikasi JWT & hak akses Admin
├── models/
│   ├── user.js                    # Model User (Admin & Client)
│   ├── stock.js                   # Model Master Data Saham
│   ├── sector.js                  # Model Sektor Industri BEI
│   ├── portfolio.js               # Model Kepemilikan Saham Klien
│   ├── deposit.js                 # Model Riwayat Kas & Penarikan
│   └── index.js                   # Definisi relasi antar tabel (Associations)
├── public/
│   └── js/
│       └── auth.js                # Helper frontend: session guard, logout, & active nav
├── routes/
│   ├── api.js                     # Root router API
│   ├── authRoutes.js              # Rute /api/auth
│   ├── depositRoutes.js           # Rute /api/deposits
│   ├── newsRoutes.js              # Rute /api/news
│   ├── portfolioRoutes.js         # Rute /api/portfolio
│   └── stockRoutes.js             # Rute /api/stocks
├── seed/
│   ├── seedData.js                # Seeder awal (user admin, client, & saham dasar)
│   └── seedTrending100.js         # Seeder 100 emiten saham trending di 11 sektor
└── views/
    ├── partials/
    │   ├── headerAdmin.ejs        # Komponen navbar khusus Admin
    │   └── headerClient.ejs       # Komponen navbar khusus Client
    ├── index.ejs                  # Halaman Login & Fitur Remember Me
    ├── admin.ejs                  # Dashboard Utama Admin (Kelola Klien, Setor/Tarik, Beli Saham)
    ├── adminViewPortoClient.ejs   # Halaman Pantau Portofolio & PnL Klien oleh Admin
    ├── catalogsStockAdmin.ejs     # Halaman Katalog Saham Realtime untuk Admin
    ├── newsAdmin.ejs              # Portal Berita Finansial untuk Admin
    ├── requstSahamAdmin.ejs       # Tabel Permintaan Pembelian Saham dari Klien
    ├── client.ejs                 # Dashboard Utama Client (Saldo, Portofolio & PnL)
    ├── clientPortoList.ejs        # Rincian Lengkap Portofolio Saham Klien
    ├── catalogsStockClient.ejs    # Halaman Katalog Saham Realtime untuk Client
    ├── newsClient.ejs             # Portal Berita Finansial untuk Client
    └── requestSahamClient.ejs     # Form Pengajuan Permintaan Saham oleh Klien
```

---

## 🚀 4. Daftar Fitur Utama yang Telah Diimplementasikan

### A. Autentikasi & Keamanan Sesi
1. **Fitur "Remember Me":** Menyimpan username pada `localStorage` saat dicentang agar login lebih cepat.
2. **Perlindungan Riwayat Peramban (BFCache Protection):** Mencegah tombol *Back/Forward* browser membuka kembali halaman setelah pengguna melakukan Logout.
3. **Pemisahan File Logout:** Fungsi `logout()` ditempatkan secara terpusat di [`public/js/auth.js`](file:///b:/MainnanSaya/app_untuk_saham/portoTrackProduction/public/js/auth.js) untuk modularitas.
4. **Keamanan Server-Side (Zero-Trust):** Seluruh aksi mutasi data (setor, tarik, beli saham, buat klien) diverifikasi ketat oleh token JWT kriptografis di sisi server backend, bukan bergantung pada frontend.

### B. Fitur Manajemen Portofolio Admin
1. **Multi-Client Isolation:** Setiap admin hanya dapat melihat dan mengelola klien yang berada di bawah naungannya (`admin_id`).
2. **Pendaftaran Klien Baru:** Admin dapat langsung menambahkan akun klien baru dari dashboard.
3. **Setor & Tarik Saldo Kas Tunai:**
   - Validasi nilai nominal (mencegah input minus atau 0).
   - Validasi penarikan kas (tidak dapat menarik melebihi sisa saldo tunai yang tersedia).
4. **Alokasi Pembelian Saham:** Membeli saham untuk klien tertentu yang otomatis memotong saldo kas klien bersangkutan.
5. **Monitoring PnL Klien (`/adminViewPortoClient`):** Menampilkan tabel perbandingan harga beli vs harga pasar realtime, total keuntungan/kerugian (PnL Rupiah & %), sisa saldo kas, serta filter per klien.

### C. Fitur Portofolio Pribadi Klien
1. **4 Kartu Ringkasan Finansial:**
   - Sisa Saldo Kas Tunai
   - Total Nilai Pasar Saham Realtime
   - Total Nilai Keseluruhan Portofolio
   - Total Keuntungan/Kerugian Realtime (PnL IDR dan %)
2. **Tabel Portofolio Interaktif (`/clientPortoList`):** Menampilkan pergerakan setiap saham yang dimiliki secara langsung.
3. **Pengajuan Permintaan Saham (`/requestSahamClient`):** Form bagi klien untuk meminta admin membelikan emiten saham tertentu.

### D. Katalog Saham Realtime (150 Emiten BEI)
1. **150 Saham Terpopuler:** Tersebar di 11 sektor industri resmi BEI (Keuangan, Energi, Material Dasar, Konsumen, Infrastruktur, Teknologi, Kesehatan, Properti, Perindustrian, dan Transportasi).
2. **Indikator Pergerakan Hari Ini:** Menampilkan badge kenaikan/penurunan harga saham hari ini (Nominal IDR & Persentase).
3. **Pencarian & Pengurutan Cepat:** Pencarian dengan *debounce* instan serta *sorting* berdasarkan Market Cap, Harga, PER, PBV, Dividend Yield, ROE, dan Abjad.
4. **Modal Detail Interaktif TradingView:** Menampilkan chart *candlestick live*, harga tertinggi/terendah hari ini, profil bisnis perusahaan, serta rasio valuasi fundamental.
5. **Panduan Edukasi Finansial:** Panduan penjelasan istilah Market Cap, PER, PBV, ROE, DER, dan Div Yield dalam Bahasa Indonesia.

---

## 🌐 5. Daftar Rute Endpoint API

| Method | Endpoint | Hak Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Publik | Autentikasi user & mengembalikan token JWT |
| `POST` | `/api/auth/register` | Publik | Registrasi akun baru |
| `POST` | `/api/auth/create-client` | Admin | Menambahkan akun klien baru di bawah admin |
| `GET` | `/api/auth/my-clients` | Admin | Mengambil daftar klien binaan admin |
| `GET` | `/api/deposits/my` | Client | Mengambil riwayat setor/tarik klien yang login |
| `GET` | `/api/deposits/all` | Admin | Mengambil data kas seluruh klien admin |
| `POST` | `/api/deposits` | Admin | Melakukan setoran kas tunai untuk klien |
| `POST` | `/api/deposits/withdraw` | Admin | Melakukan penarikan saldo tunai klien |
| `GET` | `/api/portfolio/my` | Client | Mengambil portofolio & PnL realtime milik klien |
| `GET` | `/api/portfolio/all` | Admin | Mengambil portofolio seluruh klien admin |
| `POST` | `/api/portfolio` | Admin | Membeli saham untuk klien (memotong saldo kas) |
| `GET` | `/api/stocks` | Publik / Auth | Mengambil 150 daftar saham realtime & sektor |
| `GET` | `/api/stocks/:ticker` | Publik / Auth | Mengambil rincian data harga & valuasi per saham |
| `GET` | `/api/news` | Publik / Auth | Mengambil portal berita pasar modal Indonesia |

---

## 🛠️ 6. Panduan Menjalankan Proyek Secara Lokal

1. **Instalasi Dependencies:**
   ```bash
   npm install
   ```

2. **Konfigurasi Environment Variable (`.env`):**
   Pastikan file `.env` memuat konfigurasi koneksi database PostgreSQL dan secret JWT:
   ```env
   PORT=3000
   DATABASE_URL=postgres://user:password@host:5432/dbname?sslmode=require
   JWT_SECRET=your_jwt_secret_key_here
   ```

3. **Menjalankan Seeder Data Awal (Opsional):**
   ```bash
   node seed/seedData.js
   node seed/seedTrending100.js
   ```

4. **Menjalankan Server Pengembangan:**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`.
