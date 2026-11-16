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
});
