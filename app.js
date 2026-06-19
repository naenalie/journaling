import { JournalStorage } from './js/storage.js';

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

    // 3. Render content if navigating to history
    if (panelId === 'panel-history') {
      renderHistory();
    }
  }

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  let activeMood = 'neutral';
  let editorTags = [];

  // ==========================================
  // DOM ELEMENT REFERENCES
  // ==========================================
  const moodStickerBtns = document.querySelectorAll('.mood-sticker-btn');
  const tagInput = document.getElementById('tag-input');
  const btnAddTag = document.getElementById('btn-add-tag');
  const editorTagList = document.getElementById('editor-tag-list');
  const btnSaveJournal = document.getElementById('btn-save-journal');
  const contentInput = document.getElementById('journal-content');
  const titleInput = document.getElementById('journal-title');

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

    if (entries.length === 0) {
      entriesContainer.innerHTML = `<div class="empty-state">Belum ada catatan. Tulis jurnal barumu hari ini! 🧸</div>`;
      return;
    }

    entries.forEach(entry => {
      const card = document.createElement('div');
      card.className = 'polaroid-card';
      card.setAttribute('data-mood', entry.mood);
      card.setAttribute('data-id', entry.id);

      const emojiMap = { awesome: '🥰', good: '🙂', neutral: '😐', bad: '🙁', awful: '😭' };
      const dateText = formatDate(entry.date);
      const tagsHtml = entry.tags.map(t => `<span class="tag-pill">#${t}</span>`).join(' ');

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

    // Attach deletion button handlers
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

  // Helper date formatter
  function formatDate(isoString) {
    const date = new Date(isoString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  }

  console.log("Moody Issue #3: Local Storage & History initialized.");
});
