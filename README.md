# Moody 🧸 — Jurnal Suasana Hati Digital Scrapbook Kawaii

Moody adalah sebuah aplikasi catatan harian (mood journal) Single Page Application (SPA) berbasis web dengan visualisasi **Digital Scrapbook & Bullet Journal Kawaii**. Aplikasi ini didesain agar terlihat premium, interaktif, dan responsif layaknya buku harian fisik dengan hiasan selotip kertas (washi tape), kertas berpola titik-titik (dotted canvas), catatan tempel (sticky notes), grafik kustom, dan stiker suasana hati yang menggemaskan.

Aplikasi ini bersifat **offline-first** dan mengutamakan privasi pengguna dengan menyimpan data sepenuhnya di memori peramban lokal (`localStorage`).

---

## ✨ Fitur Utama

- **Digital Scrapbook UI/UX**: Estetika buku harian fisik bergaya kawaii dengan rotasi kartu acak, bayangan lembut, selotip transparan (washi tape) dengan tepi robek (polygon clip-path), dan kanvas berpola titik.
- **Form Jurnal Interaktif**: Pemilih sticker mood emoji yang menyala saat aktif, kolom input judul opsional, catatan teks biasa, dan sistem manajemen tag pill dinamis.
- **Daftar Catatan Polaroid**: Entri jurnal lama ditampilkan sebagai kartu foto polaroid klasik, lengkap dengan aksen warna sisi kiri sesuai gradasi warna mood masing-masing.
- **Pencarian & Penyaringan Cepat**: Kotak pencarian dinamis (case-insensitive) yang langsung memfilter catatan berdasarkan judul, isi, atau tag, serta tombol saring cepat mood emoji.
- **Detail Polaroid Modal**: Klik pada kartu polaroid memicu modal dialog pop-up detail yang cantik dengan animasi scaling halus untuk membaca konten jurnal yang panjang secara utuh.
- **Dashboard Statistik & Analisis**:
  - **Streak Harian**: Algoritma kalkulator streak beruntun menulis jurnal harian secara real-time.
  - **Top Tags**: Bar chart horizontal murni CSS yang mengurutkan 5 tag paling sering digunakan.
- **Visualisasi Tren Suasana Hati (SVG Chart)**:
  - **Mood Trend Line Chart**: Grafik garis koordinat SVG dinamis yang melukiskan naik-turun emosi Anda selama 10 entri terakhir.
  - **Kalender Kontribusi Bulanan**: Grid kontribusi 30 hari terakhir bergaya pixel-art di mana setiap kotak diberi warna gradien sesuai mood pada tanggal tersebut.
- **Backup & Restore Data**: Ekspor seluruh catatan jurnal ke dalam satu berkas `.json` cadangan dan impor kembali dengan validasi skema data serta fitur merge/anti-duplikasi.

---

## 🛠️ Tech Stack (Teknologi yang Digunakan)

Aplikasi ini dibuat secara murni tanpa pustaka visualisasi (charting libraries) atau kerangka kerja (framework) eksternal demi menjaga kecepatan rendering dan ukuran aplikasi yang super ringan:

- **Struktur**: HTML5 Semantik.
- **Tampilan**: Vanilla CSS3 (Custom Variables, CSS Transitions, Backdrop Filter Blur, Clip-path polygon).
- **Logika & State**: Vanilla JavaScript (ES6+ Modules).
- **Tipografi**: Google Fonts API (Outfit, Fredoka, Patrick Hand).
- **Penyimpanan**: Browser `localStorage` API.
- **Grafik**: SVG Inline dinamis yang digambar secara terprogram.

---

## 🚀 Cara Menjalankan Secara Lokal

Karena aplikasi ini menggunakan modul ES6 (`type="module"`), peramban (browser) modern melarang pembukaannya langsung melalui protokol `file://` (mengakibatkan CORS error). Anda perlu menjalankannya menggunakan server web lokal sederhana.

### Cara Cepat Menggunakan Python
1. Buka Terminal atau Command Prompt di direktori proyek.
2. Jalankan perintah server bawaan Python:
   ```bash
   python -m http.server 8000
   ```
3. Buka peramban dan navigasikan ke: [http://localhost:8000](http://localhost:8000)

### Cara Cepat Menggunakan Node.js (npx)
1. Buka Terminal di direktori proyek.
2. Jalankan perintah server:
   ```bash
   npx http-server -p 8000
   ```
3. Buka peramban di: [http://localhost:8000](http://localhost:8000)

---

## 📖 Panduan Penggunaan

1. **Menulis Jurnal**:
   - Isi judul (opsional).
   - Pilih stiker suasana hati Anda hari ini.
   - Tulis catatan harian Anda di kolom editor.
   - Tambahkan tag (ketik tag lalu klik tombol `+` atau tekan `Enter`).
   - Klik **Simpan Jurnal 💾** untuk menyimpan. Anda akan dialihkan secara otomatis ke tab Riwayat.
2. **Membaca & Mencari Jurnal**:
   - Di tab **Buku Harian**, Anda dapat melihat semua kartu polaroid yang tersusun rapi.
   - Gunakan kotak pencarian untuk mencari teks tertentu, atau klik tag pill pada kartu polaroid untuk menyaring tag itu secara instan.
   - Klik di area kartu polaroid (selain tombol hapus/tag) untuk membuka detail baca modal secara utuh.
3. **Menganalisis Tren & Backup**:
   - Buka tab **Tren & Statistik** untuk melihat statistik streak mencatat harian Anda, visualisasi grafik garis suasana hati, dan kalender kontribusi 30 hari terakhir.
   - Klik **Ekspor Jurnal (.JSON)** untuk mengunduh cadangan data Anda.
   - Klik **Impor Jurnal** dan pilih file `.json` hasil ekspor sebelumnya untuk memulihkan atau menyatukan data.

---

## 📸 Screenshots

*(Tampilan Visual Scrapbook & Bullet Journal Kawaii)*

```text
+-------------------------------------------------------+
|  [Logo: Moody 🧸]                      (Mode Offline) |
+-------------------------------------------------------+
|  [Tab: ✍️ Tulis]   [Tab: 📖 Riwayat]   [Tab: 📊 Tren]  |
|                                                       |
|  +-------------------------------------------------+  |
|  | [STICKY NOTE - Editor Jurnal]                   |  |
|  |                                                 |  |
|  |  Judul: [_____________________________________] |  |
|  |  Mood:  [🥰 Awesome] [🙂 Good] [😐 Neutral] ... |  |
|  |  Isi:   [ Tulis cerita hari ini...            ] |  |
|  |  Tag:   [_________] [+] (#kerja, #liburan)     |  |
|  |                                                 |  |
|  |                      [ Simpan Jurnal 💾 ]        |  |
|  +-------------------------------------------------+  |
+-------------------------------------------------------+
```

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah lisensi **MIT License** - bebas digunakan, dimodifikasi, dan didistribusikan untuk tujuan edukasi atau komersial.
