// ===== LOADER =====
document.body.classList.add('loading');

window.addEventListener('load', () => {
  const frameCanvas = document.getElementById('frameCanvas');

  // If frame animation exists, loader waits for frames (handled in inline script)
  // Otherwise, use timed loader for subpages
  if (!frameCanvas) {
    setTimeout(() => {
      hideLoader();
    }, 800);
  }
});

function hideLoader() {
  document.body.classList.remove('loading');
  const loader = document.getElementById('loader');
  if (!loader) return;
  loader.classList.add('fade-out');

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

// ===== UNIFIED SCROLL HANDLER =====
const navbar = document.getElementById('navbar');
let scrollTicking = false;

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      // Navbar
      if (navbar) {
        if (scrollY > 60) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
      }
      // Scroll progress
      const bar = document.getElementById('scrollProgress');
      if (bar) {
        const pct = (scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        bar.style.width = pct + '%';
      }
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });

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
  let rafId = null;
  let lastFrame = 0;
  const FRAME_INTERVAL = 50; // ~20fps cap

  function resize(){
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    c.style.width = window.innerWidth + 'px';
    c.style.height = window.innerHeight + 'px';
  }
  function init(){
    resize();
    stars = [];
    const starCount = window.innerWidth <= 768 ? 30 : 60;
    for(let i=0; i<starCount; i++){
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
  function animate(now){
    rafId = requestAnimationFrame(animate);
    if(now - lastFrame < FRAME_INTERVAL) return;
    lastFrame = now;
    ctx.clearRect(0, 0, c.width, c.height);
    const t = now;
    for(let i = 0; i < stars.length; i++){
      const s = stars[i];
      s.x += s.driftX;
      s.y += s.driftY;
      if(s.x < 0) s.x = c.width;
      if(s.x > c.width) s.x = 0;
      if(s.y < 0) s.y = c.height;
      if(s.y > c.height) s.y = 0;
      const tw = Math.sin(t * s.twinkleSpeed + s.twinklePhase);
      const op = s.baseOpacity + tw * 0.3;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(10, 25, 47, ${Math.max(0, op)})`;
      ctx.fill();
    }
  }
  // Pause when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if(document.hidden){
      if(rafId){ cancelAnimationFrame(rafId); rafId = null; }
    } else {
      if(!rafId){ lastFrame = 0; rafId = requestAnimationFrame(animate); }
    }
  });
  window.addEventListener('resize', () => { resize(); init(); });
  init();
  rafId = requestAnimationFrame(animate);
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
document.querySelectorAll('.faq-question').forEach(trigger => {
  trigger.addEventListener('click', function() {
    const item = this.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      if (openItem !== item) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
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
        services: data.service_type || 'Nem választott',
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

// Scroll progress bar handled in unified scroll handler above

// ===== GLOWING CARD EFFECT =====
(function() {
  const glowCards = document.querySelectorAll('[data-glow]');
  if (!glowCards.length) return;

  const pointer = { x: 0, y: 0 };
  const states = new Map();

  glowCards.forEach(card => {
    states.set(card, { angle: 0, rafId: null });
  });

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateAngle(card, from, to) {
    const state = states.get(card);
    if (!state) return;
    // Cancel any running animation for this card
    if (state.rafId) cancelAnimationFrame(state.rafId);

    const startTime = performance.now();
    const duration = 2000;
    const glowEl = card.querySelector('.glow-effect');
    if (!glowEl) return;

    function tick(now) {
      const p = Math.min((now - startTime) / duration, 1);
      const value = from + (to - from) * easeOutQuart(p);
      glowEl.style.setProperty('--glow-start', String(value));
      state.angle = value;
      if (p < 1) {
        state.rafId = requestAnimationFrame(tick);
      } else {
        state.rafId = null;
      }
    }
    state.rafId = requestAnimationFrame(tick);
  }

  let updateRaf = null;
  function scheduleUpdate() {
    if (updateRaf) return;
    updateRaf = requestAnimationFrame(() => {
      updateRaf = null;
      doUpdate(pointer.x, pointer.y);
    });
  }

  function doUpdate(x, y) {
    const proximity = 64;

    glowCards.forEach(card => {
      const glowEl = card.querySelector('.glow-effect');
      if (!glowEl) return;

      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width * 0.5;
      const cy = rect.top + rect.height * 0.5;

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
    scheduleUpdate();
  }, { passive: true });

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
})();
