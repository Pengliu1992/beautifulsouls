(() => {
  const grid = document.getElementById('highlight-grid');
  if (!grid) return;

  function showError() {
    const message = document.createElement('p');
    message.className = 'highlight-description';
    message.setAttribute('role', 'status');
    message.textContent = 'The homepage themes could not be loaded. Please refresh the page.';
    grid.replaceChildren(message);
    grid.setAttribute('aria-busy', 'false');
  }

  function createCard(id, entry) {
    const card = document.createElement('article');
    card.className = 'highlight-card';

    const copy = document.createElement('div');
    copy.className = 'highlight-copy';

    const heading = document.createElement('h2');
    const link = document.createElement('a');
    link.className = 'highlight-title-link';
    link.href = 'framework.html?article=' + encodeURIComponent(id);
    link.textContent = entry.title;
    heading.appendChild(link);

    const description = document.createElement('p');
    description.className = 'highlight-description';
    description.textContent = entry.summary;
    copy.append(heading, description);

    const image = document.createElement('img');
    image.src = entry.image;
    image.alt = entry.imageAlt;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.addEventListener('error', () => {
      card.classList.add('image-unavailable');
      image.remove();
    }, { once: true });

    card.append(copy, image);
    return card;
  }

  async function renderCards() {
    try {
      const response = await fetch('content/framework-index.json', {
        cache: 'no-store',
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('Could not load the framework index');

      const index = await response.json();
      if (!Array.isArray(index.order) || !index.entries) {
        throw new Error('Unexpected framework index structure');
      }

      const cards = index.order.map((id) => {
        const entry = index.entries[id];
        if (!entry || entry.id !== id || !entry.title || !entry.summary || !entry.image || !entry.imageAlt) {
          throw new Error('Incomplete homepage data for ' + id);
        }
        return createCard(id, entry);
      });

      grid.replaceChildren(...cards);
      grid.setAttribute('aria-busy', 'false');
    } catch (error) {
      console.error('Homepage cards could not be loaded:', error);
      showError();
    }
  }

  renderCards();
})();
