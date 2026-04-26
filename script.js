// ── Bootstrap ─────────────────────────────────────────────────────────────
(async () => {
  try {
    const res  = await fetch('data.json');
    const data = await res.json();

    buildNav(data);
    buildHero(data);
    buildAbout(data);
    buildProjects(data);
    buildCerts(data);
    buildEducation(data);
    buildContact(data);
    initReveal();
    initScrollSpy();
  } catch (e) {
    console.error('Error loading data.json:', e);
    document.getElementById('app-error').style.display = 'block';
  }
})();

// ── NAV ───────────────────────────────────────────────────────────────────
function buildNav(data) {
  document.querySelector('.nav-logo').textContent = data.name.split(' ')[0] + '.';

  const hamburger = document.querySelector('.hamburger');
  const drawer    = document.getElementById('nav-drawer');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    drawer.classList.toggle('open');
  });

  // close drawer on link click
  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      drawer.classList.remove('open');
    });
  });
}

// ── HERO ──────────────────────────────────────────────────────────────────
function buildHero(data) {
  // Name
  const [first, ...rest] = data.name.split(' ');
  document.getElementById('hero-name').innerHTML =
    `${first} <span class="grad">${rest.join(' ')}</span>`;

  // Tagline typing effect
  const tagEl = document.getElementById('hero-tagline');
  type(tagEl, data.tagline, 32);

  // Short bio
  document.getElementById('hero-desc').textContent =
    data.objective.slice(0, 200) + '…';

  // Stats
  document.getElementById('hero-stats').innerHTML = [
    { n: data.projects.length + '+', l: 'Projects Built' },
    { n: data.certifications.length,  l: 'Certifications' },
    { n: '2025',                       l: 'Latest Cert' }
  ].map(s => `
    <div class="stat">
      <span class="stat-num">${s.n}</span>
      <span class="stat-lbl">${s.l}</span>
    </div>
  `).join('');
}

// ── ABOUT ─────────────────────────────────────────────────────────────────
function buildAbout(data) {
  // Bio paragraph
  document.getElementById('about-body').innerHTML =
    `<p>${data.objective}</p>`;

  // Contact chips
  const DOT_COLORS = ['#6c47ff','#ff4fa0','#00c8d7','#22d06e'];
  const chips = [
    { svg: iconEmail(), label: data.contact.email, href: `mailto:${data.contact.email}` },
    { svg: iconPhone(), label: data.contact.phone,  href: `tel:${data.contact.phone}` },
    { svg: iconLI(),    label: 'LinkedIn',           href: data.contact.linkedin },
    { svg: iconPin(),   label: data.contact.location, href: '#' }
  ];
  document.getElementById('contact-chips').innerHTML =
    chips.map(c => `<a href="${c.href}" class="c-chip" target="_blank" rel="noopener">${c.svg}${c.label}</a>`).join('');

  // Skills
  const colors = ['#6c47ff','#ff4fa0','#00c8d7','#ffaa00','#22d06e','#ff6b6b'];
  document.getElementById('skills-list').innerHTML =
    Object.entries(data.skills).map(([cat, tags], i) => `
      <div class="skill-card reveal">
        <div class="sk-head">
          <span class="sk-dot" style="background:${colors[i % colors.length]}"></span>
          ${cat}
        </div>
        <div class="sk-tags">${tags.map(t => `<span class="sk-tag">${t}</span>`).join('')}</div>
      </div>
    `).join('');
}

// ── PROJECTS ──────────────────────────────────────────────────────────────
function buildProjects(data) {
  document.getElementById('projects-grid').innerHTML =
    data.projects.map((p, i) => `
      <div class="proj-card reveal" style="transition-delay:${i * 0.12}s">
        <div class="proj-num">0${i + 1}</div>
        <div class="proj-badges">${p.tech.map(t => `<span class="proj-badge">${t}</span>`).join('')}</div>
        <div class="proj-title">${p.title}</div>
        <div class="proj-desc">${p.description}</div>
        <ul class="proj-list">
          ${p.highlights.map(h => `<li><span class="proj-arrow">→</span>${h}</li>`).join('')}
        </ul>
      </div>
    `).join('');
}

// ── CERTS ─────────────────────────────────────────────────────────────────
const CERT_ICONS  = ['🏆','📊','🗄️','📈'];
const CERT_STYLES = [
  { stripe: 'stripe-1', ic: 'ic-1' },
  { stripe: 'stripe-2', ic: 'ic-2' },
  { stripe: 'stripe-3', ic: 'ic-3' },
  { stripe: 'stripe-4', ic: 'ic-4' },
];

function buildCerts(data) {
  document.getElementById('certs-grid').innerHTML =
    data.certifications.map((c, i) => {
      const s = CERT_STYLES[i % CERT_STYLES.length];
      return `
        <div class="cert-card reveal" style="transition-delay:${i * 0.1}s">
          <div class="cert-stripe ${s.stripe}"></div>
          <div class="cert-icon-wrap ${s.ic}">${CERT_ICONS[i] || '🎓'}</div>
          <div class="cert-title">${c.title}</div>
          <div class="cert-issuer">${c.issuer}${c.platform ? ' · ' + c.platform : ''}</div>
          <div class="cert-meta">
            ${c.year     ? 'Year: ' + c.year              : ''}
            ${c.duration ? 'Duration: ' + c.duration      : ''}
            ${c.certId   ? ' · ID: ' + c.certId           : ''}
            ${c.description ? '<br>' + c.description      : ''}
          </div>
        </div>
      `;
    }).join('');
}

// ── EDUCATION ─────────────────────────────────────────────────────────────
function buildEducation(data) {
  document.getElementById('edu-wrap').innerHTML =
    data.education.map(e => `
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
  document.getElementById('cta-btns').innerHTML = `
    <a href="mailto:${data.contact.email}" class="btn-white">✉️ Send an Email</a>
    <a href="${data.contact.linkedin}" target="_blank" rel="noopener" class="btn-ghost">🔗 LinkedIn</a>
    <a href="tel:${data.contact.phone}" class="btn-ghost">📞 Call</a>
  `;
}

// ── SCROLL REVEAL ─────────────────────────────────────────────────────────
function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

  // observe both existing and dynamically-injected elements
  function observe() { document.querySelectorAll('.reveal').forEach(el => io.observe(el)); }
  observe();
  // re-observe after dynamic inserts
  setTimeout(observe, 50);
}

// ── SCROLL SPY ────────────────────────────────────────────────────────────
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');
  window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) cur = s.id; });
    links.forEach(a => { a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--violet)' : ''; });
  }, { passive: true });
}

// ── TYPING ────────────────────────────────────────────────────────────────
function type(el, text, speed = 40) {
  let i = 0; el.textContent = '';
  const t = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) clearInterval(t);
  }, speed);
}

// ── ICON SVGS ─────────────────────────────────────────────────────────────
function iconEmail() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>`;
}
function iconPhone() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 4.11 5.17 2 2 0 0 1 6.09 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L10.09 10.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 24 18v-.08z"/></svg>`;
}
function iconLI() {
  return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;
}
function iconPin() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
}
