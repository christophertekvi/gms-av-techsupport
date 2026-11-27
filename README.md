# 📡 GMS Multimedia — YouTube Live Streaming Manager

Aplikasi web internal Tim Multimedia GMS untuk mengelola jadwal, siaran langsung, dan monitoring **YouTube Live Streaming** secara terpusat. Seluruh halaman dilindungi autentikasi multi-user sebelum operator dapat mengakses dashboard siaran.

---

## 📑 Daftar Isi

- [✨ Fitur Utama](#-fitur-utama)
- [🔐 Manajemen Akun Pengguna (`data/admin-users.json`)](#-manajemen-akun-pengguna-dataadmin-usersjson)
- [🎥 Panduan Penggunaan Live Manager](#-panduan-penggunaan-live-manager)
- [💻 Panduan Pengembang & Instalasi Lokal](#-panduan-pengembang--instalasi-lokal)
- [📁 Struktur Proyek](#-struktur-proyek)
- [🚀 Panduan Deployment (Vercel)](#-panduan-deployment-vercel)

---

## ✨ Fitur Utama

- 🔐 **Autentikasi Multi-User**: Login menggunakan `username` dan `password` yang tersimpan di `data/admin-users.json` (mendukung password plaintext maupun hash `scrypt`), dengan session cookie bertanda tangan HMAC-SHA256 (`av_admin_session`) dan indikator nama user aktif di pojok kanan atas navbar.
- 📺 **Grid 4 Kartu dengan Playable Iframe**: Daftar siaran ditampilkan dalam grid 4 kolom per baris lengkap dengan embed player YouTube yang bisa langsung diputar di setiap kartu.
- 🚀 **Go Live Langsung**: Tombol **Go Live** mentransisikan broadcast langsung ke status `live` (tanpa melewati fase `testing`), dilengkapi validasi status encoder dan popup konfirmasi (`ConfirmModal`).
- ➕ **Buat Upcoming Stream**: Form pembuatan jadwal siaran baru beserta pemilihan/pembuatan Stream Key RTMP, privasi, latency, DVR, playlist, dan kategori YouTube.
- 📊 **Studio Matrix Realtime**: Pantau status koneksi encoder, stream health, jumlah penonton (*concurrent viewers*), total views, dan detail RTMP dalam satu modal.
- 🌙 **Dark Mode Terintegrasi**: Nyaman digunakan di ruangan control room / FOH yang minim cahaya.

---

## 🔐 Manajemen Akun Pengguna (`data/admin-users.json`)

Daftar pengguna yang diizinkan masuk dikelola di file `data/admin-users.json`:

```json
[
  {
    "username": "admin",
    "name": "Admin GMS",
    "role": "admin",
    "password": "ganti-password-ini"
  },
  {
    "username": "operator",
    "name": "Operator AV",
    "role": "operator",
    "password": "password-operator"
  }
]
```

> 💡 **Catatan Keamanan**:
> - Anda juga dapat menggunakan field `"passwordHash": "<salt>:<scryptHex>"` (hasil fungsi `hashPassword()` di `lib/auth.js`) alih-alih `"password"`.
> - Tambahkan `"disabled": true` untuk menonaktifkan akun sementara tanpa menghapusnya.
> - Untuk deployment cloud (seperti Vercel), Anda dapat menimpa isi file ini melalui environment variable `ADMIN_USERS_JSON` berisi string JSON array yang sama.

---

## 🎥 Panduan Penggunaan Live Manager

1. **Login**: Buka halaman utama (`/`) dan masukkan `username` serta `password` tim Anda. Nama akun yang sedang login akan tampil di pojok kanan atas navbar.
2. **Hubungkan Channel YouTube**: Jika belum terhubung, klik tombol **Hubungkan Channel YouTube** untuk melakukan otorisasi Google OAuth 2.0.
3. **Buat / Kelola Siaran**:
   - Gunakan filter **Upcoming**, **Live**, **Selesai**, atau **Semua** untuk menyaring daftar siaran.
   - Klik **+ Buat Upcoming Stream** untuk menjadwalkan siaran baru.
   - Pastikan encoder (ATEM / vMix / OBS) sudah mengirim sinyal hingga indikator berubah menjadi **Encoder Terhubung** (hijau), lalu klik **Go Live** dan konfirmasi pada popup.
   - Klik **Studio Matrix** untuk melihat metrik realtime, atau **Stop Stream** untuk mengakhiri siaran yang sedang berlangsung.

---

## 💻 Panduan Pengembang & Instalasi Lokal

### 1. Kebutuhan Sistem
- **Node.js**: Versi 18.17.0 atau lebih baru (direkomendasikan Node.js 20+)
- **npm**
- **Git**

### 2. Langkah Instalasi

```bash
# 1. Clone repository
git clone https://github.com/christophertekvi/gms-av-techsupport.git
cd gms-av-techsupport

# 2. Install dependencies
npm install

# 3. Buat file konfigurasi .env.local
# (lihat daftar variabel di bawah)

# 4. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### 3. Konfigurasi Environment Variables (`.env.local`)

| Variabel | Wajib | Deskripsi |
|---|---|---|
| `YOUTUBE_CLIENT_ID` | Ya | OAuth 2.0 Client ID dari Google Cloud Console |
| `YOUTUBE_CLIENT_SECRET` | Ya | OAuth 2.0 Client Secret dari Google Cloud Console |
| `AUTH_SECRET` | Disarankan | Secret key acak untuk menandatangani cookie sesi `av_admin_session` |
| `ADMIN_USERS_JSON` | Opsional | String JSON daftar user untuk menimpa `data/admin-users.json` |

> Pastikan **Authorized Redirect URI** di Google Cloud Console diisi `http://localhost:3000/api/youtube/callback` (untuk lokal) dan `https://domain-anda.vercel.app/api/youtube/callback` (untuk produksi).

---

## 📁 Struktur Proyek

```
av-docs/
├── app/
│   ├── admin/                      # Redirect otomatis ke halaman utama (/)
│   ├── api/
│   │   ├── auth/                   # Endpoint login, logout, dan cek sesi user
│   │   └── youtube/                # Endpoint OAuth, broadcasts, metrics, transition, options
│   ├── privacy/                    # Halaman Kebijakan Privasi (kebutuhan OAuth)
│   ├── terms/                      # Halaman Ketentuan Layanan (kebutuhan OAuth)
│   ├── globals.css
│   ├── layout.js                   # Root layout, Navbar, dan Footer
│   ├── not-found.js                # Halaman 404
│   └── page.js                     # Halaman utama (Login -> Live Streaming Manager)
├── components/
│   ├── admin/
│   │   ├── ConfirmModal.jsx        # Popup konfirmasi & alert pengganti dialog browser
│   │   ├── CreateStreamModal.jsx   # Modal pembuatan upcoming stream baru
│   │   ├── LiveEmbedPlayer.jsx     # Embed player YouTube Live dengan kontrol kualitas
│   │   ├── LiveStreamingTab.jsx    # Grid 4-kolom daftar siaran & kontrol cepat
│   │   └── StreamMatrixModal.jsx   # Modal monitoring health & statistik stream
│   ├── AdminNavStatus.jsx          # Indikator nama user yang sedang login di navbar
│   ├── Navbar.jsx                  # Header navigasi utama
│   └── ThemeToggle.jsx             # Switcher Dark/Light theme
├── data/
│   └── admin-users.json            # Daftar akun pengguna (username, name, role, password)
├── lib/
│   ├── auth.js                     # Verifikasi kredensial & HMAC session token
│   └── youtube.js                  # Helper YouTube Data API v3 & OAuth token manager
└── public/
    └── icon.png
```

---

## 🚀 Panduan Deployment (Vercel)

1. Push repository ke GitHub.
2. Import project di [Vercel](https://vercel.com).
3. Tambahkan Environment Variables di Vercel:
   - `YOUTUBE_CLIENT_ID`
   - `YOUTUBE_CLIENT_SECRET`
   - `AUTH_SECRET`
   - `ADMIN_USERS_JSON` *(opsional jika ingin mengelola akun lewat env var)*
4. Tambahkan URL callback produksi (`https://<domain-vercel>/api/youtube/callback`) ke **Authorized Redirect URIs** di Google Cloud Console.
5. Deploy project.
