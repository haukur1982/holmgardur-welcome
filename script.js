/* ============================================
   HOLMGARDUR WELCOME BOOK — INTERACTIVITY
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Scroll-based fade-in animations ---
  const fadeEls = document.querySelectorAll('.fade-in');

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  fadeEls.forEach(el => fadeObserver.observe(el));

  // --- Copy WiFi password ---
  const copyBtn = document.getElementById('copyWifi');
  const wifiPassword = document.getElementById('wifiPassword');

  if (copyBtn && wifiPassword) {
    copyBtn.addEventListener('click', async () => {
      const password = wifiPassword.textContent.trim();
      try {
        await navigator.clipboard.writeText(password);
        copyBtn.classList.add('copied');
        copyBtn.querySelector('.copy-label').textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.querySelector('.copy-label').textContent = 'Copy';
        }, 2000);
      } catch {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = password;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        copyBtn.classList.add('copied');
        copyBtn.querySelector('.copy-label').textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.querySelector('.copy-label').textContent = 'Copy';
        }, 2000);
      }
    });
  }

  // --- Interactive check-out checklist ---
  const STORAGE_KEY = 'holmgardur-checklist';
  const checkboxes = document.querySelectorAll('#checklist input[type="checkbox"]');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');

  // Load saved state
  function loadChecklist() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      checkboxes.forEach(cb => {
        if (saved[cb.dataset.key]) {
          cb.checked = true;
        }
      });
    } catch {
      // Ignore storage errors
    }
    updateProgress();
  }

  // Save state
  function saveChecklist() {
    const state = {};
    checkboxes.forEach(cb => {
      state[cb.dataset.key] = cb.checked;
    });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage errors
    }
  }

  // Update progress bar
  function updateProgress() {
    const total = checkboxes.length;
    const done = Array.from(checkboxes).filter(cb => cb.checked).length;
    const pct = total > 0 ? (done / total) * 100 : 0;

    if (progressFill) progressFill.style.width = pct + '%';
    if (progressText) {
      if (done === total && total > 0) {
        progressText.textContent = 'All done! Have a great trip ✈️';
      } else {
        progressText.textContent = `${done} of ${total} done`;
      }
    }
  }

  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      saveChecklist();
      updateProgress();
    });
  });

  loadChecklist();

  // --- Bottom navigation active state ---
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section[id]');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        updateActiveNav(id);
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-10% 0px -60% 0px'
  });

  sections.forEach(section => navObserver.observe(section));

  function updateActiveNav(activeId) {
    // Map section IDs to nav data-section values
    const navMap = {
      'welcome': 'welcome',
      'quick-ref': 'quick-ref',
      'guidelines': 'quick-ref',
      'water': 'quick-ref',
      'bathroom': 'quick-ref',
      'kitchen': 'quick-ref',
      'trash': 'quick-ref',
      'parking': 'quick-ref',
      'safety': 'quick-ref',
      'getting-around': 'recommendations',
      'recommendations': 'recommendations',
      'tours': 'recommendations',
      'checkout': 'checkout',
      'thankyou': 'checkout'
    };

    const targetNav = navMap[activeId] || activeId;

    navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.section === targetNav);
    });
  }

  // Smooth scroll for nav links (helps on older browsers)
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(item.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Also handle the hero scroll cue
  const scrollCue = document.querySelector('.scroll-cue');
  if (scrollCue) {
    scrollCue.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(scrollCue.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

});
