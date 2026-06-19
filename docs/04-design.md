# Design Document — Moody (Digital Scrapbook Journal)

## Sources Read
- [01-requirements.md](file:///C:/Users/User/.gemini/antigravity/scratch/moody-journal/docs/01-requirements.md)
- [02-prd.md](file:///C:/Users/User/.gemini/antigravity/scratch/moody-journal/docs/02-prd.md)
- [03-vertical-slice-issues.md](file:///C:/Users/User/.gemini/antigravity/scratch/moody-journal/docs/03-vertical-slice-issues.md)

---

## 1. Visual Theme: Digital Scrapbook Journal
Aplikasi web ini menggunakan visualisasi jurnal fisik (bullet journal/scrapbook) dengan gaya **Kawaii**:
*   **Kanvas (Background)**: Warna dasar krem/putih hangat (`#FDFBF7`) dengan grid titik halus (`radial-gradient` CSS) menyerupai kertas bullet journal.
*   **Tipografi**:
    *   *Judul*: Font tulisan tangan tebal dan bulat (*Fredoka* atau *Chewy*).
    *   *Catatan/Isi*: Font tulisan pulpen/fineliner yang rapi (*Patrick Hand* atau *Kalam*).
    *   *Warna Teks*: Navy tua/charcoal (`#1B263B`) untuk kontras tinggi yang ramah mata dibanding hitam pekat.
*   **Elemen Desain**:
    *   *Sticky Notes*: Kotak pastel (pink, kuning, biru, hijau) dengan rotasi kecil acak (-2 hingga +2 derajat) dan bayangan lembut agar terlihat melayang (3D).
    *   *Washi Tape*: Garis persegi semi-transparan dengan pinggiran bergigi (efek robek) yang menempelkan catatan/elemen.
    *   *Navigasi*: Tab samping/atas bergaya pembatas kertas folder index fisik yang melengkung.
    *   *Stickers*: Emojis dan ikon 2D datar dengan outline tebal sebagai perwakilan suasana hati (mood).

---

## 2. Technology Stack Decision
*   **Bahasa Utama**: HTML5, CSS3, dan JavaScript (ES6+).
*   **Fonts**: Outfit (Sistem/Interface), Fredoka (Headings), Patrick Hand (Editor & Journal body).
*   **Font Loader**: Google Fonts API.
*   **Penyimpanan**: Browser `localStorage` (offline-first, no account setup).
*   **Grafik & Visualisasi**: Inline SVG murni yang digambar secara terprogram menggunakan JavaScript (bebas pustaka eksternal seperti Chart.js untuk kecepatan muat instan).

---

## 3. File & Module Structure
Mengikuti prinsip **codebase-design**, kode dibagi menjadi modul-modul mendalam (deep modules) dengan permukaan interface seminimal mungkin untuk menyembunyikan detail implementasi:

```
moody-journal/
├── docs/
│   ├── 01-requirements.md
│   ├── 02-prd.md
│   ├── 03-vertical-slice-issues.md
│   └── 04-design.md
├── js/
│   ├── storage.js          # Modul Penyimpanan (Deep: membaca/menulis LocalStorage)
│   ├── stats.js            # Modul Analisis (Deep: kalkulasi streak, SVG, tags)
│   └── router.js           # Modul Navigasi (Deep: penanganan routing SPA & animasi tab)
├── index.html              # UI Shell markup
├── style.css               # Desain Visual, Kisi Dotted, Layout, dan Animasi
└── app.js                  # Pemicu Utama (Entry Point / Glue)
```

---

## 4. Module Interface & Seams

### Modul Penyimpanan (`js/storage.js`)
Modul ini bertugas mengelola siklus hidup data jurnal di `localStorage`.
*   **Interface (Seam)**:
    ```javascript
    export const JournalStorage = {
      getAllEntries: () => JournalEntry[],
      saveEntry: (entryData) => JournalEntry,
      deleteEntry: (id) => boolean,
      importData: (jsonString) => boolean
    };
    ```
*   **Kedalaman (Depth)**: Menyembunyikan validasi JSON, pembuatan ID unik (`crypto.randomUUID`), penanganan kesalahan kuota LocalStorage, dan konversi tanggal menjadi objek terstandarisasi.

### Modul Analisis (`js/stats.js`)
Modul ini menghitung metrik statistik dan menghasilkan representasi visual mentah untuk dashboard.
*   **Interface (Seam)**:
    ```javascript
    export const JournalStats = {
      getStreak: (entries) => number,
      getTagFrequency: (entries) => { tag: string, count: number }[],
      getMoodMetrics: (entries) => { mood: string, percentage: number }[],
      generateMoodTrendPath: (entries, width, height) => { points: string, gridLines: string[] },
      getMonthlyContributionMap: (entries) => { dateStr: string, mood: string }[]
    };
    ```
*   **Kedalaman (Depth)**: Menyembunyikan perhitungan algoritma streak harian yang rumit (mendeteksi jeda waktu hari), agregasi statistik, serta perhitungan geometri matematika koordinat X/Y untuk melukis path garis SVG.

---

## 5. Data Model
Satu entri jurnal didefinisikan sebagai objek JSON dengan skema berikut:

```typescript
interface JournalEntry {
  id: string;          // ID unik UUID
  title: string;       // Judul jurnal (opsional)
  content: string;     // Isi tulisan harian (wajib)
  mood: string;        // Opsi: 'awesome', 'good', 'neutral', 'bad', 'awful'
  tags: string[];      // Array label string
  date: string;        // Stempel waktu ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
}
```

---

## 6. UI Wireframe / Layout Sketch (Text-based)

```
+-------------------------------------------------------+
|  [Logo: Moody]                         (Mode Lokal)   |
+-------------------------------------------------------+
|                                                       |
|  [TAB: Menulis]   [TAB: Riwayat]   [TAB: Analisis]    |
|  (Tapped/Index folder style tabs at top or right)    |
|                                                       |
|  +-------------------------------------------------+  |
|  | [STICKY NOTE]                                   |  |
|  |                                                 |  |
|  |  Judul Jurnal: [______________________________] |  |
|  |                                                 |  |
|  |  Suasana Hati:                                  |  |
|  |  [ Awesome ] [ Good ] [ Okay ] [ Sad ] [ Bad ]  |  |
|  |                                                 |  |
|  |  Catatan Hari Ini:                              |  |
|  |  +-------------------------------------------+  |  |
|  |  |                                           |  |  |
|  |  |                                           |  |  |
|  |  +-------------------------------------------+  |  |
|  |                                                 |  |
|  |  Tag: [___________] [+]                         |  |
|  |  (Tag Pills: [kerja x] [santai x])              |  |
|  |                                                 |  |
|  |                    [ Simpan Jurnal ]            |  |
|  +-------------------------------------------------+  |
|                                                       |
+-------------------------------------------------------+
```

---

## 7. User Flows

### Alur Penyimpanan Jurnal
1. Pengguna memasukkan judul, isi jurnal, memilih mood, dan memasukkan tags.
2. Klik tombol "Simpan Jurnal".
3. Validasi berjalan (isi wajib diisi).
4. `JournalStorage.saveEntry` dipanggil untuk mengemas objek, membuat ID baru, menyimpannya ke `localStorage`, dan mengosongkan formulir.
5. Antarmuka beralih ke tab "Riwayat Jurnal" dengan animasi kertas bergeser.

### Alur Analisis Data
1. Pengguna membuka tab "Analisis Mood".
2. Aplikasi memuat seluruh data entri lewat `JournalStorage.getAllEntries`.
3. `JournalStats` menghitung streak menulis, menghitung distribusi mood, dan menghasilkan array koordinat grafik.
4. Kode DOM menggambar grafik SVG dan grid kontribusi 30 kotak hari secara dinamis.

---

## 8. Important Trade-offs

### 1. LocalStorage vs. IndexedDB
*   **Pilihan**: LocalStorage.
*   **Alasan**: Struktur data Moody murni berupa teks ringkas (tanpa media/gambar) karena keputusan cakupan awal. LocalStorage jauh lebih sederhana untuk diimplementasikan, sangat andal, dan memiliki interface sinkron yang mudah diuji dibandingkan IndexedDB yang asinkron.
*   **Risiko**: Batasan kuota 5MB. Namun, 5MB dapat menampung lebih dari 2.500 entri jurnal teks biasa, cukup untuk penggunaan bertahun-tahun.

### 2. Grafik SVG Mandiri vs. Pustaka Grafik (Chart.js / D3)
*   **Pilihan**: SVG Inline buatan sendiri (Custom).
*   **Alasan**: Menghilangkan dependensi eksternal, membuat berkas tetap berukuran kecil (kB saja), dan memberikan kebebasan kustomisasi gaya visual scrapbook sepenuhnya (seperti membuat garis bergelombang/sketsa pulpen dan gradasi warna pastel kustom menggunakan filter CSS/SVG).
*   **Risiko**: Memerlukan matematika koordinat buatan sendiri di JavaScript, namun logikanya sangat sederhana karena datanya terbatas (hanya tren mood harian).
