document.addEventListener('DOMContentLoaded', async () => {
  const toc = document.getElementById('reader-toc');
  const title = document.getElementById('reader-title');
  const meta = document.getElementById('reader-meta');
  const partLabel = document.getElementById('reader-part');
  const body = document.getElementById('reader-body');
  if (!toc || !title || !meta || !partLabel || !body) return;

  let index;
  const groups = new Map();

  try {
    const response = await fetch('essays-index.json');
    if (!response.ok) throw new Error('Could not load the reading index');
    index = await response.json();
  } catch (error) {
    title.textContent = 'The reading could not be loaded';
    body.textContent = 'Please refresh the page or return to The Framework later.';
    return;
  }

  const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));

  const citationMarkup = text => escapeHtml(text).replace(/\[(\d+(?:,\s*\d+)*)\]/g, (match, numbers) => {
    const links = numbers.split(/,\s*/).map(number =>
      '<a class="citation" href="references.html#ref-' + number + '" aria-label="Reference ' + number + '">' + number + '</a>'
    );
    return '[' + links.join(', ') + ']';
  });

  function labelFor(entry) {
    return entry.label === 'Part opening'
      ? entry.part + ' · Opening'
      : entry.label + '  ' + entry.title;
  }

  const byPart = new Map();
  index.order.forEach(id => {
    const entry = index.entries[id];
    if (!byPart.has(entry.part)) byPart.set(entry.part, []);
    byPart.get(entry.part).push(id);
  });

  [...byPart.entries()].forEach(([part, ids], groupIndex) => {
    const group = document.createElement('section');
    group.className = 'toc-part-group';

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'toc-part-toggle';
    toggle.setAttribute('aria-expanded', groupIndex === 0 ? 'true' : 'false');
    toggle.setAttribute('aria-controls', 'toc-items-' + groupIndex);

    const chevron = document.createElement('span');
    chevron.className = 'toc-chevron';
    chevron.setAttribute('aria-hidden', 'true');
    chevron.textContent = '⌄';

    const text = document.createElement('span');
    text.className = 'toc-part-name';
    text.textContent = part === 'Part I'
      ? 'Part I — The Creator: Ultimate Ground, Origin, and Cause'
      : 'Part II — Humanity: Heaven’s Breath in Earthly Clay';
    toggle.append(chevron, text);

    const list = document.createElement('div');
    list.className = 'toc-part-items';
    list.id = 'toc-items-' + groupIndex;
    list.hidden = groupIndex !== 0;

    ids.forEach(id => {
      const entry = index.entries[id];
      const link = document.createElement('a');
      link.href = 'framework.html?article=' + encodeURIComponent(id);
      link.dataset.articleId = id;
      link.textContent = labelFor(entry);
      if (entry.label === 'Part opening') link.classList.add('toc-opening');
      link.addEventListener('click', event => {
        event.preventDefault();
        const url = new URL(location.href);
        url.searchParams.set('article', id);
        history.pushState({ article: id }, '', url);
        loadArticle(id, true);
      });
      list.appendChild(link);
    });

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      list.hidden = expanded;
    });

    group.append(toggle, list);
    toc.appendChild(group);
    groups.set(part, { toggle, list });
  });

  async function loadArticle(id, scrollToArticle = false) {
    const entry = index.entries[id] ? { ...index.entries[id] } : null;
    if (!entry) {
      title.textContent = 'Reading entry not found';
      body.textContent = 'Choose a section from the contents panel.';
      return;
    }

    try {
      const response = await fetch(entry.source);
      if (!response.ok) throw new Error('Could not load this manuscript section');
      const source = await response.json();
      const article = { ...entry, ...source };

      document.title = (article.label === 'Part opening' ? article.part : article.label) + ' · ' + article.title + ' | Beautiful Souls';
      partLabel.textContent = article.part;
      meta.textContent = article.label === 'Part opening'
        ? article.part.toUpperCase() + ' · OPENING'
        : article.part.toUpperCase() + ' · SECTION ' + article.label;
      title.textContent = article.title;
      body.replaceChildren();

      (article.paragraphs || []).forEach(paragraph => {
        const p = document.createElement('p');
        p.innerHTML = citationMarkup(paragraph);
        body.appendChild(p);
      });

      toc.querySelectorAll('a[data-article-id]').forEach(link => {
        const current = link.dataset.articleId === id;
        link.classList.toggle('current', current);
        if (current) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });

      const group = groups.get(article.part);
      if (group) {
        group.toggle.setAttribute('aria-expanded', 'true');
        group.list.hidden = false;
      }

      if (scrollToArticle && window.matchMedia('(max-width: 850px)').matches) {
        document.querySelector('.reader-article').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (error) {
      title.textContent = 'The essay could not be loaded';
      body.textContent = 'Please return to The Framework and choose another reading.';
    }
  }

  window.addEventListener('popstate', event => {
    const id = (event.state && event.state.article) || new URLSearchParams(location.search).get('article') || 'part1';
    loadArticle(id);
  });

  const initialId = new URLSearchParams(location.search).get('article') || 'part1';
  await loadArticle(index.entries[initialId] ? initialId : 'part1');
});