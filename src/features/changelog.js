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

  const renderAllLogs = () => {
    const html = CHANGELOGS.map(log => `
      <div style="margin-bottom: 1.5rem;">
        <div class="version-title">${log.title} <span class="version-date">${log.date}</span></div>
        <ul style="margin-bottom: 0;">
          ${log.changes.map(ch => `<li>${ch}</li>`).join('')}
        </ul>
      </div>
    `).join('');
    body.innerHTML = html;
  };

  const renderCurrentLog = () => {
    const currentLog = CHANGELOGS.find(log => log.version === CURRENT_VERSION);
    if (currentLog) {
      body.innerHTML = `
        <div class="version-title">${currentLog.title} <span class="version-date">${currentLog.date}</span></div>
        <ul>
          ${currentLog.changes.map(ch => `<li>${ch}</li>`).join('')}
        </ul>
      `;
      return true;
    }
    return false;
  };

  // Check LocalStorage
  const lastViewedVersion = localStorage.getItem('plantPocketVersion');

  if (lastViewedVersion !== CURRENT_VERSION) {
    if (renderCurrentLog()) {
      openModal();
    }
  }

  // Click version badge to view all logs
  if (versionBadge) {
    versionBadge.addEventListener('click', () => {
      renderAllLogs();
      openModal();
    });
  }

  // Close Logic
  const handleClose = () => {
    localStorage.setItem('plantPocketVersion', CURRENT_VERSION);
    closeModal();
  };

  closeBtn.addEventListener('click', handleClose);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      handleClose();
    }
  });
}
