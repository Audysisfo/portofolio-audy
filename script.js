/**
 * PORTOFOLIO AUDY AWALIA PUTRI — JAVASCRIPT LOGIC
 * Features:
 * - Theme Switcher (Latte / Light Cream / Dark Espresso)
 * - Built-in Ambient Café Lofi Generator (Web Audio API)
 * - Dynamic Global Search Bar with Auto-Scroll & Highlighting
 * - Filterable Skills & Project Categories
 * - Interactive Case Study & CV Modals
 * - Contact Form Validation & Toast Feedback
 * - Active ScrollSpy Navigation
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. THEME SWITCHER ---
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const savedTheme = localStorage.getItem('audy_portfolio_theme') || 'latte';
  body.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = body.getAttribute('data-theme');
      let nextTheme = 'light';
      if (currentTheme === 'latte') nextTheme = 'light';
      else if (currentTheme === 'light') nextTheme = 'dark';
      else nextTheme = 'latte';

      body.setAttribute('data-theme', nextTheme);
      localStorage.setItem('audy_portfolio_theme', nextTheme);

      const themeNames = {
        latte: 'Mocha Editorial',
        light: 'Light Latte Cream',
        dark: 'Midnight Espresso'
      };
      showToast(`Tema diganti ke: ${themeNames[nextTheme] || nextTheme}`, '☕');
    });
  }

  // --- 2. MOBILE MENU TOGGLE ---
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking any nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // --- 3. SCROLLSPY (ACTIVE NAVBAR LINK) ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentSection = '';
    const scrollPosition = window.pageYOffset + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // --- 4. WEB AUDIO API: AESTHETIC CAFÉ AMBIENT LOFI GENERATOR ---
  let audioCtx = null;
  let isPlaying = false;
  let gainNode = null;
  let chordInterval = null;
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundWave = document.getElementById('soundWave');

  // Cozy Lo-Fi Chord Frequencies (Fmaj7 - Am7 - Dm7 - Bbmaj7)
  const chordProgression = [
    [174.61, 220.00, 261.63, 329.63], // Fmaj7
    [220.00, 261.63, 329.63, 392.00], // Am7
    [146.83, 174.61, 220.00, 261.63], // Dm7
    [116.54, 146.83, 174.61, 220.00]  // Bbmaj7
  ];
  let chordIndex = 0;

  function playSoftChord() {
    if (!audioCtx || !isPlaying) return;

    const chord = chordProgression[chordIndex % chordProgression.length];
    chordIndex++;

    const now = audioCtx.currentTime;
    const duration = 3.6;

    chord.forEach((freq) => {
      const osc = audioCtx.createOscillator();
      const noteGain = audioCtx.createGain();

      osc.type = 'sine'; // warm soft sine wave
      osc.frequency.setValueAtTime(freq, now);

      // Add soft warm detune
      osc.detune.setValueAtTime((Math.random() - 0.5) * 8, now);

      // Smooth attack & decay envelope
      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.exponentialRampToValueAtTime(0.05, now + 0.8);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(noteGain);
      noteGain.connect(gainNode);

      osc.start(now);
      osc.stop(now + duration);
    });
  }

  function startCafeSound() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!audioCtx) {
        audioCtx = new AudioContextClass();
        gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gainNode.connect(audioCtx.destination);
      }

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      isPlaying = true;
      if (soundWave) soundWave.classList.add('playing');
      if (soundToggleBtn) {
        soundToggleBtn.innerHTML = `<span>Pause Lofi</span> <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
      }

      playSoftChord();
      chordInterval = setInterval(playSoftChord, 3800);
      showToast('Memutar musik lofi santai ☕', '🎵');
    } catch (e) {
      console.warn('Audio Context error:', e);
    }
  }

  function stopCafeSound() {
    isPlaying = false;
    if (chordInterval) clearInterval(chordInterval);
    if (soundWave) soundWave.classList.remove('playing');
    if (soundToggleBtn) {
      soundToggleBtn.innerHTML = `<span>Play Lofi Vibe</span> <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
    }
    showToast('Musik dijeda', '⏸️');
  }

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      if (isPlaying) {
        stopCafeSound();
      } else {
        startCafeSound();
      }
    });
  }

  // --- 5. SEARCH PILL BAR INTERACTION (REFERENCE STYLE) ---
  const globalSearchInput = document.getElementById('globalSearchInput');
  const searchPill = document.getElementById('searchPill');

  if (globalSearchInput) {
    globalSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const term = globalSearchInput.value.toLowerCase().trim();
        handleSearch(term);
      }
    });

    globalSearchInput.addEventListener('input', (e) => {
      const val = e.target.value.toLowerCase().trim();
      if (val.length > 3) {
        handleQuickFilter(val);
      }
    });
  }

  function handleSearch(term) {
    if (!term) return;

    if (term.includes('cv') || term.includes('resume')) {
      openCvModal();
      return;
    }
    if (term.includes('proyek') || term.includes('project') || term.includes('karya') || term.includes('portofolio')) {
      scrollToSection('projects');
      return;
    }
    if (term.includes('kontak') || term.includes('contact') || term.includes('wa') || term.includes('email')) {
      scrollToSection('contact');
      return;
    }
    if (term.includes('tentang') || term.includes('about') || term.includes('skills') || term.includes('keahlian')) {
      scrollToSection('about');
      return;
    }
    if (term.includes('pengalaman') || term.includes('organisasi') || term.includes('pendidikan')) {
      scrollToSection('experience');
      return;
    }

    showToast(`Mencari topik: "${term}"...`, '🔍');
  }

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      showToast(`Menuju bagian: ${id.toUpperCase()}`, '✨');
    }
  }

  function handleQuickFilter(query) {
    // Check if matching skills
    const skillItems = document.querySelectorAll('.skill-badge-item');
    skillItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(query)) {
        item.style.borderColor = 'var(--accent-caramel)';
        item.style.backgroundColor = 'rgba(196, 135, 83, 0.2)';
      } else {
        item.style.borderColor = '';
        item.style.backgroundColor = '';
      }
    });
  }

  // --- 6. SKILL CATEGORY TABS ---
  const skillTabs = document.querySelectorAll('.skill-tab-btn');
  const skillItems = document.querySelectorAll('.skill-badge-item');

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      skillItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // --- 7. EXPERIENCE / EDUCATION TABS ---
  const expTabBtns = document.querySelectorAll('.exp-tab-btn');
  const expPanels = document.querySelectorAll('.exp-panel');

  expTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      expTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.getAttribute('data-target');
      expPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.getAttribute('id') === targetId) {
          panel.classList.add('active');
        }
      });
    });
  });

  // --- 8. PORTFOLIO FILTER TABS ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- 9. MODALS (CV & CASE STUDIES) ---
  const cvModal = document.getElementById('cvModal');
  const openCvBtns = document.querySelectorAll('.open-cv-btn, #heroCvBtn');
  const closeCvModalBtn = document.getElementById('closeCvModal');
  const printCvBtn = document.getElementById('printCvBtn');
  const downloadCvActionBtn = document.getElementById('downloadCvActionBtn');

  function openCvModal() {
    if (cvModal) {
      cvModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.classList.remove('open');
    });
    document.body.style.overflow = '';
  }

  openCvBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCvModal();
    });
  });

  if (closeCvModalBtn) {
    closeCvModalBtn.addEventListener('click', closeAllModals);
  }

  // Print CV
  if (printCvBtn) {
    printCvBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Download CV Simulator
  if (downloadCvActionBtn) {
    downloadCvActionBtn.addEventListener('click', () => {
      showToast('Mengunduh CV Audy Awalia Putri (.pdf)...', '📥');
      setTimeout(() => {
        // Create an ATS text summary download if direct pdf is clicked
        const cvContent = `CURRICULUM VITAE - AUDY AWALIA PUTRI\n` +
          `Mahasiswa Sistem Informasi\n` +
          `Email: audyawaliaputri@gmail.com | Domisili: Pontianak Barat, Indonesia\n\n` +
          `PENDIDIKAN:\n` +
          `- S1 Sistem Informasi (Mahasiswa Aktif Semester 1)\n\n` +
          `KEAHLIAN:\n` +
          `- UI/UX: Figma, Wireframing, Prototyping, Usability Testing\n` +
          `- Web Dev: HTML5, CSS3, JavaScript ES6+, Git/GitHub\n\n` +
          `PENGALAMAN:\n` +
          `- Ketua Divisi UI/UX & Media Kreatif HMSI (2024 - Sekarang)\n` +
          `- Core Team Member GDSC (2023 - 2024)\n` +
          `- Juara 2 UI/UX Competition Nasional (2024)`;

        const blob = new Blob([cvContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'CV_Audy_Awalia_Putri_Information_Systems.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('Berkas CV berhasil diunduh!', '✅');
      }, 1000);
    });
  }

  // Project Case Study Modal Triggers
  const viewDetailBtns = document.querySelectorAll('.view-detail-btn');
  viewDetailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetModalId = btn.getAttribute('data-modal');
      const targetModal = document.getElementById(targetModalId);
      if (targetModal) {
        targetModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Modal Close buttons
  document.querySelectorAll('.modal-close-btn, .modal-close-action').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  // Close modal on backdrop click
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAllModals();
      }
    });
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // --- 10. COPY EMAIL BUTTON ---
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'audyawaliaputri@gmail.com';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => {
          showToast('Email disalin: audyawaliaputri@gmail.com', '📋');
        }).catch(() => {
          fallbackCopy(email);
        });
      } else {
        fallbackCopy(email);
      }
    });
  }

  function fallbackCopy(text) {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showToast('Email disalin ke clipboard!', '📋');
  }

  // --- 11. CONTACT FORM VALIDATION & SUBMISSION ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('senderName');
      const emailInput = document.getElementById('senderEmail');
      const subjectSelect = document.getElementById('subjectSelect');
      const messageInput = document.getElementById('senderMessage');

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        setError(nameInput, 'nameError', true);
        isValid = false;
      } else {
        setError(nameInput, 'nameError', false);
      }

      // Validate Email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailInput.value.trim())) {
        setError(emailInput, 'emailError', true);
        isValid = false;
      } else {
        setError(emailInput, 'emailError', false);
      }

      // Validate Subject
      if (!subjectSelect.value) {
        setError(subjectSelect, 'subjectError', true);
        isValid = false;
      } else {
        setError(subjectSelect, 'subjectError', false);
      }

      // Validate Message
      if (messageInput.value.trim().length < 10) {
        setError(messageInput, 'messageError', true);
        isValid = false;
      } else {
        setError(messageInput, 'messageError', false);
      }

      if (isValid) {
        const senderName = nameInput.value.trim();
        const subject = subjectSelect.value;
        const submitBtn = document.getElementById('submitFormBtn');
        const origContent = submitBtn.innerHTML;

        submitBtn.innerHTML = `<span>Mengirim Pesan...</span> <div class="pulse-indicator"></div>`;
        submitBtn.disabled = true;

        setTimeout(() => {
          submitBtn.innerHTML = origContent;
          submitBtn.disabled = false;
          contactForm.reset();

          showToast(`Terima kasih, ${senderName}! Pesan Anda telah terkirim.`, '💌');
        }, 1200);
      }
    });
  }

  function setError(inputEl, errorId, show) {
    const group = inputEl.closest('.form-group');
    if (!group) return;
    if (show) {
      group.classList.add('has-error');
    } else {
      group.classList.remove('has-error');
    }
  }

  // --- 12. TOAST NOTIFICATION HELPER ---
  function showToast(message, icon = '✨') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span style="font-size: 1.2rem;">${icon}</span>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3500);
  }

  // Greeting Toast on first visit
  setTimeout(() => {
    showToast('Selamat datang di portofolio Audy Awalia Putri!', '☕');
  }, 900);

});
