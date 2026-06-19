# Walkthrough — Moody (Digital Scrapbook Journal)

Dokumen ini mendokumentasikan hasil implementasi dan pembuktian fungsionalitas aplikasi **Moody** setelah menyelesaikan seluruh siklus pengerjaan isu.

---

## 1. Perubahan Berkas Utama
Aplikasi ini telah selesai dibangun menggunakan struktur modular murni tanpa pustaka luar (zero-dependencies) demi keringanan beban kerja di sisi klien:
*   [index.html](file:///C:/Users/User/.gemini/antigravity/scratch/moody-journal/index.html) — Kerangka antarmuka bertema digital scrapbook kawaii dengan grid titik, form catatan, bilah navigasi tab folder index, dashboard visualisasi SVG, panel impor/ekspor, dan detail modal penayangan.
*   [style.css](file:///C:/Users/User/.gemini/antigravity/scratch/moody-journal/style.css) — Seluruh kode gaya sistem visual, variabel warna HSL mood pastel, visual washi tape robek menggunakan *clip-path*, efek rotasi *sticky notes*, polaroid kartu jurnal, transisi transisi SPA, dan media kueri responsif.
*   [app.js](file:///C:/Users/User/.gemini/antigravity/scratch/moody-journal/app.js) — Logika pengendali utama (Controller) untuk rendering antarmuka, penanganan *event*, manajemen masukan tag editor, modal detail jurnal, dan trigger utilitas impor/ekspor.
*   [js/storage.js](file:///C:/Users/User/.gemini/antigravity/scratch/moody-journal/js/storage.js) — Modul penyimpanan *deep* yang membungkus serialisasi dan deserialisasi LocalStorage browser, validasi skema data, penanganan penghapusan, dan penggabungan impor JSON.
*   [js/stats.js](file:///C:/Users/User/.gemini/antigravity/scratch/moody-journal/js/stats.js) — Modul kalkulator statistik *deep* yang menghitung jumlah hari berturut-turut menulis (streak harian), agregasi tag, persentase mood, penggambaran koordinat garis path SVG, serta grid piksel kontribusi 30 hari.

---

## 2. Hasil Verifikasi Fitur & Pembuktian Manual

### A. Navigasi SPA & Tema Visual
- **Tindakan**: Mengklik tab "✍️ Tulis Jurnal", "📖 Buku Harian", dan "📊 Tren & Statistik".
- **Hasil**: Konten panel berganti seketika dengan animasi meluncur dan memudar yang sangat mulus. Latar belakang krem bertekstur grid titik, layout washi tape robek, serta rotasi kecil pada elemen kartu memproyeksikan visual scrapbook fisik berkualitas premium.

### B. Pencatatan Jurnal & Penanganan Tag (Issue 2)
- **Tindakan**: Memasukkan judul, memilih mood "Awesome" (🥰), menulis teks isi jurnal, mengetik tag "kerja" dan "santai" (menekan Enter untuk menambahkan), kemudian menekan "Simpan Jurnal".
- **Hasil**:
  - Validasi formulir berfungsi dengan baik (jika kolom isi kosong, tombol simpan tidak berjalan dan memperingatkan pengguna).
  - Penambahan dan penghapusan tag pill di editor berjalan mulus.
  - Setelah diklik simpan, notifikasi toast cantik "Jurnal Tersimpan! 🧸" muncul di atas layar, form dikosongkan kembali, dan antarmuka otomatis dialihkan ke halaman "Buku Harian".

### C. Penyimpanan & Riwayat Jurnal (Issue 3 & 4)
- **Tindakan**: Memeriksa penyimpanan LocalStorage dan daftar riwayat entri.
- **Hasil**:
  - Kunci `moody_entries` terbuat di LocalStorage dengan format array JSON yang terisi data entri yang baru saja dibuat.
  - Entri dirender sebagai kartu polaroid lucu dengan kemiringan rotasi acak. Sisi atas dihiasi washi tape kuning/pink bergigi robek, dan area foto diisi warna pastel dan emoji sesuai suasana hati.
  - Mengetik pada kolom pencarian langsung menyaring kartu secara real-time berdasarkan teks judul, isi, maupun tag.
  - Mengklik tombol filter mood di atas menyaring daftar entri berdasarkan mood tertentu.
  - Mengklik tombol trash (🗑️) memunculkan dialog konfirmasi dan berhasil menghapus entri dari LocalStorage serta layar secara instan.

### D. Tampilan Detail Jurnal (Issue 5)
- **Tindakan**: Mengklik salah satu kartu polaroid di halaman Buku Harian.
- **Hasil**: Overlay modal detail terbuka di tengah layar dengan efek transisi pop-up. Modal menampilkan seluruh detail catatan dengan format line breaks (`white-space: pre-wrap`), stempel waktu hari/jam yang lengkap, badge mood yang menyala, dan daftar tag. Menekan tombol `×`, mengklik area luar modal, atau menekan tombol `Escape` di keyboard berhasil menutup modal dengan aman.

### E. Dashboard Analisis & SVG (Issue 6 & 7)
- **Tindakan**: Membuat beberapa entri di tanggal yang berbeda dan mengunjungi panel Tren & Statistik.
- **Hasil**:
  - **Streak**: Menampilkan jumlah hari berturut-turut menulis jurnal dengan benar.
  - **Top Tags**: Mengagregasi frekuensi tag yang paling sering ditulis dan menampilkannya sebagai grafik batang horizontal berwarna pastel dengan persentase lebar yang dinamis.
  - **Tren SVG**: Grafik garis SVG dinamis menghubungkan titik-titik koordinat tingkat suasana hati dari waktu ke waktu secara presisi. Setiap titik dihiasi lingkaran berpendar berwarna sesuai mood entri.
  - **Pixel Mood**: Grid 30 hari diisi dengan kotak-kotak piksel kecil. Hari di mana jurnal ditulis akan diwarnai sesuai dengan mood hari tersebut, sementara hari yang kosong tetap berwarna abu-abu.

### F. Impor / Ekspor Cadangan
- **Tindakan**: Mengekspor data ke berkas JSON lalu mengimpornya kembali.
- **Hasil**:
  - Mengekspor menghasilkan unduhan file format `moody-journal-backup-YYYY-MM-DD.json` berisi data mentah terstruktur.
  - Mengimpor file tersebut lewat pemilih file lokal berhasil membaca, memvalidasi skema data, menyimpannya di LocalStorage, memperbarui statistik secara real-time, dan mengalihkan halaman ke Buku Harian.
