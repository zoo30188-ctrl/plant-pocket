export function initManual() {
  const manualModal = document.getElementById('manualModal');
  const openBtn = document.getElementById('openManualBtn');
  const closeBtn = document.getElementById('closeManualBtn');

  // Check if first time
  const hasSeenManual = localStorage.getItem('plantPocketManualSeen');

  if (!hasSeenManual) {
    // Show manual automatically on first launch
    manualModal.classList.add('show');
  }

  // Open manually via header button
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      manualModal.classList.add('show');
    });
  }

  // Close logic
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      localStorage.setItem('plantPocketManualSeen', 'true');
      manualModal.classList.remove('show');
    });
  }
}
