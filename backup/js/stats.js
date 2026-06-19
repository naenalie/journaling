export const JournalStats = {
  // Hitung jumlah hari berturut-turut menulis jurnal
  getStreak(entries) {
    if (!entries || entries.length === 0) return 0;

    // Ambil tanggal unik format YYYY-MM-DD
    const dates = [...new Set(entries.map(entry => {
      const d = new Date(entry.date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }))].sort((a, b) => new Date(b) - new Date(a)); // Urutan dari terbaru

    const todayStr = this._getLocalDateStr(new Date());
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = this._getLocalDateStr(yesterday);

    // Jika entri terbaru bukan hari ini atau kemarin, streak putus (0)
    if (dates[0] !== todayStr && dates[0] !== yesterdayStr) {
      return 0;
    }

    let streak = 0;
    let checkDate = new Date(dates[0]); // Mulai dari tanggal entri terdekat

    while (true) {
      const checkStr = this._getLocalDateStr(checkDate);
      if (dates.includes(checkStr)) {
        streak++;
        // Mundur 1 hari
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  },

  // Hitung frekuensi tag (mengembalikan array terurut {name, count})
  getTagFrequency(entries) {
    if (!entries) return [];
    
    const freq = {};
    entries.forEach(entry => {
      if (Array.isArray(entry.tags)) {
        entry.tags.forEach(tag => {
          const t = tag.trim().toLowerCase();
          if (t) freq[t] = (freq[t] || 0) + 1;
        });
      }
    });

    return Object.keys(freq)
      .map(tag => ({ name: tag, count: freq[tag] }))
      .sort((a, b) => b.count - a.count);
  },

  // Hitung persentase suasana hati
  getMoodMetrics(entries) {
    if (!entries || entries.length === 0) return [];
    
    const counts = { awesome: 0, good: 0, neutral: 0, bad: 0, awful: 0 };
    entries.forEach(entry => {
      if (counts[entry.mood] !== undefined) {
        counts[entry.mood]++;
      }
    });

    const total = entries.length;
    return Object.keys(counts).map(mood => ({
      mood: mood,
      count: counts[mood],
      percentage: Math.round((counts[mood] / total) * 100)
    }));
  },

  // Buat path SVG garis tren mood (ambil maksimal 10 entri terbaru)
  generateMoodTrendPath(entries, width = 500, height = 200) {
    if (!entries || entries.length < 2) return null;

    // Ambil maks 10 entri terbaru, lalu urutkan kronologis (terlama ke terbaru)
    const trendEntries = [...entries].slice(0, 10).reverse();
    const moodValues = { awful: 1, bad: 2, neutral: 3, good: 4, awesome: 5 };

    const paddingX = 40;
    const paddingY = 30;
    const chartWidth = width - paddingX * 2;
    const chartHeight = height - paddingY * 2;

    const points = [];
    const stepX = trendEntries.length > 1 ? chartWidth / (trendEntries.length - 1) : chartWidth;

    trendEntries.forEach((entry, i) => {
      const val = moodValues[entry.mood] || 3;
      const x = paddingX + i * stepX;
      // Nilai 5 (awesome) ada di atas (y kecil), Nilai 1 (awful) ada di bawah (y besar)
      const y = paddingY + chartHeight - ((val - 1) / 4) * chartHeight;
      points.push({ x, y, mood: entry.mood, date: new Date(entry.date) });
    });

    // Buat koordinat path
    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathD += ` L ${points[i].x} ${points[i].y}`;
    }

    return {
      points: points,
      pathD: pathD
    };
  },

  // Buat kalender kontribusi 30 hari terakhir
  getMonthlyContributionMap(entries) {
    const map = {};
    
    // Inisialisasi 30 hari terakhir
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = this._getLocalDateStr(d);
      map[dateStr] = null; // Default kosong
    }

    // Isi dari entri (ambil entri terbaru di hari itu)
    entries.forEach(entry => {
      const d = new Date(entry.date);
      const dateStr = this._getLocalDateStr(d);
      if (map[dateStr] !== undefined && !map[dateStr]) {
        map[dateStr] = entry.mood;
      }
    });

    return Object.keys(map).map(dateStr => ({
      date: dateStr,
      mood: map[dateStr]
    }));
  },

  // Helper mendapatkan format YYYY-MM-DD lokal
  _getLocalDateStr(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
};
