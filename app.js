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

  console.log("Moody Issue #1: SPA Shell & Tabs initialized.");
});
