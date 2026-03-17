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

// ===== COUNT-UP ANIMATION =====
function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function countUp(el, target, suffix, duration) {
  suffix = suffix || '';
  duration = duration || 2000;
  var start = performance.now();

  function update(now) {
    var elapsed = now - start;
    var p = Math.min(elapsed / duration, 1);
    var eased = easeOutExpo(p);
    var cur = eased * target;
    el.textContent = (target % 1 === 0 ? Math.floor(cur) : cur.toFixed(1)) + suffix;
    if (p < 1) requestAnimationFrame(update);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(update);
}

// Observe stat items for count-up
const statItems = document.querySelectorAll('.stat[data-target]');
if (statItems.length > 0) {
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.stat[data-target]');
        items.forEach((item, i) => {
          setTimeout(() => {
            const numEl = item.querySelector('.stat-number');
            const target = parseFloat(item.dataset.target);
            const suffix = item.dataset.suffix || '';
            countUp(numEl, target, suffix);
          }, i * 200);
        });
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  // Observe the parent panel
  const statsPanel = document.querySelector('.stats-panel');
  if (statsPanel) statObserver.observe(statsPanel);
}

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

// ===== QUOTE FORM SUBMISSION (EmailJS) =====
const quoteForm = document.getElementById('quoteForm');
if (quoteForm) {
  emailjs.init('lImh7Y3P4X0INk2f4');

  quoteForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = document.getElementById('formSubmit');
    const errorEl = document.getElementById('formError');
    errorEl.hidden = true;

    // Collect form data
    const data = {};
    new FormData(quoteForm).forEach(function(val, key) { data[key] = val; });

    // Client-side required check
    var required = ['name', 'email', 'company', 'industry', 'service', 'description'];
    for (var i = 0; i < required.length; i++) {
      if (!data[required[i]] || !data[required[i]].trim()) {
        errorEl.textContent = 'Kérjük, töltsd ki az összes kötelező mezőt (*).';
        errorEl.hidden = false;
        return;
      }
    }

    btn.disabled = true;
    btn.innerHTML = 'Küldés... <span class="cta-arrow">→</span>';

    try {
      await emailjs.send('service_l1itukg', 'template_9wkzyl9', {
        name: data.name,
        email: data.email,
        phone: data.phone || 'Nem adta meg',
        company: data.company,
        website: data.website || 'Nem adta meg',
        industry: data.industry,
        service: data.service,
        description: data.description,
        budget: data.budget || 'Nem adta meg',
        timeline: data.timeline || 'Nem adta meg',
        source: data.source || 'Nem adta meg'
      });
      window.location.href = 'koszonjuk.html';
    } catch (err) {
      errorEl.textContent = 'Hiba történt a küldés során. Kérjük, próbáld újra vagy írj a hello@cestive.hu címre.';
      errorEl.hidden = false;
      btn.disabled = false;
      btn.innerHTML = 'Ajánlat kérése <span class="cta-arrow">→</span>';
    }
  });
}

// ===== SCROLL PROGRESS BAR =====
const scrollProgressBar = document.getElementById('scrollProgress');
if (scrollProgressBar) {
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    scrollProgressBar.style.width = pct + '%';
  }, { passive: true });
}
