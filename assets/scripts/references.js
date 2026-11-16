document.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('bibliography');
  if (!list) return;

  // Recalculate the target position after the bibliography has been inserted
  // and the browser has completed its initial font/layout pass.
  function scrollToRequestedReference() {
    const requestedId = window.location.hash.slice(1);
    if (!requestedId) return;

    const scrollWhenReady = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const target = document.getElementById(requestedId);
          if (!target) return;

          const header = document.querySelector('.site-header');
          const stickyOffset = header
            ? Math.max(0, header.getBoundingClientRect().bottom)
            : 0;
          const targetTop = target.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: Math.max(0, targetTop - stickyOffset - 14),
            behavior: 'auto'
          });
          target.focus({ preventScroll: true });
        });
      });
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(scrollWhenReady, scrollWhenReady);
    } else {
      scrollWhenReady();
    }
  }

  try {
    const response = await fetch('content/references.json', {
      cache: 'no-store',
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error('Could not load the bibliography');

    const references = await response.json();
    const fragment = document.createDocumentFragment();

    references.forEach((reference) => {
      const item = document.createElement('li');
      item.id = 'ref-' + reference.number;
      item.tabIndex = -1;

      const number = document.createElement('span');
      number.className = 'ref-number';
      number.textContent = '[' + reference.number + ']';

      const text = document.createElement('span');
      text.textContent = reference.text;

      const top = document.createElement('a');
      top.className = 'back-to-top';
      top.href = '#top';
      top.textContent = '↑';
      top.setAttribute('aria-label', 'Back to top');

      item.append(number, text, top);
      fragment.appendChild(item);
    });

    list.replaceChildren(fragment);

    // Handle both direct citation links and later hash changes on this page.
    scrollToRequestedReference();
    window.addEventListener('hashchange', scrollToRequestedReference);
  } catch (error) {
    console.error('Bibliography loading failed:', error);
    list.textContent = 'The references could not be loaded.';
  }
});
