// Startup Idea Generator - script.js
// Usage: click "New idea" or press Space. Save favorites, download as JSON.

(() => {
  const ideaText = document.getElementById('ideaText');
  const ideaMeta = document.getElementById('ideaMeta');
  const newBtn = document.getElementById('newBtn');
  const saveBtn = document.getElementById('saveBtn');
  const copyBtn = document.getElementById('copyBtn');
  const showAllBtn = document.getElementById('showAllBtn');
  const allModal = document.getElementById('allModal');
  const closeModal = document.getElementById('closeModal');
  const allList = document.getElementById('allList');
  const addInput = document.getElementById('addInput');
  const favList = document.getElementById('favList');
  const downloadBtn = document.getElementById('downloadBtn');
  const clearFavBtn = document.getElementById('clearFavBtn');

  let ideas = [];
  let current = null;
  const FAVORITES_KEY = 'startup-ideas-favorites';

  function fetchIdeas() {
    return fetch('ideas.json')
      .then(r => {
        if (!r.ok) throw new Error('Failed to load ideas.json');
        return r.json();
      })
      .then(data => {
        if (!Array.isArray(data)) throw new Error('ideas.json must be an array');
        ideas = data;
      })
      .catch(e => {
        console.error(e);
        // Fallback tiny list
        ideas = [
          { idea: 'Neighborhood compost pickup service', summary: 'Weekly pickup of compost for busy households, processed into saleable compost for gardeners.' },
          { idea: 'AR furniture try-on app', summary: 'Mobile app that uses AR to show furniture in your room before you buy.' }
        ];
      });
  }

  function pickRandom() {
    if (!ideas.length) return null;
    const idx = Math.floor(Math.random() * ideas.length);
    return ideas[idx];
  }

  function renderIdea(obj) {
    if (!obj) {
      ideaText.textContent = 'No idea available.';
      ideaMeta.textContent = '';
      current = null;
      return;
    }
    current = obj;
    ideaText.textContent = obj.idea || 'Untitled idea';
    ideaMeta.textContent = obj.summary ? obj.summary : '';
  }

  function loadFavorites() {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  function saveFavorites(list) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(list, null, 2));
    renderFavorites();
  }

  function renderFavorites() {
    const favs = loadFavorites();
    favList.innerHTML = '';
    if (!favs.length) {
      favList.innerHTML = '<li>No favorites yet — save ideas you like.</li>';
      return;
    }
    for (let i = 0; i < favs.length; i++) {
      const li = document.createElement('li');
      const left = document.createElement('div');
      left.style.width = '100%';
      const title = document.createElement('div');
      title.textContent = favs[i].idea;
      title.style.fontWeight = '700';
      const meta = document.createElement('div');
      meta.textContent = favs[i].summary || '';
      meta.className = 'meta';
      left.appendChild(title);
      left.appendChild(meta);

      const right = document.createElement('div');
      right.style.display = 'flex';
      right.style.gap = '8px';
      const copy = document.createElement('button');
      copy.className = 'btn small';
      copy.textContent = 'Copy';
      copy.addEventListener('click', () => {
        navigator.clipboard?.writeText(favs[i].idea + (favs[i].summary ? '\n\n' + favs[i].summary : ''));
      });

      const remove = document.createElement('button');
      remove.className = 'btn small';
      remove.textContent = 'Remove';
      remove.addEventListener('click', () => {
        const updated = favs.filter((_, j) => j !== i);
        saveFavorites(updated);
      });

      right.appendChild(copy);
      right.appendChild(remove);

      li.appendChild(left);
      li.appendChild(right);
      favList.appendChild(li);
    }
  }

  function addCurrentToFavorites() {
    if (!current) return;
    const favs = loadFavorites();
    // prevent duplicates by idea text
    if (favs.some(f => f.idea === current.idea)) {
      alert('This idea is already in favorites.');
      return;
    }
    favs.unshift(current);
    saveFavorites(favs);
  }

  function showAllIdeas() {
    allList.innerHTML = '';
    if (!ideas.length) {
      allList.textContent = 'No ideas loaded.';
    } else {
      ideas.forEach((it, idx) => {
        const item = document.createElement('div');
        item.className = 'all-item';
        const title = document.createElement('div');
        title.className = 'title';
        title.textContent = it.idea;
        const meta = document.createElement('div');
        meta.textContent = it.summary || '';
        meta.className = 'meta';
        const actions = document.createElement('div');
        actions.style.marginTop = '8px';
        actions.style.display = 'flex';
        actions.style.gap = '8px';
        const useBtn = document.createElement('button');
        useBtn.className = 'btn small';
        useBtn.textContent = 'Use';
        useBtn.addEventListener('click', () => {
          renderIdea(it);
          closeAllModal();
        });
        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn small';
        saveBtn.textContent = 'Save';
        saveBtn.addEventListener('click', () => {
          const favs = loadFavorites();
          if (favs.some(f => f.idea === it.idea)) return alert('Already saved');
          favs.unshift(it);
          saveFavorites(favs);
        });
        actions.appendChild(useBtn);
        actions.appendChild(saveBtn);

        item.appendChild(title);
        item.appendChild(meta);
        item.appendChild(actions);
        allList.appendChild(item);
      });
    }
    allModal.setAttribute('aria-hidden', 'false');
  }

  function closeAllModal() {
    allModal.setAttribute('aria-hidden', 'true');
  }

  function downloadFavorites() {
    const favs = loadFavorites();
    const blob = new Blob([JSON.stringify(favs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'startup-ideas-favorites.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function addCustomIdea(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const item = { idea: trimmed, summary: '' };
    ideas.unshift(item);
    renderIdea(item);
    addInput.value = '';
  }

  // Wire events
  newBtn.addEventListener('click', () => renderIdea(pickRandom()));
  saveBtn.addEventListener('click', addCurrentToFavorites);
  copyBtn.addEventListener('click', () => {
    if (!current) return;
    const text = current.idea + (current.summary ? '\n\n' + current.summary : '');
    navigator.clipboard?.writeText(text);
  });
  showAllBtn.addEventListener('click', showAllIdeas);
  closeModal.addEventListener('click', closeAllModal);
  allModal.addEventListener('click', (e) => {
    if (e.target === allModal) closeAllModal();
  });
  downloadBtn.addEventListener('click', downloadFavorites);
  clearFavBtn.addEventListener('click', () => {
    if (confirm('Clear all favorites?')) {
      saveFavorites([]);
    }
  });

  addInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addCustomIdea(addInput.value);
    }
  });

  // Keyboard: Space -> new idea (but avoid when typing in input)
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && document.activeElement !== addInput) {
      e.preventDefault();
      renderIdea(pickRandom());
    }
  });

  // Init
  fetchIdeas().then(() => {
    renderIdea(pickRandom());
    renderFavorites();
  });
})();