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
    
    const newEntry = {
      id: (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      title: entry.title ? entry.title.trim() : '',
      content: entry.content ? entry.content.trim() : '',
      mood: entry.mood || 'neutral',
      tags: Array.isArray(entry.tags) ? entry.tags.map(t => t.trim().toLowerCase()).filter(Boolean) : [],
      date: entry.date || new Date().toISOString()
    };
    
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
  }
};
