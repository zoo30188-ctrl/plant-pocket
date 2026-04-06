export function initManual() {
  const manualModal = document.getElementById('manualModal');
  const openBtn = document.getElementById('openManualBtn');
  const closeBtn = document.getElementById('closeManualBtn');

  const openModal = () => {
    manualModal.classList.add('show');
    document.body.classList.add('modal-open');
  };

  const closeModal = () => {
    manualModal.classList.remove('show');
    document.body.classList.remove('modal-open');
  };

  // Check if first time
  const hasSeenManual = localStorage.getItem('plantPocketManualSeen');

  if (!hasSeenManual) {
    // Show manual automatically on first launch
    openModal();
  }

  // Open manually via header button
  if (openBtn) {
    openBtn.addEventListener('click', openModal);
  }

  // Close logic
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      localStorage.setItem('plantPocketManualSeen', 'true');
      closeModal();
    });
  }
}
