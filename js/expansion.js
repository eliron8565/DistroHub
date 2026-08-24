/* DistroHub Expansion Pack — keeps the original app, adds more Linux and richer discovery. */
(() => {
  const extraPath = 'data/extra-distros.json';
  const favoriteKey = 'distroHubFavorites';
  const filterKey = 'distroHubFilter';
  const getFavorites = () => { try { return JSON.parse(localStorage.getItem(favoriteKey) || '[]'); } catch { return []; } };
  const saveFavorites = items => localStorage.setItem(favoriteKey, JSON.stringify(items));
  const esc = value => String(value ?? '').replace(/[&<>\"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[ch]));

  document.addEventListener('DOMContentLoaded', () => {
    if (!window.DistroHub) return;
    const style = document.createElement('style');
    style.textContent = `.distro-explorer-bar{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:0 0 18px;padding:12px;border:1px solid var(--glass-border-light);background:var(--glass-bg-2);border-radius:16px;backdrop-filter:blur(16px)}.distro-filter{border:1px solid var(--glass-border-light);background:transparent;color:var(--text-secondary);padding:8px 12px;border-radius:999px;cursor:pointer;font:inherit;font-size:.82rem;transition:.2s}.distro-filter:hover,.distro-filter.active{color:#fff;border-color:transparent;background:linear-gradient(135deg,var(--primary-color),var(--secondary-color));box-shadow:var(--glow-primary)}.distro-count{margin-left:auto;color:var(--text-tertiary);font-size:.82rem}.distro-card{overflow:visible}.distro-card-favorite{position:absolute;top:12px;right:12px;width:38px;height:38px;border-radius:12px;border:1px solid var(--glass-border-light);background:var(--glass-bg-2);color:var(--text-tertiary);cursor:pointer;z-index:4;backdrop-filter:blur(10px);transition:.2s}.distro-card-favorite:hover,.distro-card-favorite.active{color:#fb7185;border-color:rgba(251,113,133,.4);transform:scale(1.08)}.distro-card-badges{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}.distro-mini-badge{font-size:.68rem;padding:4px 7px;border-radius:999px;background:rgba(99,102,241,.12);border:1px solid rgba(99,102,241,.2);color:var(--text-secondary)}.distro-empty-actions{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:15px}.distro-card.is-favorite{box-shadow:0 0 0 1px rgba(251,113,133,.14),0 18px 55px rgba(251,113,133,.08)}@media(max-width:700px){.distro-count{width:100%;margin-left:0}.distro-explorer-bar{position:sticky;top:5.5rem;z-index:90}}`;
    document.head.appendChild(style);

    const proto = window.DistroHub.prototype;
    const originalLoad = proto.loadDistributions;
    const originalSetup = proto.setupEventListeners;

    proto.loadDistributions = async function() {
      try {
        const [baseResponse, extraResponse] = await Promise.all([fetch('data/distros.json'), fetch(extraPath)]);
        if (!baseResponse.ok) throw new Error('Main distro database unavailable');
        const base = await baseResponse.json();
        const extra = extraResponse.ok ? await extraResponse.json() : [];
        const seen = new Set();
        this.distros = [...base, ...extra].filter(d => d?.name && !seen.has(d.name) && seen.add(d.name));
        this.filteredDistros = [...this.distros];
      } catch (error) {
        console.error('DistroHub expansion load failed:', error);
        if (originalLoad) await originalLoad.call(this);
      }
    };

    proto.setupEventListeners = function() {
      originalSetup.call(this);
      const page = document.getElementById('distros');
      const header = page?.querySelector('.page-header');
      if (!header || document.getElementById('distroExplorerBar')) return;
      const bar = document.createElement('div');
      bar.id = 'distroExplorerBar';
      bar.className = 'distro-explorer-bar';
      bar.innerHTML = `<button class="distro-filter active" data-filter="all">All</button><button class="distro-filter" data-filter="favorites">❤️ Favorites</button><button class="distro-filter" data-filter="Beginner">Beginner</button><button class="distro-filter" data-filter="Intermediate">Intermediate</button><button class="distro-filter" data-filter="Advanced">Advanced</button><button class="distro-filter" data-filter="Gaming">🎮 Gaming</button><button class="distro-filter" data-filter="Lightweight">⚡ Lightweight</button><button class="distro-filter" data-filter="Server">🖥️ Server</button><span class="distro-count" id="distroCount"></span>`;
      header.insertAdjacentElement('afterend', bar);
      bar.querySelectorAll('.distro-filter').forEach(btn => btn.addEventListener('click', () => {
        bar.querySelectorAll('.distro-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        localStorage.setItem(filterKey, filter);
        this.applyExpansionFilter(filter);
      }));
      const saved = localStorage.getItem(filterKey) || 'all';
      const active = [...bar.querySelectorAll('.distro-filter')].find(b => b.dataset.filter === saved);
      (active || bar.querySelector('[data-filter="all"]')).click();
    };

    proto.applyExpansionFilter = function(filter) {
      const favorites = new Set(getFavorites());
      if (filter === 'all') this.filteredDistros = [...this.distros];
      else if (filter === 'favorites') this.filteredDistros = this.distros.filter(d => favorites.has(d.name));
      else if (['Beginner','Intermediate','Advanced'].includes(filter)) this.filteredDistros = this.distros.filter(d => d.difficulty === filter);
      else if (['Gaming','Lightweight','Server'].includes(filter)) this.filteredDistros = this.distros.filter(d => String(d.category).includes(filter) || (d.useCases || []).some(u => String(u).toLowerCase().includes(filter.toLowerCase())));
      else this.filteredDistros = [...this.distros];
      this.renderDistributions();
    };

    proto.toggleFavorite = function(name) {
      const favorites = getFavorites();
      const index = favorites.indexOf(name);
      if (index >= 0) favorites.splice(index, 1); else favorites.push(name);
      saveFavorites(favorites);
      this.applyExpansionFilter(localStorage.getItem(filterKey) || 'all');
    };

    proto.renderDistributions = function() {
      const container = document.getElementById('distrosContainer');
      if (!container) return;
      const favorites = new Set(getFavorites());
      const list = this.filteredDistros || [];
      const count = document.getElementById('distroCount');
      if (count) count.textContent = `${list.length} of ${this.distros.length} distributions`;
      if (!list.length) {
        container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:4rem 2rem"><div style="font-size:52px;margin-bottom:12px">🐧</div><h3>No distributions found</h3><p style="color:var(--text-secondary)">Try another filter or add a favorite.</p><div class="distro-empty-actions"><button class="btn btn-primary" onclick="app.applyExpansionFilter('all')">Show All</button></div></div>`;
        return;
      }
      container.innerHTML = list.map(distro => {
        const isFav = favorites.has(distro.name);
        const uses = (distro.useCases || []).slice(0,3);
        const safeName = esc(distro.name).replace(/'/g,"\\'");
        const safeUrl = esc(distro.downloadUrl || '').replace(/'/g,"\\'");
        return `<div class="distro-card ${isFav ? 'is-favorite' : ''}"><button class="distro-card-favorite ${isFav ? 'active' : ''}" aria-label="${isFav ? 'Remove from' : 'Add to'} favorites" onclick="app.toggleFavorite('${safeName}')"><i class="fa${isFav ? 's' : 'r'} fa-heart"></i></button><div class="distro-card-logo">${distro.icon || '🐧'}</div><h3 class="distro-card-name">${esc(distro.name)}</h3><span class="distro-card-category">${esc(distro.category || 'Linux')}</span><div class="distro-card-badges">${distro.difficulty ? `<span class="distro-mini-badge">${esc(distro.difficulty)}</span>` : ''}${uses.map(u=>`<span class="distro-mini-badge">${esc(u)}</span>`).join('')}</div><p class="distro-card-description">${esc(distro.description)}</p><div class="distro-card-info"><div><strong>Base:</strong> ${esc(distro.base)}</div><div><strong>Release:</strong> ${esc(distro.release)}</div></div><div class="distro-card-buttons"><button class="btn-download" onclick="app.downloadDistro('${safeName}','${safeUrl}')"><i class="fas fa-download"></i> Download</button><button class="btn-details" onclick="app.showDistroDetails('${safeName}')"><i class="fas fa-info-circle"></i> Details</button></div></div>`;
      }).join('');
    };

    proto.handleSearch = function(query) {
      const q = query.trim().toLowerCase();
      if (!q) this.filteredDistros = [...this.distros];
      else this.filteredDistros = this.distros.filter(d => [d.name,d.description,d.category,d.base,d.release,d.support,d.packageManager,d.desktopEnvironment,d.alternativeTo,d.difficulty,...(d.useCases||[])].filter(Boolean).join(' ').toLowerCase().includes(q));
      this.renderDistributions();
    };
  });
})();
