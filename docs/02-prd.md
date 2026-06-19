# Product Requirements Document (PRD) — Moody

## Sources Read
- [01-requirements.md](file:///C:/Users/User/.gemini/antigravity/scratch/moody-journal/docs/01-requirements.md)
- User input/answers dari sesi `/grill-me` (Juni 2026).

---

## Overview
**Moody** adalah aplikasi web jurnal harian satu halaman (Single Page Application) yang berjalan sepenuhnya di sisi klien (client-side) tanpa server/database luar. Aplikasi ini menggunakan LocalStorage browser untuk penyimpanan data dan mengusung estetika **Glassmorphism & Dreamy Dark Mode** yang memukau. Fitur utama aplikasi berpusat pada penulisan jurnal teks, pelacakan mood harian, dan visualisasi analisis mood interaktif.

## Target Users
Pengguna yang menginginkan tempat menulis jurnal pribadi yang cepat, aman (lokal di perangkat), offline-first, serta memiliki visualisasi visual/tren emosi yang menarik tanpa perlu mendaftar akun.

## Problem
Aplikasi jurnal umumnya rumit, memerlukan koneksi internet, memiliki desain yang membosankan, atau tidak menyediakan visualisasi statistik emosi yang intuitif dan menarik untuk membantu pengguna melacak kesehatan mental mereka secara praktis.

## Goals
1. Menyediakan antarmuka penulisan jurnal teks yang bebas gangguan (distraction-free) dengan visual yang modern dan premium.
2. Memfasilitasi pelacakan suasana hati harian (mood tracking) dengan pilihan warna gradasi yang estetis.
3. Memudahkan pengorganisasian entri dengan penanda kategori (tags).
4. Menyediakan dashboard analisis data mood harian dengan visualisasi grafik SVG dinamis dan kalender kontribusi (GitHub-style).
5. Menyediakan mekanisme pencadangan (backup) dan pemulihan (restore) data melalui file JSON lokal.

## Non-Goals / Out of Scope
- Tidak mendukung lampiran multimedia seperti gambar, audio, atau dokumen (fokus murni pada teks).
- Tidak menggunakan database cloud (Firebase, Supabase, dll.) atau otentikasi akun pengguna (PIN lock juga ditiadakan untuk kemudahan pengujian).
- Tidak memiliki sinkronisasi otomatis antar perangkat secara online.

---

## User Stories
- **Sebagai penulis jurnal**, saya ingin menulis entri harian, memilih mood hari itu, dan menambahkan tag agar saya dapat mendokumentasikan hidup saya secara terstruktur.
- **Sebagai pengguna visual**, saya ingin melihat visualisasi tren mood harian dan kalender kontribusi bulanan agar saya mudah memantau fluktuasi emosi saya.
- **Sebagai pencatat yang konsisten**, saya ingin melihat statistik streak menulis harian agar saya termotivasi menulis setiap hari.
- **Sebagai pemilik data**, saya ingin mengekspor data jurnal saya ke file JSON dan mengimpornya kembali agar saya tidak kehilangan data jika riwayat browser terhapus.
- **Sebagai pencari**, saya ingin mencari entri jurnal lama berdasarkan kata kunci teks, mood, atau tag tertentu agar saya bisa dengan cepat menemukan momen masa lalu.

---

## Core User Flows

### 1. Menulis Jurnal Baru
`User membuka aplikasi` -> `Pilih tab 'Jurnal Baru' di Floating Dock` -> `Ketik judul & isi jurnal` -> `Pilih satu tingkat mood (Awesome s.d. Awful)` -> `Tambahkan tag jika perlu` -> `Klik 'Simpan Jurnal'` -> `Sistem menyimpan data ke LocalStorage` -> `Notifikasi sukses muncul`.

### 2. Membaca & Menyaring Riwayat Jurnal
`Pilih tab 'Riwayat Jurnal'` -> `User melihat daftar kartu entri (urut terbaru)` -> `User mengetik di kolom pencarian / mengklik filter mood/tag` -> `Daftar kartu langsung tersaring secara dinamis` -> `User mengklik salah satu kartu` -> `Detail entri terbuka dalam modal glassmorphic` -> `User menutup modal atau menghapus entri tersebut`.

### 3. Memantau Analisis
`Pilih tab 'Analisis Mood'` -> `Sistem menghitung streak dan frekuensi tag` -> `Sistem menggambar grafik SVG tren mood & grid kontribusi bulanan` -> `User melihat ringkasan visual` -> `User mengunduh backup JSON melalui tombol ekspor jika diinginkan`.

---

## Functional Requirements

- **FR1: Editor Jurnal & Pemilihan Mood**
  - Menyediakan input teks untuk Judul (opsional) dan Isi Jurnal (wajib).
  - Menyediakan 5 opsi mood interaktif: *Awesome, Good, Neutral, Bad, Awful*.
  - Menyediakan input tag yang memungkinkan pengguna menambah beberapa tag.
- **FR2: Navigasi Single Page Application (SPA)**
  - Menggunakan floating dock melayang di bawah layar untuk navigasi antara: Jurnal Baru, Riwayat Jurnal, dan Analisis Mood.
  - Pergantian halaman harus instan tanpa memuat ulang browser (reload).
- **FR3: Pencarian & Filter Riwayat**
  - Kolom pencarian teks yang menyaring entri berdasarkan kecocokan judul/isi secara *real-time*.
  - Tombol filter cepat berdasarkan kelima mood.
  - Klik tag pada kartu jurnal untuk langsung menerapkan filter tag tersebut.
- **FR4: Dashboard Analisis Mood & Kalender Kontribusi**
  - Menghitung streak menulis berturut-turut (termasuk deteksi jika streak putus).
  - Merender grafik garis SVG dinamis yang menghubungkan tingkat mood antar entri dari waktu ke waktu.
  - Merender kontribusi bulanan (grid 30 hari terakhir) yang diwarnai sesuai dengan mood hari tersebut.
  - Grafik batang sederhana atau bagan persentase untuk penggunaan tag paling sering.
- **FR5: Ekspor & Impor JSON**
  - Tombol untuk mengunduh semua data jurnal dalam satu file format `moody-backup.json`.
  - Input file untuk mengunggah file backup `.json` guna menggantikan atau menggabungkan data LocalStorage.

---

## Non-Functional Requirements

- **Desain & Estetika (Visual Excellence):**
  - Menerapkan **Dreamy Dark Mode** dengan latar belakang navy/slate gelap, bias cahaya gradasi, dan kartu glassmorphic (`backdrop-filter: blur`, border semi-transparan putih `rgba(255,255,255,0.08)`).
  - Mikro-animasi pada hover ikon navigasi, tombol mood, dan saat modal dibuka.
  - Menggunakan font modern sans-serif (Inter atau Outfit) yang diimpor dari Google Fonts.
- **Performa & Ukuran:**
  - Waktu muat awal di bawah 1 detik.
  - Operasi LocalStorage sinkron dan instan.
- **Keamanan & Privasi:**
  - Bebas pelacakan eksternal. Semua data tetap berada di mesin lokal milik pengguna.

---

## Acceptance Criteria

1. Menekan tombol "Simpan Jurnal" dengan formulir kosong memunculkan pesan validasi (isi jurnal wajib diisi).
2. Data entri baru tersimpan dengan kunci `moody_entries` di LocalStorage dengan skema objek yang valid (id, title, content, mood, tags, date).
3. Halaman Riwayat memperbarui daftar entri secara instan tanpa perlu reload setelah menyimpan jurnal baru.
4. Grafik garis SVG di halaman Analisis terisi dan menghubungkan titik-titik koordinat mood dengan benar jika terdapat minimal 2 entri.
5. Tombol ekspor menghasilkan unduhan berkas valid JSON yang berisi array seluruh entri. Pengunggahan file backup tersebut berhasil memulihkan entri ke aplikasi.

---

## Risks and Open Questions
- **Keterbatasan Kapasitas LocalStorage:** Batas browser adalah ~5MB. Karena tidak ada gambar, batas ini cukup untuk ratusan ribu entri teks, sehingga risiko ini sangat kecil untuk pemakaian normal.
- **Kehilangan Data:** Jika pengguna membersihkan cache/data browser (clear site data), data jurnal akan hilang. *Solusi*: Berikan info di dashboard untuk menyarankan pengguna mengekspor data secara berkala.
