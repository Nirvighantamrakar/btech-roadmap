/* ─── app.js — BTech Roadmap Interactive Logic ─── */

/* ── 1. CURSOR GLOW ── */
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

/* ── 2. PARTICLE CANVAS ── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let W = window.innerWidth, H = window.innerHeight;
  canvas.width = W; canvas.height = H;

  const COLORS = ['rgba(99,102,241,', 'rgba(34,211,238,', 'rgba(16,185,129,', 'rgba(245,158,11,'];

  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 2 + 0.5,
    dx: (Math.random() - 0.5) * 0.3,
    dy: (Math.random() - 0.5) * 0.3,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: Math.random() * 0.5 + 0.1,
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    }
    requestAnimationFrame(draw);
  }

  draw();

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });
})();

/* ── 3. REVEAL ON SCROLL (IntersectionObserver — baseline widely available) ── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stagger children cards
        const cards = entry.target.querySelectorAll('.skill-card.reveal');
        cards.forEach((card, i) => {
          setTimeout(() => card.classList.add('visible'), i * 80);
        });
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
);

document.querySelectorAll('.year-section.reveal').forEach((el) => revealObserver.observe(el));
document.querySelectorAll('.skill-card.reveal').forEach((el) => revealObserver.observe(el));

/* ── 4. 3D TILT EFFECT ON CARDS ── */
document.querySelectorAll('[data-tilt]').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const rotX = -dy * 8;
    const rotY = dx * 8;
    card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;

    // Move the glow to follow cursor
    const glow = card.querySelector('.card-glow');
    if (glow) {
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;
      glow.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(99,102,241,0.15) 0%, transparent 60%)`;
    }
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
    const glow = card.querySelector('.card-glow');
    if (glow) {
      glow.style.background = 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.08) 0%, transparent 60%)';
    }
  });
});

/* ── 5. NAV ACTIVE STATE ON SCROLL ── */
const sections = document.querySelectorAll('.year-section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((a) => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((s) => activeObserver.observe(s));

/* ── 6. ADD active STYLE VIA JS ── */
const navStyle = document.createElement('style');
navStyle.textContent = `.nav-links a.active { color: #e8eaf0; background: rgba(99,102,241,0.15); border-color: rgba(99,102,241,0.3); }`;
document.head.appendChild(navStyle);

/* ── 7. HERO PARALLAX ON MOUSE MOVE ── */
const hero = document.getElementById('hero');
const floatingCards = document.querySelectorAll('.floating-card');
const orbs = document.querySelectorAll('.orb');

document.addEventListener('mousemove', (e) => {
  const nx = (e.clientX / window.innerWidth - 0.5) * 2;
  const ny = (e.clientY / window.innerHeight - 0.5) * 2;

  floatingCards.forEach((card, i) => {
    const depth = (i + 1) * 6;
    card.style.transform = `translateX(${nx * depth}px) translateY(${ny * depth}px)`;
  });

  orbs.forEach((orb, i) => {
    const depth = (i + 1) * 12;
    orb.style.transform = `translate(${nx * depth}px, ${ny * depth}px)`;
  });
});

/* ── 8. SMOOTH SCROLL for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
