// ── Load data and render the page ──────────────────────────────────────────

async function loadData() {
  const res = await fetch('data.json');
  return res.json();
}

function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}

// ── NAV ───────────────────────────────────────────────────────────────────

function buildNav(data) {
  document.querySelector('.nav-logo').textContent = data.name.split(' ')[0] + '.';

  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));

  // Close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // Active nav on scroll
  const sections = document.querySelectorAll('section[id]');
  const links = navLinks.querySelectorAll('a[href^="#"]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
    });
  }, { passive: true });
}

// ── HERO ──────────────────────────────────────────────────────────────────

function buildHero(data) {
  const [first, ...rest] = data.name.split(' ');
  document.getElementById('hero-name').innerHTML =
    `${first} <span class="accent">${rest.join(' ')}</span>`;
  document.getElementById('hero-tagline').textContent = data.tagline;
  document.getElementById('hero-desc').textContent =
    data.objective.slice(0, 180) + '…';

  // Stats
  const statsEl = document.getElementById('hero-stats');
  const statsData = [
    { number: '2+', label: 'Projects Built' },
    { number: '4', label: 'Certifications' },
    { number: '2025', label: 'Latest Cert' }
  ];
  statsEl.innerHTML = statsData.map(s => `
    <div class="stat-item">
      <div class="stat-number">${s.number}</div>
      <div class="stat-label">${s.label}</div>
    </div>
  `).join('');
}

// ── ABOUT / SKILLS ─────────────────────────────────────────────────────────

function buildAbout(data) {
  const { contact, objective, skills } = data;

  // Paragraph
  document.getElementById('about-text').innerHTML = `
    <p>${objective}</p>
  `;

  // Contact chips
  const chips = document.getElementById('contact-chips');
  const items = [
    { icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`, label: contact.email, href: `mailto:${contact.email}` },
    { icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498A1 1 0 0121 15.72V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>`, label: contact.phone, href: `tel:${contact.phone}` },
    { icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`, label: 'LinkedIn', href: contact.linkedin },
    { icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`, label: contact.location, href: '#' }
  ];
  chips.innerHTML = items.map(i => `<a href="${i.href}" class="chip" target="_blank">${i.icon} ${i.label}</a>`).join('');

  // Skills
  const skillsEl = document.getElementById('skills-list');
  skillsEl.innerHTML = Object.entries(skills).map(([cat, tags]) => `
    <div class="skill-category-card reveal">
      <div class="skill-cat-title">${cat}</div>
      <div class="skill-tags">${tags.map(t => `<span class="skill-tag">${t}</span>`).join('')}</div>
    </div>
  `).join('');
}

// ── PROJECTS ──────────────────────────────────────────────────────────────

function buildProjects(data) {
  const grid = document.getElementById('projects-grid');
  grid.innerHTML = data.projects.map((p, i) => `
    <div class="project-card reveal" style="transition-delay: ${i * 0.1}s">
      <div class="project-number">0${i + 1}</div>
      <div class="project-tech-badges">${p.tech.map(t => `<span class="tech-badge">${t}</span>`).join('')}</div>
      <div class="project-title">${p.title}</div>
      <div class="project-desc">${p.description}</div>
      <ul class="project-highlights">${p.highlights.map(h => `<li>${h}</li>`).join('')}</ul>
    </div>
  `).join('');
}

// ── CERTIFICATIONS ────────────────────────────────────────────────────────

const CERT_ICONS = ['🏆', '📊', '🗄️', '📈'];

function buildCerts(data) {
  const grid = document.getElementById('certs-grid');
  grid.innerHTML = data.certifications.map((c, i) => `
    <div class="cert-card reveal" style="transition-delay: ${i * 0.1}s">
      <div class="cert-icon">${CERT_ICONS[i] || '🎓'}</div>
      <div class="cert-info">
        <div class="cert-title">${c.title}</div>
        <div class="cert-issuer">${c.issuer}${c.platform ? ` — ${c.platform}` : ''}</div>
        <div class="cert-meta">
          ${c.year ? `Year: ${c.year}` : ''}
          ${c.duration ? `Duration: ${c.duration}` : ''}
          ${c.certId ? ` · ID: ${c.certId}` : ''}
          ${c.description ? `<br>${c.description}` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

// ── EDUCATION ─────────────────────────────────────────────────────────────

function buildEducation(data) {
  const wrap = document.getElementById('education-wrap');
  wrap.innerHTML = data.education.map(e => `
    <div class="edu-card reveal">
      <div class="edu-icon">🎓</div>
      <div>
        <div class="edu-degree">${e.degree}</div>
        <div class="edu-school">${e.institution}</div>
        <div class="edu-meta">${e.location} · ${e.year}</div>
      </div>
    </div>
  `).join('');
}

// ── CONTACT ───────────────────────────────────────────────────────────────

function buildContact(data) {
  const cl = document.getElementById('contact-links');
  cl.innerHTML = `
    <a href="mailto:${data.contact.email}" class="btn-primary">✉️ Send Email</a>
    <a href="${data.contact.linkedin}" target="_blank" class="btn-secondary">LinkedIn Profile</a>
    <a href="tel:${data.contact.phone}" class="btn-secondary">📞 Call</a>
  `;
}

// ── SCROLL REVEAL ─────────────────────────────────────────────────────────

function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  const observe = () => document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  observe();
  return observe; // call again after dynamic inserts
}

// ── TYPING EFFECT ─────────────────────────────────────────────────────────

function typeEffect(el, text, speed = 50) {
  let i = 0; el.textContent = '';
  const t = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) clearInterval(t);
  }, speed);
}

// ── INIT ──────────────────────────────────────────────────────────────────

(async () => {
  try {
    const data = await loadData();

    buildNav(data);
    buildHero(data);
    buildAbout(data);
    buildProjects(data);
    buildCerts(data);
    buildEducation(data);
    buildContact(data);

    // Init reveals after all dynamic content injected
    initReveal();

    // Typing on hero role
    const roleEl = document.getElementById('hero-tagline');
    if (roleEl) {
      const original = roleEl.textContent;
      setTimeout(() => typeEffect(roleEl, original, 35), 800);
    }

  } catch (err) {
    console.error('Failed to load data.json:', err);
    document.body.innerHTML = '<p style="color:#f87171;padding:2rem">Could not load data.json — make sure it is in the same folder as index.html.</p>';
  }
})();
