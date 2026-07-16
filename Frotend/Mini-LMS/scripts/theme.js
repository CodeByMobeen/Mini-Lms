document.addEventListener('DOMContentLoaded', () => {
  renderBackground();
  highlightActiveNav();
  initializeButtonRipples();
  animatePageElements();
  animateDashboardCounters();
  animateAttendanceRings();
});

function renderBackground() {
  const orbSettings = [
    { left: '8%', top: '20%', size: 260, color: 'rgba(108,99,255,0.22)', duration: 24, delay: 0 },
    { left: '70%', top: '10%', size: 320, color: 'rgba(62,207,207,0.18)', duration: 28, delay: 2 },
    { left: '40%', top: '75%', size: 220, color: 'rgba(255,101,132,0.18)', duration: 22, delay: 1 },
    { left: '88%', top: '58%', size: 180, color: 'rgba(108,99,255,0.2)', duration: 30, delay: 4 },
    { left: '16%', top: '78%', size: 200, color: 'rgba(62,207,207,0.16)', duration: 26, delay: 3 },
    { left: '55%', top: '35%', size: 220, color: 'rgba(255,101,132,0.14)', duration: 32, delay: 5 }
  ];

  orbSettings.forEach((orb, index) => {
    const element = document.createElement('div');
    element.className = 'background-orb';
    element.style.width = `${orb.size}px`;
    element.style.height = `${orb.size}px`;
    element.style.left = orb.left;
    element.style.top = orb.top;
    element.style.background = orb.color;
    element.style.animationDuration = `${orb.duration}s`;
    element.style.animationDelay = `${orb.delay}s`;
    element.style.opacity = '0.22';
    document.body.appendChild(element);
  });

  const starfield = document.createElement('div');
  starfield.id = 'starfield';
  const starCount = 92;
  for (let i = 0; i < starCount; i += 1) {
    const size = [1, 2, 3][Math.floor(Math.random() * 3)];
    const star = document.createElement('span');
    star.className = 'star';
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDuration = `${3 + Math.random() * 5}s`;
    star.style.animationDelay = `${Math.random() * 5}s`;
    star.style.opacity = `${0.25 + Math.random() * 0.7}`;
    starfield.appendChild(star);
  }
  document.body.appendChild(starfield);
}

function highlightActiveNav() {
  const pathname = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar .nav-item').forEach((link) => {
    if (!pathname) return;
    if (link.getAttribute('href') === pathname) {
      link.classList.add('active');
    }
  });
}

function initializeButtonRipples() {
  document.body.addEventListener('click', (event) => {
    const button = event.target.closest('.btn');
    if (!button) return;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    button.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
}

function animatePageElements() {
  const elements = Array.from(document.querySelectorAll('.card, .stat-card, .course-card, .announce-card, .assignment, .progress-card, .gpa-card, .topbar, .auth-card, .attendance-ring-card'));
  elements.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.animation = `fadeInUp 0.8s ease forwards`;
    item.style.animationDelay = `${index * 75}ms`;
  });
}

function animateDashboardCounters() {
  const counters = Array.from(document.querySelectorAll('.stat-card .value, .gpa-card .gpa'));
  counters.forEach((element, index) => {
    const text = element.textContent.trim();
    const hasPercent = text.includes('%');
    const numeric = parseFloat(text.replace('%', '')) || 0;
    const decimals = (text.split('.')[1] || '').length;
    animateValue(element, 0, numeric, 1200, hasPercent, decimals, index * 100);
  });
}

function animateValue(element, start, end, duration, percent, decimals, delay) {
  const startTime = performance.now() + delay;
  function step(currentTime) {
    if (currentTime < startTime) {
      requestAnimationFrame(step);
      return;
    }
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const value = start + (end - start) * progress;
    element.textContent = `${value.toFixed(decimals)}${percent ? '%' : ''}`;
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
}

function animateAttendanceRings() {
  document.querySelectorAll('.attendance-ring').forEach((ring) => {
    const percent = parseFloat(ring.dataset.percent) || 0;
    const angle = Math.min(Math.max(percent, 0), 100) * 3.6;
    ring.style.setProperty('--progress-angle', `${angle}deg`);
    ring.style.animation = 'ringFill 1.2s ease forwards';
  });
}

/* If canvas-confetti is loaded on the quiz page, expose a simple helper */
window.launchConfetti = function () {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6C63FF', '#3ECFCF', '#FF6584', '#FF8C42']
    });
  }
};
