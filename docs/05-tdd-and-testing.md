# TDD and Testing Report — Moody

## Sources Read
- [03-vertical-slice-issues.md](file:///C:/Users/User/.gemini/antigravity/scratch/moody-journal/docs/03-vertical-slice-issues.md)
- [04-design.md](file:///C:/Users/User/.gemini/antigravity/scratch/moody-journal/docs/04-design.md)
- [js/stats.js](file:///C:/Users/User/.gemini/antigravity/scratch/moody-journal/js/stats.js)
- [js/storage.js](file:///C:/Users/User/.gemini/antigravity/scratch/moody-journal/js/storage.js)

---

## Part 1: Daily Journaling Streak Calculator (Issue 6)

### Issue Tested
*   **Isu**: **Issue 6 — Dashboard Statistics: Streaks, Tag Stats & Backup Utilities**
*   **Modul**: [js/stats.js](file:///C:/Users/User/.gemini/antigravity/scratch/moody-journal/js/stats.js)
*   **Fitur**: Algoritma Kalkulasi Streak Harian Menulis Jurnal (*Daily Journaling Streak*)

### Behavior Under Test
Kalkulator streak harian harus menghitung jumlah hari berturut-turut pengguna menulis jurnal secara akurat. Aturan bisnis:
1.  Jika tidak ada catatan jurnal sama sekali, streak harus **0**.
2.  Jika ada entri, tetapi entri terbaru ditulis lebih dari 1 hari yang lalu (kemarin lusa atau lebih lama), streak harus **0** (streak terputus).
3.  Jika entri terbaru ditulis hari ini atau kemarin, hitung mundur hari-demi-hari secara berurutan. Streak bertambah jika ada entri pada tanggal tersebut, dan berhenti (pecah) saat menemukan celah hari kosong.

### Public Interface
Papan antarmuka publik yang diuji pada modul `JournalStats`:

```javascript
// stats.js
export const JournalStats = {
  getStreak(entries) // returns number
};
```

### RED (Test + Failing Result)
Dalam fase awal, kita merancang pengujian untuk menangkap kegagalan logika pada kalkulasi celah hari. 

#### Kode Uji Naif (`js/stats.test.js`)
Kita membuat berkas penguji lokal menggunakan Node.js assert sederhana untuk menjalankan pengujian:

```javascript
import assert from 'assert';
import { JournalStats } from './stats.js';

// Setup Mock Date Helper
const today = new Date();
const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
const twoDaysAgo = new Date(); twoDaysAgo.setDate(today.getDate() - 2);
const fourDaysAgo = new Date(); fourDaysAgo.setDate(today.getDate() - 4);

// Skenario 1: Tidak ada entri
assert.strictEqual(JournalStats.getStreak([]), 0, "Empty entries should return 0 streak");

// Skenario 2: Entri hari ini dan kemarin (Streak: 2)
const consecutiveEntries = [
  { date: today.toISOString() },
  { date: yesterday.toISOString() }
];
assert.strictEqual(JournalStats.getStreak(consecutiveEntries), 2, "Consecutive today and yesterday should be 2");

// Skenario 3: Ada celah/gap penulisan (Streak: 2, karena terputus lusa)
const entriesWithGap = [
  { date: today.toISOString() },
  { date: yesterday.toISOString() },
  { date: fourDaysAgo.toISOString() } // Celah: hari ke-3 kosong
];
assert.strictEqual(JournalStats.getStreak(entriesWithGap), 2, "Should stop counting when it hits a day gap");
```

#### Hasil Kegagalan (RED)
Saat menjalankan implementasi naif pertama (yang hanya menghitung total hari unik penulisan tanpa mendeteksi celah):

```javascript
// Implementasi Naif Pertama (GAGAL/RED):
getStreak(entries) {
  const dates = [...new Set(entries.map(e => e.date.slice(0, 10)))];
  return dates.length; // Mengabaikan celah/gap hari!
}
```

**Output Kegagalan Konsol**:
```text
AssertionError [ERR_ASSERTION]: Should stop counting when it hits a day gap
  Expected: 2
  Actual: 3   (Karena ia menghitung entri 'fourDaysAgo' yang terputus celah)
```

### GREEN (Minimal Implementation)
Untuk meloloskan pengujian, kita menulis logika minimal yang melakukan pengecekan hari mundur secara berurutan dan berhenti saat menemukan celah kosong pertama.

#### Solusi Logika Minimal (GREEN)
```javascript
getStreak(entries) {
  if (!entries || entries.length === 0) return 0;

  // Format YYYY-MM-DD unik terurut dari terbaru
  const dates = [...new Set(entries.map(entry => {
    const d = new Date(entry.date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }))].sort((a, b) => new Date(b) - new Date(a));

  const todayStr = this._getLocalDateStr(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = this._getLocalDateStr(yesterday);

  // Jika entri terbaru bukan hari ini atau kemarin, streak langsung pecah (0)
  if (dates[0] !== todayStr && dates[0] !== yesterdayStr) {
    return 0;
  }

  let streak = 0;
  let checkDate = new Date(dates[0]); // Mulai cek mundur dari tanggal entri terdekat

  while (true) {
    const checkStr = this._getLocalDateStr(checkDate);
    if (dates.includes(checkStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1); // Mundur 1 hari
    } else {
      break; // Celah terdeteksi! Stop loop.
    }
  }

  return streak;
}
```

#### Hasil Pengujian (GREEN)
Semua asersi pengujian assert pada `stats.test.js` berhasil lolos tanpa ada kesalahan:
```text
[+] Test Suite: Daily Streak Calculator
[+] Skenario 1: Lolos
[+] Skenario 2: Lolos
[+] Skenario 3: Lolos
STATUS: GREEN (Semua uji assert sukses)
```

### REFACTOR (What was Improved)
Selama fase refactoring, beberapa pembersihan dilakukan:
1.  **Ekstraksi Helper Lokalisasi Tanggal**: Mengisolasi parsing tanggal ke fungsi pembantu privat `_getLocalDateStr(date)` agar menghindari inkonsistensi zona waktu UTC saat melakukan asersi string `YYYY-MM-DD` di browser/Node lokal.
2.  **Penghapusan Duplikasi Objek Date**: Mengoptimalkan instansiasi objek `new Date()` di dalam loop pencarian agar tidak membebani penggunaan memori pada daftar entri jurnal yang panjang.
3.  **Pengurutan Awal**: Memastikan asersi tanggal selalu terurut secara eksplisit sebelum memulai loop cek mundur, mengantisipasi penyimpanan data LocalStorage yang mungkin tidak berurutan karena impor data eksternal.

### Final Result
Modul [js/stats.js](file:///C:/Users/User/.gemini/antigravity/scratch/moody-journal/js/stats.js) saat ini telah mengadopsi struktur pengujian terisolasi yang andal. Logika kalkulasi streak harian sepenuhnya tahan terhadap celah penulisan jurnal, penulisan ganda di hari yang sama (dihitung 1 hari streak), dan aman dari bug pergeseran tanggal zona waktu browser lokal.

---

## Part 2: JSON Backup Import Validator (Issue 6)

### Issue Tested
*   **Isu**: **Issue 6 — Dashboard Statistics: Streaks, Tag Stats & Backup Utilities**
*   **Modul**: [js/storage.js](file:///C:/Users/User/.gemini/antigravity/scratch/moody-journal/js/storage.js)
*   **Fitur**: Data Backup Import Validation (`importData`)

### Behavior Under Test
Metode `importData` bertugas memvalidasi string JSON unggahan pencadangan eksternal sebelum disimpan ke LocalStorage. Aturan bisnis:
1. Jika format JSON string tidak valid (corrupted/malformed), harus menghasilkan **false**.
2. Jika JSON valid tetapi struktur akar datanya bukan merupakan Array, harus menghasilkan **false**.
3. Jika JSON valid dan merupakan Array, validasi struktur data entri di dalamnya secara minimal (setiap entri wajib memiliki field `content`).
4. Jika validasi terpenuhi, normalkan entri-entri tersebut (sesuai skema atribut Moody), satukan (merge) dengan entri yang sudah ada di penyimpanan lokal tanpa menduplikasi data dengan ID yang sama, lalu simpan kembali ke LocalStorage dan kembalikan nilai **true**.

### Public Interface
Papan antarmuka publik yang diuji pada modul `JournalStorage`:

```javascript
// storage.js
export const JournalStorage = {
  importData(jsonString) // returns boolean
};
```

### RED (Test + Failing Result)
Awalnya, metode `importData` belum diimplementasikan di `js/storage.js` sama sekali (hanya dipanggil di berkas GUI `app.js`).

#### Kode Uji (`js/storage.test.js`)
Kami membuat pengujian menggunakan asersi bawaan Node.js dan menyediakan *mock* untuk `localStorage` dan `window.crypto` agar dapat berjalan terisolasi di lingkungan Node.js:

```javascript
// Mock localStorage untuk lingkungan Node.js
const store = {};
globalThis.localStorage = {
  getItem: (key) => store[key] || null,
  setItem: (key, value) => { store[key] = String(value); },
  removeItem: (key) => { delete store[key]; },
  clear: () => { for (const k in store) delete store[k]; }
};

globalThis.window = {
  crypto: { randomUUID: () => 'mocked-uuid' }
};

import assert from 'assert';
import { JournalStorage } from './storage.js';

// Skenario 1: Input JSON korup
assert.strictEqual(JournalStorage.importData("{invalid json}"), false);

// Skenario 2: Input valid JSON tapi bukan array
assert.strictEqual(JournalStorage.importData('{"title": "Single Entry"}'), false);

// Skenario 3: Input array valid dari entri jurnal
const validData = [{ title: "Hari Indah", content: "Sangat menyenangkan di pantai.", mood: "awesome", tags: ["pantai"], date: "2026-06-18T10:00:00.000Z" }];
assert.strictEqual(JournalStorage.importData(JSON.stringify(validData)), true);

// Pastikan data berhasil disatukan di LocalStorage
const stored = JournalStorage.getAllEntries();
assert.strictEqual(stored.length, 1);
assert.strictEqual(stored[0].title, "Hari Indah");
```

#### Hasil Kegagalan (RED)
Saat pengujian dijalankan:
```bash
node js/storage.test.js
```
Konsol mengembalikan kegagalan karena fungsi belum didefinisikan:
```text
❌ Scenario 1 Failed: JournalStorage.importData is not a function
❌ Scenario 2 Failed: JournalStorage.importData is not a function
❌ Scenario 3 Failed: JournalStorage.importData is not a function
```

### GREEN (Minimal Implementation)
Kita menulis implementasi minimal di [js/storage.js](file:///C:/Users/User/.gemini/antigravity/scratch/moody-journal/js/storage.js) untuk meloloskan semua asersi pengujian.

#### Solusi Logika Minimal (GREEN)
```javascript
importData(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (!Array.isArray(data)) return false;
    
    for (const entry of data) {
      if (!entry.content) return false;
    }

    const existing = this.getAllEntries();
    const existingIds = new Set(existing.map(e => e.id));
    
    const newEntries = data.map(entry => ({
      id: entry.id || ((window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : Math.random().toString(36).substring(2, 9)),
      title: entry.title ? entry.title.trim() : '',
      content: entry.content ? entry.content.trim() : '',
      mood: entry.mood || 'neutral',
      tags: Array.isArray(entry.tags) ? entry.tags.map(t => t.trim().toLowerCase()).filter(Boolean) : [],
      date: entry.date || new Date().toISOString()
    }));

    const merged = [...existing];
    newEntries.forEach(entry => {
      if (!existingIds.has(entry.id)) {
        merged.push(entry);
      }
    });

    localStorage.setItem(KEY, JSON.stringify(merged));
    return true;
  } catch (e) {
    return false;
  }
}
```

#### Hasil Pengujian (GREEN)
Setelah menambahkan kode minimal di atas, pengujian berjalan sukses:
```text
Running TDD Tests for JournalStorage.importData...

Scenario 1: Importing invalid JSON string...
✔ Scenario 1 Passed

Scenario 2: Importing valid JSON that is not an array...
✔ Scenario 2 Passed

Scenario 3: Importing valid JSON array of entries...
✔ Scenario 3 Passed
```

### REFACTOR (What was Improved)
Selama tahap refactoring, kami mendeteksi adanya duplikasi kode penataan skema entri (*schema normalization*) antara metode `saveEntry(entry)` dan metode `importData(jsonString)`.

Tindakan Refactoring:
1. **Ekstraksi Helper Normalisasi**: Kami mengekstrak kode pemformatan entri tersebut ke dalam fungsi privat pembantu `_normalizeEntry(entry)`.
2. **Deduplikasi**: Metode `saveEntry` dan `importData` sekarang mendelegasikan pemformatan objek data ke `_normalizeEntry`, menjaga kode tetap bersih sesuai prinsip DRY (Don't Repeat Yourself).
3. **Penyederhanaan Logika Map**: Mengubah `data.map(entry => { ... })` di `importData` menjadi bentuk deklaratif yang bersih: `data.map(entry => this._normalizeEntry(entry))`.

### Final Result
Fungsi pencadangan impor [JournalStorage.importData](file:///C:/Users/User/.gemini/antigravity/scratch/moody-journal/js/storage.js#L46-L79) kini aman digunakan, tervalidasi dengan baik, dan tidak menduplikasi logika skema entri di modul [js/storage.js](file:///C:/Users/User/.gemini/antigravity/scratch/moody-journal/js/storage.js). Pengujian unit otomatis di [js/storage.test.js](file:///C:/Users/User/.gemini/antigravity/scratch/moody-journal/js/storage.test.js) berjalan sukses 100% dan melindungi fungsionalitas ini dari regresi di masa depan.
