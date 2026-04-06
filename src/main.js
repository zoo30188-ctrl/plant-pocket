import './style.css';
import { initSpecs } from './features/specs.js';
import { initPunch } from './features/punch.js';
import { initToolkit } from './features/toolkit.js';
import { initChangelog } from './features/changelog.js';
import { initManual } from './features/manual.js';

document.addEventListener('DOMContentLoaded', () => {
  const navBtns = document.querySelectorAll('.nav-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Deactivate all
      navBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(t => t.classList.remove('active'));
      
      // Activate clicked
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      document.getElementById(targetId).classList.add('active');
    });
  });

  // Init features
  initManual();
  initChangelog();
  initSpecs();
  initPunch();
  initToolkit();
});
