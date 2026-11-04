const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const moodButton = document.querySelector('.mood-toggle');
const heroArt = document.querySelector('.hero-art');

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation.classList.toggle('open', !isOpen);
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('open');
  });
});

moodButton.addEventListener('click', () => {
  const active = document.body.classList.toggle('alt-mode');
  moodButton.setAttribute('aria-pressed', String(active));
});

const activateHero = () => {
  heroArt.classList.remove('clicked');
  void heroArt.offsetWidth;
  heroArt.classList.add('clicked');
  document.body.classList.toggle('alt-mode');
  moodButton.setAttribute('aria-pressed', String(document.body.classList.contains('alt-mode')));
};

heroArt.addEventListener('click', activateHero);
heroArt.querySelector('img').addEventListener('animationend', (event) => {
  if (event.animationName === 'hero-pop') heroArt.classList.remove('clicked');
});
heroArt.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    activateHero();
  }
});

document.querySelectorAll('.benefit-card, .risk-list p, .energy-visual').forEach((item) => {
  const toggle = () => {
    const selected = item.classList.toggle('selected');
    item.setAttribute('aria-pressed', String(selected));
  };
  item.addEventListener('click', toggle);
  item.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle();
    }
  });
});

const patternLab = document.querySelector('.pattern-lab');
const patternNodes = [...document.querySelectorAll('.pattern-node')];
patternNodes.forEach((node) => {
  node.addEventListener('click', () => {
    patternNodes.forEach((item) => item.classList.remove('active'));
    node.classList.add('active');
    const positions = ['10%', '50%', '90%'];
    patternLab.style.setProperty('--pulse-left', positions[Number(node.dataset.patternStep)]);
  });
});

const mapNodes = [...document.querySelectorAll('.benefit-map button')];
mapNodes.forEach((node) => {
  node.addEventListener('click', () => {
    const active = node.classList.toggle('active');
    node.setAttribute('aria-pressed', String(active));
    if (node.classList.contains('map-center')) {
      mapNodes.filter((item) => item !== node).forEach((item) => {
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
    }
  });
});

const scanner = document.querySelector('.media-scanner');
document.querySelectorAll('[data-scan-mode]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-scan-mode]').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    scanner.dataset.mode = button.dataset.scanMode;
  });
});

const caseVisual = document.querySelector('.case-visual');
caseVisual.addEventListener('pointermove', (event) => {
  const bounds = caseVisual.getBoundingClientRect();
  const eyeX = ((event.clientX - bounds.left) / bounds.width - .5) * 10;
  const eyeY = ((event.clientY - bounds.top) / bounds.height - .5) * 8;
  caseVisual.style.setProperty('--eye-x', `${eyeX}px`);
  caseVisual.style.setProperty('--eye-y', `${eyeY}px`);
});
caseVisual.addEventListener('pointerleave', () => {
  caseVisual.style.setProperty('--eye-x', '0px');
  caseVisual.style.setProperty('--eye-y', '0px');
});

let lastTrail = 0;
document.addEventListener('pointermove', (event) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || event.timeStamp - lastTrail < 90) return;
  lastTrail = event.timeStamp;
  const star = document.createElement('span');
  star.className = 'trail-star';
  star.setAttribute('aria-hidden', 'true');
  star.textContent = '✦';
  star.style.left = `${event.clientX + 8}px`;
  star.style.top = `${event.clientY + 8}px`;
  document.body.appendChild(star);
  star.addEventListener('animationend', () => star.remove());
});

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...navigation.querySelectorAll('a')];

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-35% 0px -55%' });

sections.forEach((section) => sectionObserver.observe(section));

const revealItems = document.querySelectorAll('.section-heading, .article-copy > *, .conclusion > *');
revealItems.forEach((item) => item.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => revealObserver.observe(item));
