document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (nav) {
    const path = location.pathname.split('/').pop() || 'index.html';
    nav.querySelectorAll('a').forEach((link) => {
      if (link.getAttribute('href') === path) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
  }

  // Try a backup photo before hiding a failed image completely.
  document.querySelectorAll('.highlight-card img[data-fallback]').forEach((image) => {
    image.addEventListener('error', () => {
      if (image.dataset.fallbackTried !== 'true') {
        image.dataset.fallbackTried = 'true';
        image.src = image.dataset.fallback;
        return;
      }
      image.closest('.highlight-card')?.classList.add('image-unavailable');
      image.remove();
    });
  });
});
