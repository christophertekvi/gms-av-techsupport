# 📖 AV Tech Church — Dokumentasi, SOP & Troubleshooting Multimedia

Pusat dokumentasi, SOP operasional, dan panduan troubleshooting peralatan Audio Visual & Multimedia GMS. Didesain agar cepat diakses oleh tim operator FOH, broadcast, dan relawan saat persiapan maupun saat ibadah live berlangsung.

---

## 📑 Daftar Isi

- [✨ Fitur Utama](#-fitur-utama)
- [🧭 Panduan Penggunaan untuk Tim Multimedia (User)](#-panduan-penggunaan-untuk-tim-multimedia-user)
  - [1. Mencari Solusi Troubleshooting Cepat](#1-mencari-solusi-troubleshooting-cepat)
  - [2. Menjelajahi Berdasarkan Kategori Alat](#2-menjelajahi-berdasarkan-kategori-alat)
  - [3. Mengecek Profil, SOP & Alat per Ruangan / Wilayah](#3-mengecek-profil-sop--alat-per-ruangan--wilayah)
  - [4. Mode Gelap / Terang (Dark Mode)](#4-mode-gelap--terang-dark-mode)
- [🛠️ Panduan Admin & Manajemen Konten (`/admin`)](#️-panduan-admin--manajemen-konten-admin)
  - [1. Masuk ke Panel Admin](#1-masuk-ke-panel-admin)
  - [2. Membuat / Mengedit Artikel Troubleshooting](#2-membuat--mengedit-artikel-troubleshooting)
  - [3. Mengelola Profil & SOP Ruangan](#3-mengelola-profil--sop-ruangan)
  - [4. Upload Gambar & Tangkapan Layar](#4-upload-gambar--tangkapan-layar)
  - [5. Cara Kerja Sinkronisasi (Git-Backed CMS)](#5-cara-kerja-sinkronisasi-git-backed-cms)
- [💻 Panduan Pengembang & Instalasi Lokal](#-panduan-pengembang--instalasi-lokal)
  - [1. Kebutuhan Sistem](#1-kebutuhan-sistem)
  - [2. Langkah Instalasi](#2-langkah-instalasi)
  - [3. Konfigurasi Environment Variables (`.env.local`)](#3-konfigurasi-environment-variables-envlocal)
- [📁 Struktur Proyek](#-struktur-proyek)
- [📝 Format Penulisan Konten (MDX)](#-format-penulisan-konten-mdx)
  - [Struktur Artikel Troubleshooting](#struktur-artikel-troubleshooting)
  - [Struktur Profil Ruangan](#struktur-profil-ruangan)
- [🚀 Panduan Deployment (Vercel)](#-panduan-deployment-vercel)

---

## ✨ Fitur Utama

- 🔍 **Pencarian Cepat (Fuzzy Search)**: Temukan solusi instan berdasarkan nama alat, gejala, kode error, atau kata kunci.
- 🗂️ **Taksonomi Kategori & Wilayah**:
  - **Kategori**: Fokus pada jenis alat/sistem (*Camera, Switcher, Streaming, Audio, Display & LED, Network*).
  - **Wilayah & Ruangan**: Fokus pada lokasi fisik (*Rooftop, PCM, MCC, GC* beserta ruangan seperti *Chappel, EK 1, EK 2*).
- 📋 **Hub Profil Ruangan**: Berisi inventaris alat di ruangan, SOP buka/tutup, routing alur sinyal, dan kumpulan artikel terkait ruangan tersebut.
- ⚡ **Tanpa Database Eksternal (Git-Backed)**: Konten tersimpan dalam file `.mdx` yang langsung terhubung ke Git — aman, terdokumentasi riwayatnya, dan gratis.
- 🎨 **Panel Admin Sederhana**: Tim non-teknis dapat menambah/mengedit artikel & mengunggah gambar tanpa perlu coding atau Git command.
- 🌙 **Dark Mode Terintegrasi**: Nyaman digunakan di ruangan minim cahaya seperti FOH / Control Room.

---

## 🧭 Panduan Penggunaan untuk Tim Multimedia (User)

### 1. Mencari Solusi Troubleshooting Cepat
Saat terjadi kendala di lapangan (misal: *ATEM blank*, *kamera delay*, *NDI tidak terdeteksi*, *OBS drop frame*):
1. Buka halaman utama web app.
2. Klik kolom pencarian di bagian atas atau navigasi.
3. Ketik kata kunci (misalnya: `ATEM`, `Blackmagic`, `freeze`, `mic feedback`, `audio delay`).
4. Hasil pencarian akan langsung muncul secara realtime. Klik artikel yang sesuai untuk membaca gejala dan langkah solusinya.

### 2. Menjelajahi Berdasarkan Kategori Alat
Gunakan menu kategori di navigasi atau di beranda jika ingin mempelajari masalah spesifik jenis alat:
- **Camera**: Operasi & kendala kamera siaran, PTZ, CCU, dan HDMI/SDI converter.
- **Switcher**: ATEM, vMix, Resolume, preset video switcher, dan input/output matrix.
- **Streaming**: Encoder hardware/software, live streaming YouTube/Facebook, bitrate, dan koneksi RTMP/SRT.
- **Audio**: Digital mixer, wireless mic, in-ear monitor, Dante/signal chain audio ke broadcast.
- **Display & LED**: LED Processor, Novastar, projector mapping, sync resolusi, dan video wall.
- **Network**: Konfigurasi switch, subnetting NDI/Dante, firewall, dan internet venue.

### 3. Mengecek Profil, SOP & Alat per Ruangan / Wilayah
Buka menu **Wilayah** (`/wilayah`) untuk melihat informasi per lokasi ibadah:
1. Pilih wilayah gereja (contoh: **MCC**, **Rooftop**, **PCM**, atau **GC**).
2. Pilih ruangan spesifik (contoh: *MCC - Chappel*, *MCC - EK 1*, *MCC - EK 2*).
3. Di halaman ruangan, Anda dapat melihat:
   - **Daftar Alat**: Inventaris perangkat aktif di ruangan tersebut.
   - **SOP Operasional**: Checklist buka ruangan (sebelum ibadah) dan tutup ruangan (setelah ibadah).
   - **Troubleshooting Terkait**: Seluruh artikel kendala yang sering terjadi di ruangan ini.

### 4. Mode Gelap / Terang (Dark Mode)
Klik ikon matahari/bulan di pojok kanan atas navbar untuk berganti antara Dark Mode dan Light Mode sesuai pencahayaan ruang kontrol Anda.

---

## 🛠️ Panduan Admin & Manajemen Konten (`/admin`)

Khusus untuk PIC Multimedia, Head of Tech, atau editor dokumentasi yang ingin menambah atau memperbarui isi panduan.

### 1. Masuk ke Panel Admin
1. Buka URL: `https://gms-av-techsupport.vercel.app/` (atau `http://localhost:3000/admin` jika di lokal).
2. Masukkan **Password Admin** yang telah ditentukan.
3. Anda akan masuk ke dashboard admin dengan dua tab: **Artikel** dan **Ruangan**.

### 2. Membuat / Mengedit Artikel Troubleshooting
1. Pilih tab **Artikel**, lalu klik **+ Tambah Artikel Baru** (atau klik ikon pensil pada artikel yang ingin diedit).
2. Isi formulir:
   - **Judul**: Buat judul yang jelas (contoh: *Mengatasi Audio Delay pada Live Streaming OBS*).
   - **Kategori**: Pilih kategori alat yang sesuai.
   - **Lokasi / Ruangan**: *(Opsional)* Pilih ruangan jika masalah ini spesifik di ruangan tertentu, atau kosongkan jika berlaku umum di semua ruangan.
   - **Deskripsi**: Ringkasan singkat masalah (1–2 kalimat).
   - **Tag**: Kata kunci pencarian yang dipisahkan koma (contoh: `obs, audio, delay, sync`).
   - **Peralatan**: Alat terkait (contoh: `Behringer X32, OBS Studio, DeckLink`).
   - **Isi Artikel**: Tulis menggunakan Markdown (gunakan heading `## Gejala`, `## Penyebab`, `## Langkah Perbaikan`).
3. Klik **Simpan Artikel**.

### 3. Mengelola Profil & SOP Ruangan
1. Pilih tab **Ruangan**.
2. Anda dapat memperbarui informasi inventaris alat, panduan operasional, atau SOP buka/tutup ruangan.
3. Klik **Simpan Perubahan**.

### 4. Upload Gambar & Tangkapan Layar
1. Pada form editor artikel/ruangan, gunakan tombol **Upload Gambar**.
2. Pilih file gambar (format `.png`, `.jpg`, `.webp`).
3. Setelah upload selesai, URL gambar otomatis disalin ke editor dalam format Markdown: `![Deskripsi Gambar](/images/uploads/nama-file.png)`.

### 5. Cara Kerja Sinkronisasi (Git-Backed CMS)
- Web app ini tidak menggunakan database terpisah.
- Saat Anda menekan tombol **Simpan** atau **Hapus**, sistem akan membuat commit otomatis ke repository GitHub menggunakan GitHub API.
- Platform hosting (seperti Vercel) akan otomatis mendeteksi perubahan tersebut dan melakukan **auto-deployment** (membutuhkan waktu ±30–60 detik hingga perubahan tampil secara live).

---

## 💻 Panduan Pengembang & Instalasi Lokal

### 1. Kebutuhan Sistem
- **Node.js**: Versi 18.17.0 atau lebih baru
- **npm** atau **pnpm** / **yarn**
- **Git**

### 2. Langkah Instalasi

```bash
# 1. Clone repository
git clone https://github.com/USERNAME/av-docs.git
cd av-docs

# 2. Install dependencies
npm install

# 3. Buat file konfigurasi lingkungan
cp .env.example .env.local

# 4. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### 3. Konfigurasi Environment Variables (`.env.local`)

Isi file `.env.local` dengan konfigurasi berikut:

| Variabel | Deskripsi | Contoh |
|---|---|---|
| `ADMIN_PASSWORD` | Password untuk masuk ke panel `/admin` | `rahasiamultimedia123` |
| `GITHUB_TOKEN` | Personal Access Token (Classic) dengan scope `repo` | `ghp_xxxxxxxxxxxxxxxxxxxx` |
| `GITHUB_OWNER` | Username atau Organisasi pemilik repository di GitHub | `christophertekvi` |
| `GITHUB_REPO` | Nama repository di GitHub | `gms-av-techsupport` |
| `GITHUB_BRANCH` | Branch target untuk menyimpan perubahan | `main` |

> ⚠️ **Catatan**: Jika `GITHUB_TOKEN` tidak diisi saat development lokal, fitur simpan/hapus di panel `/admin` tidak akan bisa meng-commit ke repo GitHub.

---

## 📁 Struktur Proyek

```
av-docs/
├── app/                      # Next.js App Router
│   ├── admin/                # Halaman Dashboard Admin (/admin)
│   ├── api/                  # API Route Handlers (auth, articles, rooms, upload)
│   ├── artikel/[slug]/       # Halaman Detail Baca Artikel MDX
│   ├── kategori/[slug]/      # Halaman Filter Berdasarkan Kategori
│   ├── wilayah/              # Halaman Daftar Wilayah & Profil Ruangan
│   │   └── [slug]/           # Detail Ruangan (SOP, daftar alat & artikel terkait)
│   ├── layout.js             # Root Layout (Navbar, Footer, Provider)
│   └── page.js               # Halaman Beranda (Home)
├── components/               # Komponen Antarmuka (UI)
│   ├── ArticleCard.jsx       # Card ringkasan artikel
│   ├── CategoryBadge.jsx     # Badge label kategori
│   ├── LocationBadge.jsx     # Badge label lokasi/ruangan
│   ├── Navbar.jsx            # Navigasi utama + Search + Dark Mode Toggle
│   ├── SearchBar.jsx         # Modal / input pencarian cepat
│   ├── Sidebar.jsx           # Sidebar filter kategori & navigasi cepat
│   └── ThemeToggle.jsx       # Switcher Dark/Light theme
├── content/                  # Database Konten Berbasis Markdown (MDX)
│   ├── articles/             # Kumpulan file artikel troubleshooting (*.mdx)
│   └── rooms/                # Kumpulan profil ruangan & SOP (*.mdx)
├── lib/                      # Helper & Fungsi Utilitas
│   ├── articles.js           # Query & parser artikel MDX
│   ├── categories.js         # Master list data kategori
│   ├── github.js             # Integrasi GitHub API untuk CMS commit
│   ├── locations.js          # Master list wilayah & helper lokasi
│   └── rooms.js              # Query & parser profil ruangan MDX
└── public/                   # Asset statis (gambar, logo, icons)
    └── images/uploads/       # Tempat penyimpanan gambar hasil upload admin
```

---

## 📝 Format Penulisan Konten (MDX)

Jika Anda ingin menambah atau mengedit artikel secara langsung melalui kode atau Git, gunakan format berikut:

### Struktur Artikel Troubleshooting
File disimpan di `content/articles/[slug-judul].mdx`:

```md
---
title: "ATEM Switcher Tidak Mendeteksi Input HDMI Kamera 2"
category: "switcher"
location: "mcc-chappel"
description: "Panduan mengatasi masalah no signal pada input HDMI ATEM Mini / SDI converter."
tags: ["atem", "hdmi", "converter", "blackmagic"]
equipment: ["ATEM 2 M/E Constellation", "Micro Converter HDMI to SDI"]
updatedAt: "2026-08-20"
---

## Gejala
- Tampilan multiview pada input 2 berwarna hitam (*Black / No Signal*).
- Lampu indikator SDI converter tidak menyala stabil.

## Penyebab
1. Resolusi output kamera tidak cocok dengan format video standard switcher (misal: 1080p50 vs 1080p59.94).
2. Kabel HDMI/SDI longgar atau rusak.
3. Power supply micro converter bermasalah.

## Langkah Perbaikan
1. **Cek Format Kamera**: Pastikan output format di menu kamera diset ke `1080p 59.94` atau `1080p 50` sesuai setup master switcher.
2. **Periksa Converter**: Pastikan lampu *Lock* pada Micro Converter menyala solid.
3. **Reseat Kabel**: Cabut dan pasang kembali kedua ujung kabel HDMI dan SDI.
```

> 💡 **Tips**: Bagian `location` bersifat opsional. Kosongkan jika artikel tersebut berlaku untuk semua lokasi.

### Struktur Profil Ruangan
File disimpan di `content/rooms/[wilayah]-[ruangan].mdx`:

```md
---
name: "MCC - Chappel"
wilayah: "mcc"
summary: "Ruang ibadah Chappel Gedung MCC."
equipment:
  - "Switcher: ATEM 2 M/E Constellation HD"
  - "Camera: 3x Sony FX3 + 1x PTZ Lumens"
  - "Audio: Behringer Wing via Dante"
---

# SOP Operasional MCC Chappel

## SOP Pembukaan (Sebelum Ibadah)
- [ ] Nyalakan Main Power Rack AV.
- [ ] Buka switch network Dante & NDI.
- [ ] Nyalakan projector / LED screen controller.
- [ ] Pastikan input video kamera 1, 2, dan 3 masuk ke multiview.

## SOP Penutupan (Setelah Ibadah)
- [ ] Matikan switch transmitter wireless mic & simpan di docking charger.
- [ ] Matikan LED screen / Projector.
- [ ] Pastikan recording live stream sudah di-stop.
- [ ] Matikan power sequence rack utama.
```

---

## 🚀 Panduan Deployment (Vercel)

1. Buat repository baru di GitHub dan lakukan push project ini.
2. Buat **GitHub Personal Access Token (Classic)**:
   - Buka [GitHub Settings > Developer Settings > Personal Access Tokens](https://github.com/settings/tokens).
   - Klik **Generate new token (classic)**.
   - Beri nama (misal: `av-docs-cms-token`) dan centang scope **`repo`**.
   - Salin token yang dihasilkan.
3. Hubungkan ke [Vercel](https://vercel.com):
   - Klik **Add New Project** lalu pilih repository GitHub Anda.
   - Pada bagian **Environment Variables**, tambahkan:
     - `ADMIN_PASSWORD`
     - `GITHUB_TOKEN`
     - `GITHUB_OWNER`
     - `GITHUB_REPO`
     - `GITHUB_BRANCH` (biasanya `main`)
4. Klik **Deploy**. Website Anda siap digunakan!

---

## 🤝 Kontribusi & Bantuan

Untuk saran penambahan fitur, pembaruan SOP, atau pelaporan bug pada aplikasi dokumentasi ini, silakan hubungi tim **AV Tech Support** atau buat *Pull Request* baru di repository ini.
