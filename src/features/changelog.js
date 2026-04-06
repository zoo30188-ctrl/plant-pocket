import { CURRENT_VERSION, CHANGELOGS } from '../data/changelog.js';

export function initChangelog() {
  const versionBadge = document.getElementById('versionBadge');
  const modal = document.getElementById('changelogModal');
  const closeBtn = document.getElementById('closeChangelogBtn');
  const body = document.getElementById('changelogBody');

  // Set current version badge
  if (versionBadge) {
    versionBadge.innerText = CURRENT_VERSION;
  }

  const openModal = () => {
    modal.classList.add('show');
    document.body.classList.add('modal-open');
  };

  const closeModal = () => {
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
  };

  // Check LocalStorage
  const lastViewedVersion = localStorage.getItem('plantPocketVersion');

  if (lastViewedVersion !== CURRENT_VERSION) {
    // Determine which logs to show (only show current version, or new ones)
    // For simplicity, we just show the most recent changelog object that matches CURRENT_VERSION
    const currentLog = CHANGELOGS.find(log => log.version === CURRENT_VERSION);

    if (currentLog) {
      let contentHtml = `
        <div class="version-title">${currentLog.title} <span class="version-date">${currentLog.date}</span></div>
        <ul>
          ${currentLog.changes.map(ch => `<li>${ch}</li>`).join('')}
        </ul>
      `;
      body.innerHTML = contentHtml;
      
      // Show modal
      openModal();
    }
  }

  // Close Logic
  closeBtn.addEventListener('click', () => {
    localStorage.setItem('plantPocketVersion', CURRENT_VERSION);
    closeModal();
  });
}
