document.addEventListener('DOMContentLoaded', () => {
  // Select navigation tabs and panel sections
  const tabDividers = document.querySelectorAll('.tab-divider');
  const panels = document.querySelectorAll('.panel-section');

  // SPA Tab Switcher
  tabDividers.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPanelId = tab.getAttribute('data-target');
      
      // If already active, do nothing
      if (tab.classList.contains('active')) return;

      // 1. Toggle Navigation Active Class
      tabDividers.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // 2. Toggle Panel Section Active Class with Smooth Fade-in
      panels.forEach(panel => {
        if (panel.id === targetPanelId) {
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
    });
  });

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

  // ==========================================
  // FORM VALIDATION (MOCK SAVE)
  // ==========================================
  btnSaveJournal.addEventListener('click', (e) => {
    e.preventDefault();
    const content = contentInput.value.trim();
    if (!content) {
      alert('Isi catatan tidak boleh kosong! ⚠️');
      contentInput.focus();
      return;
    }

    // Mock save logic for Issue 2
    alert(`[MOCK SAVE] Menolak simpan karena Issue #3 belum dipasang. Judul: "${titleInput.value.trim()}", Mood: ${activeMood}, Tags: ${editorTags.join(', ')}`);
  });

  console.log("Moody Issue #2: Editor & Mood Selector initialized.");
});
