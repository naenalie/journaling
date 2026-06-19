# Requirements: Moody - Mood Journaling Web App

## 1. Project Overview
 Moody adalah aplikasi web jurnal pribadi berbasis web yang fokus pada pencatatan teks, pelacakan mood harian, dan label kategori (tags). Aplikasi ini ditujukan untuk uji coba lokal, offline-first, tanpa backend server, dan mengusung estetika visual yang premium.

---

## 2. Fitur Utama (Core Features)
- **Editor Jurnal**:
  - Kolom input Judul (opsional) dan Isi Jurnal (wajib).
  - Pilihan mood harian (5 tingkat mood: *Awesome, Good, Neutral, Bad, Awful*) dengan efek interaktif.
  - Penambahan tag/kategori secara mudah.
- **Riwayat Jurnal (History)**:
  - Daftar entri jurnal yang disusun terbalik secara kronologis (terbaru di atas).
  - Kolom pencarian teks real-time untuk mencocokkan konten/judul.
  - Filter cepat berdasarkan tingkat mood dan tag.
  - Tampilan detail entri menggunakan modal glassmorphic.
  - Fitur untuk menghapus entri jurnal.
- **Dashboard Analisis & Visualisasi**:
  - **Streak Menulis**: Menghitung jumlah hari berturut-turut menulis jurnal.
  - **Grafik Tren Mood**: Grafik garis SVG dinamis untuk melihat perkembangan mood dari waktu ke waktu.
  - **Kalender Kontribusi Bulanan**: Grid kontribusi bulanan (GitHub-style) di mana kotak hari diwarnai berdasarkan mood hari tersebut.
  - **Frekuensi Tag**: Grafik bar sederhana yang menunjukkan tag yang paling sering digunakan.
- **Utilitas Data**:
  - Ekspor seluruh entri jurnal menjadi berkas `moody-backup.json`.
  - Impor berkas `.json` cadangan untuk memulihkan atau memasukkan data ke LocalStorage.

---

## 3. Batasan Teknis (Technical Constraints)
- **Teknologi**: Vanilla HTML5, Vanilla CSS3, dan Vanilla JavaScript modern (ES6+).
- **Arsitektur**: Single Page Application (SPA) murni. Semua halaman dimuat sekali dan transisi antar tab ditangani oleh JavaScript tanpa reload.
- **Penyimpanan**: Menggunakan `localStorage` browser.
- **Keamanan**: Tidak memerlukan enkripsi atau PIN Lock screen (karena ditujukan khusus untuk uji coba cepat).
- **Media**: Hanya mendukung teks dan metadata. Tidak mendukung unggahan gambar, audio, atau lampiran media lainnya.

---

## 4. Desain & Estetika (UI/UX)
- **Tema**: **Dreamy Dark Mode** dengan latar belakang gelap gelap (slate/navy), efek berpendar (glow), dan sudut membulat.
- **Gaya**: **Glassmorphism** dengan efek kartu semi-transparan (`backdrop-filter: blur`, warna latar `rgba` tipis, dan border border tipis bersinar).
- **Warna Mood (Gradasi HSL)**:
  - Awesome: Ungu ke Indigo
  - Good: Emerald ke Teal
  - Neutral: Slate ke Abu-abu
  - Bad: Biru ke Cobalt
  - Awful: Coral ke Crimson
- **Navigasi**: Dermaga melayang (Floating Bottom Dock) dengan efek kaca blur, ikon navigasi responsif, dan mikro-animasi pada interaksi hover.
