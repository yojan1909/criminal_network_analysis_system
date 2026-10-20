/**
 * Nexus Intelligence Command Center - Live Feed Controller
 * Safely polls the backend for live threat feeds, news updates, watchlist hits,
 * and system health without destroying page DOM or causing flicker/blanking.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initial staggered poll
  setTimeout(pollLiveThreats, 2000);
  setTimeout(pollNews, 6000);
  setTimeout(pollWatchlist, 10000);
  setTimeout(updateSystemHealth, 3000);

  // Periodic updates
  setInterval(pollLiveThreats, 25000);
  setInterval(pollNews, 60000);
  setInterval(pollWatchlist, 45000);
  setInterval(updateSystemHealth, 15000);
});

async function pollLiveThreats() {
  try {
    if (!window.NexusAPI) return;
    const res = await window.NexusAPI.get('/api/live-feeds/threats?count=1');
    if (res && res.status === 'success' && res.threats && res.threats.length > 0) {
      const threat = res.threats[0];
      
      // Inject into dashboard alert table if present
      const alertsContainer = document.querySelector('[data-priority-alerts]');
      if (alertsContainer) {
        // Check if already present to avoid duplication
        const existingId = alertsContainer.querySelector(`[data-threat-id="${threat.id}"]`);
        if (!existingId) {
          const alertDiv = document.createElement('div');
          alertDiv.setAttribute('data-threat-id', threat.id);
          alertDiv.className = 'p-space-sm rounded bg-surface-container-low border border-outline-variant/30 hover:border-primary/40 transition-colors cursor-pointer';
          alertDiv.onclick = () => { window.location.href = `entity-profiles.html?id=${threat.id}`; };
          alertDiv.innerHTML = `
            <div class="flex items-center justify-between mb-1">
              <span class="font-data-mono-sm text-data-mono-sm text-error">${threat.id}</span>
              <span class="px-1.5 py-0.5 rounded bg-error-container/30 text-error text-[10px] font-bold uppercase">LIVE FBI WANTED</span>
            </div>
            <p class="font-body-sm text-body-sm text-on-surface line-clamp-1 font-semibold">${threat.name} — ${threat.nationality || 'Fugitive'}</p>
            <p class="font-data-mono-sm text-data-mono-sm text-outline mt-0.5 truncate">${threat.description ? threat.description.slice(0, 80) + '...' : 'Under Active Federal Warrant'}</p>
          `;
          alertsContainer.prepend(alertDiv);
          
          // Maintain max 6 cards
          while (alertsContainer.children.length > 6) {
            alertsContainer.removeChild(alertsContainer.lastElementChild);
          }
        }
      }
    }
  } catch (err) {
    console.debug('[NEXUS LIVE FEED] Threat poll note:', err);
  }
}

async function pollNews() {
  try {
    if (!window.NexusAPI) return;
    const res = await window.NexusAPI.get('/api/live-feeds/news?count=3');
    if (res && res.status === 'success' && res.news && res.news.length > 0) {
      const newsTicker = document.querySelector('[data-news-ticker]');
      if (newsTicker) {
        newsTicker.innerHTML = res.news.map(n => `
          <div class="flex items-start gap-2 py-2 border-b border-outline-variant/10 last:border-0">
            <span class="material-symbols-outlined text-[14px] ${n.severity === 'critical' ? 'text-error' : n.severity === 'high' ? 'text-orange-400' : 'text-primary'} mt-0.5">article</span>
            <div class="flex-1 min-w-0">
              <p class="font-body-sm text-on-surface truncate">${n.title}</p>
              <p class="font-data-mono-sm text-data-mono-sm text-outline">${n.source} • ${new Date(n.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        `).join('');
      }
    }
  } catch (err) {
    console.debug('[NEXUS LIVE FEED] News poll note:', err);
  }
}

async function pollWatchlist() {
  try {
    if (!window.NexusAPI) return;
    const res = await window.NexusAPI.get('/api/live-feeds/watchlist?count=2');
    if (res && res.status === 'success' && res.hits && res.hits.length > 0) {
      const watchPanel = document.querySelector('[data-watchlist-hits]');
      if (watchPanel) {
        watchPanel.innerHTML = res.hits.map(h => `
          <div class="flex items-center gap-3 py-2 border-b border-outline-variant/10 last:border-0">
            <span class="material-symbols-outlined text-[16px] text-error">gpp_maybe</span>
            <div class="flex-1 min-w-0">
              <a href="entity-profiles.html?id=${h.entity_id}" class="font-body-sm text-on-surface hover:text-primary transition-colors font-medium">${h.entity_name}</a>
              <p class="font-data-mono-sm text-data-mono-sm text-outline">${h.matched_source} • ${Math.round(h.match_confidence * 100)}% Match</p>
            </div>
          </div>
        `).join('');
      }
    }
  } catch (err) {
    console.debug('[NEXUS LIVE FEED] Watchlist poll note:', err);
  }
}

async function updateSystemHealth() {
  try {
    if (!window.NexusAPI) return;
    const res = await window.NexusAPI.get('/api/live-feeds/system-health');
    if (!res) return;

    // Safely update only leaf spans in header to prevent wiping layouts
    document.querySelectorAll('header span').forEach(el => {
      if (el.children.length === 0) {
        const t = el.textContent.trim();
        if (t.match(/^[\d,]+\s*ev\/min$/)) {
          el.textContent = res.ingest_rate;
        } else if (t.match(/^\d+ms$/)) {
          el.textContent = `${Math.round(res.api_latency_ms)}ms`;
        }
      }
    });

    const healthPanel = document.querySelector('[data-system-health]');
    if (healthPanel) {
      healthPanel.innerHTML = `
        <div class="flex items-center gap-2 mb-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span class="font-label-md text-label-md text-emerald-400 uppercase font-bold">${res.status}</span>
        </div>
        <div class="space-y-1 font-data-mono-sm text-data-mono-sm">
          ${Object.entries(res.services || {}).map(([name, status]) => `
            <div class="flex items-center justify-between text-on-surface-variant">
              <span>${name.replace(/_/g, ' ')}</span>
              <span class="text-emerald-400 font-semibold">${status}</span>
            </div>
          `).join('')}
          <div class="flex items-center justify-between text-on-surface-variant mt-2 pt-2 border-t border-outline-variant/20">
            <span>API Latency</span>
            <span class="text-primary font-bold">${res.api_latency_ms}ms</span>
          </div>
          <div class="flex items-center justify-between text-on-surface-variant">
            <span>Ingest Rate</span>
            <span class="text-secondary font-bold">${res.ingest_rate}</span>
          </div>
        </div>
      `;
    }
  } catch (err) {
    console.debug('[NEXUS LIVE FEED] System health note:', err);
  }
}
