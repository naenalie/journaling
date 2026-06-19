# Refleksi Proyek — Moody

Dokumen ini berisi refleksi mengenai proses pengembangan aplikasi **Moody — Jurnal Suasana Hati Digital Scrapbook Kawaii** dari awal hingga selesai.

---

## 1. Apa yang Saya Bangun (What I Built)
Saya membangun sebuah aplikasi web Single Page Application (SPA) mandiri bernama **Moody**, yang didesain dengan estetika **Digital Scrapbook & Bullet Journal Kawaii**. Fitur-fitur utama meliputi:
- Form editor jurnal interaktif dengan input judul, stiker suasana hati, catatan isi, dan tag dinamis.
- Penyimpanan lokal peramban (`localStorage`) dengan tata letak daftar entri berbentuk kartu polaroid.
- Fitur pencarian teks case-insensitive dan penyaringan cepat berdasarkan tag/mood.
- Pop-up detail modal untuk membaca catatan panjang secara lengkap dengan animasi transisi yang mulus.
- Dashboard statistik yang menghitung streak harian secara akurat dan menyajikan tag terpopuler.
- Visualisasi data tingkat lanjut menggunakan grafik tren garis SVG dinamis dan kalender kontribusi bulanan piksel warna.
- Cadangan data dalam format `.json` lengkap dengan merger anti-duplikasi otomatis.

---

## 2. Pustaka/Alat AI yang Digunakan di Setiap Tahap (AI Tools Used)
Pengembangan proyek ini didampingi oleh agen AI **Antigravity (Google DeepMind)** dengan alur kerja berikut:
1. **Perencanaan (PRD & Analisis)**: AI membantu menyusun spesifikasi kebutuhan bisnis ([docs/01-requirements.md](file:///C:/Users/User/.gemini/antigravity/scratch/moody-journal/docs/01-requirements.md)) dan menerjemahkannya ke berkas PRD ([docs/02-prd.md](file:///C:/Users/User/.gemini/antigravity/scratch/moody-journal/docs/02-prd.md)).
2. **Perancangan Arsitektur**: AI memecah PRD menjadi backlog implementasi irisan vertikal ([docs/03-vertical-slice-issues.md](file:///C:/Users/User/.gemini/antigravity/scratch/moody-journal/docs/03-vertical-slice-issues.md)) dan membuat blueprint arsitektur modul ([docs/04-design.md](file:///C:/Users/User/.gemini/antigravity/scratch/moody-journal/docs/04-design.md)).
3. **Pengembangan TDD**: AI berperan sebagai TDD coach untuk memverifikasi logika streak harian dan skema importir data dengan mengisolasi kode pengujian di Node.js menggunakan mock.
4. **Implementasi & Review**: AI membuat kerangka HTML, CSS kustom scrapbook, serta kode modul JavaScript, dan memverifikasi interaksinya secara otomatis menggunakan subagent browser headless.

---

## 3. Keputusan Mandiri vs Saran AI (Own Decisions vs AI Suggestions)

### Keputusan Mandiri (Human Decisions):
- **Teknologi Tanpa Framework**: Memutuskan untuk menggunakan plain HTML, CSS, dan JS murni (tanpa React, Vue, atau Tailwind) agar aplikasi memuat secara instan dan tidak rentan terhadap kerusakan pustaka di masa mendatang.
- **Konsep Estetika Scrapbook**: Meminta visualisasi kawaii spesifik (kertas grid titik-titik, sticky notes berwarna pastel dengan rotasi kemiringan kecil acak, stiker penunjuk suasana hati tebal, dan selotip washi tape).
- **Pendekatan Tanpa Login**: Mempertahankan data 100% lokal di browser pengguna demi keamanan privasi mutlak dan kenyamanan bebas akun.

### Saran AI (AI Suggestions):
- **Selotip Torn CSS (Torn Washi Tape)**: AI menyarankan penggunaan properti CSS `clip-path: polygon(...)` untuk menghasilkan efek tepi robek bergigi pada washi tape secara matematis daripada memuat aset gambar eksternal yang lambat.
- **Deduplikasi Skema Jurnal**: Saat merefaktor kode penyimpanan, AI menyarankan pembuatan metode internal privat `_normalizeEntry()` agar logika normalisasi skema entri di `saveEntry` dan `importData` tidak berulang (prinsip DRY).
- **Matematika Koordinat SVG**: AI menghitung rumus penskalaan dinamis untuk titik X/Y grafik SVG agar garis tren mood selalu pas berada di dalam kotak grafik (`viewBox`) tanpa terpotong di berbagai resolusi layar.

---

## 4. Apa yang Saya Pelajari (What I Learned)
- **Desain Modul Mendalam (Deep Modules)**: Memahami cara membungkus kerumitan logika (seperti matematika grafik SVG di `stats.js` atau validasi importir di `storage.js`) di balik interface API modul yang sederhana, sehingga kode utama `app.js` tetap bersih dan mudah dibaca.
- **Pola Pengujian Tanpa Browser di Node.js**: Mempelajari teknik melakukan unit testing modul peramban secara terisolasi di lingkungan Node.js dengan menyuntikkan mock object global seperti `globalThis.localStorage`.
- **Dinamika Geometri SVG**: Memahami cara memanipulasi koordinat path SVG `<path d="M... L..."/>` secara terprogram untuk menggambar kurva tren data murni dari JavaScript.

---

## 5. Apa yang Ingin Saya Lakukan Secara Berbeda (What I Would Do Differently)
- **Keamanan Enkripsi Backup**: Menambahkan opsi enkripsi kata sandi (AES) saat mengekspor data cadangan JSON, sehingga data jurnal sensitif pengguna tetap terlindungi ketika disimpan di penyimpanan komputer umum.
- **Transisi ke IndexedDB**: Jika di masa depan pengguna ingin menambahkan stiker gambar kustom atau foto asli ke dalam scrapbook, saya akan bermigrasi dari LocalStorage (kuota 5MB) ke IndexedDB yang mendukung penyimpanan media biner berukuran besar.
- **Tema Kustomisasi**: Menambahkan pemilih palet warna kustom sehingga pengguna dapat mengubah visual scrapbook dari tema Pastel Cerah ke tema Retro Vintage sesuai kepribadian mereka.

---

## 6. Tantangan yang Dihadapi & Solusinya (Challenges Faced)
- **CORS Error ES Modules**: Saat membuka file `index.html` langsung dari browser lokal (`file:///`), ES modules terblokir oleh aturan keamanan browser. Solusinya adalah menjalankan server web HTTP bawaan Python di port 8000.
- **Uncontrolled Browser Alert**: Selama pengujian otomatis, instruksi `alert()` bawaan browser memblokir eksekusi naskah otomatis peramban. Ini diselesaikan dengan memastikan naskah verifikasi menangani dialog peramban atau merancang notifikasi non-blocking di masa mendatang.
- **Hak Akses Token Git**: Saat mencoba mengunggah berkas konfigurasi GitHub Actions, token PAT menolak karena ketiadaan hak akses `workflow`. Solusinya adalah mendorong semua kode fitur utama ke remote, dan membiarkan pengguna melakukan push lokal untuk berkas alur kerja CI/CD.
