const KEY = 'moody_entries';

export const JournalStorage = {
  // Ambil semua entri jurnal dari LocalStorage
  getAllEntries() {
    try {
      const data = localStorage.getItem(KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error reading from localStorage:", e);
      return [];
    }
  },

  // Simpan entri baru
  saveEntry(entry) {
    const entries = this.getAllEntries();
    const newEntry = this._normalizeEntry(entry);
    entries.unshift(newEntry); // Tempatkan di atas (terbaru)
    localStorage.setItem(KEY, JSON.stringify(entries));
    return newEntry;
  },

  // Hapus entri berdasarkan ID
  deleteEntry(id) {
    let entries = this.getAllEntries();
    const initialLength = entries.length;
    entries = entries.filter(item => item.id !== id);
    if (entries.length < initialLength) {
      localStorage.setItem(KEY, JSON.stringify(entries));
      return true;
    }
    return false;
  },

  // Impor data dari string JSON
  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!Array.isArray(data)) return false;
      
      // Minimal validation: each entry must have content
      for (const entry of data) {
        if (!entry.content) return false;
      }

      // Merge data (avoid duplicates based on ID or if no ID, generate one)
      const existing = this.getAllEntries();
      const existingIds = new Set(existing.map(e => e.id));
      
      const newEntries = data.map(entry => this._normalizeEntry(entry));

      // Merge and save
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
  },

  // Helper untuk melakukan normalisasi objek entri sesuai dengan skema
  _normalizeEntry(entry) {
    return {
      id: entry.id || ((window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : Math.random().toString(36).substring(2, 9)),
      title: entry.title ? entry.title.trim() : '',
      content: entry.content ? entry.content.trim() : '',
      mood: entry.mood || 'neutral',
      tags: Array.isArray(entry.tags) ? entry.tags.map(t => t.trim().toLowerCase()).filter(Boolean) : [],
      date: entry.date || new Date().toISOString()
    };
  }
};
