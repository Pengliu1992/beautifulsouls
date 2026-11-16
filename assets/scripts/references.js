document.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('bibliography');
  if (!list) return;

  try {
    const response = await fetch('content/references.json', {
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

    // The browser may process the URL fragment before JavaScript creates
    // the bibliography items. Scroll after the requested entry exists.
    const requestedId = decodeURIComponent(window.location.hash.slice(1));
    if (requestedId) {
      requestAnimationFrame(() => {
        const target = document.getElementById(requestedId);
        if (target) {
          target.scrollIntoView({ block: 'start', behavior: 'auto' });
          target.focus({ preventScroll: true });
        }
      });
    }
  } catch (error) {
    console.error('Bibliography loading failed:', error);
    list.textContent = 'The references could not be loaded.';
  }
});
