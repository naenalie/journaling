import { JournalStorage } from './js/storage.js';
import { JournalStats } from './js/stats.js';

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  let activeMood = 'neutral';
  let editorTags = [];
  let currentFilterMood = 'all';
  let currentSearchQuery = '';

  // ==========================================
  // DOM ELEMENT REFERENCES
  // ==========================================
  // Navigation
  const tabDividers = document.querySelectorAll('.tab-divider');
  const panels = document.querySelectorAll('.panel-section');

  // Form Editor
  const journalForm = document.getElementById('journal-form');
  const titleInput = document.getElementById('journal-title');
  const contentInput = document.getElementById('journal-content');
  const moodStickerBtns = document.querySelectorAll('.mood-sticker-btn');
  const tagInput = document.getElementById('tag-input');
  const btnAddTag = document.getElementById('btn-add-tag');
  const editorTagList = document.getElementById('editor-tag-list');
  const btnSaveJournal = document.getElementById('btn-save-journal');

  // History List
  const searchInput = document.getElementById('search-input');
  const moodFilterBtns = document.querySelectorAll('.mood-filter-btn');
  const entriesContainer = document.getElementById('journal-entries-container');

  // Stats Dashboard
  const statsStreakNum = document.getElementById('stats-streak-num');
  const statsStreakDesc = document.getElementById('stats-streak-desc');
  const statsTagsContainer = document.getElementById('stats-tags-container');
  const moodTrendSvg = document.getElementById('mood-trend-svg');
  const chartPlaceholder = document.getElementById('chart-placeholder');
  const contributionCalendar = document.getElementById('contribution-calendar');
  const btnExport = document.getElementById('btn-export');
  const importFile = document.getElementById('import-file');

  // Modal
  const detailModal = document.getElementById('detail-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDate = document.getElementById('modal-date');
  const modalMoodBadge = document.getElementById('modal-mood-badge');
  const modalContent = document.getElementById('modal-content');
  const modalTagList = document.getElementById('modal-tag-list');

  // Toast
  const toastSticker = document.getElementById('toast-sticker');
  const toastMessage = document.getElementById('toast-message');

  // ==========================================
  // SPA ROUTING & PANEL NAVIGATION
  // ==========================================
  tabDividers.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPanelId = tab.getAttribute('data-target');
      switchPanel(targetPanelId);
    });
  });

  function switchPanel(panelId) {
    // Update active tab divider
    tabDividers.forEach(tab => {
      if (tab.getAttribute('data-target') === panelId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Update active section panel
    panels.forEach(panel => {
      if (panel.id === panelId) {
        panel.style.display = 'block';
        panel.offsetHeight; // Trigger layout reflow for animation
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
        setTimeout(() => {
          if (!panel.classList.contains('active')) {
            panel.style.display = 'none';
          }
        }, 350);
      }
    });

    // Re-render data if navigating to specific pages
    if (panelId === 'panel-history') {
      renderHistory();
    } else if (panelId === 'panel-analytics') {
      renderAnalytics();
    }
  }

  // ==========================================
  // TOAST STICKER HELPER
  // ==========================================
  function showToast(message, emoji = '✨') {
    toastMessage.textContent = message;
    toastSticker.querySelector('.toast-icon').textContent = emoji;
    toastSticker.classList.remove('hidden');
    
    // Auto hide after 2.5 seconds
    setTimeout(() => {
      toastSticker.classList.add('hidden');
    }, 2500);
  }

  // ==========================================
  // ISSUE 2: EDITOR & TAG PILLS LOGIC
  // ==========================================
  // Mood selection click
  moodStickerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      moodStickerBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeMood = btn.getAttribute('data-mood');
    });
  });

  // Adding tags function
  function addEditorTag() {
    const rawValue = tagInput.value.trim().toLowerCase();
    if (rawValue) {
      // Split by comma or space if user enters multiples
      const newTags = rawValue.split(/[\s,]+/).filter(Boolean);
      newTags.forEach(tag => {
        if (!editorTags.includes(tag) && editorTags.length < 8) {
          editorTags.push(tag);
        }
      });
      tagInput.value = '';
      renderEditorTags();
    }
  }

  // Render tag pills inside editor
  function renderEditorTags() {
    editorTagList.innerHTML = '';
    editorTags.forEach((tag, idx) => {
      const pill = document.createElement('span');
      pill.className = 'tag-pill';
      pill.innerHTML = `#${tag} <button type="button" class="btn-remove-tag" data-index="${idx}">&times;</button>`;
      editorTagList.appendChild(pill);
    });

    // Attach deletion listener on remove buttons
    editorTagList.querySelectorAll('.btn-remove-tag').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.getAttribute('data-index'));
        editorTags.splice(index, 1);
        renderEditorTags();
      });
    });
  }

  // Handle Enter on tag input
  tagInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEditorTag();
    }
  });

  // Handle "+" button click
  btnAddTag.addEventListener('click', (e) => {
    e.preventDefault();
    addEditorTag();
  });

  // ==========================================
  // ISSUE 3 & 4: SAVING & HISTORY RENDERING
  // ==========================================
  // Handle Save
  btnSaveJournal.addEventListener('click', (e) => {
    e.preventDefault();
    
    const content = contentInput.value.trim();
    if (!content) {
      showToast('Isi catatan tidak boleh kosong!', '⚠️');
      contentInput.focus();
      return;
    }

    const title = titleInput.value.trim();
    const entry = {
      title: title,
      content: content,
      mood: activeMood,
      tags: editorTags
    };

    // Save using storage module
    JournalStorage.saveEntry(entry);
    showToast('Jurnal tersimpan! 🧸', '✨');

    // Reset Form States
    titleInput.value = '';
    contentInput.value = '';
    editorTags = [];
    renderEditorTags();
    activeMood = 'neutral';
    moodStickerBtns.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-mood') === 'neutral') {
        btn.classList.add('active');
      }
    });

    // Redirect to History
    setTimeout(() => {
      switchPanel('panel-history');
    }, 400);
  });

  // Render History Card List
  function renderHistory() {
    const entries = JournalStorage.getAllEntries();
    entriesContainer.innerHTML = '';

    // Apply Search and Mood Filter
    const filtered = entries.filter(entry => {
      // 1. Mood filter matching
      const moodMatches = currentFilterMood === 'all' || entry.mood === currentFilterMood;
      
      // 2. Search keyword matching (title, content, tags)
      const query = currentSearchQuery.toLowerCase().trim();
      const contentMatches = !query || 
        entry.title.toLowerCase().includes(query) || 
        entry.content.toLowerCase().includes(query) || 
        entry.tags.some(tag => tag.toLowerCase().includes(query));

      return moodMatches && contentMatches;
    });

    if (filtered.length === 0) {
      entriesContainer.innerHTML = `<div class="empty-state">Belum ada catatan yang cocok. Tulis jurnal barumu hari ini! 🧸</div>`;
      return;
    }

    filtered.forEach(entry => {
      const card = document.createElement('div');
      card.className = 'polaroid-card';
      card.setAttribute('data-mood', entry.mood);
      card.setAttribute('data-id', entry.id);

      // Mood Emojis Mapping
      const emojiMap = { awesome: '🥰', good: '🙂', neutral: '😐', bad: '🙁', awful: '😭' };
      const dateText = formatDate(entry.date);

      // Compile tag pills HTML
      const tagsHtml = entry.tags.map(t => `<span class="tag-pill click-tag" data-tag="${t}">#${t}</span>`).join(' ');

      card.innerHTML = `
        <div class="washi-tape"></div>
        <button class="btn-delete-card" data-id="${entry.id}" title="Hapus catatan">🗑️</button>
        <div class="polaroid-photo-area">
          <span class="polaroid-sticker">${emojiMap[entry.mood]}</span>
        </div>
        <div class="polaroid-details">
          <h4 class="polaroid-title">${entry.title || 'Tanpa Judul'}</h4>
          <span class="polaroid-date">${dateText}</span>
          <p class="polaroid-text">${entry.content}</p>
        </div>
        <div class="tag-pills-container" style="margin-top: 8px;">
          ${tagsHtml}
        </div>
      `;

      entriesContainer.appendChild(card);
    });

    // Attach card details modal triggers
    entriesContainer.querySelectorAll('.polaroid-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Prevent modal if clicking tag or delete button
        if (e.target.classList.contains('btn-delete-card') || e.target.classList.contains('click-tag')) {
          return;
        }
        const id = card.getAttribute('data-id');
        openDetailModal(id);
      });
    });

    // Attach tag quick-filters
    entriesContainer.querySelectorAll('.click-tag').forEach(tagEl => {
      tagEl.addEventListener('click', (e) => {
        e.stopPropagation();
        const tag = tagEl.getAttribute('data-tag');
        searchInput.value = tag;
        currentSearchQuery = tag;
        renderHistory();
      });
    });

    // Attach deletion button handlers
    entriesContainer.querySelectorAll('.btn-delete-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        if (confirm('Apakah Anda yakin ingin menghapus catatan jurnal ini secara permanen?')) {
          JournalStorage.deleteEntry(id);
          showToast('Catatan dihapus!', '🗑️');
          renderHistory();
        }
      });
    });
  }

  // Handle Search Input changes
  searchInput.addEventListener('input', () => {
    currentSearchQuery = searchInput.value;
    renderHistory();
  });

  // Handle Mood Quick Filters click
  moodFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      moodFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilterMood = btn.getAttribute('data-filter');
      renderHistory();
    });
  });

  // ==========================================
  // ISSUE 5: ENTRY DETAIL MODAL LOGIC
  // ==========================================
  function openDetailModal(id) {
    const entries = JournalStorage.getAllEntries();
    const entry = entries.find(item => item.id === id);
    if (!entry) return;

    const emojiMap = { awesome: '🥰 Awesome', good: '🙂 Good', neutral: '😐 Neutral', bad: '🙁 Bad', awful: '😭 Awful' };

    modalTitle.textContent = entry.title || 'Tanpa Judul';
    modalDate.textContent = formatDateFull(entry.date);
    modalMoodBadge.textContent = emojiMap[entry.mood];
    modalMoodBadge.setAttribute('data-mood', entry.mood);
    
    // Style modal badge base on mood
    modalMoodBadge.style.backgroundColor = `var(--bg-${entry.mood})`;

    modalContent.textContent = entry.content;

    // Render tag list
    modalTagList.innerHTML = '';
    if (entry.tags && entry.tags.length > 0) {
      entry.tags.forEach(t => {
        const pill = document.createElement('span');
        pill.className = 'tag-pill';
        pill.textContent = `#${t}`;
        modalTagList.appendChild(pill);
      });
    }

    detailModal.classList.add('active');
  }

  function closeModal() {
    detailModal.classList.remove('active');
  }

  btnCloseModal.addEventListener('click', closeModal);
  detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) closeModal();
  });

  // Keyboard accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && detailModal.classList.contains('active')) {
      closeModal();
    }
  });

  // ==========================================
  // ISSUE 6 & 7: ANALYTICS DASHBOARD
  // ==========================================
  function renderAnalytics() {
    const entries = JournalStorage.getAllEntries();

    // 1. Render streak count
    const streak = JournalStats.getStreak(entries);
    statsStreakNum.textContent = streak;
    if (streak > 0) {
      statsStreakDesc.textContent = `Hebat! Anda mencatat beruntun selama ${streak} hari. Pertahankan kebiasaan baik ini!`;
    } else {
      statsStreakDesc.textContent = 'Mulai menulis catatan hari ini untuk membangun rantai streak mencatat Anda!';
    }

    // 2. Render top tags bar charts
    const topTags = JournalStats.getTagFrequency(entries).slice(0, 5);
    statsTagsContainer.innerHTML = '';
    
    if (topTags.length === 0) {
      statsTagsContainer.innerHTML = `<div style="text-align:center; padding: 10px; color: var(--color-muted); font-family: 'Patrick Hand'; font-size: 1.1rem;">Belum ada tag yang digunakan.</div>`;
    } else {
      const maxCount = topTags[0].count;
      topTags.forEach(tag => {
        const percent = Math.round((tag.count / maxCount) * 100);
        const item = document.createElement('div');
        item.className = 'stats-bar-item';
        item.innerHTML = `
          <div class="stats-bar-label-row">
            <span class="stats-bar-label">#${tag.name}</span>
            <span class="stats-bar-count">${tag.count} kali</span>
          </div>
          <div class="stats-bar-outer">
            <div class="stats-bar-inner" style="width: ${percent}%;"></div>
          </div>
        `;
        statsTagsContainer.appendChild(item);
      });
    }

    // 3. Render SVG Mood Line Chart
    renderSvgChart(entries);

    // 4. Render 30-Day Contribution Calendar Grid
    renderCalendarGrid(entries);
  }

  function renderSvgChart(entries) {
    moodTrendSvg.innerHTML = '';
    
    // We need at least 2 entries to draw a line
    if (!entries || entries.length < 2) {
      chartPlaceholder.style.display = 'flex';
      moodTrendSvg.style.display = 'none';
      return;
    }

    chartPlaceholder.style.display = 'none';
    moodTrendSvg.style.display = 'block';

    const width = 500;
    const height = 200;
    const trendData = JournalStats.generateMoodTrendPath(entries, width, height);
    
    if (!trendData) return;

    const { points, pathD } = trendData;

    // Draw Y-Axis Guideline grids
    const moodLevels = [
      { y: 30, text: '🥰 Awesome' },
      { y: 67.5, text: '🙂 Good' },
      { y: 105, text: '😐 Neutral' },
      { y: 142.5, text: '🙁 Bad' },
      { y: 180, text: '😭 Awful' }
    ];

    moodLevels.forEach(level => {
      // Draw grid line
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('class', 'svg-grid-line');
      line.setAttribute('x1', '40');
      line.setAttribute('y1', level.y);
      line.setAttribute('x2', '460');
      line.setAttribute('y2', level.y);
      moodTrendSvg.appendChild(line);

      // Draw level text
      const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      txt.setAttribute('class', 'svg-axis-text');
      txt.setAttribute('x', '35');
      txt.setAttribute('y', level.y + 4);
      txt.setAttribute('text-anchor', 'end');
      txt.textContent = level.text.split(' ')[0]; // Just show emoji on axis for mobile/small space
      moodTrendSvg.appendChild(txt);
    });

    // Draw Path line
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('class', 'svg-trend-line');
    path.setAttribute('d', pathD);
    moodTrendSvg.appendChild(path);

    // Draw Dots on points
    const moodColors = {
      awesome: 'var(--accent-purple)',
      good: 'var(--accent-mint)',
      neutral: 'var(--color-navy)',
      bad: 'var(--accent-blue)',
      awful: 'var(--accent-coral)'
    };

    points.forEach(pt => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('class', 'svg-trend-dot');
      circle.setAttribute('cx', pt.x);
      circle.setAttribute('cy', pt.y);
      circle.setAttribute('fill', `var(--bg-${pt.mood})`);
      circle.setAttribute('stroke', moodColors[pt.mood]);
      
      // Simple tooltip overlay simulation
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = `${pt.mood.toUpperCase()} - ${formatDateShort(pt.date)}`;
      circle.appendChild(title);

      moodTrendSvg.appendChild(circle);
    });
  }

  function renderCalendarGrid(entries) {
    contributionCalendar.innerHTML = '';
    const last30Days = JournalStats.getMonthlyContributionMap(entries);

    last30Days.forEach(day => {
      const box = document.createElement('div');
      box.className = 'calendar-day-box';
      if (day.mood) {
        box.setAttribute('data-mood', day.mood);
      }

      // Tooltip date description
      const d = new Date(day.date);
      const textDate = formatDateShort(d);
      box.title = `${textDate} : ${day.mood ? day.mood.toUpperCase() : 'Tidak ada catatan'}`;
      
      contributionCalendar.appendChild(box);
    });
  }

  // ==========================================
  // DATA BACKUP (EXPORT/IMPORT JSON)
  // ==========================================
  // Export Data JSON
  btnExport.addEventListener('click', () => {
    const entries = JournalStorage.getAllEntries();
    if (entries.length === 0) {
      showToast('Tidak ada catatan untuk diekspor.', '⚠️');
      return;
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `moody-journal-backup-${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('Berhasil diekspor! 📥', '✨');
  });

  // Import Data JSON
  importFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
      const content = event.target.result;
      const success = JournalStorage.importData(content);
      if (success) {
        showToast('Data berhasil diimpor! 📤', '✨');
        // Clear input file value
        importFile.value = '';
        // Switch to history panel
        setTimeout(() => {
          switchPanel('panel-history');
        }, 800);
      } else {
        showToast('Gagal memproses file. Pastikan format valid.', '❌');
      }
    };
    reader.readAsText(file);
  });

  // ==========================================
  // HELPER DATE FORMATTERS
  // ==========================================
  function formatDate(isoString) {
    const date = new Date(isoString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  }

  function formatDateFull(isoString) {
    const date = new Date(isoString);
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('id-ID', options);
  }

  function formatDateShort(dateObj) {
    const options = { day: 'numeric', month: 'short' };
    return dateObj.toLocaleDateString('id-ID', options);
  }

  // ==========================================
  // APP INITIALIZATION
  // ==========================================
  // Render tags in editor initially
  renderEditorTags();
  
  // Set default panel active
  switchPanel('panel-editor');
});
