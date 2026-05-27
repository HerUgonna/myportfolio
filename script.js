/* ═══════════════════════════════════════════
   LVV Portfolio — Main Script
   ═══════════════════════════════════════════ */

(async function () {
  // ── Load data.json ──
  const res = await fetch('data.json');
  const D = await res.json();

  // ── NAV ──
  const navLinks = document.getElementById('nav-links');
  const mobileLinks = document.getElementById('mobile-links');
  D.nav.forEach(n => {
    const id = n.toLowerCase();
    navLinks.innerHTML += `<li><a href="#${id}">${n}</a></li>`;
    mobileLinks.innerHTML += `<li><a href="#${id}" class="mobile-link-item">${n}</a></li>`;
  });

  // CV button link
  const cvUrl = D.contact.cv.url;
  document.getElementById('nav-cv-btn').href = cvUrl;
  document.getElementById('btn-cv-download').href = cvUrl;

  // ── MOBILE TOGGLE ──
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  toggle.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    mobileMenu.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
      mobileMenu.setAttribute('aria-hidden', true);
      document.body.style.overflow = '';
    });
  });

  // ── NAVBAR SCROLL ──
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // ── HERO ──
  document.getElementById('hero-name').textContent = D.personal.name + '.';
  document.getElementById('hero-tagline').textContent = D.personal.tagline;

  // Typing effect
  const typingEl = document.getElementById('typing-text');
  const roles = D.personal.typing_roles;
  let ri = 0, ci = 0, deleting = false;
  function typeLoop() {
    const word = roles[ri];
    if (!deleting) {
      typingEl.textContent = word.substring(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(typeLoop, 2000); return; }
      setTimeout(typeLoop, 80);
    } else {
      typingEl.textContent = word.substring(0, --ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; setTimeout(typeLoop, 400); return; }
      setTimeout(typeLoop, 40);
    }
  }
  typeLoop();

  // ── ABOUT ──
  document.getElementById('about-bio').textContent = D.personal.bio;
  const credsEl = document.getElementById('about-creds');
  const credIcons = [
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5"/></svg>',
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5"/></svg>',
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.77 4 4 0 0 1 0 6.76 4 4 0 0 1-4.78 4.77 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z"/><path d="m9 12 2 2 4-4"/></svg>'
  ];
  D.credentials.forEach((c, i) => {
    credsEl.innerHTML += `
      <div class="cred-card reveal">
        <span class="cred-icon">${credIcons[i] || credIcons[0]}</span>
        <span class="cred-text">${c}</span>
      </div>`;
  });

  // ── PROJECTS ──
  const projGrid = document.getElementById('projects-grid');
  D.projects.forEach(p => {
    const tags = p.tags.map(t => `<span class="project-tag">${t}</span>`).join('');
    projGrid.innerHTML += `
      <div class="project-card reveal">
        <div class="project-card-inner">
          <div class="project-head">
            <h3>${p.title}</h3>
            <span class="project-badge badge-${p.badge_color}">${p.badge}</span>
          </div>
          <div class="project-meta">${p.role} · ${p.period}</div>
          <div class="project-tags">${tags}</div>
          <p class="project-desc">${p.description}</p>
          <a href="${p.link}" class="project-link">View Project <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
        </div>
      </div>`;
  });

  // Card mouse glow effect
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });

  // ── SKILLS ──
  const skillsWrap = document.getElementById('skills-wrap');
  D.skills.forEach(s => {
    const pills = s.items.map(i => `<span class="skill-pill">${i}</span>`).join('');
    skillsWrap.innerHTML += `
      <div class="skill-group reveal">
        <div class="skill-cat cat-${s.color}">${s.category}</div>
        <div class="skill-items">${pills}</div>
      </div>`;
  });

  // ── EXPERIENCE ──
  const expTimeline = document.getElementById('exp-timeline');
  D.experience.forEach(e => {
    const bullets = e.bullets.map(b => `<li>${b}</li>`).join('');
    expTimeline.innerHTML += `
      <div class="exp-item reveal">
        <div class="exp-dot">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
        </div>
        <div class="exp-card">
          <div class="exp-header">
            <span class="exp-period">${e.period}</span>
            <span class="exp-location">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              ${e.location}
            </span>
          </div>
          <div class="exp-company">${e.company}</div>
          <div class="exp-role">${e.role}</div>
          <ul class="exp-bullets">${bullets}</ul>
        </div>
      </div>`;
  });

  // ── CONTACT ──
  document.getElementById('contact-title').innerHTML =
    `Let's build<br><span class="gradient-word">something.</span>`;
  document.getElementById('contact-sub').textContent = D.personal.contact_subtext;
  document.getElementById('footer-tagline').textContent = D.personal.footer_tagline;

  const contactEl = document.getElementById('contact-links');
  const icons = {
    email: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,7 12,13 2,7"/></svg>',
    linkedin: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
    github: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>',
    phone: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    cv: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>'
  };
  ['email', 'linkedin', 'github', 'phone', 'cv'].forEach(k => {
    const c = D.contact[k];
    contactEl.innerHTML += `
      <a href="${c.url}" class="contact-card" target="_blank" rel="noopener">
        <span class="contact-icon">${icons[k]}</span>
        <span class="contact-label">${c.label}</span>
        <span class="contact-arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </span>
      </a>`;
  });

  // ── REVEAL ON SCROLL ──
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ── PARTICLE CANVAS ──
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.5 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.a = Math.random() * 0.3 + 0.05;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,149,108,${this.a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 60; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(200,149,108,${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();

})();
