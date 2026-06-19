'use strict';

/* ================= PRELOADER ================= */
window.addEventListener('load', () => {
  initPreloader();
});

function initPreloader() {
  const loader = document.getElementById('preloader');
  const fill = document.querySelector('.preloader-fill');
  const pct = document.querySelector('.preloader-percent');

  if (!loader || !fill || !pct) {
    initAll();
    return;
  }

  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 15 + 5;

    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);

      fill.style.width = '100%';
      pct.textContent = '100%';

      setTimeout(() => {
        if (window.gsap) {
          gsap.to(loader, {
            opacity: 0,
            duration: 0.6,
            onComplete: () => {
              loader.style.display = 'none';
              initAll();
            }
          });
        } else {
          loader.style.display = 'none';
          initAll();
        }
      }, 300);
    }

    fill.style.width = progress + '%';
    pct.textContent = Math.floor(progress) + '%';
  }, 60);
}

/* ================= INIT ALL ================= */
function initAll() {
  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger);
  }

  initCursor();
  initNavbar();
  initThreeJS();
  initHeroAnimations();
  initScrollAnimations();
  initTiltCards();
  initCounters();
  initStatBars();
  initPortfolioFilter();
  initHamburger();
  initContactForm();
  initSmoothScroll();
}

/* ================= CURSOR ================= */
function initCursor() {
  const outer = document.getElementById('cursor-outer');
  const inner = document.getElementById('cursor-inner');

  if (!outer || !inner) return;

  // disable on touch devices
  if (window.matchMedia("(pointer: coarse)").matches) return;

  let mx = -100, my = -100;
  let ox = -100, oy = -100;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;

    if (window.gsap) {
      gsap.set(inner, { x: mx, y: my });
    } else {
      inner.style.transform = `translate(${mx}px,${my}px)`;
    }
  });

  function animate() {
    ox += (mx - ox) * 0.12;
    oy += (my - oy) * 0.12;

    if (window.gsap) {
      gsap.set(outer, { x: ox, y: oy });
    } else {
      outer.style.transform = `translate(${ox}px,${oy}px)`;
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ================= NAVBAR ================= */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

/* ================= THREE JS ================= */
function initThreeJS() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const geometry = new THREE.BufferGeometry();
  const count = 800;

  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 100;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x00f5ff,
    size: 0.2
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  function animate() {
    points.rotation.y += 0.0008;
    points.rotation.x += 0.0003;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* ================= HERO ANIMATION ================= */
function initHeroAnimations() {
  if (!window.gsap) return;

  gsap.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.6 });
  gsap.to('.hero-sub', { opacity: 1, y: 0, delay: 0.3 });
}

/* ================= SCROLL ANIMATION ================= */
function initScrollAnimations() {
  const items = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  items.forEach(el => {
    if (!window.gsap) return;

    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%'
        }
      }
    );
  });
}

/* ================= TILT CARDS ================= */
function initTiltCards() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rx = (y / rect.height - 0.5) * -10;
      const ry = (x / rect.width - 0.5) * 10;

      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `rotateX(0) rotateY(0)`;
    });
  });
}

/* ================= COUNTERS ================= */
function initCounters() {
  document.querySelectorAll('.counter').forEach(el => {
    const target = +el.dataset.target || 0;
    let count = 0;

    const update = () => {
      count += target / 60;
      if (count >= target) count = target;
      el.textContent = Math.floor(count);

      if (count < target) requestAnimationFrame(update);
    };

    update();
  });
}

/* ================= STAT BARS ================= */
function initStatBars() {
  document.querySelectorAll('.stat-bar-fill').forEach(bar => {
    const w = bar.style.getPropertyValue('--w');
    bar.style.width = w;
  });
}

/* ================= PORTFOLIO FILTER (FIXED CLICK) ================= */
function initPortfolioFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio-item');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      items.forEach(item => {
        const match = filter === 'all' || item.dataset.cat === filter;

        if (match) {
          item.style.display = 'block';
          item.style.pointerEvents = 'auto';
          item.style.opacity = '1';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ================= HAMBURGER ================= */
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');

  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
    });
  });
}

/* ================= CONTACT FORM ================= */
function initContactForm() {
  const btn = document.getElementById('submit-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const name = document.querySelector('input[type="text"]')?.value;
    const email = document.querySelector('input[type="email"]')?.value;

    if (!name || !email) {
      btn.style.transform = 'translateX(5px)';
      setTimeout(() => btn.style.transform = 'translateX(0)', 200);
      return;
    }

    const span = btn.querySelector('span');
    const original = span.textContent;

    span.textContent = "Sending...";

    setTimeout(() => {
      span.textContent = "Message Sent ✓";

      setTimeout(() => {
        span.textContent = original;
      }, 2000);
    }, 1000);
  });
}

/* ================= SMOOTH SCROLL (FIXED CLICK BUG) ================= */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;

      e.preventDefault();

      window.scrollTo({
        top: target.offsetTop - 70,
        behavior: 'smooth'
      });
    });
  });
}