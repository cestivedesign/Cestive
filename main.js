// ===== LOADER =====
document.body.classList.add('loading');

window.addEventListener('load', () => {
  const frameCanvas = document.getElementById('frameCanvas');

  // If frame animation exists, loader waits for frames (handled in inline script)
  // Otherwise, use timed loader for subpages
  if (!frameCanvas) {
    setTimeout(() => {
      hideLoader();
    }, 2500);
  }
});

function hideLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  loader.classList.add('fade-out');
  document.body.classList.remove('loading');

  // Trigger hero animations after loader fades
  setTimeout(() => {
    triggerHeroAnimations();
  }, 400);

  // Remove loader from DOM after transition
  setTimeout(() => {
    loader.remove();
  }, 1000);
}

// ===== HERO ANIMATIONS =====
function triggerHeroAnimations() {
  const elements = document.querySelectorAll('.animate-on-load');
  elements.forEach((el) => {
    const delay = parseInt(el.dataset.delay || 0) * 150;
    setTimeout(() => {
      el.classList.add('visible');
    }, delay);
  });
}

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
let lastScrollY = 0;

function handleNavScroll() {
  const scrollY = window.scrollY;
  if (scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScrollY = scrollY;
}

window.addEventListener('scroll', handleNavScroll, { passive: true });

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ===== SCROLL REVEAL =====
const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0) * 120;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
});

scrollRevealElements.forEach(el => {
  revealObserver.observe(el);
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      const offset = 80;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});



/* ===== STARSCAPE ===== */
(function(){
  const c = document.getElementById('starscape');
  if(!c) return;
  const ctx = c.getContext('2d');
  let stars = [];
  function resize(){
    const d = window.devicePixelRatio || 1;
    c.width = window.innerWidth * d;
    c.height = window.innerHeight * d;
    c.style.width = window.innerWidth + 'px';
    c.style.height = window.innerHeight + 'px';
  }
  function init(){
    resize();
    stars = [];
    for(let i=0; i<180; i++){
      stars.push({
        x: Math.random() * c.width,
        y: Math.random() * c.height,
        radius: 0.3 + Math.random() * 1.2,
        baseOpacity: 0.2 + Math.random() * 0.6,
        driftX: (Math.random() - 0.5) * 0.04,
        driftY: (Math.random() - 0.5) * 0.02,
        twinkleSpeed: 0.001 + Math.random() * 0.003,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }
  }
  function animate(){
    ctx.clearRect(0, 0, c.width, c.height);
    stars.forEach(s => {
      s.x += s.driftX;
      s.y += s.driftY;
      if(s.x < 0) s.x = c.width;
      if(s.x > c.width) s.x = 0;
      if(s.y < 0) s.y = c.height;
      if(s.y > c.height) s.y = 0;
      const tw = Math.sin(Date.now() * s.twinkleSpeed + s.twinklePhase);
      const op = s.baseOpacity + tw * 0.3;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(10, 25, 47, ${Math.max(0, op)})`;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  window.addEventListener('resize', () => { resize(); init(); });
  init();
  animate();
})();

// ===== MAGNETIC BUTTONS =====
document.querySelectorAll('.cta-button').forEach(btn => {
  btn.addEventListener('mousemove', function(e) {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
  });
  btn.addEventListener('mouseleave', function() {
    btn.style.transform = '';
  });
});

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-trigger').forEach(trigger => {
  trigger.addEventListener('click', function() {
    const item = this.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      if (openItem !== item) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
      }
    });
    item.classList.toggle('open');
    this.setAttribute('aria-expanded', String(!isOpen));
  });
});

// ===== SINGLE-STEP QUOTE FORM =====
const quoteForm = document.getElementById('quoteForm');
if (quoteForm) {
  emailjs.init('lImh7Y3P4X0INk2f4');
  
  const errorEl = document.getElementById('formError');
  const successEl = document.getElementById('formSuccess');
  const btnSubmit = document.getElementById('btnSubmit');

  quoteForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    errorEl.hidden = true;
    if(btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.textContent = 'Küldés...';
    }
    
    const formData = new FormData(quoteForm);
    const data = Object.fromEntries(formData.entries());
    
    try {
      await emailjs.send('service_l1itukg', 'template_9wkzyl9', {
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || 'Nem adta meg',
        company: data.company || 'Nem adta meg',
        website: data.website || 'Nem adta meg',
        industry: data.industry || 'Nem adta meg',
        services: data.services || 'Nem választott',
        budget: data.budget || 'Nem választott',
        timeline: data.timeline || 'Nem választott',
        source: data.source || 'Nem választott',
        description: data.description || '',
        features: 'Nem választott',
        content_source: 'Nem választott',
        branding: 'Nem választott',
        hosting: 'Nem választott',
        tech_notes: '',
        ai_tasks: 'Nem választott',
        current_tools: '',
        repetitive_tasks: '',
        team_size: 'Nem adta meg',
        payment_pref: 'Nem választott',
        maintenance: 'Nem választott',
        success_criteria: '',
        concerns: '',
        availability: 'Nem választott',
        channels: 'Nem választott',
        extra_notes: '',
        references: 'Nem adta meg',
        pages: 'Nem adta meg'
      });
      
      // Hide form fields container and show success message
      if (quoteForm.children.length > 0) {
        quoteForm.children[0].style.display = 'none';
      }
      if (successEl) {
        successEl.classList.add('visible');
      }
    } catch (err) {
      if (errorEl) {
        errorEl.textContent = 'Hiba történt a küldés során. Kérjük, próbáld újra vagy írj a hello@cestive.hu címre.';
        errorEl.hidden = false;
      }
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = 'Ajánlatkérés elküldése <span class="cta-arrow">→</span>';
      }
    }
  });
}

// ===== WORD SCROLL =====
const WordScroll = (() => {
  const defaults = {
    snap: true,
    animate: true,
    start: 180,
    end: 260,
    startIndex: 0,
  };

  const init = (selector = '.word-scroll', options = {}) => {
    const root = document.querySelector(selector);
    if (!root) return;

    const config = { ...defaults, ...options };
    const list = root.querySelector('ul');
    if (!list) return;
    const items = [...list.children];

    list.style.setProperty('--count', items.length);
    items.forEach((item, i) => {
      item.style.setProperty('--i', i);
    });

    root.dataset.snap = config.snap;
    root.dataset.animate = config.animate;
    root.style.setProperty('--start', config.start);
    root.style.setProperty('--hue', config.start);
    root.style.setProperty('--end', config.end);

    const index = Math.max(0, Math.min(config.startIndex, items.length - 1));
    const target = items[index];

    if (target) {
      requestAnimationFrame(() => {
        const offset = target.offsetTop - (root.clientHeight / 2) + (target.clientHeight / 2);
        root.scrollTop = offset;
      });
    }
  };

  return { init };
})();

WordScroll.init('.word-scroll', {
  snap: true,
  animate: true,
  start: 180,
  end: 260,
  startIndex: 3,
});

// ===== SCROLL PROGRESS BAR =====
const scrollProgressBar = document.getElementById('scrollProgress');
if (scrollProgressBar) {
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    scrollProgressBar.style.width = pct + '%';
  }, { passive: true });
}

// ===== GLOWING CARD EFFECT =====
(function() {
  const glowCards = document.querySelectorAll('[data-glow]');
  if (!glowCards.length) return;

  const pointer = { x: 0, y: 0 };
  const states = new Map();

  glowCards.forEach(card => {
    states.set(card, { angle: 0 });
  });

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateAngle(card, from, to) {
    const startTime = performance.now();
    const duration = 2000;

    function tick(now) {
      const p = Math.min((now - startTime) / duration, 1);
      const value = from + (to - from) * easeOutQuart(p);

      const glowEl = card.querySelector('.glow-effect');
      if (glowEl) glowEl.style.setProperty('--glow-start', String(value));

      const state = states.get(card);
      if (state) state.angle = value;

      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function update(x, y) {
    const proximity = 64;
    const inactiveZone = 0.01;

    glowCards.forEach(card => {
      const glowEl = card.querySelector('.glow-effect');
      if (!glowEl) return;

      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width * 0.5;
      const cy = rect.top + rect.height * 0.5;

      const dist = Math.hypot(x - cx, y - cy);
      const inactiveR = 0.5 * Math.min(rect.width, rect.height) * inactiveZone;

      if (dist < inactiveR) {
        glowEl.style.setProperty('--glow-active', '0');
        return;
      }

      const active =
        x > rect.left - proximity &&
        x < rect.left + rect.width + proximity &&
        y > rect.top - proximity &&
        y < rect.top + rect.height + proximity;

      glowEl.style.setProperty('--glow-active', active ? '1' : '0');
      if (!active) return;

      const state = states.get(card);
      const current = state ? state.angle : 0;
      let target = (180 * Math.atan2(y - cy, x - cx)) / Math.PI + 90;

      const diff = ((target - current + 180) % 360) - 180;
      animateAngle(card, current, current + diff);
    });
  }

  document.body.addEventListener('pointermove', (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    update(e.clientX, e.clientY);
  }, { passive: true });

  window.addEventListener('scroll', () => {
    update(pointer.x, pointer.y);
  }, { passive: true });
})();
