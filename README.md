# AV Tech Church — Dokumentasi & Troubleshooting

Website dokumentasi troubleshooting & tutorial untuk tim multimedia gereja.
Dibangun dengan Next.js (App Router), React, dan Tailwind CSS.

## Fitur

- **Kategori**: Camera, Switcher, Streaming, Audio, Display & LED, Network
- **Pencarian** cepat (client-side, fuzzy search) di seluruh artikel
- **Tally Dot** — indikator tingkat keparahan artikel (Kritis / Perlu Perhatian / Tips),
  meniru konvensi tally light broadcast (merah = program/on-air, hijau = preview/aman)
- **Dark mode**
- **Panel Admin** (`/admin`) — tim non-teknis bisa tambah/edit/hapus artikel lewat form,
  lengkap dengan upload gambar, tanpa perlu tahu Git atau coding
- Konten disimpan sebagai file Markdown (`.mdx`) di dalam repo — ringan, gratis, dan
  otomatis ter-backup lewat riwayat Git

## Cara Kerja "CMS Sederhana"-nya

Tidak ada database eksternal. Saat seseorang publish artikel lewat `/admin`, server akan
langsung **commit file baru ke repository GitHub** memakai GitHub API. Karena repo ini
terhubung ke Vercel, setiap commit otomatis memicu deploy ulang (biasanya 30–60 detik),
dan artikel baru langsung tayang. Tidak perlu server database, tidak ada biaya tambahan.

## Setup Awal

### 1. Push project ini ke GitHub

```bash
cd av-tech-church-docs
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git push -u origin main
```

### 2. Buat GitHub Personal Access Token

1. Buka https://github.com/settings/tokens → **Generate new token (classic)**
2. Beri scope **repo** (akses penuh ke repo pribadi/organisasi)
3. Salin tokennya (hanya muncul sekali)

### 3. Deploy ke Vercel

1. Buka https://vercel.com → **Add New Project** → import repo GitHub tadi
2. Framework otomatis terdeteksi sebagai **Next.js**, tidak perlu ubah build settings
3. Sebelum deploy, tambahkan **Environment Variables** berikut (Settings → Environment Variables):

| Key | Value |
|---|---|
| `ADMIN_PASSWORD` | password bebas, dipakai untuk masuk `/admin` |
| `GITHUB_TOKEN` | token dari langkah 2 |
| `GITHUB_OWNER` | username/organisasi GitHub kamu |
| `GITHUB_REPO` | nama repo ini |
| `GITHUB_BRANCH` | `main` (atau branch default repo kamu) |

4. Klik **Deploy**. Setelah selesai, buka `https://nama-project.vercel.app/admin` dan
   login pakai `ADMIN_PASSWORD` yang tadi di-set.

### 4. Development lokal (opsional)

```bash
npm install
cp .env.example .env.local   # isi sesuai token & repo kamu
npm run dev
```

Buka http://localhost:3000

> Catatan: publish artikel lewat `/admin` di lokal tetap akan commit ke GitHub sungguhan
> (karena pakai GitHub API), bukan hanya menulis file lokal. Ini disengaja supaya perilaku
> lokal & production konsisten.

## Struktur Folder

```
app/                 → halaman & API routes (App Router)
  page.js            → beranda
  kategori/[slug]/   → halaman per kategori
  artikel/[slug]/    → halaman detail artikel (render MDX)
  admin/             → panel admin (form CRUD artikel)
  api/                → route handler: articles, auth, upload
components/          → komponen UI (Navbar, Sidebar, ArticleCard, dst)
content/articles/    → semua artikel dalam format .mdx
lib/                 → helper: baca/tulis artikel, kategori, integrasi GitHub
```

## Menambah Kategori Baru

Edit `lib/categories.js`, tambahkan objek baru ke array `CATEGORIES`:

```js
{ slug: 'lighting', label: 'Lighting', description: 'Stage lighting & DMX' }
```

## Menulis Artikel Langsung Lewat Kode (opsional)

Selain lewat `/admin`, kamu juga bisa menambah file `.mdx` langsung di
`content/articles/nama-artikel.mdx` dengan format:

```md
---
title: "Judul artikel"
category: "switcher"
severity: "warning"
description: "Ringkasan singkat"
tags: ["tag1", "tag2"]
equipment: ["Alat A", "Alat B"]
updatedAt: "2026-07-08"
---

## Gejala
...

## Langkah Perbaikan
...
```

## Keamanan

- `/admin` dilindungi password sederhana (cookie httpOnly). Untuk tim yang lebih besar
  dengan kebutuhan multi-user & role, pertimbangkan upgrade ke autentikasi berbasis akun
  di masa depan.
- Jangan commit file `.env` / `.env.local` ke Git (sudah otomatis di-ignore lewat `.gitignore`).
