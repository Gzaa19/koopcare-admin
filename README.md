<div align="center">

# KoopCare Web Admin - Koperasi Digital Syariah 🚀

![Project Badge](https://img.shields.io/badge/Project-KoopCare-5F7334?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

**Sistem Web Admin (Back-Office) untuk mengelola operasional Koperasi Digital Syariah KoopCare. Sistem ini mencakup manajemen KYC, Persetujuan Pembiayaan (Loan Management), Buku Besar (General Ledger), Kasir, dan Manajemen Dana Ta'awun.**

</div>

---

## 🛠 Tech Stack
* **Frontend:** React.js (Vite) + Tailwind CSS v4 + Zustand
* **Backend:** Node.js + Express.js
* **Database:** MySQL 8.0
* **Infrastructure:** Docker & Docker Compose

---

## 📐 Standar Penulisan Kode (Coding Conventions)

Untuk menjaga kualitas dan keterbacaan kode (*clean code*) bagi seluruh tim pengembang, proyek ini menerapkan aturan standar penulisan sebagai berikut:

### 1. Aturan Penamaan (Naming Conventions)
* **Variabel & Properti:** Menggunakan `camelCase`. Harus deskriptif dan berupa kata benda.
  * ✅ *Benar:* `userName`, `totalAmount`, `isValid`
  * ❌ *Salah:* `UserName`, `total_amount`, `val`
* **Konstanta (Constants):** Menggunakan `UPPER_SNAKE_CASE`.
  * ✅ *Benar:* `MAX_LOAN_AMOUNT`, `API_BASE_URL`
  * ❌ *Salah:* `maxLoanAmount`, `ApiBaseUrl`
* **Fungsi & Metode:** Menggunakan `camelCase`. Harus diawali dengan kata kerja (*verb*).
  * ✅ *Benar:* `calculateTotal()`, `getUserData()`, `handleSubmit()`
  * ❌ *Salah:* `calculation()`, `UserData()`
* **Kelas & Komponen React:** Menggunakan `PascalCase`.
  * ✅ *Benar:* `UserProfile`, `LoanDashboard`, `TaawunController`
  * ❌ *Salah:* `userProfile`, `loan_dashboard`
* **File & Folder (Files & Directories):**
  * **Frontend (React):** Komponen menggunakan `PascalCase` (contoh: `Button.jsx`, `Dashboard.jsx`). File utilitas/fungsi menggunakan `camelCase` (contoh: `formatCurrency.js`).
  * **Backend (Node.js):** Semua file dan folder menggunakan `camelCase` (contoh: `authController.js`, `loanRoutes.js`).

### 2. Aturan Database (MySQL Conventions)
* **Nama Tabel:** Menggunakan `snake_case` dan bentuk jamak (*plural*).
  * ✅ *Benar:* `users`, `kyc_documents`, `loan_applications`
* **Nama Kolom:** Menggunakan `snake_case` dan bentuk tunggal (*singular*).
  * ✅ *Benar:* `first_name`, `created_at`, `loan_status`
* **Primary Key:** Selalu gunakan `id` (INT/UUID).
* **Foreign Key:** Gabungan nama tabel tunggal dan `id` (contoh: `user_id`, `loan_id`).

### 3. Aturan Bahasa (Language Protocol)
* **Kode & Penamaan:** Seluruh penamaan variabel, fungsi, dan komponen **WAJIB** menggunakan bahasa Inggris untuk menjaga standar industri.
* **Komentar (Comments):** Penjelasan logika yang kompleks boleh menggunakan Bahasa Indonesia agar mudah dipahami anggota tim.

### 4. Standar Commit Git (Conventional Commits)
Gunakan format berikut saat melakukan `git commit`:
* `feat:` ➝ Menambah fitur baru (contoh: `feat: add loan approval dashboard`)
* `fix:` ➝ Memperbaiki *bug* (contoh: `fix: resolve jwt token undefined`)
* `docs:` ➝ Mengubah dokumentasi/README (contoh: `docs: update setup instructions`)
* `style:` ➝ Perubahan UI/CSS, *formatting* tanpa mengubah logika (contoh: `style: update button colors to KoopCare standard`)
* `refactor:` ➝ Menulis ulang kode tanpa menambah fitur atau memperbaiki bug.
* `chore:` ➝ Pembaruan dependensi, konfigurasi Docker, build process (contoh: `chore: update tailwind config to v4`).

---

## 📋 Prasyarat (Prerequisites)
Sebelum menjalankan proyek ini, pastikan mesin Anda telah terpasang:
1. [Git](https://git-scm.com/)
2. [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Pastikan Docker Engine dalam keadaan *running*)

---

## 🚀 Cara Instalasi & Menjalankan Proyek (Local Development)

### 1. Clone Repositori
Buka terminal dan jalankan perintah berikut:
```bash
git clone https://github.com/sayafauzi/koopcare-admin.git
cd koopcare-admin
```

## 🤝 Panduan Kolaborasi Git (Team Workflow)

Agar tidak terjadi error `non-fast-forward` atau konflik yang merusak kode, seluruh anggota tim **WAJIB** mengikuti alur kerja berikut:

### 1. Alur Kerja Harian (The Golden Rule)
Sebelum mulai mengetik kode apa pun setiap hari, pastikan lokal Anda sinkron dengan server:
```bash
git pull origin main
```
*Lakukan ini secara berkala, terutama setelah rekan tim mengabarkan mereka baru saja melakukan push.*

### 2. Prosedur Push yang Aman
Jika Kita ingin mengirim perubahan, ikuti urutan ini:
1. **Simpan Pekerjaan:** `git add .` dan `git commit -m "feat: deskripsi singkat"`
2. **Tarik Perubahan Terbaru:** `git pull origin main`
3. **Selesaikan Konflik (Jika ada):** Jika muncul tulisan *Conflict*, buka file tersebut, pilih kode yang benar, lalu `git add .` dan `git commit`.
4. **Kirim:** `git push origin main`

---

## 🛠 Penanganan Error Umum

### A. Error: `non-fast-forward` (Rejected)
**Penyebab:** Ada kode baru di GitHub yang belum Anda tarik ke laptop.
**Solusi Rapi:**
```bash
# 1. Atur strategi merge
git config pull.rebase false

# 2. Tarik dan gabungkan otomatis
git pull origin main

# 3. Jika aman, langsung push
git push origin main
```

### B. Error: `divergent branches`
**Penyebab:** Sejarah Git di lokal dan GitHub berbeda arah.
**Solusi:**
```bash
git pull origin main --allow-unrelated-histories
```

---

## 🚫 Yang HARUS Dihindari (Best Practices)

1. **Dilarang keras menggunakan `--force`:** Jangan pernah menjalankan `git push --force` di branch utama (`main`). Ini akan **menghapus** hasil kerja rekan tim di GitHub secara permanen.
   
2. **Jangan Mengedit File Langsung di Web GitHub:** Hindari menekan tombol "Edit" di browser GitHub. Ini adalah penyebab utama error `non-fast-forward`. Selalu edit di VS Code/Laptop Anda.

3. **Jangan Commit Folder `node_modules`:** Pastikan folder ini ada di `.gitignore`. Men-commit ribuan file library akan membuat proses `pull/push` menjadi sangat lambat dan berat.

4. **Pesan Commit yang Jelas:** Gunakan awalan (prefix) agar rekan tim mudah membaca riwayat:
   - `feat:` untuk fitur baru.
   - `fix:` untuk perbaikan bug.
   - `style:` untuk perubahan tampilan/CSS.
   - `docs:` untuk perubahan README atau dokumentasi.

---

## 🐳 Tips Docker untuk Tim
Jika rekan tim menambahkan library baru (misal: menginstall `lucide-react`), maka saat melakukan `pull`, harus menjalankan:
```bash
docker-compose up --build
```
*Ini untuk memastikan container Docker menginstall library baru tersebut secara otomatis.*

---

