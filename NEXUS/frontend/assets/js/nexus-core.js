/**
 * Nexus Intelligence Command Center - Core Frontend Controller
 * Handles: API communication, dashboard data binding, global search, notifications, toasts,
 * entity profiles, case workspaces, cross-case search, and all page controllers.
 */

const NexusAPI = {
  base: window.location.origin,

  async get(endpoint) {
    try {
      const res = await fetch(`${this.base}${endpoint}`);
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error(`[NEXUS API] GET ${endpoint}:`, err);
      return null;
    }
  },

  async post(endpoint, data) {
    try {
      const res = await fetch(`${this.base}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error(`[NEXUS API] POST ${endpoint}:`, err);
      return null;
    }
  },

  async put(endpoint, data) {
    try {
      const res = await fetch(`${this.base}${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error(`[NEXUS API] PUT ${endpoint}:`, err);
      return null;
    }
  },

  // --- NLP & AI Intelligence Methods ---
  async extractNLP(text, title = 'Investigative Note') {
    return await this.post('/api/nlp/extract', { text, document_title: title });
  },

  async ingestDocument(title, text, caseId = null) {
    return await this.post('/api/nlp/ingest', { title, text, case_id: caseId });
  },

  async getReviewQueue(caseId = null) {
    const url = caseId ? `/api/nlp/review-queue?case_id=${encodeURIComponent(caseId)}` : '/api/nlp/review-queue';
    return await this.get(url);
  },

  async approveQueuedItem(id, editedName = null, editedType = null) {
    return await this.post(`/api/nlp/review-queue/${id}/approve`, { edited_name: editedName, edited_type: editedType });
  },

  async rejectQueuedItem(id) {
    return await this.post(`/api/nlp/review-queue/${id}/reject`, {});
  },

  async askCopilot(message, caseId = 'CS-2024-8841') {
    return await this.post('/api/ai/chat', { message, case_id: caseId });
  },

  async getAIStatus() {
    return await this.get('/api/ai/status');
  }
};

// Make API globally available
window.NexusAPI = NexusAPI;

// Utility: get URL params
function getUrlParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// Utility: format currency
function formatCurrency(amount, currency = 'EUR') {
  if (currency === 'INR') return '₹' + Number(amount).toLocaleString('en-IN');
  if (currency === 'USD') return '$' + Number(amount).toLocaleString();
  return '€' + Number(amount).toLocaleString();
}

// Utility: format timestamp
function formatTime(ts) {
  if (!ts) return '—';
  try {
    return new Date(ts).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return ts; }
}

// Utility: severity color class
function sevColor(severity) {
  const m = { critical: 'text-red-400', high: 'text-orange-400', medium: 'text-yellow-400', low: 'text-blue-400' };
  return m[severity] || 'text-slate-400';
}

function sevBg(severity) {
  const m = { critical: 'bg-red-500/15 text-red-400 border-red-500/30', high: 'bg-orange-500/15 text-orange-400 border-orange-500/30', medium: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', low: 'bg-blue-500/15 text-blue-400 border-blue-500/30' };
  return m[severity] || 'bg-slate-500/15 text-slate-400 border-slate-500/30';
}

// Entity type icon mapping
function entityIcon(type) {
  const m = {
    'Person': 'person', 'Organization': 'business', 'Location': 'location_on',
    'Vehicle': 'directions_car', 'PhoneNumber': 'phone', 'BankAccount': 'account_balance',
    'SocialMediaAccount': 'share', 'Document': 'description',
  };
  return m[type] || 'hub';
}

function entityColor(type) {
  const m = {
    'Person': '#4cd7f6', 'Organization': '#c084fc', 'Location': '#10b981',
    'Vehicle': '#f59e0b', 'PhoneNumber': '#ec4899', 'BankAccount': '#6366f1',
    'SocialMediaAccount': '#8b5cf6',
  };
  return m[type] || '#64748b';
}

// Risk score badge HTML
function riskBadge(score) {
  let cls = 'bg-green-500/15 text-green-400 border-green-500/30';
  if (score >= 80) cls = 'bg-red-500/15 text-red-400 border-red-500/30';
  else if (score >= 60) cls = 'bg-orange-500/15 text-orange-400 border-orange-500/30';
  else if (score >= 40) cls = 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30';
  return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-mono font-bold ${cls}">${score}/100</span>`;
}


document.addEventListener('DOMContentLoaded', () => {
  // 1. Live Tactical UTC Clock
  const clockEl = document.getElementById('tactical-clock');
  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    const utcHours = String(now.getUTCHours()).padStart(2, '0');
    const utcMins = String(now.getUTCMinutes()).padStart(2, '0');
    const utcSecs = String(now.getUTCSeconds()).padStart(2, '0');
    clockEl.textContent = `${utcHours}:${utcMins}:${utcSecs} UTC`;
  }
  if (clockEl) {
    updateClock();
    setInterval(updateClock, 1000);
  }

  // 2. Global Hotkeys (/ or Cmd/Ctrl+K) for Search
  window.addEventListener('keydown', (e) => {
    if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      const currentPath = window.location.pathname;
      if (!currentPath.includes('cross-case-search')) {
        window.location.href = 'cross-case-search.html';
      } else {
        const searchInput = document.querySelector('input[type="text"], input[type="search"]');
        if (searchInput) searchInput.focus();
      }
    }
  });

  // 3. Tactical Toast Notification Utility
  window.showTacticalToast = function(message, type = 'info') {
    let container = document.getElementById('nexus-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'nexus-toast-container';
      container.className = 'fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    const borderColor = type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : type === 'error' ? '#ef4444' : '#06b6d4';
    toast.className = 'pointer-events-auto px-4 py-2.5 rounded-lg bg-[#141a21] border text-xs font-mono text-slate-200 shadow-xl flex items-center gap-2 transform translate-y-2 opacity-0 transition-all duration-300';
    toast.style.borderColor = borderColor;
    toast.innerHTML = `
      <span class="w-2 h-2 rounded-full" style="background-color: ${borderColor}"></span>
      <span>${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => { toast.classList.remove('translate-y-2', 'opacity-0'); }, 10);
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  };

  // Initialize all page controllers
  initDashboard();
  initAlertsPage();
  initReportGenerator();
  initTabsNavigation();
  initGlobalSearch();
  initNotificationBadge();
  initCaseFileButton();
  initEntityProfilePage();
  initCaseWorkspacePage();
  initCrossSearchPage();
  initNetworkExplorerPage();

  // Initialize Global AI Copilot Floating Widget
  initGlobalCopilotWidget();

  // Universal button auto-wiring for all actions (Add Files, Add POI, Change Status, etc.)
  wireAllInteractiveButtons();
});


// ============================================================
//  DASHBOARD PAGE
// ============================================================
async function initDashboard() {
  const isIndex = window.location.pathname === '/' ||
                  window.location.pathname.endsWith('index.html') ||
                  window.location.pathname.endsWith('/');
  if (!isIndex) return;

  // Fetch dashboard stats
  const stats = await NexusAPI.get('/api/dashboard/stats');
  if (stats) {
    updateKPICards(stats);
  }

  // Fetch priority alerts
  const alertData = await NexusAPI.get('/api/dashboard/priority-alerts');
  if (alertData && alertData.alerts) {
    updatePriorityAlerts(alertData.alerts);
  }

  // Fetch recent activity
  const activityData = await NexusAPI.get('/api/dashboard/recent-activity');
  if (activityData && activityData.activities) {
    updateRecentActivity(activityData.activities);
  }

  // Fetch case summary for case cards
  const caseData = await NexusAPI.get('/api/dashboard/case-summary');
  if (caseData && caseData.cases) {
    updateDashboardCaseCards(caseData.cases);
  }

  // Update system health bar
  const health = await NexusAPI.get('/api/live-feeds/system-health');
  if (health) {
    updateSystemHealthBar(health);
  }
}

function updateKPICards(stats) {
  const kpiMapping = {
    'Active Cases': stats.active_cases,
    'Entities Tracked': stats.total_entities,
    'Pending Review': stats.pending_review,
    'Open Alerts': stats.open_alerts,
    'Critical Alerts': stats.critical_alerts,
  };

  const allHeadlines = document.querySelectorAll('span, div, p');
  for (const [label, value] of Object.entries(kpiMapping)) {
    allHeadlines.forEach(el => {
      if (el.textContent.trim() === label) {
        const parent = el.closest('div[class*="flex"], article, section');
        if (parent) {
          const numEl = parent.querySelector('[class*="display-lg"], [class*="headline-lg"]');
          if (numEl && /^\d/.test(numEl.textContent.trim())) {
            numEl.textContent = String(value);
            numEl.style.transition = 'all 0.3s ease';
            numEl.classList.add('text-primary');
            setTimeout(() => numEl.classList.remove('text-primary'), 1000);
          }
        }
      }
    });
  }
}

function updatePriorityAlerts(alerts) {
  const alertContainer = document.querySelector('[data-priority-alerts]');
  if (!alertContainer) return;
  alertContainer.innerHTML = alerts.map(a => `
    <div class="p-space-sm rounded bg-surface-container-low border border-outline-variant/30 hover:border-${a.severity === 'critical' ? 'error' : 'primary'}/40 transition-colors cursor-pointer"
         onclick="window.location.href='alerts-patterns.html'">
      <div class="flex items-center justify-between mb-1">
        <span class="font-data-mono-sm text-data-mono-sm text-${a.severity === 'critical' ? 'error' : 'primary'}">${a.id}</span>
        <span class="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${a.severity === 'critical' ? 'bg-error-container/30 text-error' : 'bg-primary/10 text-primary'}">${a.severity}</span>
      </div>
      <p class="font-body-sm text-body-sm text-on-surface line-clamp-2">${a.title}</p>
    </div>
  `).join('');
}

function updateRecentActivity(activities) {
  const actContainer = document.querySelector('[data-recent-activity]');
  if (!actContainer) return;
  actContainer.innerHTML = activities.slice(0, 8).map(a => `
    <div class="flex items-start gap-space-sm py-space-xs border-b border-outline-variant/10 last:border-0">
      <span class="material-symbols-outlined text-[16px] text-primary mt-0.5">${a.icon || 'info'}</span>
      <div class="flex-1 min-w-0">
        <p class="font-body-sm text-body-sm text-on-surface truncate">${a.details || a.action}</p>
        <p class="font-data-mono-sm text-data-mono-sm text-outline">${a.user} • ${a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : ''}</p>
      </div>
    </div>
  `).join('');
}

function updateDashboardCaseCards(cases) {
  const container = document.querySelector('[data-case-cards]');
  if (!container) return;
  container.innerHTML = cases.map(c => {
    const statusColors = { open: 'text-blue-400', investigating: 'text-primary', chargesheet_ready: 'text-green-400', closed: 'text-outline' };
    return `
    <div class="group flex flex-col justify-between bg-surface-container-low p-space-md rounded-xl shadow-sm hover:bg-surface-container transition-all cursor-pointer" onclick="window.location.href='case-workspaces.html?id=${c.id}'">
      <div>
        <div class="flex items-start justify-between gap-space-xs">
          <span class="font-data-mono-sm text-data-mono-sm text-primary font-bold">${c.id}</span>
          <span class="flex items-center gap-1 px-space-xs py-space-2xs rounded ${sevBg(c.priority)} text-[10px] font-bold uppercase">${c.priority}</span>
        </div>
        <h4 class="font-headline-sm text-headline-sm text-on-surface font-bold mt-space-sm group-hover:text-primary transition-colors line-clamp-2">${c.title}</h4>
        <div class="mt-space-md flex flex-col space-y-space-xs font-data-mono-sm text-data-mono-sm bg-surface-container-lowest/80 p-space-sm rounded">
          <div class="flex items-center justify-between text-on-surface-variant">
            <span>Status:</span>
            <span class="${statusColors[c.status] || 'text-outline'} font-semibold uppercase">${c.status.replace('_', ' ')}</span>
          </div>
          <div class="flex items-center justify-between text-on-surface-variant">
            <span>Entities:</span>
            <span class="text-secondary font-semibold">${c.entity_count || 0}</span>
          </div>
          <div class="flex items-center justify-between text-on-surface-variant">
            <span>Alerts:</span>
            <span class="text-on-surface">${c.alert_count || 0}</span>
          </div>
        </div>
      </div>
      <div class="mt-space-md pt-space-xs grid grid-cols-2 gap-space-xs">
        <button class="px-space-xs py-1.5 rounded bg-primary text-on-primary font-headline-sm text-body-sm font-semibold hover:bg-secondary transition-colors text-center" onclick="event.stopPropagation(); window.location.href='case-workspaces.html?id=${c.id}'">Workspace</button>
        <button class="flex items-center justify-center gap-1 px-space-xs py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm text-body-sm transition-colors text-center" onclick="event.stopPropagation(); window.location.href='network-explorer.html?case=${c.id}'">
          <span class="material-symbols-outlined text-[14px]">grain</span><span>Graph</span>
        </button>
      </div>
    </div>`;
  }).join('');
}

function updateSystemHealthBar(health) {
  // Update header stream status
  const allEls = document.querySelectorAll('span');
  allEls.forEach(el => {
    const t = el.textContent.trim();
    if (t === 'REALTIME FEDERATED' || t.includes('ev/min')) {
      // Already set — update dynamically
    }
    if (t.match(/^\d{2}:\d{2}:\d{2}\s+UTC$/) && el.id !== 'tactical-clock') {
      // Update last sync time
      el.textContent = new Date(health.last_sync).toISOString().substring(11, 19) + ' UTC';
    }
  });
}


// ============================================================
//  ENTITY PROFILE PAGE
// ============================================================
async function initEntityProfilePage() {
  if (!window.location.pathname.includes('entity-profiles')) return;

  // 1. Initialize the Real-Time FBI Most Wanted Selector Bar
  await initFbiFugitiveSelector();

  // 2. Determine target entity ID (from URL param or default to top FBI fugitive)
  const urlId = getUrlParam('id');
  if (urlId) {
    await loadEntityProfile(urlId);
  } else {
    // Default to top FBI wanted fugitive
    const topFugitive = document.querySelector('#fbi-fugitive-selector-bar [data-fugitive-id]');
    if (topFugitive) {
      const topId = topFugitive.getAttribute('data-fugitive-id');
      await loadEntityProfile(topId);
    }
  }

  // Wire entity list nav links on the page
  wireEntityListLinks();
}

async function initFbiFugitiveSelector() {
  const bar = document.getElementById('fbi-fugitive-selector-bar');
  if (!bar) return;

  try {
    const res = await NexusAPI.get('/api/live-feeds/fbi-wanted?limit=25');
    const fugitives = (res && res.fugitives) ? res.fugitives : [];
    if (fugitives.length === 0) return;

    bar.innerHTML = fugitives.map((f, idx) => {
      const isTop = idx === 0;
      const rewardMatch = f.description ? f.description.match(/\$[\d,]+/) : null;
      const rewardText = rewardMatch ? rewardMatch[0] : (f.risk_score > 90 ? '$250,000+' : 'WANTED');
      const mugshot = f.photo_url || 'assets/images/img_3712ecdcd3.jpg';

      return `
        <div data-fugitive-id="${f.id}" onclick="loadEntityProfile('${f.id}')"
             class="group flex items-center gap-2.5 px-3 py-2 rounded-lg bg-surface-container border border-outline-variant/30 hover:border-primary cursor-pointer shrink-0 transition-all duration-200 select-none hover:scale-[1.02]">
          <div class="relative w-9 h-11 rounded overflow-hidden bg-surface-container-lowest border border-outline-variant/40 shrink-0">
            <img src="${mugshot}" alt="${f.name}" class="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all" />
          </div>
          <div class="flex flex-col min-w-0 pr-1">
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-bold text-on-surface truncate group-hover:text-primary transition-colors max-w-[140px]">${f.name}</span>
              <span class="px-1 py-0.2 rounded text-[9px] font-mono font-bold ${f.risk_score >= 95 ? 'bg-error/20 text-error' : 'bg-primary/20 text-primary'}">${f.risk_score}</span>
            </div>
            <div class="flex items-center gap-1 mt-0.5">
              <span class="text-[10px] font-mono text-outline">${f.id}</span>
              <span class="text-[9px] font-mono text-amber-400 font-semibold bg-amber-400/10 px-1 rounded truncate max-w-[90px]">${rewardText}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    console.debug('[NEXUS FBI] Selector init note:', err);
  }
}

async function loadEntityProfile(entityId) {
  if (!entityId) return;
  if (window.showTacticalToast) {
    window.showTacticalToast(`Retrieving authentic FBI dossier: ${entityId}...`, 'info');
  }

  const data = await NexusAPI.get(`/api/entities/${entityId}`);
  if (!data || !data.entity) {
    if (window.showTacticalToast) window.showTacticalToast('Entity profile record not found.', 'error');
    return;
  }

  const e = data.entity;
  const rels = data.relationships || [];
  const notes = data.notes || [];
  const comms = data.communications || [];
  const txns = data.transactions || [];
  const insights = data.insights || [];

  // Update page title & URL without page reload
  document.title = `${e.name} — Nexus Real-Time Forensic Dossier`;
  if (window.history && window.history.replaceState) {
    window.history.replaceState({}, '', `entity-profiles.html?id=${entityId}`);
  }

  // 1. Mugshot Frame
  const mugshotImg = document.getElementById('profile-mugshot-img');
  if (mugshotImg) {
    mugshotImg.src = e.photo_url || 'assets/images/img_3712ecdcd3.jpg';
    mugshotImg.alt = `FBI Wanted Forensic Surveillance Mugshot: ${e.name}`;
  }

  // 2. Name & Title
  const nameTitle = document.getElementById('profile-name-title');
  if (nameTitle) nameTitle.textContent = e.name;

  // 3. ID Badge
  const idBadge = document.getElementById('profile-id-badge');
  if (idBadge) idBadge.textContent = e.id;

  // 4. Type & Status Badges
  const typeBadge = document.getElementById('profile-type-badge');
  if (typeBadge) typeBadge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-primary"></span>${(e.entity_type || 'PERSON').toUpperCase()}`;

  const statusBadge = document.getElementById('profile-status-badge');
  if (statusBadge) {
    const isFugitive = (e.status === 'active_fugitive' || e.risk_score >= 90);
    statusBadge.className = isFugitive
      ? 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-error-container/30 text-error font-data-mono-sm text-data-mono-sm font-semibold'
      : 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/20 text-primary font-data-mono-sm text-data-mono-sm font-semibold';
    statusBadge.innerHTML = `<span class="w-2 h-2 rounded-full ${isFugitive ? 'bg-error animate-ping' : 'bg-primary'}"></span>${isFugitive ? 'CRITICAL RISK // FBI MOST WANTED' : 'ACTIVE INVESTIGATION'}`;
  }

  // 5. Threat Score & Gauges
  const threatScore = document.getElementById('profile-threat-score');
  if (threatScore) threatScore.textContent = String(Math.round(e.risk_score || 94));

  const facialMatch = document.getElementById('profile-facial-match');
  if (facialMatch) facialMatch.textContent = `${(98.2 + (absStrHash(e.name) % 15) / 10).toFixed(1)}%`;

  // 6. Official FBI Wanted Description & Caution Narrative
  const descEl = document.getElementById('profile-fbi-description');
  if (descEl) {
    descEl.textContent = e.description || `${e.name} is currently sought by federal authorities and international partner agencies under active felony warrants.`;
  }

  const rewardBadge = document.getElementById('profile-reward-badge');
  if (rewardBadge) {
    const rMatch = e.description ? e.description.match(/\$[\d,]+/) : null;
    if (rMatch) {
      rewardBadge.textContent = `REWARD: UP TO ${rMatch[0]}`;
      rewardBadge.classList.remove('hidden');
    } else if (e.risk_score >= 95) {
      rewardBadge.textContent = 'REWARD: UP TO $5,000,000 BOUNTY';
      rewardBadge.classList.remove('hidden');
    } else {
      rewardBadge.textContent = 'ACTIVE FEDERAL WARRANT';
    }
  }

  // 7. Contributing Factors & Field Offices
  const factorsContainer = document.getElementById('profile-contributing-factors');
  if (factorsContainer) {
    let factors = e.contributing_factors || [];
    if (typeof factors === 'string') {
      try { factors = JSON.parse(factors); } catch (e) { factors = [factors]; }
    }
    if (Array.isArray(factors) && factors.length > 0) {
      factorsContainer.innerHTML = factors.map(f => `
        <span class="px-2 py-0.5 rounded bg-surface-container border border-outline-variant/20 text-[11px] font-mono text-secondary">${f}</span>
      `).join('');
    }
  }

  // 8. Aliases Chips
  const aliasesContainer = document.getElementById('profile-aliases-container');
  if (aliasesContainer) {
    let aliases = e.aliases || [];
    if (typeof aliases === 'string') {
      try { aliases = JSON.parse(aliases); } catch (e) { aliases = [aliases]; }
    }
    if (Array.isArray(aliases) && aliases.length > 0) {
      aliasesContainer.innerHTML = aliases.map(a => `
        <span class="px-2 py-0.5 rounded-full bg-surface-container text-on-surface text-body-sm font-body-sm border border-outline-variant/30">${a}</span>
      `).join('');
    } else {
      aliasesContainer.innerHTML = `<span class="text-outline text-xs italic">No confirmed aliases reported</span>`;
    }
  }

  // 9. Personal Identifiers
  const legalName = document.getElementById('profile-legal-name');
  if (legalName) legalName.textContent = e.name;

  const dobEl = document.getElementById('profile-dob');
  if (dobEl) dobEl.textContent = e.dob ? `${e.dob}` : 'Record Sealed / Classified';

  const citizenshipEl = document.getElementById('profile-citizenship');
  if (citizenshipEl) citizenshipEl.textContent = e.nationality || 'Foreign National // Multiple Passports';

  const ncicDossier = document.getElementById('profile-ncic-dossier');
  if (ncicDossier) ncicDossier.textContent = `#FBI-${absStrHash(e.name) % 90000 + 10000}-US`;

  // 9B. Authentic FBI Biometrics & Cross-Links
  const bio = e.fbi_details || {};
  const bHeight = document.getElementById('profile-bio-height');
  if (bHeight) bHeight.textContent = e.height || bio.height || 'N/A';

  const bWeight = document.getElementById('profile-bio-weight');
  if (bWeight) bWeight.textContent = e.weight || bio.weight || 'N/A';

  const bHair = document.getElementById('profile-bio-hair');
  if (bHair) bHair.textContent = e.hair || bio.hair || 'N/A';

  const bEyes = document.getElementById('profile-bio-eyes');
  if (bEyes) bEyes.textContent = e.eyes || bio.eyes || 'N/A';

  const bSex = document.getElementById('profile-bio-sex');
  if (bSex) bSex.textContent = e.sex || bio.sex || 'Unknown';

  const bRace = document.getElementById('profile-bio-race');
  if (bRace) bRace.textContent = e.race || bio.race || 'Unknown';

  const bWarning = document.getElementById('profile-bio-warning');
  if (bWarning) {
    bWarning.textContent = e.warning_message || bio.warning_message || 'ACTIVE MULTI-JURISDICTIONAL FEDERAL WARRANT';
  }

  // Action buttons cross-links
  const reportBtn = document.getElementById('profile-generate-briefing-btn');
  if (reportBtn) reportBtn.href = `report-generator.html?id=${entityId}`;

  const networkBtn = document.getElementById('profile-open-network-btn');
  if (networkBtn) networkBtn.href = `network-explorer.html?id=${entityId}`;

  const pdfLink = document.getElementById('profile-fbi-pdf-link');
  if (pdfLink) {
    let pdfUrl = null;
    if (e.fbi_files && Array.isArray(e.fbi_files) && e.fbi_files.length > 0) {
      pdfUrl = e.fbi_files[0].url;
    } else if (bio.files && Array.isArray(bio.files) && bio.files.length > 0) {
      pdfUrl = bio.files[0].url;
    }
    if (pdfUrl) {
      pdfLink.href = pdfUrl;
      pdfLink.style.display = 'inline-flex';
    } else {
      pdfLink.href = `https://www.fbi.gov/wanted`;
    }
  }

  const govLink = document.getElementById('profile-fbi-gov-link');
  if (govLink) {
    govLink.href = e.fbi_url || bio.url || 'https://www.fbi.gov/wanted';
  }

  // 10. Highlight Active Fugitive in Selector Bar
  document.querySelectorAll('#fbi-fugitive-selector-bar [data-fugitive-id]').forEach(card => {
    const cId = card.getAttribute('data-fugitive-id');
    if (cId === entityId) {
      card.classList.add('border-primary', 'bg-surface-container-high', 'ring-1', 'ring-primary');
      card.classList.remove('border-outline-variant/30');
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } else {
      card.classList.remove('border-primary', 'bg-surface-container-high', 'ring-1', 'ring-primary');
      card.classList.add('border-outline-variant/30');
    }
  });

  // 11. Populate Relationships Ledger Table
  const relTable = document.querySelector('table tbody');
  if (relTable) {
    if (rels.length > 0) {
      relTable.innerHTML = rels.map(r => {
        const otherName = r.target_name || r.source_name || 'Vektor Maritime Syndicate';
        const otherId = r.target_entity_id || r.source_entity_id || 'ORG-5519';
        const conf = Math.round((r.confidence || 0.94) * 100);
        return `
          <tr class="bg-surface-container hover:bg-surface-container-high transition-colors">
            <td class="py-2.5 px-space-sm flex items-center gap-2 min-w-[200px]">
              <span class="w-2 h-2 rounded-full bg-primary"></span>
              <a href="entity-profiles.html?id=${otherId}" class="text-on-surface font-semibold hover:text-primary transition-colors">${otherName}</a>
              <span class="font-data-mono-sm text-data-mono-sm text-outline">${otherId}</span>
            </td>
            <td class="py-2.5 px-space-sm">
              <span class="px-2 py-0.5 rounded bg-surface-container-highest text-primary font-data-mono-sm text-data-mono-sm font-medium">
                ${r.relationship_type || 'FINANCIAL_CONDUIT'}
              </span>
            </td>
            <td class="py-2.5 px-space-sm">
              <div class="flex items-center gap-2">
                <div class="w-16 bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                  <div class="bg-primary h-full" style="width: ${conf}%"></div>
                </div>
                <span class="font-data-mono-sm text-data-mono-sm text-on-surface font-bold">${conf}%</span>
              </div>
            </td>
            <td class="py-2.5 px-space-sm">
              <span class="font-data-mono-sm text-data-mono-sm text-secondary hover:underline cursor-pointer">DOC-FBI-${absStrHash(otherName) % 9000 + 1000}</span>
            </td>
            <td class="py-2.5 px-space-sm text-right font-data-mono-sm text-data-mono-sm text-on-surface-variant">2024-03-28</td>
            <td class="py-2.5 px-space-sm text-right">
              <button onclick="loadEntityProfile('${otherId}')" class="text-outline hover:text-primary transition-colors p-1" title="Inspect Associate">
                <span class="material-symbols-outlined text-[18px]">open_in_new</span>
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // 12. Populate Timeline
  loadEntityTimeline(entityId);
  loadEntityFinancials(entityId);
  loadEntityCommunications(entityId);

  if (window.showTacticalToast) {
    window.showTacticalToast(`Forensic Dossier Active: ${e.name} (${e.id}) — Threat: ${e.risk_score}/100`, 'success');
  }
}
window.loadEntityProfile = loadEntityProfile;
window.initFbiFugitiveSelector = initFbiFugitiveSelector;

function absStrHash(str) {
  let hash = 0;
  for (let i = 0; i < (str || '').length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

async function loadEntityTimeline(entityId) {
  const data = await NexusAPI.get(`/api/entities/${entityId}/timeline`);
  const container = document.querySelector('[data-entity-timeline]');
  if (!container || !data || !data.events) return;

  container.innerHTML = data.events.map(ev => `
    <div class="flex gap-3 py-2 border-b border-outline-variant/10 last:border-0 ${ev.flagged ? 'bg-error-container/5' : ''}">
      <div class="flex flex-col items-center">
        <span class="material-symbols-outlined text-[16px] ${ev.type === 'communication' ? 'text-primary' : ev.type === 'transaction' ? 'text-secondary' : 'text-outline'}">${ev.type === 'communication' ? 'call' : ev.type === 'transaction' ? 'payments' : 'note'}</span>
        <div class="w-px flex-1 bg-outline-variant/20 mt-1"></div>
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-body-sm text-on-surface">${ev.description}</p>
        <div class="flex items-center gap-2 mt-0.5">
          <span class="font-data-mono-sm text-data-mono-sm text-outline">${formatTime(ev.timestamp)}</span>
          ${ev.details ? `<span class="font-data-mono-sm text-data-mono-sm text-on-surface-variant">${ev.details}</span>` : ''}
          ${ev.flagged ? `<span class="px-1.5 py-0.5 rounded bg-error-container/30 text-error text-[10px] font-bold">⚠ ${ev.flag_reason || 'FLAGGED'}</span>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

async function loadEntityFinancials(entityId) {
  const data = await NexusAPI.get(`/api/entities/${entityId}/financials`);
  const container = document.querySelector('[data-entity-financials]');
  if (!container || !data) return;

  container.innerHTML = `
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <div class="p-3 bg-surface-container-low rounded">
        <span class="font-label-md text-label-md text-outline uppercase">Total Transactions</span>
        <p class="font-headline-md text-headline-md text-on-surface mt-1">${data.total_transactions}</p>
      </div>
      <div class="p-3 bg-surface-container-low rounded">
        <span class="font-label-md text-label-md text-outline uppercase">Total Inflow</span>
        <p class="font-headline-md text-headline-md text-green-400 mt-1">${formatCurrency(data.total_inflow)}</p>
      </div>
      <div class="p-3 bg-surface-container-low rounded">
        <span class="font-label-md text-label-md text-outline uppercase">Total Outflow</span>
        <p class="font-headline-md text-headline-md text-red-400 mt-1">${formatCurrency(data.total_outflow)}</p>
      </div>
      <div class="p-3 bg-surface-container-low rounded">
        <span class="font-label-md text-label-md text-outline uppercase">Flagged</span>
        <p class="font-headline-md text-headline-md text-error mt-1">${data.flagged_count} <span class="text-xs text-outline">${data.flagged_patterns.length > 0 ? '(' + data.flagged_patterns.join(', ') + ')' : ''}</span></p>
      </div>
    </div>
    ${data.transactions.length > 0 ? `
    <div class="overflow-x-auto">
      <table class="w-full text-xs">
        <thead><tr class="border-b border-outline-variant/30 text-outline uppercase font-label-md">
          <th class="py-2 px-2 text-left">Date</th><th class="py-2 px-2 text-left">From</th>
          <th class="py-2 px-2 text-left">To</th><th class="py-2 px-2 text-right">Amount</th>
          <th class="py-2 px-2 text-left">Mode</th><th class="py-2 px-2 text-left">Flag</th>
        </tr></thead>
        <tbody>${data.transactions.slice(0, 20).map(t => `
          <tr class="border-b border-outline-variant/10 hover:bg-surface-container/40 ${t.flagged ? 'bg-error-container/5' : ''}">
            <td class="py-1.5 px-2 font-data-mono-sm">${formatTime(t.timestamp)}</td>
            <td class="py-1.5 px-2">${t.source_name || t.source_account}</td>
            <td class="py-1.5 px-2">${t.target_name || t.target_account}</td>
            <td class="py-1.5 px-2 text-right font-mono font-bold">${formatCurrency(t.amount, t.currency)}</td>
            <td class="py-1.5 px-2 text-outline">${t.mode}</td>
            <td class="py-1.5 px-2">${t.flagged ? `<span class="text-error text-[10px]">⚠ ${t.flag_reason || ''}</span>` : '—'}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>` : '<p class="text-outline text-sm">No financial transactions found for this entity.</p>'}
  `;
}

async function loadEntityCommunications(entityId) {
  const data = await NexusAPI.get(`/api/entities/${entityId}/communications`);
  const container = document.querySelector('[data-entity-comms]');
  if (!container || !data) return;

  container.innerHTML = `
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <div class="p-3 bg-surface-container-low rounded">
        <span class="font-label-md text-label-md text-outline uppercase">Total Records</span>
        <p class="font-headline-md text-headline-md text-on-surface mt-1">${data.total_records}</p>
      </div>
      <div class="p-3 bg-surface-container-low rounded">
        <span class="font-label-md text-label-md text-outline uppercase">Total Duration</span>
        <p class="font-headline-md text-headline-md text-primary mt-1">${Math.round(data.total_duration_seconds / 60)}m</p>
      </div>
      <div class="p-3 bg-surface-container-low rounded">
        <span class="font-label-md text-label-md text-outline uppercase">Flagged</span>
        <p class="font-headline-md text-headline-md text-error mt-1">${data.flagged_count}</p>
      </div>
      <div class="p-3 bg-surface-container-low rounded">
        <span class="font-label-md text-label-md text-outline uppercase">Top Contacts</span>
        <p class="font-headline-md text-headline-md text-secondary mt-1">${data.top_contacts.length}</p>
      </div>
    </div>
    ${data.top_contacts.length > 0 ? `
    <div class="mb-4">
      <h4 class="font-label-md text-label-md text-outline uppercase tracking-wider mb-2">Top Contacts</h4>
      <div class="flex flex-wrap gap-2">
        ${data.top_contacts.map(c => `
          <a href="entity-profiles.html?id=${c.id}" class="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded hover:bg-surface-container transition-colors border border-outline-variant/20">
            <span class="font-body-sm text-on-surface">${c.name || c.id}</span>
            <span class="font-data-mono-sm text-data-mono-sm text-primary">${c.count} calls</span>
            <span class="font-data-mono-sm text-data-mono-sm text-outline">${Math.round(c.total_duration / 60)}m</span>
          </a>
        `).join('')}
      </div>
    </div>` : ''}
    ${data.records.length > 0 ? `
    <div class="overflow-x-auto">
      <table class="w-full text-xs">
        <thead><tr class="border-b border-outline-variant/30 text-outline uppercase font-label-md">
          <th class="py-2 px-2 text-left">Time</th><th class="py-2 px-2 text-left">Source</th>
          <th class="py-2 px-2 text-left">Target</th><th class="py-2 px-2 text-right">Duration</th>
          <th class="py-2 px-2 text-left">Flag</th>
        </tr></thead>
        <tbody>${data.records.slice(0, 30).map(r => `
          <tr class="border-b border-outline-variant/10 hover:bg-surface-container/40 ${r.flagged ? 'bg-error-container/5' : ''}">
            <td class="py-1.5 px-2 font-data-mono-sm">${formatTime(r.timestamp)}</td>
            <td class="py-1.5 px-2">${r.source_name || r.source_number}</td>
            <td class="py-1.5 px-2">${r.target_name || r.target_number}</td>
            <td class="py-1.5 px-2 text-right font-mono">${r.duration_seconds}s</td>
            <td class="py-1.5 px-2">${r.flagged ? `<span class="text-error text-[10px]">⚠ ${r.flag_reason || ''}</span>` : '—'}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>` : '<p class="text-outline text-sm">No communication records found for this entity.</p>'}
  `;
}

async function loadEntityList(container) {
  const data = await NexusAPI.get('/api/entities?limit=50');
  if (!data || !data.entities) return;

  // Don't overwrite if there's already rich content (from Stitch)
  // Instead, update the entity items that exist or add a dynamic list after the static content
  const listContainer = document.querySelector('[data-entity-list]') || container;
  if (!listContainer) return;

  listContainer.innerHTML = `
    <div class="grid gap-3">
      ${data.entities.map(e => `
        <a href="entity-profiles.html?id=${e.id}" class="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant/20 hover:border-primary/40 hover:bg-surface-container transition-all group">
          <div class="w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant/40" style="background: ${entityColor(e.entity_type)}20; color: ${entityColor(e.entity_type)}">
            <span class="material-symbols-outlined text-[20px]">${entityIcon(e.entity_type)}</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">${e.name}</span>
              <span class="font-data-mono-sm text-data-mono-sm text-outline">${e.id}</span>
            </div>
            <p class="font-body-sm text-on-surface-variant truncate">${e.description || ''}</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="font-label-md text-label-md text-outline uppercase">${e.entity_type}</span>
            ${riskBadge(e.risk_score || 0)}
          </div>
        </a>
      `).join('')}
    </div>
  `;
}

function wireEntityListLinks() {
  // Wire any clickable entity links on the page
  document.querySelectorAll('[data-entity-link]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('data-entity-link');
      if (id) window.location.href = `entity-profiles.html?id=${id}`;
    });
  });
}


// ============================================================
//  CASE WORKSPACE PAGE
// ============================================================
async function initCaseWorkspacePage() {
  if (!window.location.pathname.includes('case-workspaces')) return;

  if (typeof initCaseWorkspaceNoteComposer === 'function') {
    initCaseWorkspaceNoteComposer();
  }

  const caseId = getUrlParam('id');
  if (caseId) {
    await loadCaseDetail(caseId);
  }
}

async function loadCaseList() {
  const data = await NexusAPI.get('/api/cases');
  if (!data || !data.cases) return;

  const container = document.querySelector('[data-case-list]');
  if (!container) {
    // Find the main grid on the page and inject
    const mainGrid = document.querySelector('main section, main > div');
    if (!mainGrid) return;
    const wrapper = document.createElement('div');
    wrapper.setAttribute('data-case-list', '');
    mainGrid.prepend(wrapper);
    renderCaseList(data.cases, wrapper);
  } else {
    renderCaseList(data.cases, container);
  }
}

function renderCaseList(cases, container) {
  container.innerHTML = `
    <div class="grid gap-4 md:grid-cols-2">
      ${cases.map(c => {
        const priorityColors = { critical: 'border-red-500/40', high: 'border-orange-500/40', medium: 'border-yellow-500/40', low: 'border-blue-500/40' };
        return `
        <div class="bg-surface-container-low p-5 rounded-xl border ${priorityColors[c.priority] || 'border-outline-variant/30'} hover:bg-surface-container transition-all cursor-pointer" onclick="window.location.href='case-workspaces.html?id=${c.id}'">
          <div class="flex items-center justify-between mb-2">
            <span class="font-data-mono-sm text-data-mono-sm text-primary font-bold">${c.id}</span>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${sevBg(c.priority)}">${c.priority}</span>
              <span class="px-2 py-0.5 rounded bg-surface-container text-[10px] font-bold uppercase text-on-surface-variant">${c.status}</span>
            </div>
          </div>
          <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">${c.title}</h3>
          <p class="font-body-sm text-on-surface-variant mt-1 line-clamp-2">${c.description || ''}</p>
          <div class="mt-3 flex items-center gap-4 font-data-mono-sm text-data-mono-sm text-outline">
            <span>${c.entity_count || 0} entities</span>
            <span>${c.document_count || 0} docs</span>
            <span>${c.alert_count || 0} alerts</span>
          </div>
        </div>`;
      }).join('')}
    </div>
  `;
}

async function loadCaseDetail(caseId) {
  window.showTacticalToast(`Loading case workspace: ${caseId}...`, 'info');
  const data = await NexusAPI.get(`/api/cases/${caseId}`);
  if (!data || !data.case) {
    window.showTacticalToast('Case not found.', 'error');
    return;
  }

  const c = data.case;
  document.title = `${c.title} — Nexus Case Workspace`;

  // Update case title in page
  const titleEls = document.querySelectorAll('h1, h2, [class*="headline-lg"]');
  titleEls.forEach(el => {
    if (el.textContent.includes('Operation HYDRA') || el.textContent.includes('Case') || el.getAttribute('data-case-title')) {
      el.textContent = c.title;
    }
  });

  // Update case ID
  const idEls = document.querySelectorAll('[class*="data-mono"]');
  idEls.forEach(el => {
    if (el.textContent.includes('CS-2024-8841') || el.getAttribute('data-case-id')) {
      el.textContent = c.id;
    }
  });

  // Populate entity list for this case
  const entityContainer = document.querySelector('[data-case-entities]');
  if (entityContainer && data.entities) {
    entityContainer.innerHTML = data.entities.map(e => `
      <a href="entity-profiles.html?id=${e.id}" class="flex items-center gap-3 p-3 bg-surface-container-lowest rounded hover:bg-surface-container transition-colors border border-outline-variant/10">
        <span class="material-symbols-outlined text-[18px]" style="color: ${entityColor(e.entity_type)}">${entityIcon(e.entity_type)}</span>
        <div class="flex-1 min-w-0">
          <span class="font-body-sm text-on-surface">${e.name}</span>
          <span class="font-data-mono-sm text-data-mono-sm text-outline ml-2">${e.id}</span>
        </div>
        ${riskBadge(e.risk_score || 0)}
      </a>
    `).join('');
  }

  // Populate documents
  const docsContainer = document.querySelector('[data-case-documents]');
  if (docsContainer && data.documents) {
    docsContainer.innerHTML = data.documents.map(d => `
      <div class="flex items-center gap-3 p-3 bg-surface-container-lowest rounded border border-outline-variant/10">
        <span class="material-symbols-outlined text-[18px] text-primary">description</span>
        <div class="flex-1 min-w-0">
          <span class="font-body-sm text-on-surface">${d.title}</span>
          <span class="font-data-mono-sm text-data-mono-sm text-outline ml-2">${d.id} • ${d.source_type} • ${d.file_type}</span>
        </div>
        <span class="font-data-mono-sm text-data-mono-sm text-outline">${Math.round(d.file_size / 1000)}KB</span>
      </div>
    `).join('');
  }

  // Populate alerts
  const alertContainer = document.querySelector('[data-case-alerts]');
  if (alertContainer && data.alerts) {
    alertContainer.innerHTML = data.alerts.map(a => `
      <div class="p-3 bg-surface-container-lowest rounded border-l-2 ${a.severity === 'critical' ? 'border-red-500' : a.severity === 'high' ? 'border-orange-500' : 'border-yellow-500'} cursor-pointer hover:bg-surface-container transition-colors" onclick="window.location.href='alerts-patterns.html'">
        <div class="flex items-center justify-between mb-1">
          <span class="font-data-mono-sm text-data-mono-sm ${a.severity === 'critical' ? 'text-red-400' : 'text-primary'}">${a.id}</span>
          <span class="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${sevBg(a.severity)}">${a.severity}</span>
        </div>
        <p class="font-body-sm text-on-surface">${a.title}</p>
        <p class="font-body-sm text-on-surface-variant mt-0.5 line-clamp-2">${a.description || ''}</p>
      </div>
    `).join('');
  }

  // Populate notes
  const notesContainer = document.querySelector('[data-case-notes]');
  if (notesContainer && data.notes) {
    notesContainer.innerHTML = data.notes.map(n => `
      <div class="p-3 bg-surface-container-lowest rounded border border-outline-variant/10 mb-2">
        <p class="font-body-sm text-on-surface">${n.content}</p>
        <p class="font-data-mono-sm text-data-mono-sm text-outline mt-1">${n.author_name || 'Unknown'} • ${formatTime(n.created_at)} • ${n.note_type}</p>
      </div>
    `).join('');
  }

  // Officers
  const officerContainer = document.querySelector('[data-case-officers]');
  if (officerContainer && data.officers) {
    officerContainer.innerHTML = data.officers.map(o => `
      <div class="flex items-center gap-2 px-3 py-2 bg-surface-container-lowest rounded">
        <span class="material-symbols-outlined text-[16px] text-primary">badge</span>
        <span class="font-body-sm text-on-surface">${o.name}</span>
        <span class="font-data-mono-sm text-data-mono-sm text-outline">${o.department || ''}</span>
      </div>
    `).join('');
  }

  window.showTacticalToast(`Case ${c.id} loaded — ${(data.entities || []).length} entities, ${(data.alerts || []).length} alerts`, 'success');
}


// ============================================================
//  CROSS-CASE SEARCH PAGE
// ============================================================
async function initCrossSearchPage() {
  if (!window.location.pathname.includes('cross-case-search')) return;

  // Find search input
  const searchInputs = document.querySelectorAll('input[type="text"], input[type="search"]');
  let mainSearchInput = null;
  searchInputs.forEach(input => {
    if (input.placeholder && (input.placeholder.includes('query') || input.placeholder.includes('search') || input.placeholder.includes('NEXUS') || input.placeholder.includes('natural language'))) {
      mainSearchInput = input;
    }
  });
  // Fallback: use the first non-header input
  if (!mainSearchInput) {
    const mainInputs = document.querySelectorAll('main input[type="text"]');
    if (mainInputs.length > 0) mainSearchInput = mainInputs[0];
  }

  // Check for URL param pre-fill
  const preQuery = getUrlParam('q');
  if (preQuery && mainSearchInput) {
    mainSearchInput.value = preQuery;
    performSearch(preQuery);
  }

  // Wire search
  if (mainSearchInput) {
    mainSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = mainSearchInput.value.trim();
        if (q) performSearch(q);
      }
    });
  }

  // Wire search/execute buttons
  document.querySelectorAll('button').forEach(btn => {
    const text = btn.textContent.trim().toLowerCase();
    if (text.includes('execute') || text.includes('search') || text.includes('run query')) {
      btn.addEventListener('click', () => {
        if (mainSearchInput) {
          const q = mainSearchInput.value.trim();
          if (q) performSearch(q);
        }
      });
    }
  });
}

async function performSearch(query) {
  window.showTacticalToast(`Executing federated search: "${query}"...`, 'info');

  // Try NL query first
  const nlResult = await NexusAPI.post('/api/search/nl-query', { query });

  // Also do federated search
  const fedResult = await NexusAPI.get(`/api/search?q=${encodeURIComponent(query)}`);

  const resultsContainer = document.querySelector('[data-search-results]');
  if (!resultsContainer) {
    // Find the results area on the page — usually after the search form
    const main = document.querySelector('main');
    if (!main) return;
    // Try to find the section that contains search results
    const sections = main.querySelectorAll('section');
    let target = null;
    sections.forEach(s => {
      if (s.textContent.includes('Result') || s.textContent.includes('result') || s.querySelector('table')) {
        target = s;
      }
    });
    if (target) {
      renderSearchResults(query, nlResult, fedResult, target);
    }
    return;
  }

  renderSearchResults(query, nlResult, fedResult, resultsContainer);
}

function renderSearchResults(query, nlResult, fedResult, container) {
  let html = '';

  // NL interpretation
  if (nlResult && nlResult.interpretation) {
    html += `
      <div class="mb-4 p-4 bg-surface-container-low rounded-xl border border-primary/30">
        <div class="flex items-center gap-2 mb-2">
          <span class="material-symbols-outlined text-primary text-[18px]">psychology</span>
          <span class="font-headline-sm text-headline-sm text-primary">AI Interpretation</span>
        </div>
        <p class="font-body-md text-on-surface">${nlResult.interpretation}</p>
        ${nlResult.cypher_equivalent ? `<code class="block mt-2 font-data-mono-sm text-data-mono-sm text-outline bg-surface-container p-2 rounded">${nlResult.cypher_equivalent}</code>` : ''}
      </div>
    `;
  }

  // NL results
  if (nlResult && nlResult.results && nlResult.results.length > 0) {
    html += `
      <div class="mb-4">
        <h3 class="font-headline-sm text-headline-sm text-on-surface mb-2">Intelligence Query Results (${nlResult.results.length})</h3>
        <div class="grid gap-2">
          ${nlResult.results.map(r => `
            <div class="p-3 bg-surface-container-low rounded border border-outline-variant/20 hover:border-primary/30 transition-colors ${r.id ? 'cursor-pointer' : ''}" ${r.id ? `onclick="window.location.href='entity-profiles.html?id=${r.id}'"` : ''}>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px] text-primary">${entityIcon(r.entity_type || r.type || '')}</span>
                <span class="font-body-sm text-on-surface font-semibold">${r.name || r.title || r.source_name || JSON.stringify(r).substring(0, 60)}</span>
                ${r.id ? `<span class="font-data-mono-sm text-data-mono-sm text-outline">${r.id}</span>` : ''}
                ${r.risk_score ? riskBadge(r.risk_score) : ''}
                ${r.score ? `<span class="font-data-mono-sm text-data-mono-sm text-secondary">Score: ${r.score}</span>` : ''}
              </div>
              ${r.description ? `<p class="font-body-sm text-on-surface-variant mt-1 line-clamp-2">${r.description}</p>` : ''}
              ${r.explanation ? `<p class="font-body-sm text-on-surface-variant mt-1 line-clamp-2">${r.explanation}</p>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Federated search results
  if (fedResult) {
    const sections = [
      { key: 'entities', label: 'Entities', icon: 'person' },
      { key: 'cases', label: 'Cases', icon: 'folder_supervised' },
      { key: 'documents', label: 'Documents', icon: 'description' },
      { key: 'alerts', label: 'Alerts', icon: 'warning' },
    ];

    sections.forEach(({ key, label, icon }) => {
      const items = fedResult[key] || [];
      if (items.length === 0) return;

      html += `
        <div class="mb-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-[16px] text-primary">${icon}</span>
            <h3 class="font-headline-sm text-headline-sm text-on-surface">${label} (${items.length})</h3>
          </div>
          <div class="grid gap-2">
            ${items.map(item => {
              const linkPage = key === 'entities' ? 'entity-profiles' : key === 'cases' ? 'case-workspaces' : key === 'alerts' ? 'alerts-patterns' : '';
              return `
              <a href="${linkPage}.html?id=${item.id}" class="flex items-center gap-3 p-3 bg-surface-container-low rounded border border-outline-variant/20 hover:border-primary/30 transition-colors">
                <span class="material-symbols-outlined text-[16px]" style="color: ${entityColor(item.entity_type || '')}">${entityIcon(item.entity_type || key)}</span>
                <div class="flex-1 min-w-0">
                  <span class="font-body-sm text-on-surface">${item.name || item.title || item.id}</span>
                  <span class="font-data-mono-sm text-data-mono-sm text-outline ml-2">${item.id}</span>
                  ${item.description ? `<p class="font-body-sm text-on-surface-variant truncate">${item.description}</p>` : ''}
                </div>
                ${item.risk_score ? riskBadge(item.risk_score) : ''}
                ${item.severity ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${sevBg(item.severity)}">${item.severity}</span>` : ''}
              </a>`;
            }).join('')}
          </div>
        </div>
      `;
    });

    html += `<p class="font-data-mono-sm text-data-mono-sm text-outline mt-4">Total results: ${fedResult.total || 0} across ${sections.filter(s => (fedResult[s.key] || []).length > 0).length} categories</p>`;
  }

  if (!html) {
    html = '<p class="text-outline text-sm py-8 text-center">No results found. Try a different query.</p>';
  }

  container.innerHTML = html;
  window.showTacticalToast(`Search complete — ${(fedResult?.total || 0)} results`, 'success');
}


// ============================================================
//  NETWORK EXPLORER PAGE
// ============================================================
async function initNetworkExplorerPage() {
  if (!window.location.pathname.includes('network-explorer')) return;

  const caseId = getUrlParam('case');

  // Wire analysis buttons to real API endpoints
  document.querySelectorAll('button').forEach(btn => {
    const txt = btn.textContent.trim();
    if (txt.includes('Key Influencers') || txt.includes('Centrality')) {
      btn.addEventListener('click', async () => {
        window.showTacticalToast('Running betweenness centrality analysis...', 'info');
        const result = await NexusAPI.post('/api/network/analyze/centrality', {
          case_id: caseId || null,
          algorithm: 'betweenness'
        });
        if (result && result.results) {
          const top3 = result.results.slice(0, 3);
          const msg = top3.map(r => `${r.label} (${r.score})`).join(', ');
          window.showTacticalToast(`Top influencers: ${msg}`, 'warning');
          showAnalysisResults('Centrality Analysis', result.results);
        }
      });
    } else if (txt.includes('Community Detection') || txt.includes('Cluster')) {
      btn.addEventListener('click', async () => {
        window.showTacticalToast('Running Louvain community detection...', 'info');
        const result = await NexusAPI.post('/api/network/analyze/communities', {
          case_id: caseId || null,
        });
        if (result && result.clusters) {
          window.showTacticalToast(`${result.cluster_count} communities detected (modularity: ${result.modularity})`, 'info');
          showCommunityResults(result);
        }
      });
    } else if (txt.includes('Link Prediction') || txt.includes('Suggest')) {
      btn.addEventListener('click', async () => {
        window.showTacticalToast('Computing link predictions...', 'info');
        const result = await NexusAPI.get(`/api/network/link-predictions?case_id=${caseId || ''}&top_n=5`);
        if (result && result.predictions) {
          window.showTacticalToast(`${result.predictions.length} potential links identified`, 'success');
          showLinkPredictions(result.predictions);
        }
      });
    }
  });

  // Load network stats
  const stats = await NexusAPI.get(`/api/network/stats${caseId ? '?case_id=' + caseId : ''}`);
  if (stats) {
    const statsEls = document.querySelectorAll('[data-network-stat]');
    statsEls.forEach(el => {
      const key = el.getAttribute('data-network-stat');
      if (stats[key] !== undefined) el.textContent = stats[key];
    });
  }
}

function showAnalysisResults(title, results) {
  let modal = document.getElementById('analysis-results-modal');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'analysis-results-modal';
  modal.className = 'fixed inset-0 bg-black/60 z-[100] flex items-center justify-center backdrop-blur-sm';
  modal.innerHTML = `
    <div class="bg-surface-container-low border border-outline-variant/40 rounded-xl shadow-2xl w-full max-w-2xl mx-4 p-6 max-h-[80vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-headline-md text-headline-md text-on-surface">${title}</h2>
        <button onclick="document.getElementById('analysis-results-modal').remove()" class="p-1 rounded hover:bg-surface-container-high text-on-surface-variant">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <table class="w-full text-xs">
        <thead><tr class="border-b border-outline-variant/30 text-outline uppercase font-label-md">
          <th class="py-2 px-2 text-left">#</th>
          <th class="py-2 px-2 text-left">Entity</th>
          <th class="py-2 px-2 text-left">Type</th>
          <th class="py-2 px-2 text-right">Score</th>
          <th class="py-2 px-2 text-right">Degree</th>
          <th class="py-2 px-2 text-left">Explanation</th>
        </tr></thead>
        <tbody>
          ${results.slice(0, 20).map((r, i) => `
            <tr class="border-b border-outline-variant/10 hover:bg-surface-container/40 cursor-pointer" onclick="window.location.href='entity-profiles.html?id=${r.entity_id}'">
              <td class="py-2 px-2 text-outline">${i + 1}</td>
              <td class="py-2 px-2 font-semibold text-on-surface">${r.label}</td>
              <td class="py-2 px-2 text-on-surface-variant">${r.entity_type}</td>
              <td class="py-2 px-2 text-right font-mono text-primary">${r.score}</td>
              <td class="py-2 px-2 text-right">${r.degree}</td>
              <td class="py-2 px-2 text-on-surface-variant text-[11px]">${r.explanation || ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}

function showCommunityResults(data) {
  let modal = document.getElementById('analysis-results-modal');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'analysis-results-modal';
  modal.className = 'fixed inset-0 bg-black/60 z-[100] flex items-center justify-center backdrop-blur-sm';
  modal.innerHTML = `
    <div class="bg-surface-container-low border border-outline-variant/40 rounded-xl shadow-2xl w-full max-w-2xl mx-4 p-6 max-h-[80vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-headline-md text-headline-md text-on-surface">Community Detection — ${data.cluster_count} Clusters</h2>
        <button onclick="document.getElementById('analysis-results-modal').remove()" class="p-1 rounded hover:bg-surface-container-high text-on-surface-variant">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <p class="font-body-sm text-on-surface-variant mb-4">Modularity: ${data.modularity} — higher values indicate stronger community structure.</p>
      ${data.clusters.map(cluster => `
        <div class="mb-4 p-3 bg-surface-container-lowest rounded border border-outline-variant/20">
          <div class="flex items-center justify-between mb-2">
            <span class="font-headline-sm text-headline-sm text-primary">${cluster.name}</span>
            <span class="font-data-mono-sm text-data-mono-sm text-outline">${cluster.member_count} members</span>
          </div>
          <div class="flex flex-wrap gap-1.5">
            ${cluster.members.map(m => `
              <a href="entity-profiles.html?id=${m.entity_id}" class="px-2 py-0.5 rounded bg-surface-container text-xs text-on-surface hover:text-primary transition-colors border border-outline-variant/20">${m.label} <span class="text-outline">(${m.entity_type})</span></a>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}

function showLinkPredictions(predictions) {
  let modal = document.getElementById('analysis-results-modal');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'analysis-results-modal';
  modal.className = 'fixed inset-0 bg-black/60 z-[100] flex items-center justify-center backdrop-blur-sm';
  modal.innerHTML = `
    <div class="bg-surface-container-low border border-outline-variant/40 rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-headline-md text-headline-md text-on-surface">Predicted Links</h2>
        <button onclick="document.getElementById('analysis-results-modal').remove()" class="p-1 rounded hover:bg-surface-container-high text-on-surface-variant">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <p class="font-body-sm text-on-surface-variant mb-4">AI-suggested relationships based on network topology (Adamic-Adar index).</p>
      ${predictions.map(p => `
        <div class="flex items-center gap-3 p-3 bg-surface-container-lowest rounded border border-outline-variant/10 mb-2">
          <span class="font-body-sm text-on-surface">${p.source_label}</span>
          <span class="material-symbols-outlined text-primary text-[16px]">arrow_forward</span>
          <span class="font-body-sm text-on-surface">${p.target_label}</span>
          <span class="font-data-mono-sm text-data-mono-sm text-secondary ml-auto">Score: ${p.score}</span>
        </div>
      `).join('')}
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}


// ============================================================
//  ALERTS PAGE
// ============================================================
function initAlertsPage() {
  const isAlertsPage = window.location.pathname.includes('alerts-patterns');
  if (!isAlertsPage) return;

  loadAlerts();

  const articles = document.querySelectorAll('main article');
  if (articles.length === 0) return;

  // Handle "Review Evidence" clicks
  articles.forEach(art => {
    const buttons = art.querySelectorAll('button');
    buttons.forEach(b => {
      if (b.textContent.includes('Review Evidence') || b.textContent.includes('Evidence Panel Active')) {
        b.addEventListener('click', (e) => {
          e.preventDefault();
          articles.forEach(a => {
            a.classList.remove('border-2', 'border-primary', 'shadow-lg');
            a.classList.add('border-outline-variant/30');
          });
          art.classList.add('border-2', 'border-primary', 'shadow-lg');
          art.classList.remove('border-outline-variant/30');
          b.className = 'px-space-sm h-7 rounded bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider font-bold flex items-center gap-1 shadow-sm';
          b.innerHTML = '<span class="material-symbols-outlined text-[15px]">visibility</span> Evidence Panel Active';

          const idEl = art.querySelector('.font-data-mono-sm.text-primary, .font-data-mono-sm.text-on-surface-variant');
          const alertId = idEl ? idEl.textContent.split('//')[0].trim() : 'ALT-8821';
          window.showTacticalToast(`Evidence Dossier loaded for ${alertId}`, 'info');
          loadAlertDetail(alertId.replace(/\s/g, ''));
        });
      }
    });

    // Disposition dropdown handler
    const dispBtns = art.querySelectorAll('button');
    dispBtns.forEach(dispBtn => {
      if (dispBtn.textContent.includes('Pending Review') || dispBtn.textContent.includes('Disposition')) {
        dispBtn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const currentText = dispBtn.textContent;
          let newDisposition = 'pending_review';

          if (currentText.includes('Pending')) {
            newDisposition = 'confirmed';
            dispBtn.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-400"></span><span>Disposition: Confirmed</span><span class="material-symbols-outlined text-[14px] text-outline">arrow_drop_down</span>';
            window.showTacticalToast('Disposition updated to: Confirmed Threat', 'success');
          } else if (currentText.includes('Confirmed')) {
            newDisposition = 'false_positive';
            dispBtn.innerHTML = '<span class="w-2 h-2 rounded-full bg-rose-400"></span><span>Disposition: False Positive</span><span class="material-symbols-outlined text-[14px] text-outline">arrow_drop_down</span>';
            window.showTacticalToast('Disposition updated to: False Positive', 'warning');
          } else {
            newDisposition = 'pending_review';
            dispBtn.innerHTML = '<span class="w-2 h-2 rounded-full bg-amber-400"></span><span>Disposition: Pending Review</span><span class="material-symbols-outlined text-[14px] text-outline">arrow_drop_down</span>';
            window.showTacticalToast('Disposition reset to: Pending Review', 'info');
          }

          // Update backend
          const idEl = art.querySelector('.font-data-mono-sm.text-primary, .font-data-mono-sm.text-on-surface-variant');
          const alertId = idEl ? idEl.textContent.split('//')[0].trim().replace(/\s/g, '') : null;
          if (alertId) {
            await NexusAPI.put(`/api/alerts/${alertId}/disposition`, { disposition: newDisposition });
          }
        });
      }
    });
  });

  // Severity filter pills
  document.querySelectorAll('button').forEach(pill => {
    const text = pill.textContent.toUpperCase();
    if (['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].some(s => text.includes(s) && text.length < 20)) {
      pill.addEventListener('click', () => {
        let targetSev = '';
        if (text.includes('CRITICAL')) targetSev = 'CRITICAL';
        else if (text.includes('HIGH')) targetSev = 'HIGH';
        else if (text.includes('MEDIUM')) targetSev = 'MEDIUM';
        else if (text.includes('LOW')) targetSev = 'LOW';

        const articles = document.querySelectorAll('main article');
        articles.forEach(art => {
          const artText = art.textContent.toUpperCase();
          if (targetSev && artText.includes(targetSev)) {
            art.style.display = '';
          } else {
            art.style.display = 'none';
          }
        });
        window.showTacticalToast(`Filtered alerts by: ${targetSev}`, 'info');
      });
    }
  });

  // Search input filter
  const filterInput = document.querySelector('input[placeholder*="Filter pattern ID"]');
  if (filterInput) {
    filterInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const articles = document.querySelectorAll('main article');
      articles.forEach(art => {
        art.style.display = art.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }
}

async function loadAlerts() {
  const data = await NexusAPI.get('/api/alerts/stats');
  if (!data) return;

  const statsEls = document.querySelectorAll('[data-alert-stat]');
  statsEls.forEach(el => {
    const key = el.getAttribute('data-alert-stat');
    if (data.by_severity && data.by_severity[key] !== undefined) {
      el.textContent = data.by_severity[key];
    }
  });
}

async function loadAlertDetail(alertId) {
  const data = await NexusAPI.get(`/api/alerts/${alertId}`);
  if (!data || !data.alert) return;

  const dossierTitle = document.querySelector('aside h3, [data-dossier-title]');
  if (dossierTitle) {
    dossierTitle.textContent = `Evidence Dossier: ${alertId}`;
  }
}


// ============================================================
//  REPORT GENERATOR
// ============================================================
function initReportGenerator() {
  const isReportPage = window.location.pathname.includes('report-generator');
  if (!isReportPage) return;

  const checkboxes = document.querySelectorAll('main input[type="checkbox"]');
  if (checkboxes.length === 0) return;

  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const label = cb.closest('label') || cb.parentElement;
      const text = label ? label.textContent.trim() : '';
      window.showTacticalToast(`Report Section [${text.split('\n')[0].trim()}]: ${cb.checked ? 'Included' : 'Excluded'}`, 'info');
    });
  });

  // Find generate/compile button
  document.querySelectorAll('button').forEach(btn => {
    const text = btn.textContent.trim().toLowerCase();
    if (text.includes('compile') || text.includes('generate') || text.includes('render')) {
      btn.addEventListener('click', async () => {
        window.showTacticalToast('Generating investigator brief...', 'info');

        const selectedSections = [];
        checkboxes.forEach(cb => {
          if (cb.checked) {
            const label = cb.closest('label') || cb.parentElement;
            const text = label ? label.textContent.trim().split('\n')[0].toLowerCase() : '';
            if (text.includes('executive') || text.includes('summary')) selectedSections.push('executive_summary');
            if (text.includes('entity') || text.includes('entities')) selectedSections.push('entity_analysis');
            if (text.includes('network') || text.includes('graph')) selectedSections.push('network_analysis');
            if (text.includes('financial') || text.includes('transaction')) selectedSections.push('financial_analysis');
            if (text.includes('communication') || text.includes('intercept')) selectedSections.push('communications_analysis');
            if (text.includes('alert') || text.includes('finding')) selectedSections.push('alerts_findings');
            if (text.includes('recommend')) selectedSections.push('recommendations');
          }
        });

        // Try to get selected case from any select/dropdown on the page
        let caseId = 'CS-2024-8841';
        const caseSelect = document.querySelector('select');
        if (caseSelect) caseId = caseSelect.value || caseId;

        const report = await NexusAPI.post('/api/reports/generate', {
          case_id: caseId,
          sections: selectedSections.length > 0 ? selectedSections : undefined,
        });

        if (report) {
          updateReportPreview(report);
          window.showTacticalToast('Investigator brief generated successfully.', 'success');
        }
      });
    }

    // Export button
    if (text.includes('export') || text.includes('download') || text.includes('pdf')) {
      btn.addEventListener('click', () => {
        window.showTacticalToast('Exporting report as PDF... Download starting.', 'info');
        window.print();
      });
    }
  });
}

function updateReportPreview(report) {
  const preview = document.querySelector('.bg-white, [data-report-preview], main .printable-document');
  if (!preview) return;

  let html = `
    <div class="p-8 text-gray-900 font-serif" style="font-family: 'Times New Roman', serif;">
      <div class="text-center mb-6 pb-4 border-b-2 border-gray-800">
        <p class="text-xs tracking-[0.3em] text-red-700 font-bold mb-2">${report.classification || 'CLASSIFIED'}</p>
        <h1 class="text-2xl font-bold mb-1">${report.title}</h1>
        <p class="text-sm text-gray-600">Generated: ${new Date(report.generated_at).toLocaleString()} by ${report.generated_by}</p>
        <p class="text-sm text-gray-600">Case: ${report.case_id}</p>
      </div>
  `;

  for (const [key, section] of Object.entries(report.sections || {})) {
    html += `<div class="mb-6">`;
    html += `<h2 class="text-lg font-bold border-b border-gray-300 pb-1 mb-3">${section.title || key}</h2>`;

    if (section.content) {
      html += `<p class="text-sm leading-relaxed mb-3">${section.content}</p>`;
    }

    if (section.high_risk_entities) {
      html += `<table class="w-full text-xs border-collapse mb-3">
        <thead><tr class="bg-gray-100">
          <th class="border p-1 text-left">ID</th><th class="border p-1 text-left">Name</th>
          <th class="border p-1 text-left">Type</th><th class="border p-1 text-left">Risk</th>
        </tr></thead><tbody>`;
      section.high_risk_entities.forEach(e => {
        html += `<tr><td class="border p-1">${e.id}</td><td class="border p-1">${e.name}</td>
          <td class="border p-1">${e.type}</td><td class="border p-1 font-bold">${e.risk_score}/100</td></tr>`;
      });
      html += `</tbody></table>`;
    }

    if (section.transaction_summary && section.transaction_summary.length > 0) {
      html += `<table class="w-full text-xs border-collapse mb-3">
        <thead><tr class="bg-gray-100">
          <th class="border p-1 text-left">From</th><th class="border p-1 text-left">To</th>
          <th class="border p-1 text-right">Amount</th><th class="border p-1 text-left">Date</th>
          <th class="border p-1 text-left">Pattern</th>
        </tr></thead><tbody>`;
      section.transaction_summary.forEach(t => {
        html += `<tr class="${t.flagged ? 'bg-red-50' : ''}">
          <td class="border p-1">${t.source}</td><td class="border p-1">${t.target}</td>
          <td class="border p-1 text-right">${t.amount} ${t.currency}</td>
          <td class="border p-1">${t.date}</td>
          <td class="border p-1">${t.pattern || '—'}</td></tr>`;
      });
      html += `</tbody></table>`;
    }

    if (section.alerts) {
      section.alerts.forEach(a => {
        const sevColor = a.severity === 'critical' ? 'red' : a.severity === 'high' ? 'orange' : 'blue';
        html += `<div class="border-l-4 pl-3 mb-3" style="border-color: ${sevColor}">
          <p class="text-xs font-bold">[${a.severity.toUpperCase()}] ${a.id}: ${a.title}</p>
          <p class="text-xs text-gray-700 mt-1">${a.description}</p>
        </div>`;
      });
    }

    if (section.items) {
      html += `<ol class="list-decimal pl-5 text-sm space-y-1">`;
      section.items.forEach(item => { html += `<li>${item}</li>`; });
      html += `</ol>`;
    }

    html += `</div>`;
  }

  if (report.source_documents && report.source_documents.length > 0) {
    html += `<div class="mt-6 pt-4 border-t border-gray-300">
      <h2 class="text-lg font-bold mb-2">Source Documents</h2>
      <ul class="text-xs space-y-1">`;
    report.source_documents.forEach(d => {
      html += `<li>📄 <strong>${d.id}</strong> — ${d.title} (${d.type})</li>`;
    });
    html += `</ul></div>`;
  }

  html += `<div class="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
    <p class="font-bold mb-1">⚠ NOTICE</p>
    <p>${report.disclaimer || ''}</p>
  </div>`;

  html += `</div>`;
  preview.innerHTML = html;
}


// ============================================================
//  TABS NAVIGATION
// ============================================================
function initTabsNavigation() {
  const profileTabButtons = document.querySelectorAll('button');
  const tabKeywords = ['overview', 'relationships', 'timeline', 'financials', 'intercepts', 'documents', 'evidence', 'notes', 'audit log'];

  profileTabButtons.forEach(btn => {
    // Extract textual label excluding material icon names and numeric badge numbers
    let label = '';
    const spans = btn.querySelectorAll('span');
    if (spans.length > 0) {
      spans.forEach(s => {
        const sText = s.textContent.trim().toLowerCase();
        if (!s.classList.contains('material-symbols-outlined') && !/^\d+/.test(sText) && sText.length >= 3) {
          if (!label) label = sText;
        }
      });
    }
    if (!label) {
      label = btn.textContent.replace(/[\n\r\t]+/g, ' ').trim().toLowerCase();
      // remove icon words
      label = label.replace(/\b(contact_page|grain|timeline|inventory_2|rate_review|description|account_balance|phone|folder)\b/gi, '').trim();
    }

    const matchedTab = tabKeywords.find(k => label.includes(k));
    if (matchedTab) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const parent = btn.parentElement;
        if (parent) {
          parent.querySelectorAll('button').forEach(b => {
            b.classList.remove('bg-surface-container', 'text-primary', 'font-bold');
            b.classList.add('text-on-surface-variant');
          });
          btn.classList.add('bg-surface-container', 'text-primary', 'font-bold');
          btn.classList.remove('text-on-surface-variant');
        }

        window.showTacticalToast(`Tab: ${matchedTab.toUpperCase()} active`, 'info');

        // Show/hide tab content sections if data-tab-content exists
        const tabSections = document.querySelectorAll('[data-tab-content]');
        if (tabSections.length > 0) {
          tabSections.forEach(section => {
            const secName = section.getAttribute('data-tab-content') || '';
            section.style.display = secName.toLowerCase().includes(matchedTab) ? '' : 'none';
          });
        }

        // Scroll to relevant section if present
        if (matchedTab.includes('relationship')) {
          const relSection = document.querySelector('[data-entity-relationships], section:has(table), table, [class*="relationship"]');
          if (relSection) relSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (matchedTab.includes('timeline')) {
          const timeSection = document.querySelector('[data-entity-timeline], [data-timeline], div:has(> .border-l-2), [class*="timeline"]');
          if (timeSection) timeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (matchedTab.includes('document') || matchedTab.includes('evidence')) {
          const docSection = document.querySelector('[data-entity-documents], [data-case-documents], section:has([class*="document"])');
          if (docSection) docSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (matchedTab.includes('overview')) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }
  });
}



// ============================================================
//  GLOBAL SEARCH BAR
// ============================================================
function initGlobalSearch() {
  const searchInput = document.querySelector('header input[type="text"]');
  if (!searchInput) return;

  let suggestionsDiv = null;
  let debounceTimer = null;

  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.trim();
    clearTimeout(debounceTimer);

    if (q.length < 2) {
      removeSuggestions();
      return;
    }

    debounceTimer = setTimeout(async () => {
      const data = await NexusAPI.get(`/api/search/suggestions?q=${encodeURIComponent(q)}`);
      if (data && data.suggestions && data.suggestions.length > 0) {
        showSuggestions(data.suggestions, searchInput);
      } else {
        removeSuggestions();
      }
    }, 250);
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = searchInput.value.trim();
      if (q) {
        window.location.href = `cross-case-search.html?q=${encodeURIComponent(q)}`;
      }
    }
    if (e.key === 'Escape') {
      removeSuggestions();
      searchInput.blur();
    }
  });

  searchInput.addEventListener('blur', () => {
    setTimeout(removeSuggestions, 200);
  });

  function showSuggestions(suggestions, inputEl) {
    removeSuggestions();
    suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'absolute top-full left-0 right-0 mt-1 bg-surface-container-low border border-outline-variant/40 rounded-lg shadow-xl overflow-hidden z-50';
    suggestionsDiv.style.maxHeight = '300px';
    suggestionsDiv.style.overflowY = 'auto';

    suggestions.forEach(s => {
      const item = document.createElement('div');
      item.className = 'px-3 py-2 hover:bg-surface-container cursor-pointer flex items-center gap-2 transition-colors';

      const icon = s.type === 'entity' ? 'person' : 'folder';
      const typeColor = s.type === 'entity' ? 'text-primary' : 'text-secondary';

      item.innerHTML = `
        <span class="material-symbols-outlined text-[16px] ${typeColor}">${icon}</span>
        <div class="flex-1 min-w-0">
          <p class="font-body-sm text-body-sm text-on-surface truncate">${s.text}</p>
          <p class="font-data-mono-sm text-data-mono-sm text-outline">${s.subtext}</p>
        </div>
      `;

      item.addEventListener('mousedown', (e) => {
        e.preventDefault();
        if (s.type === 'entity') {
          window.location.href = `entity-profiles.html?id=${s.id}`;
        } else if (s.type === 'case') {
          window.location.href = `case-workspaces.html?id=${s.id}`;
        }
      });

      suggestionsDiv.appendChild(item);
    });

    const wrapper = inputEl.closest('.relative');
    if (wrapper) {
      wrapper.appendChild(suggestionsDiv);
    }
  }

  function removeSuggestions() {
    if (suggestionsDiv) {
      suggestionsDiv.remove();
      suggestionsDiv = null;
    }
  }
}


// ============================================================
//  NOTIFICATION BADGE
// ============================================================
async function initNotificationBadge() {
  const data = await NexusAPI.get('/api/alerts/stats');
  if (!data) return;

  const notifBtns = document.querySelectorAll('button');
  notifBtns.forEach(btn => {
    if (btn.querySelector('.material-symbols-outlined') && btn.textContent.includes('notifications')) {
      const badge = btn.querySelector('.rounded-full.bg-primary');
      if (badge && data.unread > 0) {
        badge.style.display = '';
      }
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleNotificationsDropdown(btn);
      });
    }
  });

  const sidebarAlertBadge = document.querySelector('a[data-path="alerts-patterns"] span.text-error, a[href*="alerts"] span.text-error');
  if (sidebarAlertBadge && data.by_severity) {
    sidebarAlertBadge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>${data.by_severity.critical || 0} Crit`;
  }
}

window.toggleNotificationsDropdown = async function(btn) {
  let existing = document.getElementById('nexus-notifications-dropdown');
  if (existing) {
    existing.remove();
    return;
  }

  const dropdown = document.createElement('div');
  dropdown.id = 'nexus-notifications-dropdown';
  dropdown.className = 'fixed right-6 top-16 w-96 max-w-[92vw] bg-surface-container-low border border-primary/40 rounded-2xl shadow-2xl z-[120] overflow-hidden flex flex-col backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200';
  
  dropdown.innerHTML = `
    <div class="px-4 py-3 bg-surface-container flex items-center justify-between border-b border-outline-variant/30">
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-[18px] text-primary">notifications_active</span>
        <span class="font-headline-sm text-headline-sm text-on-surface font-bold">Tactical Alerts</span>
      </div>
      <span class="font-data-mono-sm text-data-mono-sm text-secondary font-bold">LIVE TELEMETRY</span>
    </div>
    <div id="nexus-notif-list" class="max-h-80 overflow-y-auto divide-y divide-outline-variant/15 font-body-sm text-body-sm p-1">
      <div class="p-4 text-center text-outline flex items-center justify-center gap-2">
        <span class="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
        <span>Polling alerts...</span>
      </div>
    </div>
    <div class="p-2.5 bg-surface-container border-t border-outline-variant/20 flex items-center justify-between">
      <button onclick="window.location.href='alerts-patterns.html'" class="text-xs font-bold text-primary hover:underline flex items-center gap-1">
        <span>Open Alerts & Patterns Console</span>
        <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
      </button>
      <button onclick="document.getElementById('nexus-notifications-dropdown').remove()" class="px-2 py-1 rounded bg-surface-container-high text-xs text-on-surface hover:bg-surface-container-highest">
        Dismiss
      </button>
    </div>
  `;

  document.body.appendChild(dropdown);

  const closeHandler = (e) => {
    if (!dropdown.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
      dropdown.remove();
      document.removeEventListener('click', closeHandler);
    }
  };
  setTimeout(() => document.addEventListener('click', closeHandler), 50);

  // Fetch recent alerts
  const alertsData = await NexusAPI.get('/api/dashboard/priority-alerts');
  const listEl = document.getElementById('nexus-notif-list');
  if (listEl && alertsData && alertsData.alerts) {
    if (alertsData.alerts.length === 0) {
      listEl.innerHTML = '<p class="p-4 text-center text-outline">No active unread alerts.</p>';
      return;
    }
    listEl.innerHTML = alertsData.alerts.slice(0, 5).map(a => `
      <div class="p-3 hover:bg-surface-container transition-colors cursor-pointer flex flex-col gap-1" onclick="window.location.href='alerts-patterns.html'">
        <div class="flex items-center justify-between">
          <span class="font-data-mono-sm text-data-mono-sm ${a.severity === 'critical' ? 'text-red-400 font-bold' : 'text-primary'}">${a.id}</span>
          <span class="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${sevBg(a.severity)}">${a.severity}</span>
        </div>
        <p class="font-semibold text-on-surface leading-tight">${a.title}</p>
        <p class="text-on-surface-variant text-[11px] line-clamp-1">${a.description || ''}</p>
        <span class="font-data-mono-sm text-[10px] text-outline mt-0.5">${formatTime(a.timestamp)}</span>
      </div>
    `).join('');
  }
};



// ============================================================
//  NEW CASE FILE BUTTON
// ============================================================
function initCaseFileButton() {
  document.querySelectorAll('button').forEach(btn => {
    if (btn.textContent.trim().includes('Case File') && btn.querySelector('.material-symbols-outlined')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        showNewCaseModal();
      });
    }
  });
}

window.showNewCaseModal = function() {
  window.openCreateCaseModal = window.showNewCaseModal;
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black/60 z-[100] flex items-center justify-center backdrop-blur-sm';
  overlay.id = 'case-modal-overlay';

  overlay.innerHTML = `
    <div class="bg-surface-container-low border border-outline-variant/40 rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-headline-md text-headline-md text-on-surface">New Case File</h2>
        <button onclick="document.getElementById('case-modal-overlay').remove()" class="p-1 rounded hover:bg-surface-container-high text-on-surface-variant">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="space-y-4">
        <div>
          <label class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1 block">Case Title</label>
          <input id="new-case-title" type="text" class="w-full px-3 py-2 bg-surface-container border border-outline-variant/40 rounded text-on-surface font-body-md text-body-md focus:border-primary focus:outline-none" placeholder="e.g., Operation THUNDERBIRD — Drug Network">
        </div>
        <div>
          <label class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1 block">Description</label>
          <textarea id="new-case-desc" rows="3" class="w-full px-3 py-2 bg-surface-container border border-outline-variant/40 rounded text-on-surface font-body-md text-body-md focus:border-primary focus:outline-none resize-none" placeholder="Brief description of the case..."></textarea>
        </div>
        <div>
          <label class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1 block">Priority</label>
          <select id="new-case-priority" class="w-full px-3 py-2 bg-surface-container border border-outline-variant/40 rounded text-on-surface font-body-md text-body-md focus:border-primary focus:outline-none">
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium" selected>Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div class="flex gap-3 pt-2">
          <button onclick="document.getElementById('case-modal-overlay').remove()" class="flex-1 px-4 py-2 rounded bg-surface-container border border-outline-variant/40 text-on-surface font-body-md hover:bg-surface-container-high transition-colors">Cancel</button>
          <button onclick="submitNewCase()" class="flex-1 px-4 py-2 rounded bg-primary text-on-primary font-headline-sm text-body-md font-semibold hover:bg-secondary transition-colors">Create Case</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
  document.getElementById('new-case-title').focus();
}

window.submitNewCase = async function() {
  const title = document.getElementById('new-case-title').value.trim();
  const desc = document.getElementById('new-case-desc').value.trim();
  const priority = document.getElementById('new-case-priority').value;

  if (!title) {
    window.showTacticalToast('Case title is required.', 'error');
    return;
  }

  const result = await NexusAPI.post('/api/cases', {
    title, description: desc, priority, assigned_officers: ['AN-89241'],
  });

  if (result && result.success) {
    window.showTacticalToast(`Case ${result.case_id} created successfully.`, 'success');
    document.getElementById('case-modal-overlay').remove();
    setTimeout(() => {
      window.location.href = `case-workspaces.html?id=${result.case_id}`;
    }, 800);
  } else {
    window.showTacticalToast('Failed to create case.', 'error');
  }
};


// ============================================================
//  INTERACTIVE ACTIONS ENGINE: MODALS & BUTTON WIRING
// ============================================================

window.openUploadDocumentModal = function(opts = {}) {
  let caseId = opts.caseId || getUrlParam('id') || getUrlParam('case') || 'CS-2024-8841';
  let modal = document.getElementById('upload-doc-modal-overlay');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'upload-doc-modal-overlay';
  modal.className = 'fixed inset-0 bg-black/75 z-[120] flex items-center justify-center backdrop-blur-sm p-4';
  modal.innerHTML = `
    <div class="bg-surface-container-low border border-primary/40 rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto flex flex-col p-6">
      <div class="flex items-center justify-between pb-3 border-b border-outline-variant/30 mb-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded bg-primary/10 border border-primary/40 flex items-center justify-center text-primary">
            <span class="material-symbols-outlined text-[20px]">upload_file</span>
          </div>
          <div>
            <h2 class="font-headline-md text-headline-md text-on-surface font-bold">Add Files & AI Ingestion</h2>
            <p class="font-label-md text-label-md text-outline">Powered by Groq / LLaMA Extraction Pipeline</p>
          </div>
        </div>
        <button id="upload-doc-close-btn" onclick="document.getElementById('upload-doc-modal-overlay').remove()" class="p-1 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Quick Fill Sample Templates -->
      <div class="mb-3 p-2.5 bg-surface-container rounded-xl border border-outline-variant/30">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-[11px] font-mono uppercase text-secondary font-bold flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">bolt</span> Quick-Load AI Test Sample:
          </span>
          <span class="text-[10px] text-outline">1-Click Groq Test</span>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <button type="button" onclick="fillSampleDoc('intercept')" class="px-2.5 py-1 rounded bg-surface-container-high hover:bg-primary/20 hover:text-primary border border-outline-variant/30 text-xs font-mono text-on-surface transition-colors">
            ⚡ Intercept Wiretap
          </button>
          <button type="button" onclick="fillSampleDoc('hawala')" class="px-2.5 py-1 rounded bg-surface-container-high hover:bg-primary/20 hover:text-primary border border-outline-variant/30 text-xs font-mono text-on-surface transition-colors">
            ⚡ Hawala Transfer Log
          </button>
          <button type="button" onclick="fillSampleDoc('fir')" class="px-2.5 py-1 rounded bg-surface-container-high hover:bg-primary/20 hover:text-primary border border-outline-variant/30 text-xs font-mono text-on-surface transition-colors">
            ⚡ Port Narcotics FIR
          </button>
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <label class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1 block">Document Title</label>
          <input id="upload-doc-title" type="text" class="w-full px-3 py-2 bg-surface-container border border-outline-variant/40 rounded text-on-surface font-body-md text-body-md focus:border-primary focus:outline-none" placeholder="e.g. Field Surveillance Log #442 — Port Limassol">
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1 block">Source Classification</label>
            <select id="upload-doc-source" class="w-full px-3 py-2 bg-surface-container border border-outline-variant/40 rounded text-on-surface font-body-md text-body-md focus:border-primary focus:outline-none">
              <option value="FIR">First Information Report (FIR)</option>
              <option value="Surveillance" selected>Surveillance Log / Field Notes</option>
              <option value="Witness Statement">Witness Statement / Deposition</option>
              <option value="Interrogation">Interrogation Transcript</option>
              <option value="CDR Analysis">CDR / Intercept Summary</option>
              <option value="Financial Audit">Financial Audit / Bank Record</option>
              <option value="Corporate Registry">Corporate Registry Extract</option>
            </select>
          </div>

          <div>
            <label class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1 block">Target Case</label>
            <input id="upload-doc-case" type="text" class="w-full px-3 py-2 bg-surface-container border border-outline-variant/40 rounded text-on-surface font-body-md text-body-md focus:border-primary focus:outline-none" value="${caseId}">
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider block">Document Text / File Upload</label>
            <label class="cursor-pointer font-label-md text-label-md text-primary hover:text-secondary flex items-center gap-1">
              <span class="material-symbols-outlined text-[15px]">attach_file</span>
              <span>Browse File (.txt, .pdf, .json, .csv)</span>
              <input id="upload-doc-file" type="file" class="hidden" accept=".txt,.json,.csv,.pdf,.doc,.docx">
            </label>
          </div>
          <textarea id="upload-doc-text" rows="6" class="w-full px-3 py-2 bg-surface-container border border-outline-variant/40 rounded text-on-surface font-body-md text-body-md focus:border-primary focus:outline-none resize-none" placeholder="Paste police report, witness transcript, or FIR text here... (Or choose a file above or click a test sample)"></textarea>
        </div>

        <div class="flex items-center gap-2 p-3 bg-surface-container rounded border border-outline-variant/20">
          <input type="checkbox" id="upload-doc-autocommit" checked class="w-4 h-4 rounded text-primary focus:ring-primary">
          <label for="upload-doc-autocommit" class="font-body-sm text-body-sm text-on-surface select-none cursor-pointer">
            Auto-commit high-confidence entities (≥85%) directly to graph, queue ambiguous ones for review
          </label>
        </div>

        <div id="upload-doc-progress" class="hidden p-3 bg-surface-container-high rounded border border-primary/30 font-data-mono-sm text-data-mono-sm text-primary flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
          <span id="upload-doc-progress-text">Analyzing text and running Groq AI extraction...</span>
        </div>

        <div id="upload-doc-results" class="hidden p-4 bg-surface-container-high/80 rounded-xl border border-secondary/30 space-y-2"></div>

        <div class="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/20">
          <button id="upload-doc-cancel-btn" type="button" onclick="document.getElementById('upload-doc-modal-overlay').remove()" class="px-4 py-2 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-body-md transition-colors">Cancel</button>
          <button id="upload-doc-submit-btn" type="button" onclick="submitDocumentIngestion()" class="flex items-center gap-2 px-5 py-2 rounded bg-primary text-on-primary font-headline-sm text-body-sm font-semibold hover:bg-secondary transition-all shadow-md">
            <span class="material-symbols-outlined text-[18px]">bolt</span>
            <span>Ingest & Extract with AI</span>
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

  // Handle file select
  const fileInput = document.getElementById('upload-doc-file');
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const titleInput = document.getElementById('upload-doc-title');
      if (!titleInput.value) {
        titleInput.value = file.name.replace(/\.[^/.]+$/, '');
      }
      const reader = new FileReader();
      reader.onload = (evt) => {
        document.getElementById('upload-doc-text').value = evt.target.result;
        window.showTacticalToast(`File "${file.name}" loaded (${Math.round(file.size / 1024)} KB).`, 'info');
      };
      reader.readAsText(file);
    });
  }
};

window.fillSampleDoc = function(type) {
  const titleInput = document.getElementById('upload-doc-title');
  const textInput = document.getElementById('upload-doc-text');
  const sourceSelect = document.getElementById('upload-doc-source');
  if (!titleInput || !textInput) return;

  if (type === 'intercept') {
    titleInput.value = 'Tactical SIGINT Intercept #9914 — Limassol Logistics';
    if (sourceSelect) sourceSelect.value = 'CDR Analysis';
    textInput.value = `[INTERCEPT RECORD 2024-09-08 23:14:02 UTC]
Target Line: +357-99-401102 (Attributed to Dmitri Petrov)
Correspondent: +372-55-901844 (Attributed to Elena Rostova, Baltic-X Holding)
Petrov: "Consignment 44-Bravo cleared Berth 4 at Limassol Port Terminal today. The bill of lading is signed under Vektor Logistics."
Rostova: "The escrow was released to EuroBank Cyprus account IBAN CY2900200195000035700142994. Transfer €450,000 immediately to Marcus Havel in Antwerp."
Petrov: "Understood. The courier will rendezvous at Frankfurt Main Station on Monday using vehicle registration plate MH-02-AK-9921."`;
  } else if (type === 'hawala') {
    titleInput.value = 'FinCEN Wire Anomaly Record — €1,250,000 Layering';
    if (sourceSelect) sourceSelect.value = 'Financial Audit';
    textInput.value = `FINANCIAL INTELLIGENCE DISSEMINATION:
Originator: Baltic-X Holding (Tallinn, Estonia)
Intermediary Bank: Hellenic Horizon Bank (Limassol, Cyprus)
Account: CY88-0050-9941-8821
Beneficiary: Vektor Logistics GMBH (Frankfurt Escrow)
Amount: €1,250,000.00 EUR
Signatory: Elena Rostova (DOB 1984-06-12)
Transaction flagged under automated Structuring Rule 4.8. Beneficial owner identified as Dmitri Petrov. Funds distributed across 14 sub-accounts within 180 seconds.`;
  } else if (type === 'fir') {
    titleInput.value = 'Port Authority Incident Record — Berth 4 Vessel Seizure';
    if (sourceSelect) sourceSelect.value = 'FIR';
    textInput.value = `FIRST INFORMATION REPORT / INCIDENT SUMMARY:
Location: Limassol Port Terminal, Pier 7 Depot, Cyprus.
Vessel: MV Nordic Wave (IMO 9148821).
Detained Person: Dmitri Voronin (alias of Dmitri Petrov).
Associates Observed: Marcus Havel, Viktor Kovac.
Description: Customs enforcement intercepted 4 shipping containers disguised as industrial machine parts. High-grade military avionics and encrypted communication sets discovered. Associated corporation Vektor Maritime GMBH registered in Limassol.`;
  }
  window.showTacticalToast('Sample intelligence report loaded. Click Ingest to test AI extraction!', 'info');
};

window.submitDocumentIngestion = async function() {
  const title = document.getElementById('upload-doc-title').value.trim();
  const sourceType = document.getElementById('upload-doc-source').value;
  const caseId = document.getElementById('upload-doc-case').value.trim();
  const text = document.getElementById('upload-doc-text').value.trim();
  const autoCommit = document.getElementById('upload-doc-autocommit').checked;

  if (!title) {
    window.showTacticalToast('Please enter a document title.', 'error');
    return;
  }
  if (!text) {
    window.showTacticalToast('Please provide document text or select a file.', 'error');
    return;
  }

  const submitBtn = document.getElementById('upload-doc-submit-btn');
  const progress = document.getElementById('upload-doc-progress');
  const resultsCard = document.getElementById('upload-doc-results');

  submitBtn.disabled = true;
  submitBtn.classList.add('opacity-50', 'pointer-events-none');
  progress.classList.remove('hidden');
  resultsCard.classList.add('hidden');

  try {
    const res = await NexusAPI.post('/api/nlp/ingest', {
      title,
      source_type: sourceType,
      case_id: caseId || null,
      text,
      auto_commit: autoCommit,
    });

    progress.classList.add('hidden');
    submitBtn.disabled = false;
    submitBtn.classList.remove('opacity-50', 'pointer-events-none');

    if (res && res.success) {
      window.showTacticalToast(`Document ${res.document_id} ingested! ${res.total_extracted} entities extracted via ${res.model_used || 'Groq'}.`, 'success');

      resultsCard.classList.remove('hidden');
      resultsCard.innerHTML = `
        <div class="flex items-center justify-between border-b border-outline-variant/30 pb-2">
          <span class="font-headline-sm text-headline-sm text-secondary font-bold">Extraction Completed (${res.model_used || 'Groq'})</span>
          <span class="font-data-mono-sm text-data-mono-sm text-outline">${res.document_id}</span>
        </div>
        <p class="font-body-sm text-on-surface">${res.summary || 'Entity extraction completed and verified.'}</p>
        <div class="grid grid-cols-2 gap-2 font-data-mono-sm text-data-mono-sm mt-2">
          <div class="p-2 bg-surface-container rounded text-emerald-400">
            ✓ Auto-accepted into graph: ${res.auto_accepted_count}
          </div>
          <div class="p-2 bg-surface-container rounded text-amber-400">
            ⏳ Queued for analyst review: ${res.queued_for_review_count}
          </div>
        </div>
        <div class="pt-2 flex justify-end gap-2">
          <button type="button" onclick="document.getElementById('upload-doc-modal-overlay').remove(); window.location.reload();" class="px-4 py-1.5 rounded bg-secondary text-surface-container-lowest font-headline-sm text-body-sm font-bold shadow-md">
            Done & Refresh View
          </button>
        </div>
      `;
    } else {
      window.showTacticalToast(res?.detail || 'Document ingestion failed.', 'error');
    }
  } catch (err) {
    progress.classList.add('hidden');
    submitBtn.disabled = false;
    submitBtn.classList.remove('opacity-50', 'pointer-events-none');
    window.showTacticalToast('Error ingesting document.', 'error');
  }
};

window.openAddEntityModal = function(defaultType = 'Person', defaultCaseId = null) {
  let caseId = defaultCaseId || getUrlParam('id') || getUrlParam('case') || 'CS-2024-8841';
  let modal = document.getElementById('add-entity-modal-overlay');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'add-entity-modal-overlay';
  modal.className = 'fixed inset-0 bg-black/75 z-[120] flex items-center justify-center backdrop-blur-sm p-4';
  modal.innerHTML = `
    <div class="bg-surface-container-low border border-primary/40 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col p-6">
      <div class="flex items-center justify-between pb-3 border-b border-outline-variant/30 mb-4">
        <h2 class="font-headline-md text-headline-md text-on-surface font-bold">Add Entity of Interest</h2>
        <button onclick="document.getElementById('add-entity-modal-overlay').remove()" class="p-1 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="space-y-4">
        <div>
          <label class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1 block">Entity Name / Primary Label</label>
          <input id="new-entity-name" type="text" class="w-full px-3 py-2 bg-surface-container border border-outline-variant/40 rounded text-on-surface font-body-md text-body-md focus:border-primary focus:outline-none" placeholder="e.g. Vikram Malhotra, Vektor Logistics, MH-02-AK-9921">
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1 block">Entity Type</label>
            <select id="new-entity-type" class="w-full px-3 py-2 bg-surface-container border border-outline-variant/40 rounded text-on-surface font-body-md text-body-md focus:border-primary focus:outline-none">
              <option value="Person" ${defaultType === 'Person' ? 'selected' : ''}>Person</option>
              <option value="Organization" ${defaultType === 'Organization' ? 'selected' : ''}>Organization</option>
              <option value="Location" ${defaultType === 'Location' ? 'selected' : ''}>Location</option>
              <option value="Vehicle" ${defaultType === 'Vehicle' ? 'selected' : ''}>Vehicle / Vessel</option>
              <option value="PhoneNumber" ${defaultType === 'PhoneNumber' ? 'selected' : ''}>Phone / Burner</option>
              <option value="BankAccount" ${defaultType === 'BankAccount' ? 'selected' : ''}>Bank Account / Wallet</option>
            </select>
          </div>
          <div>
            <label class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1 block">Risk Score (0 - 100)</label>
            <input id="new-entity-risk" type="number" min="0" max="100" value="65" class="w-full px-3 py-2 bg-surface-container border border-outline-variant/40 rounded text-on-surface font-body-md text-body-md focus:border-primary focus:outline-none">
          </div>
        </div>
        <div>
          <label class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1 block">Description & Intelligence Notes</label>
          <textarea id="new-entity-desc" rows="3" class="w-full px-3 py-2 bg-surface-container border border-outline-variant/40 rounded text-on-surface font-body-md text-body-md focus:border-primary focus:outline-none resize-none" placeholder="Suspect background, aliases, observed activities..."></textarea>
        </div>
        <div class="flex items-center justify-end gap-3 pt-2">
          <button type="button" onclick="document.getElementById('add-entity-modal-overlay').remove()" class="px-4 py-2 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-body-md transition-colors">Cancel</button>
          <button type="button" onclick="submitNewEntity('${caseId}')" class="px-5 py-2 rounded bg-primary text-on-primary font-headline-sm text-body-md font-semibold hover:bg-secondary transition-colors">Create Entity</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  document.getElementById('new-entity-name').focus();
};

window.submitNewEntity = async function(caseId) {
  const name = document.getElementById('new-entity-name').value.trim();
  const type = document.getElementById('new-entity-type').value;
  const risk = parseFloat(document.getElementById('new-entity-risk').value) || 50;
  const desc = document.getElementById('new-entity-desc').value.trim();

  if (!name) {
    window.showTacticalToast('Entity name is required.', 'error');
    return;
  }

  const payload = {
    entity_type: type,
    name: name,
    risk_score: risk,
    description: desc,
    case_id: caseId || null,
  };
  if (type === 'PhoneNumber') payload.phone_number = name;
  if (type === 'Vehicle') payload.vehicle_reg = name;
  if (type === 'BankAccount') payload.account_number = name;

  const res = await NexusAPI.post('/api/entities', payload);
  if (res && res.success) {
    window.showTacticalToast(`Entity ${name} (${res.entity_id}) added to graph.`, 'success');
    document.getElementById('add-entity-modal-overlay').remove();
    setTimeout(() => window.location.reload(), 600);
  } else {
    window.showTacticalToast('Failed to create entity.', 'error');
  }
};

window.openChangeStatusModal = function(caseId, currentStatus = 'investigating') {
  caseId = caseId || getUrlParam('id') || 'CS-2024-8841';
  let modal = document.getElementById('status-modal-overlay');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'status-modal-overlay';
  modal.className = 'fixed inset-0 bg-black/75 z-[120] flex items-center justify-center backdrop-blur-sm p-4';
  modal.innerHTML = `
    <div class="bg-surface-container-low border border-primary/40 rounded-2xl shadow-2xl w-full max-w-md p-6">
      <div class="flex items-center justify-between pb-3 border-b border-outline-variant/30 mb-4">
        <h2 class="font-headline-md text-headline-md text-on-surface font-bold">Change Case Status</h2>
        <button onclick="document.getElementById('status-modal-overlay').remove()" class="p-1 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="space-y-4">
        <p class="font-body-sm text-on-surface-variant">Case: <span class="text-primary font-bold">${caseId}</span></p>
        <select id="case-new-status-select" class="w-full px-3 py-2 bg-surface-container border border-outline-variant/40 rounded text-on-surface font-body-md text-body-md focus:border-primary focus:outline-none">
          <option value="open">Open (Initial Assessment)</option>
          <option value="investigating" selected>Investigating (Active Taskforce)</option>
          <option value="chargesheet_ready">Chargesheet Ready (Prosecution Review)</option>
          <option value="closed">Closed (Adjudicated)</option>
        </select>
        <div class="flex items-center justify-end gap-3 pt-2">
          <button type="button" onclick="document.getElementById('status-modal-overlay').remove()" class="px-4 py-2 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-body-md transition-colors">Cancel</button>
          <button type="button" onclick="submitCaseStatus('${caseId}')" class="px-5 py-2 rounded bg-primary text-on-primary font-headline-sm text-body-md font-semibold hover:bg-secondary transition-colors">Update Status</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
};

window.submitCaseStatus = async function(caseId) {
  const status = document.getElementById('case-new-status-select').value;
  const res = await NexusAPI.put(`/api/cases/${caseId}/status`, { status });
  if (res && res.success) {
    window.showTacticalToast(`Case status updated to: ${status.toUpperCase()}`, 'success');
    document.getElementById('status-modal-overlay').remove();
    setTimeout(() => window.location.reload(), 500);
  } else {
    window.showTacticalToast(res?.error || 'Invalid status transition.', 'error');
  }
};

window.openAssignOfficerModal = function(caseId) {
  caseId = caseId || getUrlParam('id') || 'CS-2024-8841';
  let modal = document.getElementById('assign-officer-modal-overlay');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'assign-officer-modal-overlay';
  modal.className = 'fixed inset-0 bg-black/75 z-[120] flex items-center justify-center backdrop-blur-sm p-4';
  modal.innerHTML = `
    <div class="bg-surface-container-low border border-primary/40 rounded-2xl shadow-2xl w-full max-w-md p-6">
      <div class="flex items-center justify-between pb-3 border-b border-outline-variant/30 mb-4">
        <h2 class="font-headline-md text-headline-md text-on-surface font-bold">Assign Investigating Officer</h2>
        <button onclick="document.getElementById('assign-officer-modal-overlay').remove()" class="p-1 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="space-y-4">
        <p class="font-body-sm text-on-surface-variant">Assigning to Case: <span class="text-primary font-bold">${caseId}</span></p>
        <div>
          <label class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1 block">Select Cadre Officer</label>
          <select id="assign-officer-select" class="w-full px-3 py-2 bg-surface-container border border-outline-variant/40 rounded text-on-surface font-body-md text-body-md focus:border-primary focus:outline-none">
            <option value="Lead Vance (AN-89241)">Spec. Agent M. Vance — HSI SAC Lead</option>
            <option value="Agent Thorne (CY-4011)">Spec. Agent R. Thorne — Cyber Forensics</option>
            <option value="Analyst Chen (IN-5520)">Intel Analyst D. Chen — FinCEN Liaison</option>
            <option value="Inspector Jenkins (TF-8812)">Inspector S. Jenkins — Interpol Taskforce</option>
          </select>
        </div>
        <div>
          <label class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1 block">Operational Clearance Role</label>
          <input id="assign-officer-role" type="text" value="CASE DEPUTY / EVIDENCE HANDLER" class="w-full px-3 py-2 bg-surface-container border border-outline-variant/40 rounded text-on-surface font-body-md text-body-md focus:border-primary focus:outline-none">
        </div>
        <div class="flex items-center justify-end gap-3 pt-2">
          <button type="button" onclick="document.getElementById('assign-officer-modal-overlay').remove()" class="px-4 py-2 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-body-md transition-colors">Cancel</button>
          <button type="button" onclick="submitAssignOfficer('${caseId}')" class="px-5 py-2 rounded bg-primary text-on-primary font-headline-sm text-body-md font-semibold hover:bg-secondary transition-colors">Assign Officer</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
};

window.submitAssignOfficer = function(caseId) {
  const officer = document.getElementById('assign-officer-select').value;
  const role = document.getElementById('assign-officer-role').value;
  window.showTacticalToast(`Officer ${officer} successfully assigned as ${role}.`, 'success');
  document.getElementById('assign-officer-modal-overlay').remove();

  // Add chip to investigator row if present
  const cadreRow = document.querySelector('div:has(> button span:contains("Assign Officer")), div.flex.items-center.gap-2.flex-wrap');
  if (cadreRow) {
    const chip = document.createElement('div');
    chip.className = 'inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-container border border-primary/40 shadow-sm animate-in fade-in duration-300';
    chip.innerHTML = `
      <div class="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-data-mono-sm text-[10px] font-bold">✓</div>
      <span class="font-body-sm text-body-sm text-on-surface font-medium">${officer.split('(')[0].trim()}</span>
      <span class="font-data-mono-sm text-data-mono-sm text-outline uppercase">${role.split('/')[0].trim()}</span>
    `;
    cadreRow.insertBefore(chip, cadreRow.lastElementChild);
  }
};

window.openQuickFlagModal = function() {
  let modal = document.getElementById('quick-flag-modal-overlay');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'quick-flag-modal-overlay';
  modal.className = 'fixed inset-0 bg-black/75 z-[120] flex items-center justify-center backdrop-blur-sm p-4';
  modal.innerHTML = `
    <div class="bg-surface-container-low border border-error/40 rounded-2xl shadow-2xl w-full max-w-md p-6">
      <div class="flex items-center justify-between pb-3 border-b border-outline-variant/30 mb-4">
        <div class="flex items-center gap-2 text-error">
          <span class="material-symbols-outlined text-[22px]">flag</span>
          <h2 class="font-headline-md text-headline-md text-on-surface font-bold">Priority Threat Flag</h2>
        </div>
        <button onclick="document.getElementById('quick-flag-modal-overlay').remove()" class="p-1 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="space-y-4">
        <div>
          <label class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1 block">Threat Severity Level</label>
          <select id="flag-severity-select" class="w-full px-3 py-2 bg-surface-container border border-outline-variant/40 rounded text-on-surface font-body-md text-body-md focus:border-primary focus:outline-none">
            <option value="CRITICAL" selected>CRITICAL // IMMINENT FLIGHT RISK</option>
            <option value="HIGH">HIGH // SANCTION EVASION / BULK CASH</option>
            <option value="MEDIUM">MEDIUM // ANOMALOUS TELEMETRY</option>
          </select>
        </div>
        <div>
          <label class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1 block">Flag Justification & Notes</label>
          <textarea id="flag-notes-text" rows="3" class="w-full px-3 py-2 bg-surface-container border border-outline-variant/40 rounded text-on-surface font-body-md text-body-md focus:border-primary focus:outline-none resize-none" placeholder="Provide tactical justification, radar anomaly, or emergency surveillance requirement..."></textarea>
        </div>
        <div class="flex items-center justify-end gap-3 pt-2">
          <button type="button" onclick="document.getElementById('quick-flag-modal-overlay').remove()" class="px-4 py-2 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-body-md transition-colors">Cancel</button>
          <button type="button" onclick="submitQuickFlag()" class="px-5 py-2 rounded bg-error text-surface-container-lowest font-headline-sm text-body-md font-bold hover:bg-red-400 transition-colors">Submit Flag</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  document.getElementById('flag-notes-text').focus();
};

window.submitQuickFlag = function() {
  const sev = document.getElementById('flag-severity-select').value;
  const notes = document.getElementById('flag-notes-text').value.trim();
  window.showTacticalToast(`Item flagged as [${sev}]: ${notes || 'Tactical review requested'}`, 'error');
  document.getElementById('quick-flag-modal-overlay').remove();
};

window.openExportDossierModal = async function(id = 'CS-2024-8841') {
  id = id || getUrlParam('id') || 'CS-2024-8841';
  let modal = document.getElementById('export-dossier-modal-overlay');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'export-dossier-modal-overlay';
  modal.className = 'fixed inset-0 bg-black/80 z-[130] flex items-center justify-center backdrop-blur-md p-4';
  
  modal.innerHTML = `
    <div class="bg-surface-container-low border border-primary/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col p-6 font-body-sm text-body-sm">
      <div class="flex items-center justify-between pb-3 border-b border-outline-variant/30 mb-4">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-[24px]">description</span>
          <div>
            <h2 class="font-headline-md text-headline-md text-on-surface font-bold">Classified Intelligence Dossier</h2>
            <p class="font-data-mono-sm text-data-mono-sm text-outline">RESTRICTED // LAW ENFORCEMENT SENSITIVE // CASE: ${id}</p>
          </div>
        </div>
        <button id="export-dossier-close-x" onclick="document.getElementById('export-dossier-modal-overlay').remove()" class="p-1 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div class="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 space-y-3 font-mono text-xs text-on-surface">
        <div class="text-center font-bold text-red-400 tracking-widest border-b border-outline-variant/20 pb-2">
          TOP SECRET // SCI // NOFORN // DOJ-NSD TACTICAL DOSSIER
        </div>
        <div class="grid grid-cols-2 gap-2 text-on-surface-variant">
          <div><span class="text-outline">CASE ID:</span> ${id}</div>
          <div><span class="text-outline">TIMESTAMP:</span> ${new Date().toUTCString()}</div>
          <div><span class="text-outline">ORIGINATING AGENCY:</span> HSI / DOJ Transnational Organized Crime</div>
          <div><span class="text-outline">ANALYST ATTRIBUTION:</span> AN-89241 (M. Vance)</div>
        </div>
        <div class="pt-2 border-t border-outline-variant/20">
          <p class="font-bold text-primary mb-1">OPERATIONAL THREAT SUMMARY:</p>
          <p class="text-on-surface leading-relaxed">
            Multi-jurisdictional network coordinating illicit maritime cargo transshipment through Limassol Port Terminal (Berth 4) with financial layering routed via Baltic-X Holding accounts and structured wire transfers to Frankfurt. Primary coordinator identified as Dmitri Petrov (POI-9042, risk score: 94/100).
          </p>
        </div>
        <div class="pt-2 border-t border-outline-variant/20">
          <p class="font-bold text-secondary mb-1">IDENTIFIED THREAT ACTORS & ASSETS:</p>
          <ul class="list-disc list-inside space-y-0.5 text-on-surface-variant">
            <li>Dmitri Petrov (POI-9042) — Centrality: 0.94 (Network Hub, Red Notice Pending)</li>
            <li>Vektor Logistics (ORG-5519) — Shell Freight Forwarder (€1.4M structured transactions)</li>
            <li>Limassol Port Terminal (LOC-4011) — Berth 4-B Transshipment Choke Point</li>
            <li>Baltic-X Holding (ORG-6023) — Offshore Holding Vehicle (BVI / Tallinn)</li>
            <li>Elena Rostova (POI-3318) — Escrow Trustee / Active Wiretap Target</li>
          </ul>
        </div>
      </div>

      <div class="flex items-center justify-between pt-4 mt-4 border-t border-outline-variant/20">
        <span class="font-data-mono-sm text-data-mono-sm text-outline">SHA-256 HASH VERIFIED</span>
        <div class="flex items-center gap-2">
          <button type="button" id="export-dossier-close-btn" onclick="document.getElementById('export-dossier-modal-overlay').remove()" class="px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm text-body-sm transition-colors">
            Close
          </button>
          <button type="button" onclick="downloadDossierText('${id}')" class="px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm text-body-sm transition-colors flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px] text-secondary">download</span>
            <span>Download .MD</span>
          </button>
          <button type="button" onclick="downloadGraphJSON('${id}')" class="px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm text-body-sm transition-colors flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px] text-primary">data_object</span>
            <span>Download .JSON</span>
          </button>
          <button type="button" onclick="window.print()" class="px-4 py-1.5 rounded bg-primary text-on-primary font-headline-sm text-body-sm font-bold hover:bg-secondary transition-colors flex items-center gap-1.5 shadow-md">
            <span class="material-symbols-outlined text-[16px]">print</span>
            <span>Print / PDF</span>
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  window.showTacticalToast(`Dossier compiled for ${id}.`, 'info');
};

window.downloadDossierText = function(id) {
  const content = `# TOP SECRET // SCI // LAW ENFORCEMENT SENSITIVE
## NEXUS COMMAND INTELLIGENCE DOSSIER — CASE ${id}
Generated: ${new Date().toISOString()}
Originator: DOJ-NSD / HSI SAC Transnational Crime Taskforce
Analyst Attribution: Spec. Agent M. Vance [AN-89241]

### 1. OPERATIONAL OVERVIEW
Operation Blackthorn investigates a transnational sanction evasion and weapons transshipment nexus operating across Limassol Port Terminal, Baltic holding companies, and Frankfurt escrow channels.

### 2. PRIMARY TARGET PROFILE
- Name: Dmitri Petrov (Alias: The Architect, D. Voronin)
- Identifier: POI-9042
- Network Centrality: 0.94 (Top 1% Global Hub)
- Threat Score: 94 / 100 [CRITICAL PRIORITY]
- Status: INTERPOL Red Notice Pending, Active Title III Wiretap

### 3. FINANCIAL & INFRASTRUCTURE NODES
- Vektor Logistics (ORG-5519): Shell forwarder, €1.4M structured transfers
- Limassol Port Terminal (LOC-4011): Pier 7 Depot berth monitoring
- Baltic-X Holding (ORG-6023): Beneficial ownership tracing directly to target
- Elena Rostova (POI-3318): Financial trustee and courier escort

---
Classification: TOP SECRET // SCI // REL TO DOJ, INTERPOL
`;
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `NEXUS_DOSSIER_${id}.md`;
  a.click();
  URL.revokeObjectURL(url);
  window.showTacticalToast(`Downloaded NEXUS_DOSSIER_${id}.md`, 'success');
};

window.downloadGraphJSON = async function(id) {
  const res = await NexusAPI.get(`/api/network/stats`);
  const data = res || { case_id: id, nodes: 48, edges: 112, timestamp: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `nexus_network_graph_${id}.json`;
  a.click();
  URL.revokeObjectURL(url);
  window.showTacticalToast(`Downloaded nexus_network_graph_${id}.json`, 'success');
};

window.exportDossier = function(id) {
  window.openExportDossierModal(id || 'CS-2024-8841');
};

window.openSurveillanceModal = function(entityId = 'POI-9042') {
  let modal = document.getElementById('surveillance-modal-overlay');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'surveillance-modal-overlay';
  modal.className = 'fixed inset-0 bg-black/75 z-[120] flex items-center justify-center backdrop-blur-sm p-4';
  modal.innerHTML = `
    <div class="bg-surface-container-low border border-primary/40 rounded-2xl shadow-2xl w-full max-w-md p-6">
      <div class="flex items-center justify-between pb-3 border-b border-outline-variant/30 mb-4">
        <div class="flex items-center gap-2 text-primary">
          <span class="material-symbols-outlined text-[22px]">track_changes</span>
          <h2 class="font-headline-md text-headline-md text-on-surface font-bold">Target Surveillance Order</h2>
        </div>
        <button onclick="document.getElementById('surveillance-modal-overlay').remove()" class="p-1 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="space-y-4">
        <p class="font-body-sm text-on-surface-variant">Target Entity: <span class="text-primary font-bold">${entityId}</span> (Dmitri Petrov)</p>
        <div class="space-y-2">
          <label class="flex items-center gap-2 p-2.5 bg-surface-container rounded cursor-pointer">
            <input type="checkbox" checked class="w-4 h-4 text-primary rounded">
            <span class="font-body-sm text-body-sm text-on-surface">Live Cellular CDR Geofence (Radius: 2.5 km)</span>
          </label>
          <label class="flex items-center gap-2 p-2.5 bg-surface-container rounded cursor-pointer">
            <input type="checkbox" checked class="w-4 h-4 text-primary rounded">
            <span class="font-body-sm text-body-sm text-on-surface">Title III Automated Packet Sniffer / IP Intercept</span>
          </label>
          <label class="flex items-center gap-2 p-2.5 bg-surface-container rounded cursor-pointer">
            <input type="checkbox" checked class="w-4 h-4 text-primary rounded">
            <span class="font-body-sm text-body-sm text-on-surface">Port of Entry & Border Manifest ANPR Triangulation</span>
          </label>
        </div>
        <div class="flex items-center justify-end gap-3 pt-2">
          <button type="button" onclick="document.getElementById('surveillance-modal-overlay').remove()" class="px-4 py-2 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-body-md transition-colors">Cancel</button>
          <button type="button" onclick="submitSurveillanceOrder('${entityId}')" class="px-5 py-2 rounded bg-primary text-on-primary font-headline-sm text-body-md font-semibold hover:bg-secondary transition-colors">Activate Surveillance</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
};

window.submitSurveillanceOrder = function(entityId) {
  window.showTacticalToast(`Surveillance Package LIVE for ${entityId}: 24/7 Geofence & Intercept active.`, 'success');
  document.getElementById('surveillance-modal-overlay').remove();
};

window.openInterpolModal = function(entityId = 'POI-9042') {
  let modal = document.getElementById('interpol-modal-overlay');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'interpol-modal-overlay';
  modal.className = 'fixed inset-0 bg-black/75 z-[120] flex items-center justify-center backdrop-blur-sm p-4';
  modal.innerHTML = `
    <div class="bg-surface-container-low border border-error/40 rounded-2xl shadow-2xl w-full max-w-lg p-6 font-body-sm text-body-sm">
      <div class="flex items-center justify-between pb-3 border-b border-outline-variant/30 mb-4">
        <div class="flex items-center gap-2 text-error">
          <span class="material-symbols-outlined text-[24px]">sync_problem</span>
          <h2 class="font-headline-md text-headline-md text-on-surface font-bold">INTERPOL I-24/7 Global Telemetry</h2>
        </div>
        <button onclick="document.getElementById('interpol-modal-overlay').remove()" class="p-1 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="space-y-3 font-mono text-xs">
        <div class="p-3 bg-red-950/30 border border-error/40 rounded-lg text-red-300">
          <p class="font-bold flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-error animate-pulse"></span>
            CONFIRMED MATCH — RED NOTICE #A-9042/11-2023
          </p>
          <p class="mt-1 text-on-surface">Subject: PETROV, Dmitri (DOB: 1978-04-19, Saint Petersburg)</p>
          <p class="text-outline text-[11px] mt-0.5">Warrant Issued by: General Prosecutor's Office of Germany (Arms Export Control Act / Hawala Layering)</p>
        </div>
        <div class="grid grid-cols-2 gap-2 text-on-surface-variant p-2 bg-surface-container rounded border border-outline-variant/20">
          <div><span class="text-outline">DIFFUSION REF:</span> INT-DF-88194</div>
          <div><span class="text-outline">BIOMETRIC HASH:</span> 9f82...c014</div>
          <div><span class="text-outline">PASSPORTS RECORDED:</span> 3 (Cyprus, St. Kitts, Vanuatu)</div>
          <div><span class="text-outline">FLAG STATUS:</span> CRITICAL ARREST ORDER</div>
        </div>
      </div>
      <div class="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20 mt-4">
        <button type="button" onclick="document.getElementById('interpol-modal-overlay').remove()" class="px-4 py-2 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-body-md transition-colors">Dismiss</button>
        <button type="button" onclick="window.showTacticalToast('Interpol Red Notice packet attached to Case CS-2024-8841.', 'success'); document.getElementById('interpol-modal-overlay').remove();" class="px-5 py-2 rounded bg-error text-surface-container-lowest font-headline-sm text-body-md font-bold hover:bg-red-400 transition-colors">Attach to Case Brief</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
};

window.openLockTerminalModal = function() {
  if (typeof window.showTerminalLockScreen === 'function') {
    window.showTerminalLockScreen();
    return;
  }

  let modal = document.getElementById('lock-terminal-overlay');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'lock-terminal-overlay';
  modal.className = 'fixed inset-0 bg-black/95 z-[300] flex items-center justify-center backdrop-blur-lg p-4 select-none';
  modal.innerHTML = `
    <div id="lock-terminal-box" class="bg-surface-container-low border border-primary/50 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center space-y-4 transition-transform duration-200">
      <div class="w-14 h-14 rounded-full bg-primary/10 border border-primary/40 mx-auto flex items-center justify-center text-primary">
        <span class="material-symbols-outlined text-[28px]">lock</span>
      </div>
      <div>
        <h2 class="font-headline-md text-headline-md text-on-surface font-bold">Terminal Session Locked</h2>
        <p class="font-data-mono-sm text-data-mono-sm text-outline mt-1">SESSION: DOJ-NSD-8841 // SEC-LEVEL: TOP SECRET</p>
      </div>
      <div>
        <input id="terminal-pin-input" type="password" maxlength="4" placeholder="••••" class="w-full text-center tracking-[0.5em] text-2xl px-4 py-3 bg-surface-container border border-outline-variant/40 rounded text-primary font-mono focus:border-primary focus:outline-none transition-all" autofocus onkeydown="if(event.key==='Enter') unlockTerminalSession()">
        <p id="terminal-pin-error-text" class="hidden text-error font-mono text-[12px] font-bold mt-2 animate-pulse">ACCESS DENIED // INVALID PIN</p>
      </div>
      <div class="flex gap-2">
        <button type="button" onclick="unlockTerminalSession()" class="w-full py-2.5 rounded bg-primary hover:bg-secondary text-surface-container-lowest font-headline-sm font-bold text-body-md transition-colors shadow-md">
          Unlock Console
        </button>
      </div>
      <p class="text-[11px] text-outline">Hint: Enter default tactical passkey <span class="font-bold text-primary font-mono">8841</span></p>
    </div>
  `;
  document.body.appendChild(modal);
  const pinInput = document.getElementById('terminal-pin-input');
  if (pinInput) pinInput.focus();
};

window.unlockTerminalSession = function() {
  const input = document.getElementById('terminal-pin-input');
  const box = document.getElementById('lock-terminal-box');
  const errText = document.getElementById('terminal-pin-error-text');
  const val = input ? input.value.trim() : '';

  if (val === '8841') {
    const modal = document.getElementById('lock-terminal-overlay');
    if (modal) modal.remove();
    const altModal = document.getElementById('terminal-lock-overlay');
    if (altModal) altModal.remove();
    window.showTacticalToast('Terminal session unlocked. Welcome back, Lead Vance.', 'success');
  } else {
    // Show error, shake, clear input, do not unlock
    if (errText) errText.classList.remove('hidden');
    if (input) {
      input.classList.remove('border-outline-variant/40');
      input.classList.add('border-error', 'ring-2', 'ring-error/50');
      input.value = '';
      input.focus();
    }
    if (box) {
      box.classList.add('translate-x-2');
      setTimeout(() => { box.classList.remove('translate-x-2'); box.classList.add('-translate-x-2'); }, 50);
      setTimeout(() => { box.classList.remove('-translate-x-2'); box.classList.add('translate-x-1'); }, 100);
      setTimeout(() => { box.classList.remove('translate-x-1'); }, 150);
    }
    window.showTacticalToast('Access Denied: Invalid Security PIN (8841 required).', 'error');
  }
};

window.initCaseWorkspaceNoteComposer = function() {
  const submitBtn = document.getElementById('case-note-submit-btn');
  const textarea = document.getElementById('case-note-composer-textarea');
  const attachBtn = document.getElementById('case-note-attach-btn');
  const fileInput = document.getElementById('case-note-file-input');
  const chip = document.getElementById('case-note-attachment-chip');
  const chipName = document.getElementById('case-note-attachment-name');
  const chipSize = document.getElementById('case-note-attachment-size');
  const chipRemove = document.getElementById('case-note-attachment-remove');
  const tagBtn = document.getElementById('case-note-tag-btn');
  const secBtn = document.getElementById('case-note-sec-btn');
  const secBadge = document.getElementById('case-note-sec-badge');

  if (!submitBtn && !textarea) return;

  // File attach button
  if (attachBtn && fileInput && !attachBtn.getAttribute('data-wired')) {
    attachBtn.setAttribute('data-wired', 'true');
    attachBtn.addEventListener('click', (e) => {
      e.preventDefault();
      fileInput.click();
    });
  }

  if (fileInput && !fileInput.getAttribute('data-wired')) {
    fileInput.setAttribute('data-wired', 'true');
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file && chip) {
        chip.classList.remove('hidden');
        if (chipName) chipName.textContent = file.name;
        if (chipSize) chipSize.textContent = `${Math.round(file.size / 1024)} KB`;
        window.showTacticalToast(`Attached document: ${file.name}`, 'info');
      }
    });
  }

  if (chipRemove && !chipRemove.getAttribute('data-wired')) {
    chipRemove.setAttribute('data-wired', 'true');
    chipRemove.addEventListener('click', (e) => {
      e.preventDefault();
      if (fileInput) fileInput.value = '';
      if (chip) chip.classList.add('hidden');
      window.showTacticalToast('Attachment removed.', 'info');
    });
  }

  // Tag entity button
  if (tagBtn && !tagBtn.getAttribute('data-wired')) {
    tagBtn.setAttribute('data-wired', 'true');
    tagBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (textarea) {
        textarea.value += ' @Dmitri_Petrov ';
        textarea.focus();
        window.showTacticalToast('Tagged entity @Dmitri_Petrov', 'info');
      }
    });
  }

  // Security classification cycling
  const secLevels = [
    { label: 'SECRET // NOFORN', cls: 'bg-amber-500/15 border-amber-500/40 text-amber-400' },
    { label: 'TOP SECRET // SCI', cls: 'bg-red-500/15 border-red-500/40 text-red-400' },
    { label: 'CONFIDENTIAL', cls: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400' },
    { label: 'UNCLASSIFIED // FOUO', cls: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' }
  ];
  let secIdx = 0;

  function cycleSec(e) {
    if (e) e.preventDefault();
    secIdx = (secIdx + 1) % secLevels.length;
    const cur = secLevels[secIdx];
    if (secBadge) {
      secBadge.className = `px-2 py-0.5 rounded border text-[10px] font-mono font-bold uppercase select-none cursor-pointer transition-colors ${cur.cls}`;
      secBadge.textContent = cur.label;
    }
    window.showTacticalToast(`Security level set to: ${cur.label}`, 'warning');
  }

  if (secBtn && !secBtn.getAttribute('data-wired')) {
    secBtn.setAttribute('data-wired', 'true');
    secBtn.addEventListener('click', cycleSec);
  }
  if (secBadge && !secBadge.getAttribute('data-wired')) {
    secBadge.setAttribute('data-wired', 'true');
    secBadge.addEventListener('click', cycleSec);
  }

  // Submit button
  if (submitBtn && !submitBtn.getAttribute('data-wired')) {
    submitBtn.setAttribute('data-wired', 'true');
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.submitCaseNoteFromUI();
    });
  }

  if (textarea && !textarea.getAttribute('data-wired')) {
    textarea.setAttribute('data-wired', 'true');
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        window.submitCaseNoteFromUI();
      }
    });
  }
};

window.submitCaseNoteFromUI = async function(caseId) {
  caseId = caseId || getUrlParam('id') || 'CS-2024-8841';
  const textarea = document.getElementById('case-note-composer-textarea') ||
                   document.querySelector('textarea[placeholder*="attributed investigator entry"], textarea[placeholder*="intelligence note"], main textarea');
  if (!textarea) return;
  const content = textarea.value.trim();
  if (!content) {
    window.showTacticalToast('Please enter note text first.', 'warning');
    textarea.focus();
    return;
  }

  const fileInput = document.getElementById('case-note-file-input');
  const chip = document.getElementById('case-note-attachment-chip');
  const secBadge = document.getElementById('case-note-sec-badge');
  const currentSec = secBadge ? secBadge.textContent.trim() : 'SECRET // NOFORN';
  const attachedFile = (fileInput && fileInput.files && fileInput.files[0]) ? fileInput.files[0].name : null;

  // Prepend live note to timeline immediately
  const timelineContainer = document.getElementById('case-timeline-entries') ||
                            document.querySelector('.space-y-space-md.pt-2, [data-case-notes], div:has(> div img[alt*="Vance"])');
  if (timelineContainer) {
    const newEntry = document.createElement('div');
    newEntry.className = 'flex items-start gap-space-md group animate-in slide-in-from-top-2 duration-300';
    newEntry.innerHTML = `
      <div class="relative shrink-0">
        <img alt="Lead Analyst M. Vance" class="w-9 h-9 rounded-full object-cover shadow-md border border-primary/50" src="assets/images/img_4d2d0c150a.jpg"/>
        <span class="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center text-[9px] text-on-primary font-bold">✓</span>
      </div>
      <div class="flex-1 bg-surface-container rounded-lg p-space-sm shadow-md border border-primary/30">
        <div class="flex flex-wrap items-center justify-between gap-1">
          <div class="flex items-center gap-2">
            <span class="font-headline-sm text-body-sm font-semibold text-primary">Lead Analyst M. Vance</span>
            <span class="px-1.5 py-0.2 rounded bg-primary/20 text-primary text-[10px] font-data-mono-sm font-bold">JUST NOW</span>
            <span class="px-1.5 py-0.2 rounded bg-surface-container-high border border-outline-variant/30 text-secondary text-[10px] font-data-mono-sm">${currentSec}</span>
          </div>
          <span class="font-data-mono-sm text-data-mono-sm text-outline">#ENTRY-${Math.floor(1000 + Math.random() * 9000)}</span>
        </div>
        <p class="font-body-sm text-body-sm text-on-surface mt-1 leading-relaxed whitespace-pre-wrap">${content}</p>
        ${attachedFile ? `
          <div class="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-surface-container-lowest border border-primary/40 text-xs font-mono text-primary">
            <span class="material-symbols-outlined text-[15px]">attach_file</span>
            <span>${attachedFile}</span>
          </div>
        ` : ''}
      </div>
    `;
    timelineContainer.prepend(newEntry);
  }

  textarea.value = '';
  if (fileInput) fileInput.value = '';
  if (chip) chip.classList.add('hidden');

  window.showTacticalToast('Attributed note saved to case chain of custody.', 'success');

  const fullBackendContent = `[${currentSec}] ${content}` + (attachedFile ? `\n[ATTACHMENT: ${attachedFile}]` : '');
  await NexusAPI.post(`/api/cases/${caseId}/notes`, {
    content: fullBackendContent,
    note_type: 'operational',
    author_name: 'Lead Analyst M. Vance'
  });
};

// ============================================================
//  AI COPILOT FLOATING WIDGET (Groq / LLaMA Powered)
// ============================================================

function initGlobalCopilotWidget() {
  if (document.getElementById('nexus-copilot-container')) return;

  const container = document.createElement('div');
  container.id = 'nexus-copilot-container';
  container.className = 'fixed bottom-6 right-6 z-[999] flex flex-col items-end';

  container.innerHTML = `
    <!-- Copilot Window -->
    <div id="nexus-copilot-window" class="hidden mb-3 w-[420px] max-w-[94vw] h-[540px] bg-surface-container-lowest/98 border border-primary/50 rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden transition-all">
      <!-- Header -->
      <div class="px-4 py-3 bg-surface-container flex items-center justify-between border-b border-outline-variant/30">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <span class="material-symbols-outlined text-[18px]">neurology</span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-headline-sm text-headline-sm text-on-surface font-bold">NEXUS AI COPILOT</span>
              <span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary/15 border border-primary/40 text-primary">GROQ LIVE</span>
            </div>
            <p class="text-[10px] text-outline leading-none mt-0.5">Llama 3.3 / GPT-OSS 120B Tactical Analysis</p>
          </div>
        </div>
        <button onclick="document.getElementById('nexus-copilot-window').classList.add('hidden')" class="p-1 rounded hover:bg-surface-container-high text-outline hover:text-on-surface">
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      <!-- Messages Thread -->
      <div id="nexus-copilot-messages" class="flex-1 p-4 overflow-y-auto space-y-3 font-body-sm text-body-sm">
        <div class="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 text-on-surface">
          <p class="font-semibold text-primary mb-1">Tactical Intelligence Ready</p>
          <p>Active case database and knowledge graph ingested. Ask me about suspects, shell corporate fronts, burner intercepts, or financial layering.</p>
        </div>
      </div>

      <!-- Quick Prompt Chips -->
      <div class="px-3 py-2 bg-surface-container-low/80 border-t border-outline-variant/20 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
        <button type="button" onclick="askQuickPrompt('Who is Dmitri Petrov and what is his role in this network?')" class="px-2.5 py-1 rounded-full bg-surface-container border border-outline-variant/30 text-[11px] text-on-surface-variant hover:border-primary/50 hover:text-primary transition-colors">
          Who is Dmitri?
        </button>
        <button type="button" onclick="askQuickPrompt('Summarize suspicious transactions over $50k linked to Vektor Logistics')" class="px-2.5 py-1 rounded-full bg-surface-container border border-outline-variant/30 text-[11px] text-on-surface-variant hover:border-primary/50 hover:text-primary transition-colors">
          Vektor Wire Transfers?
        </button>
        <button type="button" onclick="askQuickPrompt('What are the critical pending alerts on this case?')" class="px-2.5 py-1 rounded-full bg-surface-container border border-outline-variant/30 text-[11px] text-on-surface-variant hover:border-primary/50 hover:text-primary transition-colors">
          Critical Alerts?
        </button>
      </div>

      <!-- Input Bar -->
      <div class="p-3 bg-surface-container border-t border-outline-variant/30 flex items-center gap-2">
        <input id="nexus-copilot-input" type="text" placeholder="Ask intelligence copilot..." class="flex-1 px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface font-body-sm text-body-sm focus:outline-none focus:border-primary" onkeydown="if(event.key==='Enter') sendCopilotMessage()">
        <button type="button" onclick="sendCopilotMessage()" class="p-2 rounded-lg bg-primary hover:bg-secondary text-surface-container-lowest transition-colors flex items-center justify-center shadow-md">
          <span class="material-symbols-outlined text-[18px]">send</span>
        </button>
      </div>
    </div>

    <!-- Toggle Button -->
    <button id="nexus-copilot-btn" type="button" onclick="toggleCopilotWindow()" class="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-primary via-cyan-400 to-secondary text-surface-container-lowest font-headline-sm text-body-sm font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all cursor-pointer">
      <span class="material-symbols-outlined text-[20px]">psychology</span>
      <span>AI Copilot</span>
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
    </button>
  `;

  document.body.appendChild(container);
}

window.toggleCopilotWindow = function() {
  const win = document.getElementById('nexus-copilot-window');
  if (win) {
    win.classList.toggle('hidden');
    if (!win.classList.contains('hidden')) {
      setTimeout(() => {
        const inp = document.getElementById('nexus-copilot-input');
        if (inp) inp.focus();
      }, 50);
    }
  }
};

window.askQuickPrompt = function(text) {
  const input = document.getElementById('nexus-copilot-input');
  if (input) {
    input.value = text;
    sendCopilotMessage();
  }
};

window.sendCopilotMessage = async function() {
  const input = document.getElementById('nexus-copilot-input');
  const msg = input ? input.value.trim() : '';
  if (!msg) return;

  const messagesDiv = document.getElementById('nexus-copilot-messages');
  if (!messagesDiv) return;
  
  // User bubble
  const userEl = document.createElement('div');
  userEl.className = 'p-3 bg-primary/10 border border-primary/30 rounded-xl text-on-surface ml-6 self-end text-right';
  userEl.innerHTML = `<p class="font-body-sm text-body-sm">${msg}</p>`;
  messagesDiv.appendChild(userEl);

  input.value = '';
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  // Typing indicator
  const typingEl = document.createElement('div');
  typingEl.id = 'copilot-typing';
  typingEl.className = 'p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 text-outline flex items-center gap-2';
  typingEl.innerHTML = `
    <span class="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
    <span>Consulting Groq intelligence graph...</span>
  `;
  messagesDiv.appendChild(typingEl);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  const caseId = getUrlParam('id') || getUrlParam('case') || 'CS-2024-8841';
  const res = await NexusAPI.askCopilot(msg, caseId);

  typingEl.remove();

  // Assistant bubble
  const botEl = document.createElement('div');
  botEl.className = 'p-3 bg-surface-container-low rounded-xl border border-secondary/30 text-on-surface space-y-1';
  botEl.innerHTML = `
    <div class="flex items-center gap-1.5 text-[10px] font-bold text-secondary uppercase">
      <span class="material-symbols-outlined text-[14px]">psychology</span>
      <span>${res?.active_model || 'Groq LLaMA'}</span>
    </div>
    <p class="font-body-sm text-body-sm text-on-surface leading-relaxed whitespace-pre-wrap">${res?.reply || 'No data found in graph.'}</p>
  `;
  messagesDiv.appendChild(botEl);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
};

// ============================================================
//  UNIVERSAL BUTTON AUTO-WIRING ENGINE
// ============================================================

function wireAllInteractiveButtons() {
  document.querySelectorAll('button').forEach(btn => {
    if (btn.hasAttribute('onclick') || btn.getAttribute('data-wired') === 'true') return;

    const txt = btn.textContent.trim().toLowerCase();
    const title = (btn.getAttribute('title') || '').toLowerCase();
    const fullText = txt + ' ' + title;

    // 1. Attach Document / Add files / Upload / Link Evidence / Import
    if (fullText.includes('add file') || fullText.includes('attach document') ||
        fullText.includes('upload') || fullText.includes('link evidence') ||
        fullText.includes('import feed') || fullText.includes('import') ||
        fullText.includes('add evidence')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.openUploadDocumentModal();
      });
      return;
    }

    // 2. Note Composer: Post Attributed Note / Add Entry / Post Note
    if (fullText.includes('post attributed note') || fullText.includes('post note') ||
        fullText.includes('add entry')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.submitCaseNoteFromUI();
      });
      return;
    }

    // 3. Note Composer Toolbar Companion Buttons:
    // Attach File icon
    if (title.includes('attach document') || btn.querySelector('.material-symbols-outlined')?.textContent.trim() === 'attach_file') {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.openUploadDocumentModal();
      });
      return;
    }
    // Tag Entity icon (@)
    if (title.includes('tag entity') || btn.querySelector('.material-symbols-outlined')?.textContent.trim() === 'alternate_email') {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const textarea = document.querySelector('textarea');
        if (textarea) {
          textarea.value += ' @Vikram_Malhotra ';
          textarea.focus();
          window.showTacticalToast('Tagged entity @Vikram_Malhotra', 'info');
        }
      });
      return;
    }
    // Security classification icon
    if (title.includes('security classification') || btn.querySelector('.material-symbols-outlined')?.textContent.trim() === 'security') {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const textarea = document.querySelector('textarea');
        if (textarea) {
          if (!textarea.value.startsWith('[TOP SECRET // SCI]')) {
            textarea.value = '[TOP SECRET // SCI] ' + textarea.value;
          }
          textarea.focus();
          window.showTacticalToast('Security Header [TOP SECRET // SCI] applied', 'warning');
        }
      });
      return;
    }

    // 4. Assign Officer
    if (fullText.includes('assign officer')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const cid = getUrlParam('id') || 'CS-2024-8841';
        window.openAssignOfficerModal(cid);
      });
      return;
    }

    // 5. Change Status
    if (fullText.includes('change status')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const cid = getUrlParam('id') || 'CS-2024-8841';
        window.openChangeStatusModal(cid);
      });
      return;
    }

    // 6. Add Target Surveillance
    if (fullText.includes('target surveillance') || fullText.includes('add surveillance')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.openSurveillanceModal('POI-9042');
      });
      return;
    }

    // 7. Cross-Check INTERPOL Live
    if (fullText.includes('interpol')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.openInterpolModal('POI-9042');
      });
      return;
    }

    // 8. Flag for Wiretap Review
    if (fullText.includes('wiretap review') || fullText.includes('wiretap')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.showTacticalToast('Target flagged for Title III emergency wiretap authorization.', 'error');
      });
      return;
    }

    // 9. Add POI / Person
    if (fullText.includes('add poi') || fullText.includes('add person') || fullText.includes('new poi')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.openAddEntityModal('Person');
      });
      return;
    }

    // 10. Add Vehicle / Account / Entity
    if (fullText.includes('add vehicle')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.openAddEntityModal('Vehicle');
      });
      return;
    }
    if (fullText.includes('add account') || fullText.includes('add bank')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.openAddEntityModal('BankAccount');
      });
      return;
    }
    if (fullText.includes('add entity') || fullText.includes('new entity') || fullText.includes('create entity')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.openAddEntityModal();
      });
      return;
    }

    // 11. Export Dossier / Report / Briefing Pack / PDF / DOCX
    if (fullText.includes('export dossier') || fullText.includes('export pdf') ||
        fullText.includes('export report') || fullText.includes('briefing pack') ||
        fullText.includes('export official pdf')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const cid = getUrlParam('id') || 'CS-2024-8841';
        window.openExportDossierModal(cid);
      });
      return;
    }

    if (fullText.includes('export docx')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.showTacticalToast('Exporting briefing pack in DOCX format...', 'info');
        setTimeout(() => window.downloadDossierText('CS-2024-8841'), 600);
      });
      return;
    }

    if (fullText.includes('export threat log')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.downloadGraphJSON('ALERTS_THREAT_LOG');
      });
      return;
    }

    if (fullText.includes('export topology')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.downloadGraphJSON('NETWORK_TOPOLOGY');
      });
      return;
    }

    // 12. Case Cards Workspace button
    if (txt === 'workspace') {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.group, [class*="rounded-xl"]');
        const caseText = card ? card.textContent : '';
        let targetId = 'CS-2024-8841';
        if (caseText.includes('7712') || caseText.includes('Sovereign')) targetId = 'CS-2024-7712';
        else if (caseText.includes('6590') || caseText.includes('Aeon')) targetId = 'CS-2024-6590';
        else if (caseText.includes('5104') || caseText.includes('Bluefin')) targetId = 'CS-2024-5104';
        window.location.href = `case-workspaces.html?id=${targetId}`;
      });
      return;
    }

    // 13. Case Cards Graph button
    if (txt.includes('graph') && !fullText.includes('recenter') && !fullText.includes('full screen')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'network-explorer.html';
      });
      return;
    }

    // 14. Dossier button in tables
    if (txt === 'dossier') {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'entity-profiles.html?id=POI-9042';
      });
      return;
    }

    // 15. Inspect button in tables
    if (txt === 'inspect') {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'alerts-patterns.html';
      });
      return;
    }

    // 16. Alerts page action buttons
    if (fullText.includes('confirm pattern')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        btn.classList.remove('bg-primary', 'hover:bg-secondary');
        btn.classList.add('bg-emerald-600', 'text-white');
        btn.innerHTML = '<span class="material-symbols-outlined text-[18px]">verified</span> Pattern Confirmed (Evidentiary Lead #EV-8841)';
        window.showTacticalToast('Pattern confirmed. Evidentiary lead #EV-8841 promoted to Case Dossier.', 'success');
      });
      return;
    }

    if (fullText.includes('false positive')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const activeCard = document.querySelector('article.border-2.border-primary');
        if (activeCard) {
          activeCard.style.opacity = '0.3';
          activeCard.style.pointerEvents = 'none';
        }
        window.showTacticalToast('Alert marked as false positive. Suppression filter updated.', 'warning');
      });
      return;
    }

    if (fullText.includes('request re-ingest')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.showTacticalToast('Signal telemetry re-ingestion scheduled with Groq sensor workers.', 'info');
      });
      return;
    }

    if (fullText.includes('acknowledge filtered')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.showTacticalToast('All filtered tactical alert notifications acknowledged.', 'success');
      });
      return;
    }

    // 17. Execute query button
    if (fullText.includes('execute query') || fullText.includes('run query') || fullText.includes('execute')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const input = document.querySelector('main input[type="text"], main input[type="search"]');
        if (input && input.value.trim()) {
          performSearch(input.value.trim());
        } else {
          window.showTacticalToast('Please enter a query or select a preset filter.', 'warning');
        }
      });
      return;
    }

    // 18. Lock Terminal button
    if (fullText.includes('lock terminal')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.openLockTerminalModal();
      });
      return;
    }

    // 19. Flag button in header
    if (txt === 'flag' || fullText.includes('priority flag')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.openQuickFlagModal();
      });
      return;
    }

    // 20. Re-Index Feeds button
    if (fullText.includes('re-index') || fullText.includes('reindex')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const icon = btn.querySelector('.material-symbols-outlined');
        if (icon) icon.classList.add('animate-spin');
        window.showTacticalToast('Re-indexing live intelligence feeds... 4,892 ev/min synchronized.', 'info');
        setTimeout(() => { if (icon) icon.classList.remove('animate-spin'); }, 1200);
      });
      return;
    }

    // 21. Review All 8 Sheets button in Report Generator
    if (fullText.includes('review all') || fullText.includes('sheets')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.showTacticalToast('Preview mode: Displaying all 8 intelligence report sheets.', 'info');
      });
      return;
    }

    // 22. Network Explorer Graph Controls: Zoom, Center, Recenter
    if (title.includes('zoom in')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', () => {
        const svg = document.querySelector('svg');
        if (svg) {
          let curr = parseFloat(svg.getAttribute('data-zoom') || 1.0);
          curr = Math.min(curr + 0.25, 2.5);
          svg.setAttribute('data-zoom', curr);
          svg.style.transform = `scale(${curr})`;
          svg.style.transformOrigin = 'center center';
          window.showTacticalToast(`Graph Zoom: ${Math.round(curr * 100)}%`, 'info');
        }
      });
      return;
    }

    if (title.includes('zoom out')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', () => {
        const svg = document.querySelector('svg');
        if (svg) {
          let curr = parseFloat(svg.getAttribute('data-zoom') || 1.0);
          curr = Math.max(curr - 0.25, 0.5);
          svg.setAttribute('data-zoom', curr);
          svg.style.transform = `scale(${curr})`;
          svg.style.transformOrigin = 'center center';
          window.showTacticalToast(`Graph Zoom: ${Math.round(curr * 100)}%`, 'info');
        }
      });
      return;
    }

    if (title.includes('recenter') || title.includes('center reset') || title.includes('fit to viewport') || title.includes('full screen')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', () => {
        const svg = document.querySelector('svg');
        if (svg) {
          svg.setAttribute('data-zoom', '1.0');
          svg.style.transform = 'scale(1.0)';
          window.showTacticalToast('Topology view centered to viewport.', 'info');
        }
      });
      return;
    }

    // 23. Network Explorer Degree Filters (1st Deg, 2nd Deg, 3rd Deg)
    if (['1st deg', '2nd deg', '3rd deg'].includes(txt)) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', () => {
        btn.parentElement?.querySelectorAll('button').forEach(b => {
          b.classList.remove('bg-primary', 'text-on-primary', 'font-bold');
          b.classList.add('text-on-surface-variant');
        });
        btn.classList.add('bg-primary', 'text-on-primary', 'font-bold');
        btn.classList.remove('text-on-surface-variant');
        window.showTacticalToast(`Displaying ${txt.toUpperCase()} topological depth.`, 'info');
      });
      return;
    }

    // 24. Network Explorer Action Drawer: View Full Profile / Expand Neighbors / Pin Dossier
    if (fullText.includes('view full profile')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', () => {
        window.location.href = 'entity-profiles.html?id=POI-9042';
      });
      return;
    }

    if (fullText.includes('expand neighbors')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', () => {
        window.showTacticalToast('Expanded 1st-hop neighborhood (+12 peripheral nodes identified).', 'info');
      });
      return;
    }

    if (title.includes('pin dossier') || fullText.includes('pin dossier') || btn.id === 'btn-pin-dossier') {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', () => {
        window.showTacticalToast('Target dossier pinned to tactical command monitoring.', 'success');
      });
      return;
    }

    // 25. Add to Case Dossier / Share Alert
    if (title.includes('add to case dossier') || fullText.includes('add to case dossier')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', () => {
        window.showTacticalToast('Alert telemetry attached to Case Dossier #CS-2024-8841.', 'success');
      });
      return;
    }
    if (title.includes('share alert') || fullText.includes('share alert')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', () => {
        window.showTacticalToast('Alert intelligence broadcast dispatched to field tactical units.', 'info');
      });
      return;
    }

    // 26. Close Panel buttons
    if (title.includes('close panel') || title.includes('collapse filter')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', () => {
        const panel = btn.closest('aside, [class*="drawer"], [class*="col-span"]');
        if (panel) {
          panel.classList.toggle('hidden');
          window.showTacticalToast('Panel display toggled.', 'info');
        }
      });
      return;
    }

    // 27. Diff History & Raw JSON in Report Generator
    if (fullText.includes('diff history')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', () => {
        window.showTacticalToast('Diff History: Comparing against Baseline v3.2 (No regressions detected).', 'info');
      });
      return;
    }
    if (fullText.includes('raw json')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', () => {
        window.downloadGraphJSON('RAW_INTELLIGENCE_RECORD');
      });
      return;
    }
    if (fullText.includes('print grid')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', () => {
        window.print();
      });
      return;
    }

    // 28. Clear Query button in Cross-Case Search
    if (title.includes('clear query')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', () => {
        const inp = document.querySelector('main input[type="text"], main input[type="search"]');
        if (inp) {
          inp.value = '';
          inp.focus();
          window.showTacticalToast('Search query cleared.', 'info');
        }
      });
      return;
    }

    // 29. Timeframe Range Buttons (Realtime Live, 24 Hours, 7 Days, Custom Range)
    if (['realtime live', '24 hours', '7 days', 'custom range'].includes(txt)) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', () => {
        btn.parentElement?.querySelectorAll('button').forEach(b => {
          b.classList.remove('bg-primary', 'text-on-primary', 'font-semibold', 'shadow-sm');
          b.classList.add('text-on-surface-variant');
        });
        btn.classList.add('bg-primary', 'text-on-primary', 'font-semibold', 'shadow-sm');
        btn.classList.remove('text-on-surface-variant');
        window.showTacticalToast(`Telemetry timeframe adjusted to: ${btn.textContent.trim()}`, 'info');
      });
      return;
    }

    // 30. Executive View Action Table Buttons (visibility, device_hub, person_add)
    const iconSpan = btn.querySelector('.material-symbols-outlined');
    const iconTxt = iconSpan ? iconSpan.textContent.trim() : '';
    if (iconTxt === 'visibility' || title.includes('inspect case')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', () => {
        window.location.href = 'case-workspaces.html?id=CS-2024-8841';
      });
      return;
    }
    if (iconTxt === 'device_hub' || title.includes('pivot graph')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', () => {
        window.location.href = 'network-explorer.html';
      });
      return;
    }
    if (iconTxt === 'person_add' || title.includes('add associated entity')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', () => {
        window.openAddEntityModal('Person');
      });
      return;
    }

    // 31. Taskforce Deployment & Interdiction Buttons
    if (fullText.includes('view taskforce') || fullText.includes('personnel deployment')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', () => {
        window.showTacticalToast('Taskforce roster synchronized: 14 field operatives deployed.', 'success');
      });
      return;
    }
    if (fullText.includes('interdict route')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', () => {
        window.showTacticalToast('Maritime Interdiction Protocol dispatched to Limassol Coast Guard.', 'warning');
      });
      return;
    }

    // 32. View toggle buttons in Search (List View, Compact View, Table View)
    if (title.includes('list view') || title.includes('compact view') || title.includes('table view')) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', () => {
        btn.parentElement?.querySelectorAll('button').forEach(b => {
          b.classList.remove('bg-surface-container-high', 'text-primary');
          b.classList.add('text-outline');
        });
        btn.classList.add('bg-surface-container-high', 'text-primary');
        btn.classList.remove('text-outline');
        window.showTacticalToast(`Switched view to: ${btn.getAttribute('title')}`, 'info');
      });
      return;
    }

    // 33. Timeline Scrubber Speed Buttons (1x, 2x, 5x)
    if (['1x', '2x', '5x'].includes(txt)) {
      btn.setAttribute('data-wired', 'true');
      btn.addEventListener('click', () => {
        btn.parentElement?.querySelectorAll('button').forEach(b => {
          b.classList.remove('text-primary', 'font-bold', 'bg-surface-container-high');
          b.classList.add('text-outline');
        });
        btn.classList.add('text-primary', 'font-bold', 'bg-surface-container-high');
        btn.classList.remove('text-outline');
        window.showTacticalToast(`Network evolution playback speed: ${txt}`, 'info');
      });
      return;
    }
  });

  // Wire Entity Filter buttons on cross-case-search.html
  document.querySelectorAll('button').forEach(btn => {
    const txt = btn.textContent.trim();
    if (['Person', 'Organization', 'Location', 'Vehicle / Vessel', 'Phone / Burner', 'Bank / Wallet', 'All'].includes(txt)) {
      btn.addEventListener('click', () => {
        document.querySelectorAll('button').forEach(b => {
          if (['Person', 'Organization', 'Location', 'Vehicle / Vessel', 'Phone / Burner', 'Bank / Wallet', 'All'].includes(b.textContent.trim())) {
            b.classList.remove('bg-primary/15', 'border-primary/40', 'text-primary');
          }
        });
        btn.classList.add('bg-primary/15', 'border-primary/40', 'text-primary');
        window.showTacticalToast(`Filtering by: ${txt}`, 'info');
        const qInput = document.querySelector('main input[type="text"]');
        if (qInput && qInput.value.trim()) {
          performSearch(qInput.value.trim() + (txt !== 'All' ? ` ${txt}` : ''));
        }
      });
    }
  });

  // Make Status Badges on Case Workspace clickable to open change status modal
  document.querySelectorAll('[class*="INVESTIGATING"], [class*="CHARGESHEET"]').forEach(el => {
    el.style.cursor = 'pointer';
    el.setAttribute('title', 'Click to Change Case Status');
    el.addEventListener('click', () => {
      const cid = getUrlParam('id') || 'CS-2024-8841';
      window.openChangeStatusModal(cid);
    });
  });

  // Wire Preset Query Chips on cross-case-search.html
  document.querySelectorAll('button, a, span').forEach(el => {
    const t = el.textContent.trim();
    if (['Cross-border Hawala', 'Port of Antwerp', 'Vektor Logistics', 'Shell Corporation', 'Gold Consignments'].includes(t)) {
      el.style.cursor = 'pointer';
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const inp = document.querySelector('main input[type="text"]');
        if (inp) {
          inp.value = t;
          if (typeof performSearch === 'function') performSearch(t);
        }
      });
    }
  });

  // Global Escape Key listener to dismiss any open modal, copilot, or dropdown
  if (!window._escapeListenerAdded) {
    window._escapeListenerAdded = true;
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Dismiss modals
        document.querySelectorAll('[id$="-modal-overlay"], [id$="-overlay"]').forEach(el => {
          if (el.id !== 'lock-terminal-overlay') el.remove();
        });
        // Dismiss notification dropdown
        const notifDropdown = document.getElementById('nexus-notifications-dropdown');
        if (notifDropdown) notifDropdown.remove();
        // Dismiss copilot window
        const copilotWin = document.getElementById('nexus-copilot-window');
        if (copilotWin && !copilotWin.classList.contains('hidden')) {
          copilotWin.classList.add('hidden');
        }
      }
    });
  }
}


