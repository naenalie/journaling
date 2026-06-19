import { JournalStorage } from './js/storage.js';
import { JournalStats } from './js/stats.js';

document.addEventListener('DOMContentLoaded', () => {
  // Select navigation tabs and panel sections
  const tabDividers = document.querySelectorAll('.tab-divider');
  const panels = document.querySelectorAll('.panel-section');

  // SPA Tab Switcher
  tabDividers.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPanelId = tab.getAttribute('data-target');
      switchPanel(targetPanelId);
    });
  });

  function switchPanel(panelId) {
    // 1. Toggle Navigation Active Class
    tabDividers.forEach(t => {
      if (t.getAttribute('data-target') === panelId) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    // 2. Toggle Panel Section Active Class with Smooth Fade-in
    panels.forEach(panel => {
      if (panel.id === panelId) {
        panel.style.display = 'block';
        panel.offsetHeight; // Force reflow
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

    // 3. Render content if navigating to history or analytics
    if (panelId === 'panel-history') {
      renderHistory();
    } else if (panelId === 'panel-analytics') {
      renderAnalytics();
    }
  }

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
  const moodStickerBtns = document.querySelectorAll('.mood-sticker-btn');
  const tagInput = document.getElementById('tag-input');
  const btnAddTag = document.getElementById('btn-add-tag');
  const editorTagList = document.getElementById('editor-tag-list');
  const searchInput = document.getElementById('search-input');
  const moodFilterBtns = document.querySelectorAll('.mood-filter-btn');
  const btnSaveJournal = document.getElementById('btn-save-journal');
  const contentInput = document.getElementById('journal-content');
  const titleInput = document.getElementById('journal-title');

  // Modal References
  const detailModal = document.getElementById('detail-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDate = document.getElementById('modal-date');
  const modalMoodBadge = document.getElementById('modal-mood-badge');
  const modalContent = document.getElementById('modal-content');
  const modalTagList = document.getElementById('modal-tag-list');

  // Analytics & Backup References
  const statsStreakNum = document.getElementById('stats-streak-num');
  const statsStreakDesc = document.getElementById('stats-streak-desc');
  const statsTagsContainer = document.getElementById('stats-tags-container');
  const btnExport = document.getElementById('btn-export');
  const importFile = document.getElementById('import-file');

  // ==========================================
  // MOOD SELECTOR WIDGET
  // ==========================================
  moodStickerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      moodStickerBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeMood = btn.getAttribute('data-mood');
    });
  });

  // ==========================================
  // TAG PILLS MANAGER
  // ==========================================
  function addEditorTag() {
    const rawValue = tagInput.value.trim().toLowerCase();
    if (rawValue) {
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

  tagInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEditorTag();
    }
  });

  btnAddTag.addEventListener('click', (e) => {
    e.preventDefault();
    addEditorTag();
  });

  const entriesContainer = document.getElementById('journal-entries-container');

  // ==========================================
  // REAL SAVE LOGIC
  // ==========================================
  btnSaveJournal.addEventListener('click', (e) => {
    e.preventDefault();
    const content = contentInput.value.trim();
    if (!content) {
      alert('Isi catatan tidak boleh kosong! ⚠️');
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

    // Simpan melalui storage module
    JournalStorage.saveEntry(entry);
    alert('Catatan jurnal berhasil disimpan! 🧸');

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

    // Pindah ke tab riwayat
    setTimeout(() => {
      switchPanel('panel-history');
    }, 300);
  });

  // ==========================================
  // HISTORY LIST RENDERING
  // ==========================================
  function renderHistory() {
    if (!entriesContainer) return;
    
    const entries = JournalStorage.getAllEntries();
    entriesContainer.innerHTML = '';

    // Lakukan penyaringan berdasarkan pencarian dan filter mood
    const filtered = entries.filter(entry => {
      const moodMatches = currentFilterMood === 'all' || entry.mood === currentFilterMood;
      
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

      const emojiMap = { awesome: '🥰', good: '🙂', neutral: '😐', bad: '🙁', awful: '😭' };
      const dateText = formatDate(entry.date);
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

    // Event click pada kartu polaroid untuk membuka modal detail
    entriesContainer.querySelectorAll('.polaroid-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-delete-card') || e.target.classList.contains('click-tag')) {
          return;
        }
        const id = card.getAttribute('data-id');
        openDetailModal(id);
      });
    });

    // Event click pada tag pill kartu riwayat untuk pencarian instan
    entriesContainer.querySelectorAll('.click-tag').forEach(tagEl => {
      tagEl.addEventListener('click', (e) => {
        e.stopPropagation();
        const tag = tagEl.getAttribute('data-tag');
        searchInput.value = tag;
        currentSearchQuery = tag;
        renderHistory();
      });
    });

    // Event click tombol hapus kartu
    entriesContainer.querySelectorAll('.btn-delete-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        if (confirm('Apakah Anda yakin ingin menghapus catatan jurnal ini secara permanen?')) {
          JournalStorage.deleteEntry(id);
          renderHistory();
        }
      });
    });
  }

  // Event listener untuk input pencarian teks
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentSearchQuery = searchInput.value;
      renderHistory();
    });
  }

  // Event listener untuk tombol filter mood emoji
  moodFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      moodFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilterMood = btn.getAttribute('data-filter');
      renderHistory();
    });
  });

  // ==========================================
  // DETAIL MODAL FUNCTIONS & LISTENERS
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
    modalMoodBadge.style.backgroundColor = `var(--bg-${entry.mood})`;

    modalContent.textContent = entry.content;

    // Render tag list di modal
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

  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  if (detailModal) {
    detailModal.addEventListener('click', (e) => {
      if (e.target === detailModal) closeModal();
    });
  }

  // Tutup modal menggunakan Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && detailModal && detailModal.classList.contains('active')) {
      closeModal();
    }
  });

  // ==========================================
  // DASHBOARD STATISTICS
  // ==========================================
  function renderAnalytics() {
    const entries = JournalStorage.getAllEntries();

    // 1. Render streak count
    const streak = JournalStats.getStreak(entries);
    if (statsStreakNum) statsStreakNum.textContent = streak;
    if (statsStreakDesc) {
      if (streak > 0) {
        statsStreakDesc.textContent = `Hebat! Anda mencatat beruntun selama ${streak} hari. Pertahankan kebiasaan baik ini!`;
      } else {
        statsStreakDesc.textContent = 'Mulai menulis catatan hari ini untuk membangun rantai streak mencatat Anda!';
      }
    }

    // 2. Render top tags bar charts
    const topTags = JournalStats.getTagFrequency(entries).slice(0, 5);
    if (statsTagsContainer) {
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
    }
  }

  // ==========================================
  // DATA BACKUP (EXPORT/IMPORT JSON)
  // ==========================================
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const entries = JournalStorage.getAllEntries();
      if (entries.length === 0) {
        alert('Tidak ada catatan untuk diekspor.');
        return;
      }

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(entries, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `moody-journal-backup-${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  }

  if (importFile) {
    importFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(event) {
        const content = event.target.result;
        const success = JournalStorage.importData(content);
        if (success) {
          alert('Data berhasil diimpor! 📤');
          importFile.value = '';
          setTimeout(() => {
            switchPanel('panel-history');
          }, 400);
        } else {
          alert('Gagal memproses file. Pastikan format valid.');
        }
      };
      reader.readAsText(file);
    });
  }

  // Helper date formatters
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

  console.log("Moody Issue #6: Streaks, Tags stats & Backup Utilities initialized.");
});
