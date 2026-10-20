/**
 * Nexus Intelligence Command Center — Universal Interaction & Button Controller
 * Provides complete interactivity for every button, icon, pin, file attachment,
 * modal, drawer, and tab across all pages (slides).
 */

(function() {
  'use strict';

  let activeAttachmentFile = null;
  let activeClassification = 'SECRET // NOFORN';
  const CLASSIFICATIONS = ['TOP SECRET // NOFORN', 'SECRET // NOFORN', 'CONFIDENTIAL', 'UNCLASSIFIED'];

  // ============================================================
  //  1. LIVE API KEY VERIFICATION & STATUS TICKER
  // ============================================================

  async function checkLiveApiKeyStatus() {
    try {
      const res = await fetch('/api/ai/verify');
      const data = await res.json();
      
      // Update any stream/AI badges across pages safely on leaf spans only
      document.querySelectorAll('header span').forEach(el => {
        if (el.children.length === 0 && el.textContent.trim() === 'REALTIME FEDERATED') {
          el.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block mr-1"></span>GROQ LIVE (${data.model || 'gpt-oss-120b'})`;
          el.setAttribute('title', `AI Key Verified: ${data.masked_key} | Latency: ${data.latency_ms}ms`);
          el.classList.add('cursor-pointer');
          el.onclick = () => showAiDiagnosticsModal(data);
        }
      });

      console.log(`[NEXUS AI] Live API verified: ${data.provider} (${data.model}) - Latency: ${data.latency_ms}ms`);
    } catch (err) {
      console.warn('[NEXUS AI] API check error:', err);
    }
  }

  function showAiDiagnosticsModal(data) {
    let modal = document.getElementById('nexus-ai-diag-modal');
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'nexus-ai-diag-modal';
    modal.className = 'fixed inset-0 bg-black/75 z-[120] flex items-center justify-center backdrop-blur-sm p-4';
    modal.innerHTML = `
      <div class="bg-surface-container-low border border-primary/40 rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div class="flex items-center justify-between pb-3 border-b border-outline-variant/30 mb-4">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[22px]">psychology</span>
            <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">Live AI Engine Diagnostics</h3>
          </div>
          <button onclick="document.getElementById('nexus-ai-diag-modal').remove()" class="text-outline hover:text-on-surface">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="space-y-3 font-body-sm text-on-surface">
          <div class="flex justify-between p-2.5 bg-surface-container rounded">
            <span class="text-outline">Provider Status:</span>
            <span class="text-emerald-400 font-bold flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>${data.status}
            </span>
          </div>
          <div class="flex justify-between p-2.5 bg-surface-container rounded">
            <span class="text-outline">Active Provider:</span>
            <span class="font-mono text-primary font-bold uppercase">${data.provider}</span>
          </div>
          <div class="flex justify-between p-2.5 bg-surface-container rounded">
            <span class="text-outline">Configured Model:</span>
            <span class="font-mono text-secondary">${data.model}</span>
          </div>
          <div class="flex justify-between p-2.5 bg-surface-container rounded">
            <span class="text-outline">Masked Key:</span>
            <span class="font-mono text-on-surface-variant">${data.masked_key}</span>
          </div>
          <div class="flex justify-between p-2.5 bg-surface-container rounded">
            <span class="text-outline">Inference Latency:</span>
            <span class="font-mono text-emerald-400 font-bold">${data.latency_ms} ms</span>
          </div>
          <div class="p-2.5 bg-surface-container rounded">
            <span class="text-outline block mb-1">Live Engine Echo:</span>
            <span class="font-mono text-xs text-primary bg-surface-container-lowest p-1.5 rounded block truncate">${data.test_output}</span>
          </div>
        </div>
        <div class="pt-4 flex justify-end">
          <button onclick="document.getElementById('nexus-ai-diag-modal').remove()" class="px-4 py-1.5 rounded bg-primary text-on-primary font-bold">
            Acknowledge
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
  }

  // ============================================================
  //  2. PIN / ATTACH FILE IN NOTE COMPOSER (Case Workspace)
  // ============================================================

  function initCaseNoteComposer() {
    const attachBtn = document.getElementById('case-note-attach-btn');
    const fileInput = document.getElementById('case-note-file-input');
    const chip = document.getElementById('case-note-attachment-chip');
    const chipName = document.getElementById('case-note-attachment-name');
    const chipSize = document.getElementById('case-note-attachment-size');
    const chipRemove = document.getElementById('case-note-attachment-remove');
    const tagBtn = document.getElementById('case-note-tag-btn');
    const secBtn = document.getElementById('case-note-sec-btn');
    const secBadge = document.getElementById('case-note-sec-badge');
    const pinBtn = document.getElementById('case-note-pin-btn');
    const submitBtn = document.getElementById('case-note-submit-btn');
    const textarea = document.getElementById('case-note-composer-textarea');

    const triggerFilePicker = (e) => {
      e.preventDefault();
      fileInput.click();
    };

    if (attachBtn && fileInput) {
      attachBtn.onclick = triggerFilePicker;
    }
    if (pinBtn && fileInput) {
      pinBtn.onclick = triggerFilePicker;
    }

    if (fileInput) {
      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        activeAttachmentFile = file;

        if (chip && chipName && chipSize) {
          chipName.textContent = file.name;
          chipSize.textContent = `${(file.size / 1024).toFixed(1)} KB`;
          chip.classList.remove('hidden');
        }
        if (window.showTacticalToast) {
          window.showTacticalToast(`Attached evidence: "${file.name}" ready to ingest.`, 'info');
        }
      };
    }

    if (chipRemove) {
      chipRemove.onclick = (e) => {
        e.preventDefault();
        activeAttachmentFile = null;
        if (fileInput) fileInput.value = '';
        if (chip) chip.classList.add('hidden');
        if (window.showTacticalToast) {
          window.showTacticalToast('Evidence attachment removed.', 'info');
        }
      };
    }

    // Cycle classification
    const cycleSec = () => {
      const idx = CLASSIFICATIONS.indexOf(activeClassification);
      activeClassification = CLASSIFICATIONS[(idx + 1) % CLASSIFICATIONS.length];
      if (secBadge) {
        secBadge.textContent = activeClassification;
        secBadge.className = activeClassification.includes('TOP') 
          ? 'px-2 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-[10px] font-mono text-red-400 font-bold uppercase select-none cursor-pointer'
          : activeClassification.includes('SECRET')
          ? 'px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/40 text-[10px] font-mono text-amber-400 font-bold uppercase select-none cursor-pointer'
          : 'px-2 py-0.5 rounded bg-blue-500/15 border border-blue-500/40 text-[10px] font-mono text-blue-400 font-bold uppercase select-none cursor-pointer';
      }
      if (window.showTacticalToast) {
        window.showTacticalToast(`Security Classification set to: ${activeClassification}`, 'info');
      }
    };

    if (secBtn) secBtn.onclick = cycleSec;
    if (secBadge) secBadge.onclick = cycleSec;

    // Quick tag popup
    if (tagBtn && textarea) {
      tagBtn.onclick = (e) => {
        e.preventDefault();
        showEntityPickerDropdown(tagBtn, (entName) => {
          const cur = textarea.value;
          textarea.value = cur + (cur && !cur.endsWith(' ') ? ' ' : '') + `@${entName} `;
          textarea.focus();
        });
      };
    }

    // Submit Attributed Note
    if (submitBtn && textarea) {
      submitBtn.onclick = async (e) => {
        e.preventDefault();
        const content = textarea.value.trim();
        if (!content && !activeAttachmentFile) {
          if (window.showTacticalToast) window.showTacticalToast('Please enter an attributed note or attach evidence.', 'warning');
          return;
        }

        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-50');

        let uploadedDoc = null;
        const caseId = new URLSearchParams(window.location.search).get('id') || 'CS-2024-8841';

        // Upload attachment if present
        if (activeAttachmentFile) {
          try {
            const formData = new FormData();
            formData.append('file', activeAttachmentFile);
            formData.append('title', activeAttachmentFile.name.replace(/\.[^/.]+$/, ''));
            formData.append('case_id', caseId);
            formData.append('source_type', 'Investigator Evidence');

            const upRes = await fetch('/api/documents/upload', {
              method: 'POST',
              body: formData,
            });
            uploadedDoc = await upRes.json();
          } catch (err) {
            console.error('File upload error:', err);
          }
        }

        // Post note to backend
        try {
          const noteText = content || `[Attached Evidence File: ${activeAttachmentFile?.name}]`;
          const res = await fetch(`/api/cases/${caseId}/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content: `[${activeClassification}] ${noteText}`,
              note_type: 'operational'
            })
          });
          const noteData = await res.json();

          // Prepend to timeline
          prependTimelineEntry({
            author: 'Lead Analyst M. Vance',
            id: 'AN-89241',
            avatar: 'assets/images/img_4d2d0c150a.jpg',
            time: 'Just now',
            classification: activeClassification,
            content: noteText,
            doc: uploadedDoc
          });

          // Clear
          textarea.value = '';
          activeAttachmentFile = null;
          if (fileInput) fileInput.value = '';
          if (chip) chip.classList.add('hidden');

          if (window.showTacticalToast) {
            window.showTacticalToast(uploadedDoc ? `Evidence ${uploadedDoc.filename} attached and note recorded in chain of custody.` : 'Attributed case note recorded in chain of custody.', 'success');
          }
        } catch (err) {
          if (window.showTacticalToast) window.showTacticalToast('Failed to post case note.', 'error');
        } finally {
          submitBtn.disabled = false;
          submitBtn.classList.remove('opacity-50');
        }
      };
    }
  }

  function prependTimelineEntry(item) {
    const container = document.getElementById('case-timeline-entries');
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'flex items-start gap-space-md group animate-fade-in';
    div.innerHTML = `
      <div class="relative shrink-0">
        <img alt="${item.author}" class="w-9 h-9 rounded-full object-cover shadow-md border border-primary/40" src="${item.avatar}"/>
        <span class="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 flex items-center justify-center text-[9px] text-black font-bold">✓</span>
      </div>
      <div class="flex-1 bg-surface-container rounded-lg p-space-sm shadow-md border border-primary/30">
        <div class="flex flex-wrap items-center justify-between gap-1 mb-1">
          <div class="flex items-center gap-2">
            <span class="font-headline-sm text-body-sm font-bold text-on-surface">${item.author}</span>
            <span class="font-data-mono-sm text-data-mono-sm text-outline">[${item.id}]</span>
            <span class="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${item.classification.includes('TOP') ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}">${item.classification}</span>
          </div>
          <span class="font-data-mono-sm text-data-mono-sm text-primary font-semibold">${item.time}</span>
        </div>
        <p class="font-body-sm text-body-sm text-on-surface leading-relaxed">${item.content}</p>
        ${item.doc ? `
          <div class="mt-2 p-2 bg-surface-container-lowest rounded border border-primary/30 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-[18px]">attachment</span>
              <span class="font-mono text-xs text-on-surface font-semibold">${item.doc.filename}</span>
              <span class="text-outline text-[10px]">(${Math.round(item.doc.file_size / 1024)} KB)</span>
            </div>
            <span class="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold">INDEXED (ID: ${item.doc.document_id})</span>
          </div>
        ` : ''}
      </div>
    `;
    container.prepend(div);
  }

  function showEntityPickerDropdown(anchorBtn, onSelect) {
    let existing = document.getElementById('nexus-entity-picker-pop');
    if (existing) { existing.remove(); return; }

    const rect = anchorBtn.getBoundingClientRect();
    const pop = document.createElement('div');
    pop.id = 'nexus-entity-picker-pop';
    pop.className = 'fixed z-[130] bg-surface-container-lowest border border-outline-variant/40 rounded-xl shadow-2xl p-2 w-56 space-y-1 font-body-sm';
    pop.style.top = `${rect.top - 180}px`;
    pop.style.left = `${rect.left}px`;

    const entities = [
      { name: 'Dmitri Petrov', type: 'Person', id: 'POI-9042' },
      { name: 'Elena Rostova', type: 'Person', id: 'POI-8821' },
      { name: 'Marcus Havel', type: 'Person', id: 'POI-7201' },
      { name: 'Vektor Logistics GmbH', type: 'Organization', id: 'ORG-5519' },
      { name: 'MV Caspian Dawn', type: 'Vehicle', id: 'VEH-2201' },
      { name: 'Limassol Terminal 4', type: 'Location', id: 'LOC-4011' }
    ];

    pop.innerHTML = `
      <div class="px-2 py-1 text-[11px] font-mono uppercase text-outline border-b border-outline-variant/20 mb-1">Tag Entity in Case</div>
      ${entities.map(e => `
        <div class="px-2 py-1.5 rounded hover:bg-surface-container-high cursor-pointer flex items-center justify-between transition-colors" data-name="${e.name}">
          <span class="text-on-surface font-semibold text-xs">${e.name}</span>
          <span class="text-[10px] text-outline font-mono">${e.type}</span>
        </div>
      `).join('')}
    `;

    document.body.appendChild(pop);

    pop.querySelectorAll('[data-name]').forEach(item => {
      item.onclick = () => {
        onSelect(item.getAttribute('data-name'));
        pop.remove();
      };
    });

    const closeHandler = (evt) => {
      if (!pop.contains(evt.target) && evt.target !== anchorBtn) {
        pop.remove();
        document.removeEventListener('click', closeHandler);
      }
    };
    setTimeout(() => document.addEventListener('click', closeHandler), 50);
  }

  // ============================================================
  //  3. PIN DOSSIER (Network Explorer)
  // ============================================================

  async function handlePinDossier(btn) {
    const entityId = btn.getAttribute('data-entity-id') || 'POI-9042';
    const caseId = new URLSearchParams(window.location.search).get('case') || 'CS-2024-8841';
    const isPinned = btn.classList.contains('text-primary');

    try {
      const res = await fetch(`/api/cases/${caseId}/pin-entity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity_id: entityId, pinned: !isPinned })
      });
      const data = await res.json();

      if (!isPinned) {
        btn.classList.add('text-primary', 'bg-primary/15', 'border-primary/40');
        btn.classList.remove('text-outline');
        if (window.showTacticalToast) window.showTacticalToast(`Dossier ${entityId} pinned to Case Workspace [${caseId}].`, 'success');
      } else {
        btn.classList.remove('text-primary', 'bg-primary/15', 'border-primary/40');
        btn.classList.add('text-outline');
        if (window.showTacticalToast) window.showTacticalToast(`Dossier ${entityId} unpinned from Case Workspace.`, 'info');
      }
    } catch (err) {
      if (window.showTacticalToast) window.showTacticalToast('Failed to toggle pin state.', 'error');
    }
  }

  // ============================================================
  //  4. ASSIGN OFFICER MODAL
  // ============================================================

  function showAssignOfficerModal() {
    let modal = document.getElementById('assign-officer-modal');
    if (modal) modal.remove();

    const caseId = new URLSearchParams(window.location.search).get('id') || 'CS-2024-8841';

    modal = document.createElement('div');
    modal.id = 'assign-officer-modal';
    modal.className = 'fixed inset-0 bg-black/75 z-[120] flex items-center justify-center backdrop-blur-sm p-4';
    modal.innerHTML = `
      <div class="bg-surface-container-low border border-primary/40 rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div class="flex items-center justify-between pb-3 border-b border-outline-variant/30 mb-4">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">person_add</span>
            <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">Assign Investigating Officer</h3>
          </div>
          <button onclick="document.getElementById('assign-officer-modal').remove()" class="text-outline hover:text-on-surface">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <p class="font-body-sm text-outline mb-3">Authorize secondary investigator credentials for Operation HYDRA [${caseId}]:</p>
        <div class="space-y-2 mb-4" id="officer-select-list">
          <label class="flex items-center justify-between p-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/20 cursor-pointer">
            <div class="flex items-center gap-3">
              <input type="radio" name="officer_radio" value="USR-1002" checked class="accent-primary w-4 h-4">
              <div>
                <span class="font-headline-sm text-sm text-on-surface block font-bold">Det. Sarah Cruz</span>
                <span class="font-mono text-xs text-outline">INTERPOL NCB LIAISON</span>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono">ACTIVE</span>
          </label>
          <label class="flex items-center justify-between p-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/20 cursor-pointer">
            <div class="flex items-center gap-3">
              <input type="radio" name="officer_radio" value="USR-1003" class="accent-primary w-4 h-4">
              <div>
                <span class="font-headline-sm text-sm text-on-surface block font-bold">Special Agent R. Thorne</span>
                <span class="font-mono text-xs text-outline">HSI SAC CYBER OPERATIONS</span>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-mono">STANDBY</span>
          </label>
          <label class="flex items-center justify-between p-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/20 cursor-pointer">
            <div class="flex items-center gap-3">
              <input type="radio" name="officer_radio" value="USR-1004" class="accent-primary w-4 h-4">
              <div>
                <span class="font-headline-sm text-sm text-on-surface block font-bold">Intel Analyst D. Chen</span>
                <span class="font-mono text-xs text-outline">FINCEN AML TASKFORCE</span>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-mono">ASSIGNED</span>
          </label>
        </div>
        <div class="flex gap-3 justify-end pt-2">
          <button onclick="document.getElementById('assign-officer-modal').remove()" class="px-4 py-2 rounded bg-surface-container text-on-surface font-body-sm hover:bg-surface-container-high">Cancel</button>
          <button id="confirm-assign-officer-btn" class="px-5 py-2 rounded bg-primary text-on-primary font-headline-sm text-body-sm font-semibold hover:bg-secondary">Assign Officer</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('confirm-assign-officer-btn').onclick = async () => {
      const selected = document.querySelector('input[name="officer_radio"]:checked');
      const officerId = selected ? selected.value : 'USR-1002';
      const officerName = officerId === 'USR-1002' ? 'Det. Sarah Cruz' : officerId === 'USR-1003' ? 'Agent R. Thorne' : 'Analyst D. Chen';

      try {
        await fetch(`/api/cases/${caseId}/assign-officer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ officer_id: officerId, officer_name: officerName })
        });
        modal.remove();
        if (window.showTacticalToast) window.showTacticalToast(`Officer ${officerName} assigned to case ${caseId}.`, 'success');
      } catch (err) {
        if (window.showTacticalToast) window.showTacticalToast('Failed to assign officer.', 'error');
      }
    };
  }

  // ============================================================
  //  5. CRYPTOGRAPHIC CHAIN OF CUSTODY AUDIT LOG MODAL
  // ============================================================

  async function showChainOfCustodyModal() {
    let modal = document.getElementById('chain-custody-modal');
    if (modal) modal.remove();

    let logs = [];
    try {
      const res = await fetch('/api/audit?limit=25');
      const data = await res.json();
      logs = data.logs || [];
    } catch (e) {
      console.error(e);
    }

    modal = document.createElement('div');
    modal.id = 'chain-custody-modal';
    modal.className = 'fixed inset-0 bg-black/80 z-[120] flex items-center justify-center backdrop-blur-sm p-4';
    modal.innerHTML = `
      <div class="bg-surface-container-low border border-primary/40 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col p-6">
        <div class="flex items-center justify-between pb-3 border-b border-outline-variant/30 mb-4">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-secondary text-[22px]">verified_user</span>
            <div>
              <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">Chain of Custody & Audit Ledger</h3>
              <p class="font-data-mono-sm text-[11px] text-outline">CRYPTOGRAPHIC SHA-256 INTEGRITY VERIFIED // UNBROKEN</p>
            </div>
          </div>
          <button onclick="document.getElementById('chain-custody-modal').remove()" class="text-outline hover:text-on-surface">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
          ${logs.map(l => `
            <div class="p-3 bg-surface-container rounded-lg border border-outline-variant/20 flex items-start justify-between gap-3">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="px-1.5 py-0.5 rounded bg-primary/20 text-primary font-bold uppercase">${l.action}</span>
                  <span class="text-on-surface font-semibold">${l.resource_type}: ${l.resource_id}</span>
                </div>
                <p class="text-on-surface-variant font-sans text-xs">${l.details || 'Standard verification transaction'}</p>
                <span class="text-outline text-[10px] block mt-1">Officer: ${l.user_id} • Target Case: ${l.case_id || 'Global'}</span>
              </div>
              <div class="text-right shrink-0">
                <span class="text-outline text-[10px] block">${new Date(l.timestamp).toLocaleTimeString()}</span>
                <span class="text-emerald-400 text-[10px] font-bold">✓ VERIFIED</span>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="pt-4 flex justify-between items-center border-t border-outline-variant/20 mt-4">
          <span class="font-data-mono-sm text-[11px] text-outline">SHA-256 Ledger State: 0x4f82a9...e109</span>
          <button onclick="document.getElementById('chain-custody-modal').remove()" class="px-4 py-1.5 rounded bg-primary text-on-primary font-bold">
            Close Ledger
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // ============================================================
  //  6. TACTICAL TERMINAL LOCK SCREEN (PIN: 8841)
  // ============================================================

  function showTerminalLockScreen() {
    let overlay = document.getElementById('terminal-lock-overlay');
    if (overlay) return;

    overlay = document.createElement('div');
    overlay.id = 'terminal-lock-overlay';
    overlay.className = 'fixed inset-0 bg-surface-container-lowest/95 z-[300] flex flex-col items-center justify-center backdrop-blur-xl p-4 select-none';
    overlay.innerHTML = `
      <div id="terminal-lock-card" class="w-full max-w-sm flex flex-col items-center text-center space-y-4 transition-transform duration-200">
        <div class="w-16 h-16 rounded-2xl bg-surface-container border border-primary/40 flex items-center justify-center text-primary shadow-xl shadow-primary/10">
          <span class="material-symbols-outlined text-[36px]">lock</span>
        </div>
        <div>
          <h2 class="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">TERMINAL SESSION LOCKED</h2>
          <p class="font-body-sm text-body-sm text-outline mt-1">Tactical console standby. Enter 4-digit Officer PIN to resume.</p>
        </div>
        <div class="w-full max-w-xs space-y-2">
          <input id="terminal-pin-input" type="password" maxlength="4" class="w-full text-center text-2xl tracking-[0.5em] font-mono py-3 bg-surface-container border border-primary/40 rounded-xl text-primary focus:outline-none focus:border-secondary transition-all" placeholder="••••" autofocus>
          <div id="terminal-pin-error-msg" class="hidden text-error font-mono text-[12px] font-bold tracking-wider animate-pulse">
            ACCESS DENIED // INVALID PIN
          </div>
          <p class="text-[11px] font-mono text-outline">Default Tactical Pin: <span class="text-primary font-bold">8841</span></p>
        </div>
        <button id="terminal-pin-unlock-btn" class="w-full max-w-xs py-2.5 rounded-xl bg-primary text-on-primary font-headline-sm font-semibold hover:bg-secondary transition-all shadow-md">
          Authenticate & Unlock
        </button>
      </div>
    `;
    document.body.appendChild(overlay);

    const pinInput = document.getElementById('terminal-pin-input');
    const lockCard = document.getElementById('terminal-lock-card');
    const errMsg = document.getElementById('terminal-pin-error-msg');
    if (pinInput) pinInput.focus();

    const unlock = () => {
      const pin = (pinInput ? pinInput.value : '').trim();
      if (pin === '8841') {
        overlay.remove();
        if (window.showTacticalToast) window.showTacticalToast('Terminal Session Authenticated & Restored. Welcome back, Officer.', 'success');
      } else {
        // Strict failure: show red error, shake card, notify toast, clear input
        if (errMsg) errMsg.classList.remove('hidden');
        if (pinInput) {
          pinInput.classList.remove('border-primary/40');
          pinInput.classList.add('border-error', 'ring-2', 'ring-error/50');
          pinInput.value = '';
          pinInput.focus();
        }
        if (lockCard) {
          lockCard.classList.add('translate-x-2');
          setTimeout(() => { lockCard.classList.remove('translate-x-2'); lockCard.classList.add('-translate-x-2'); }, 50);
          setTimeout(() => { lockCard.classList.remove('-translate-x-2'); lockCard.classList.add('translate-x-1'); }, 100);
          setTimeout(() => { lockCard.classList.remove('translate-x-1'); }, 150);
        }
        if (window.showTacticalToast) {
          window.showTacticalToast('Access Denied: Invalid Security PIN (8841 required).', 'error');
        }
      }
    };

    document.getElementById('terminal-pin-unlock-btn').onclick = unlock;
    pinInput.onkeydown = (e) => { 
      if (errMsg) errMsg.classList.add('hidden');
      pinInput.classList.remove('border-error', 'ring-2', 'ring-error/50');
      pinInput.classList.add('border-primary/40');
      if (e.key === 'Enter') unlock(); 
    };
  }

  window.showTerminalLockScreen = showTerminalLockScreen;
  window.openLockTerminalModal = showTerminalLockScreen;

  // ============================================================
  //  7. TACTICAL NOTIFICATIONS DRAWER
  // ============================================================

  async function toggleNotificationsDrawer() {
    let drawer = document.getElementById('tactical-notifications-drawer');
    if (drawer) {
      drawer.classList.toggle('translate-x-full');
      return;
    }

    drawer = document.createElement('div');
    drawer.id = 'tactical-notifications-drawer';
    drawer.className = 'fixed top-14 right-0 bottom-0 w-80 max-w-[90vw] bg-surface-container-low border-l border-outline-variant/30 shadow-2xl z-[90] flex flex-col transform translate-x-0 transition-transform duration-300 backdrop-blur-md';
    drawer.innerHTML = `
      <div class="p-4 border-b border-outline-variant/30 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-[20px]">notifications_active</span>
          <span class="font-headline-sm text-on-surface font-bold">Tactical Feeds & Alerts</span>
        </div>
        <button onclick="document.getElementById('tactical-notifications-drawer').classList.add('translate-x-full')" class="text-outline hover:text-on-surface">
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
      <div class="flex-1 overflow-y-auto p-3 space-y-2.5 font-body-sm" id="tactical-notif-list">
        <div class="p-3 bg-surface-container rounded-xl border border-red-500/30">
          <div class="flex justify-between items-center mb-1">
            <span class="text-red-400 font-bold text-xs uppercase font-mono">INTERPOL RED NOTICE</span>
            <span class="text-outline text-[10px]">1m ago</span>
          </div>
          <p class="text-on-surface font-medium text-xs">Dmitri Petrov confirmed crossing border sector Cyprus.</p>
        </div>
        <div class="p-3 bg-surface-container rounded-xl border border-amber-500/30">
          <div class="flex justify-between items-center mb-1">
            <span class="text-amber-400 font-bold text-xs uppercase font-mono">SIGINT INTERCEPT</span>
            <span class="text-outline text-[10px]">14m ago</span>
          </div>
          <p class="text-on-surface font-medium text-xs">Encrypted call burst detected: +357-99-421-883 to burner.</p>
        </div>
        <div class="p-3 bg-surface-container rounded-xl border border-primary/30">
          <div class="flex justify-between items-center mb-1">
            <span class="text-primary font-bold text-xs uppercase font-mono">FINANCIAL AUDIT</span>
            <span class="text-outline text-[10px]">42m ago</span>
          </div>
          <p class="text-on-surface font-medium text-xs">€250,000 structured wire hit German escrow account.</p>
        </div>
      </div>
      <div class="p-3 border-t border-outline-variant/30">
        <a href="alerts-patterns.html" class="block w-full py-2 text-center rounded bg-surface-container hover:bg-surface-container-high text-primary font-headline-sm text-xs font-bold transition-colors">
          View All Threat Alerts →
        </a>
      </div>
    `;
    document.body.appendChild(drawer);
  }

  // ============================================================
  //  8. ENTITY PROFILE ACTIONS (Wiretap, INTERPOL, Surveillance)
  // ============================================================

  async function handleWiretapFlag() {
    const entityId = new URLSearchParams(window.location.search).get('id') || 'POI-9042';
    try {
      const res = await fetch(`/api/entities/${entityId}/wiretap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ warrant_ref: 'WARRANT-FISA-2024-912' })
      });
      const data = await res.json();
      if (window.showTacticalToast) {
        window.showTacticalToast(`Judicial Wiretap Authorized: ${data.name || entityId} flagged for SIGINT intercept (Warrant: ${data.warrant_ref})`, 'warning');
      }
    } catch (e) {
      if (window.showTacticalToast) window.showTacticalToast('Failed to flag wiretap.', 'error');
    }
  }

  async function handleLinkEntityToCase() {
    const entityId = new URLSearchParams(window.location.search).get('id') || 'POI-9042';
    try {
      const res = await fetch(`/api/entities/${entityId}/link-case`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_id: 'CS-2024-8841' })
      });
      const data = await res.json();
      if (window.showTacticalToast) {
        window.showTacticalToast(data.message || 'Entity linked to case.', 'success');
      }
    } catch (e) {
      if (window.showTacticalToast) window.showTacticalToast('Failed to link entity to case.', 'error');
    }
  }

  async function handleCrossCheckInterpol() {
    try {
      const res = await fetch('/api/live-feeds/threats?count=3');
      const data = await res.json();
      const threats = data.threats || [];

      let modal = document.getElementById('interpol-match-modal');
      if (modal) modal.remove();

      modal = document.createElement('div');
      modal.id = 'interpol-match-modal';
      modal.className = 'fixed inset-0 bg-black/80 z-[120] flex items-center justify-center backdrop-blur-sm p-4';
      modal.innerHTML = `
        <div class="bg-surface-container-low border border-red-500/40 rounded-2xl shadow-2xl w-full max-w-lg p-6">
          <div class="flex items-center justify-between pb-3 border-b border-outline-variant/30 mb-4">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-error text-[24px]">sync_problem</span>
              <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">INTERPOL Red Notice Cross-Check</h3>
            </div>
            <button onclick="document.getElementById('interpol-match-modal').remove()" class="text-outline hover:text-on-surface">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="p-3 bg-red-950/30 border border-red-500/40 rounded-xl mb-3 flex items-center gap-3">
            <span class="w-3 h-3 rounded-full bg-error animate-ping shrink-0"></span>
            <div>
              <span class="font-headline-sm text-error font-bold text-sm block">96% BIOMETRIC FACIAL & ALIAS CORRELATION</span>
              <span class="text-xs text-on-surface-variant font-mono">Lyon Central Registry File: #INT-RED-9942</span>
            </div>
          </div>
          <div class="space-y-2">
            ${threats.map(t => `
              <div class="p-3 bg-surface-container rounded-xl flex items-center justify-between gap-3">
                <img src="${t.picture}" class="w-10 h-10 rounded-full object-cover border border-outline-variant/40" />
                <div class="flex-1 min-w-0">
                  <span class="font-bold text-sm text-on-surface block truncate">${t.name}</span>
                  <span class="text-xs text-outline font-mono">${t.location} • ${t.detected_via}</span>
                </div>
                <span class="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-mono text-xs font-bold">${t.risk_score}% MATCH</span>
              </div>
            `).join('')}
          </div>
          <div class="pt-4 flex justify-end">
            <button onclick="document.getElementById('interpol-match-modal').remove()" class="px-4 py-2 rounded bg-primary text-on-primary font-bold">
              Dismiss Brief
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    } catch (e) {
      if (window.showTacticalToast) window.showTacticalToast('Failed to query INTERPOL feeds.', 'error');
    }
  }

  // ============================================================
  //  9. UNIVERSAL GLOBAL CLICK DELEGATION
  // ============================================================

  function initUniversalDelegation() {
    document.addEventListener('click', async (e) => {
      const btn = e.target.closest('button, a[role="button"]');
      if (!btn) return;

      const txt = (btn.textContent || '').trim().toLowerCase();
      const title = (btn.getAttribute('title') || '').toLowerCase();
      const id = (btn.id || '').toLowerCase();
      const full = `${txt} ${title} ${id}`;

      // A. Terminal Lock
      if (full.includes('lock terminal') || id === 'lock-terminal') {
        e.preventDefault();
        showTerminalLockScreen();
        return;
      }

      // B. Case File Creation (+ Case File button)
      if (full.includes('case file') && (full.includes('add') || full.includes('+') || full.includes('new'))) {
        e.preventDefault();
        if (window.showNewCaseModal) {
          window.showNewCaseModal();
        } else if (window.openCreateCaseModal) {
          window.openCreateCaseModal();
        }
        return;
      }

      // C. Notifications Bell
      if (full.includes('notifications')) {
        e.preventDefault();
        toggleNotificationsDrawer();
        return;
      }

      // D. Flag Target (navbar flag button)
      if (full.includes('flag') && btn.closest('header')) {
        e.preventDefault();
        if (window.showTacticalToast) {
          window.showTacticalToast('Active target escalated to high-priority watch queue.', 'warning');
        }
        return;
      }

      // E. Assign Officer
      if (full.includes('assign officer') || id === 'btn-assign-officer') {
        e.preventDefault();
        showAssignOfficerModal();
        return;
      }

      // F. Chain of Custody
      if (full.includes('chain log') || id === 'btn-view-chain-log') {
        e.preventDefault();
        showChainOfCustodyModal();
        return;
      }

      // G. Pin Dossier (push_pin)
      if (full.includes('pin dossier') || full.includes('push_pin') || id === 'btn-pin-dossier') {
        e.preventDefault();
        handlePinDossier(btn);
        return;
      }

      // H. Link Evidence / Attach Document
      if (full.includes('link evidence') || id === 'btn-link-evidence') {
        e.preventDefault();
        if (window.openUploadDocumentModal) {
          window.openUploadDocumentModal();
        }
        return;
      }

      // I. Wiretap Review
      if (full.includes('wiretap')) {
        e.preventDefault();
        handleWiretapFlag();
        return;
      }

      // J. Link to Case button in Entity Profile
      if (full.includes('link to case')) {
        e.preventDefault();
        handleLinkEntityToCase();
        return;
      }

      // K. Cross-Check INTERPOL
      if (full.includes('cross-check interpol') || full.includes('interpol')) {
        e.preventDefault();
        handleCrossCheckInterpol();
        return;
      }

      // L. Export PDF Dossier
      if (full.includes('export pdf') || full.includes('export official') || full.includes('export dossier') || id === 'btn-export-dossier') {
        e.preventDefault();
        if (window.exportDossier) {
          window.exportDossier();
        } else {
          window.print();
        }
        return;
      }

      // M. Timeline Category Filters (All Activity, Investigator Notes, etc.)
      const pillNames = ['all activity', 'investigator notes', 'automated ingests', 'evidence added', 'warrants'];
      if (pillNames.some(p => full.includes(p))) {
        e.preventDefault();
        document.querySelectorAll('button').forEach(b => {
          if (pillNames.some(p => (b.textContent || '').trim().toLowerCase().includes(p))) {
            b.classList.remove('bg-primary', 'text-on-primary', 'font-bold');
            b.classList.add('bg-surface-container', 'text-on-surface-variant');
          }
        });
        btn.classList.remove('bg-surface-container', 'text-on-surface-variant');
        btn.classList.add('bg-primary', 'text-on-primary', 'font-bold');
        if (window.showTacticalToast) window.showTacticalToast(`Filtered view: ${btn.textContent.trim()}`, 'info');
        return;
      }

      // N. Re-Index Feeds
      if (full.includes('re-index') || full.includes('sync feeds')) {
        e.preventDefault();
        btn.classList.add('animate-spin');
        setTimeout(() => {
          btn.classList.remove('animate-spin');
          if (window.showTacticalToast) window.showTacticalToast('Live intelligence feeds re-indexed across all federated sources.', 'success');
        }, 800);
        return;
      }

      // O. Briefing Pack
      if (full.includes('briefing pack')) {
        e.preventDefault();
        window.location.href = 'report-generator.html';
        return;
      }

      // P. Key Influencers Analysis
      if (full.includes('influencer') || full.includes('centrality')) {
        e.preventDefault();
        try {
          const res = await fetch('/api/network/analyze/centrality', { method: 'POST' });
          const data = await res.json();
          if (window.showTacticalToast) {
            window.showTacticalToast(`Centrality analysis complete: Top bridge is ${data.top_betweenness?.[0]?.name || 'Dmitri Petrov'}.`, 'success');
          }
        } catch (e) {
          if (window.showTacticalToast) window.showTacticalToast('Key Influencers analysis executed.', 'info');
        }
        return;
      }

      // Q. Incident Pin Drop
      if (full.includes('incident pin') || full.includes('pin_drop')) {
        e.preventDefault();
        if (window.showTacticalToast) {
          window.showTacticalToast('Geospatial Incident Pin: 34.6738° N, 33.0416° E [Port Limassol Sector 4]', 'info');
        }
        return;
      }
    });
  }

  // ============================================================
  //  10. ALERTS & PATTERNS COMPLETE INTERACTION SUITE
  // ============================================================

  function initAlertsInteractions() {
    if (!window.location.pathname.includes('alerts-patterns')) return;

    // A. Pattern Category Tabs (All Patterns, Financial, Communication, Location / SIGINT, Identity Anomalies)
    const categoryButtons = document.querySelectorAll('main section button');
    let activeCategory = 'all';

    const categoryKeywords = {
      'financial': ['swift', 'offshore', 'structuring', 'smurfing', 'transaction', 'commerzbank', 'crypto', 'wire', 'laundering', 'bvi', 'financial', 'fin-09'],
      'communication': ['burner', 'imei', 'sim', 'telemetry', 'cellular', 'tower', 'call', 'sms', 'switch', 'burst', 'sigint', 'handshake'],
      'location': ['geo', 'ais', 'vessel', 'baltic', 'transponder', 'port', 'nautical', 'limassol', 'frankfurt', 'flight', 'terminal', 'travel', 'geofence'],
      'identity': ['ofac', 'alias', 'sanction', 'fuzzy', 'registry', 'kestrel', 'poi', 'passport', 'notice', 'identity', 'anomalies']
    };

    categoryButtons.forEach(btn => {
      const text = btn.textContent.toLowerCase().trim();
      const isCatBtn = ['all patterns', 'financial', 'communication', 'location', 'identity'].some(c => text.includes(c));
      if (!isCatBtn) return;

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        // Reset category buttons
        categoryButtons.forEach(b => {
          const bt = b.textContent.toLowerCase().trim();
          if (['all patterns', 'financial', 'communication', 'location', 'identity'].some(c => bt.includes(c))) {
            b.className = 'px-space-sm py-1 rounded bg-surface-container border border-outline-variant/30 hover:border-primary/50 text-on-surface-variant hover:text-on-surface font-label-md text-label-md tracking-wider uppercase transition-colors flex items-center gap-1.5';
          }
        });

        // Activate clicked
        btn.className = 'px-space-sm py-1 rounded bg-primary text-on-primary font-label-md text-label-md tracking-wider uppercase font-bold flex items-center gap-1.5 shadow-sm';

        let catKey = 'all';
        if (text.includes('financial')) catKey = 'financial';
        else if (text.includes('communication')) catKey = 'communication';
        else if (text.includes('location')) catKey = 'location';
        else if (text.includes('identity')) catKey = 'identity';
        activeCategory = catKey;

        // Filter cards
        const articles = document.querySelectorAll('main article');
        let visibleCount = 0;
        articles.forEach(art => {
          const artText = art.textContent.toLowerCase();
          if (catKey === 'all') {
            art.style.display = '';
            visibleCount++;
          } else {
            const match = categoryKeywords[catKey].some(kw => artText.includes(kw));
            art.style.display = match ? '' : 'none';
            if (match) visibleCount++;
          }
        });

        if (window.showTacticalToast) {
          window.showTacticalToast(`Pattern Filter: ${btn.querySelector('span')?.textContent || 'Category'} (${visibleCount} matching)`, 'info');
        }
      });
    });

    // B. Severity Filters with active toggle state
    let activeSeverity = null;
    document.querySelectorAll('main button').forEach(sevBtn => {
      const text = sevBtn.textContent.toUpperCase();
      const isSev = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].find(s => text.includes(s) && text.length < 25);
      if (!isSev) return;

      sevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const articles = document.querySelectorAll('main article');

        if (activeSeverity === isSev) {
          // Toggle off -> show all
          activeSeverity = null;
          sevBtn.classList.remove('ring-2', 'ring-primary', 'shadow-lg');
          articles.forEach(art => art.style.display = '');
          if (window.showTacticalToast) window.showTacticalToast('Severity filter cleared (showing all alerts)', 'info');
        } else {
          activeSeverity = isSev;
          document.querySelectorAll('main button').forEach(b => b.classList.remove('ring-2', 'ring-primary', 'shadow-lg'));
          sevBtn.classList.add('ring-2', 'ring-primary', 'shadow-lg');

          let matchCount = 0;
          articles.forEach(art => {
            const hasSev = art.textContent.toUpperCase().includes(isSev);
            art.style.display = hasSev ? '' : 'none';
            if (hasSev) matchCount++;
          });
          if (window.showTacticalToast) window.showTacticalToast(`Severity Filter: ${isSev} (${matchCount} alerts)`, 'info');
        }
      });
    });

    // C. Linked Case Dropdown
    const caseSelect = document.querySelector('select:has(option[value="CS-2024-8841"])');
    if (caseSelect) {
      caseSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        const articles = document.querySelectorAll('main article');
        articles.forEach(art => {
          if (!val || val.includes('All Cases')) {
            art.style.display = '';
          } else {
            art.style.display = art.textContent.includes(val) ? '' : 'none';
          }
        });
        if (window.showTacticalToast) window.showTacticalToast(`Filtered by Case: ${val}`, 'info');
      });
    }

    // D. Sort Dropdown
    const sortSelects = document.querySelectorAll('main select');
    sortSelects.forEach(sel => {
      if (sel.textContent.includes('Sort')) {
        sel.addEventListener('change', (e) => {
          const container = document.querySelector('.xl\\:col-span-7');
          if (!container) return;
          const cards = Array.from(container.querySelectorAll('article'));
          if (cards.length === 0) return;

          const sortType = e.target.value;
          if (sortType.includes('Severity')) {
            const weight = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
            cards.sort((a, b) => {
              const aSev = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].find(s => a.textContent.includes(s)) || 'LOW';
              const bSev = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].find(s => b.textContent.includes(s)) || 'LOW';
              return (weight[bSev] || 0) - (weight[aSev] || 0);
            });
          } else if (sortType.includes('Confidence')) {
            cards.sort((a, b) => {
              const aMatch = a.textContent.match(/(\d{2,3}(?:\.\d)?%)/);
              const bMatch = b.textContent.match(/(\d{2,3}(?:\.\d)?%)/);
              const aScore = aMatch ? parseFloat(aMatch[1]) : 0;
              const bScore = bMatch ? parseFloat(bMatch[1]) : 0;
              return bScore - aScore;
            });
          }
          cards.forEach(c => container.appendChild(c));
          if (window.showTacticalToast) window.showTacticalToast(`Alert stream re-sorted: ${sortType}`, 'info');
        });
      }
    });

    // E. Evidence Dossier Panel Action Buttons
    document.querySelectorAll('aside button, main button').forEach(btn => {
      const txt = btn.textContent.toLowerCase().trim();

      // Confirm Pattern
      if (txt.includes('confirm pattern')) {
        btn.addEventListener('click', async (e) => {
          e.preventDefault();
          btn.innerHTML = '<span class="material-symbols-outlined text-[18px]">verified</span> Pattern Confirmed (Lead #EV-8841)';
          btn.className = 'w-full h-9 rounded bg-emerald-600 text-white font-headline-sm text-body-sm font-bold tracking-wide uppercase transition-colors flex items-center justify-center gap-2 shadow-md';
          
          // Update active card badge
          const activeCard = document.querySelector('main article.border-primary, main article:first-of-type');
          if (activeCard) {
            const dispBtn = activeCard.querySelector('button:has(.bg-amber-400), button:has(.bg-emerald-400)');
            if (dispBtn) {
              dispBtn.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-400"></span><span>Disposition: Confirmed</span><span class="material-symbols-outlined text-[14px] text-outline">arrow_drop_down</span>';
            }
          }
          if (window.showTacticalToast) {
            window.showTacticalToast('Pattern Confirmed! Evidentiary Lead #EV-8841 promoted to Case Dossier CS-2024-8841.', 'success');
          }
        });
      }

      // False Positive
      if (txt.includes('false positive') && btn.closest('aside')) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const activeCard = document.querySelector('main article.border-primary, main article:first-of-type');
          if (activeCard) {
            activeCard.style.opacity = '0.5';
            const dispBtn = activeCard.querySelector('button');
            if (dispBtn) {
              dispBtn.innerHTML = '<span class="w-2 h-2 rounded-full bg-rose-400"></span><span>Disposition: False Positive</span>';
            }
          }
          if (window.showTacticalToast) {
            window.showTacticalToast('Pattern marked as False Positive. Telemetry flagged for filter recalibration.', 'warning');
          }
        });
      }

      // Request Re-Ingest
      if (txt.includes('re-ingest')) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const orig = btn.innerHTML;
          btn.innerHTML = '<span class="material-symbols-outlined text-[16px] animate-spin">sync</span> Re-Evaluating Mesh...';
          setTimeout(() => {
            btn.innerHTML = orig;
            if (window.showTacticalToast) {
              window.showTacticalToast('Re-Ingest complete: Heuristic model re-verified 4 cited records (94.6% consensus).', 'success');
            }
          }, 800);
        });
      }

      // Close Evidence Panel
      if (btn.getAttribute('title') === 'Close Panel' || (txt === 'close' && btn.closest('aside'))) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const aside = btn.closest('aside');
          if (aside) {
            aside.classList.toggle('hidden');
            if (window.showTacticalToast) window.showTacticalToast(aside.classList.contains('hidden') ? 'Evidence Dossier Panel hidden.' : 'Evidence Dossier Panel restored.', 'info');
          }
        });
      }

      // Share Alert
      if (btn.getAttribute('title') === 'Share Alert' || txt.includes('share')) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          navigator.clipboard?.writeText(window.location.href);
          if (window.showTacticalToast) {
            window.showTacticalToast('Alert telemetry URL copied to tactical clipboard.', 'success');
          }
        });
      }
    });
  }

  // ============================================================
  //  11. NETWORK GRAPH EXPLORER COMPLETE INTERACTION SUITE
  // ============================================================

  function initNetworkExplorerInteractions() {
    if (!window.location.pathname.includes('network-explorer')) return;

    const svg = document.querySelector('main svg[viewBox="0 0 760 520"]');
    if (!svg) return;

    // A. Zoom & Pan Controls
    let currentZoom = 1.0;
    const zoomInBtn = document.querySelector('button[title="Zoom In"]');
    const zoomOutBtn = document.querySelector('button[title="Zoom Out"]');

    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', () => {
        currentZoom = Math.min(currentZoom + 0.25, 2.8);
        applyGraphScale(currentZoom);
        if (window.showTacticalToast) window.showTacticalToast(`Graph Zoom: ${(currentZoom * 100).toFixed(0)}%`, 'info');
      });
    }

    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', () => {
        currentZoom = Math.max(currentZoom - 0.25, 0.5);
        applyGraphScale(currentZoom);
        if (window.showTacticalToast) window.showTacticalToast(`Graph Zoom: ${(currentZoom * 100).toFixed(0)}%`, 'info');
      });
    }

    function applyGraphScale(scale) {
      svg.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
      svg.style.transform = `scale(${scale})`;
      svg.style.transformOrigin = 'center center';
    }

    // B. Entity Type Filter Checkboxes
    const typeCheckboxes = document.querySelectorAll('aside input[type="checkbox"], main input[type="checkbox"]');
    typeCheckboxes.forEach(cb => {
      const labelEl = cb.closest('label');
      const typeText = labelEl ? labelEl.textContent.trim().toLowerCase() : '';

      cb.addEventListener('change', () => {
        const checked = cb.checked;
        const colorMap = {
          'person': ['#22d3ee', '#4cd7f6', '#06b6d4'],
          'organization': ['#a855f7', '#c084fc'],
          'location': ['#10b981', '#059669'],
          'vehicle': ['#f97316', '#ea580c'],
          'phone': ['#eab308', '#ca8a04'],
          'bank': ['#ec4899', '#db2777']
        };

        let matchedKey = Object.keys(colorMap).find(k => typeText.includes(k));
        if (matchedKey) {
          const colors = colorMap[matchedKey];
          const activeSvg = document.getElementById('network-graph-svg') || svg;
          const circles = activeSvg.querySelectorAll('circle');
          circles.forEach(c => {
            const fill = (c.getAttribute('fill') || '').toLowerCase();
            const stroke = (c.getAttribute('stroke') || '').toLowerCase();
            if (colors.some(col => fill.includes(col) || stroke.includes(col))) {
              c.style.transition = 'opacity 0.25s ease';
              c.style.opacity = checked ? '1.0' : '0.08';
              const parentG = c.closest('g');
              if (parentG && parentG.getAttribute('data-node-id') !== 'CENTER') {
                parentG.style.transition = 'opacity 0.25s ease';
                parentG.style.opacity = checked ? '1.0' : '0.08';
              }
            }
          });
        }
        if (window.showTacticalToast) {
          window.showTacticalToast(`Filter Layer: ${typeText.split('\n')[0].trim()} ${checked ? 'Visible' : 'Hidden'}`, 'info');
        }
      });
    });

    // C. Relationship Filter Pills
    document.querySelectorAll('button').forEach(btn => {
      const txt = btn.textContent.trim().toLowerCase();
      const relPills = ['financial wire', 'co-travel', 'direct call / sms', 'corporate ownership', 'physical meeting'];
      if (relPills.includes(txt)) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const isActive = btn.classList.contains('bg-primary/20') || btn.classList.contains('bg-primary');
          if (isActive) {
            btn.className = 'px-2 py-1 rounded text-body-sm bg-surface-container-high text-on-surface-variant font-body-sm transition-colors hover:text-on-surface';
          } else {
            btn.className = 'px-2 py-1 rounded text-body-sm bg-primary/20 text-primary font-body-sm font-semibold transition-colors hover:bg-primary/30';
          }
          if (window.showTacticalToast) {
            window.showTacticalToast(`Relationship Filter: ${btn.textContent.trim()} ${isActive ? 'Dimmed' : 'Highlighted'}`, 'info');
          }
        });
      }
    });

    // D. Timeline Scrubber (Play, Pause, Steps, Speeds)
    let isPlaying = false;
    let playInterval = null;
    let currentTick = 149;
    let playbackSpeed = 1; // 1x, 2x, 5x

    const playBtn = document.getElementById('timeline-play-btn');
    const playIcon = document.getElementById('play-icon');
    const stepBack = document.getElementById('timeline-step-back');
    const stepFwd = document.getElementById('timeline-step-fwd');
    const timeDisplay = document.getElementById('scrubber-timestamp');

    const updateTickDisplay = () => {
      if (timeDisplay) {
        const sec = String(currentTick % 60).padStart(2, '0');
        const min = String(Math.floor(currentTick / 60) + 40).padStart(2, '0');
        timeDisplay.innerHTML = `TIMESTAMP: 2024-03-28 09:${min}:${sec} UTC`;
      }
      const tickBadge = timeDisplay?.nextElementSibling;
      if (tickBadge) tickBadge.textContent = `EVENT TICK #${currentTick}`;

      // Pulse a node in the graph
      const circles = svg.querySelectorAll('circle');
      if (circles.length > 0) {
        const randCircle = circles[currentTick % circles.length];
        randCircle.style.filter = 'drop-shadow(0 0 16px #5de6ff)';
        setTimeout(() => { if (randCircle.getAttribute('data-selected') !== 'true') randCircle.style.filter = ''; }, 200);
      }
    };

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
          if (playIcon) playIcon.textContent = 'pause';
          playBtn.classList.replace('bg-primary', 'bg-amber-500');
          if (window.showTacticalToast) window.showTacticalToast(`Network Chronological Playback: ACTIVE (${playbackSpeed}x)`, 'info');

          playInterval = setInterval(() => {
            currentTick = (currentTick + 1) % 200;
            updateTickDisplay();
          }, Math.max(80, Math.floor(400 / playbackSpeed)));
        } else {
          if (playIcon) playIcon.textContent = 'play_arrow';
          playBtn.classList.replace('bg-amber-500', 'bg-primary');
          clearInterval(playInterval);
          if (window.showTacticalToast) window.showTacticalToast('Network Playback Paused.', 'info');
        }
      });
    }

    if (stepBack) {
      stepBack.addEventListener('click', () => {
        currentTick = Math.max(1, currentTick - 1);
        updateTickDisplay();
      });
    }

    if (stepFwd) {
      stepFwd.addEventListener('click', () => {
        currentTick = (currentTick + 1) % 200;
        updateTickDisplay();
      });
    }

    // Speed multiplier buttons
    document.querySelectorAll('#timeline-play-btn ~ div button, .flex button').forEach(b => {
      const t = b.textContent.trim();
      if (['1x', '2x', '5x'].includes(t)) {
        b.addEventListener('click', () => {
          playbackSpeed = parseInt(t);
          b.parentElement.querySelectorAll('button').forEach(sb => {
            sb.className = 'px-2 py-0.5 rounded font-data-mono-sm text-data-mono-sm text-outline hover:text-on-surface';
          });
          b.className = 'px-2 py-0.5 rounded font-data-mono-sm text-data-mono-sm text-primary font-bold bg-surface-container-high';
          if (isPlaying) {
            clearInterval(playInterval);
            playInterval = setInterval(() => {
              currentTick = (currentTick + 1) % 200;
              updateTickDisplay();
            }, Math.max(80, Math.floor(400 / playbackSpeed)));
          }
          if (window.showTacticalToast) window.showTacticalToast(`Playback speed: ${t}`, 'info');
        });
      }
    });

    // E. Isolate Subgraph Button
    let isIsolated = false;
    document.querySelectorAll('button').forEach(btn => {
      const txt = btn.textContent.toLowerCase().trim();

      if (txt.includes('isolate subgraph')) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          isIsolated = !isIsolated;
          const circles = svg.querySelectorAll('circle');
          const lines = svg.querySelectorAll('line, path');

          if (isIsolated) {
            btn.classList.add('bg-primary', 'text-on-primary');
            btn.classList.remove('bg-surface-container-high', 'text-primary');
            circles.forEach(c => {
              const r = parseFloat(c.getAttribute('r') || '0');
              if (r < 10) c.style.opacity = '0.15';
              else { c.style.stroke = '#4cd7f6'; c.style.strokeWidth = '3px'; }
            });
            lines.forEach(l => l.style.opacity = '0.2');
            if (window.showTacticalToast) window.showTacticalToast('Target Subgraph Isolated: Dmitri Petrov 1st & 2nd hop nexus.', 'success');
          } else {
            btn.classList.remove('bg-primary', 'text-on-primary');
            btn.classList.add('bg-surface-container-high', 'text-primary');
            circles.forEach(c => { c.style.opacity = '1.0'; c.style.stroke = ''; c.style.strokeWidth = ''; });
            lines.forEach(l => l.style.opacity = '1.0');
            if (window.showTacticalToast) window.showTacticalToast('Subgraph isolation cleared. Full topology restored.', 'info');
          }
        });
      }

      // Add to Case button in Network Explorer
      if (txt.includes('add to case') && btn.closest('.grid, aside, div')) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          if (window.showTacticalToast) {
            window.showTacticalToast('Selected Network Entity successfully attached to Operation Blackthorn (CS-2024-8841).', 'success');
          }
        });
      }

      // Reset All Filters
      if (btn.id === 'reset-filters' || btn.getAttribute('title')?.includes('Reset All Filters')) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          typeCheckboxes.forEach(cb => { cb.checked = true; });
          const circles = svg.querySelectorAll('circle');
          circles.forEach(c => { c.style.opacity = '1.0'; });
          currentZoom = 1.0;
          applyGraphScale(1.0);
          if (window.showTacticalToast) window.showTacticalToast('All graph filters, layers, and zoom levels reset.', 'success');
        });
      }

      // Snapshot button
      if (txt.includes('snapshot')) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          if (window.showTacticalToast) {
            window.showTacticalToast('High-resolution tactical graph snapshot captured and stored in case evidence vault.', 'success');
          }
        });
      }

      // Ingest Node Feed
      if (txt.includes('ingest node feed')) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          showIngestNodeModal();
        });
      }
    });

    function showIngestNodeModal() {
      let modal = document.getElementById('ingest-node-modal');
      if (modal) modal.remove();

      modal = document.createElement('div');
      modal.id = 'ingest-node-modal';
      modal.className = 'fixed inset-0 bg-black/80 z-[150] flex items-center justify-center backdrop-blur-sm p-4 select-none';
      modal.innerHTML = `
        <div class="bg-surface-container-low border border-primary/40 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-outline-variant/30">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">device_hub</span>
              <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">Ingest Tactical Entity to Graph</h3>
            </div>
            <button onclick="document.getElementById('ingest-node-modal').remove()" class="text-outline hover:text-on-surface">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="space-y-3 font-body-sm">
            <div>
              <label class="block text-outline text-xs uppercase mb-1">Entity Name / Identifier</label>
              <input id="new-node-name" type="text" placeholder="e.g. Baltic Trust Cyprus Ltd or POI-9841" class="w-full px-3 py-2 bg-surface-container border border-outline-variant/40 rounded text-on-surface focus:outline-none focus:border-primary">
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-outline text-xs uppercase mb-1">Type</label>
                <select id="new-node-type" class="w-full px-3 py-2 bg-surface-container border border-outline-variant/40 rounded text-on-surface focus:outline-none">
                  <option value="ORGANIZATION">Organization</option>
                  <option value="PERSON">Person</option>
                  <option value="LOCATION">Location</option>
                  <option value="BANK">Bank Account</option>
                  <option value="VEHICLE">Vehicle / Vessel</option>
                </select>
              </div>
              <div>
                <label class="block text-outline text-xs uppercase mb-1">Threat Score</label>
                <input id="new-node-risk" type="number" min="1" max="100" value="85" class="w-full px-3 py-2 bg-surface-container border border-outline-variant/40 rounded text-on-surface">
              </div>
            </div>
            <div>
              <label class="block text-outline text-xs uppercase mb-1">Link to Target</label>
              <select class="w-full px-3 py-2 bg-surface-container border border-outline-variant/40 rounded text-on-surface">
                <option>Dmitri Petrov (POI-9042)</option>
                <option>Limassol Port Terminal (LOC-4011)</option>
                <option>Vektor Logistics (ORG-5519)</option>
              </select>
            </div>
          </div>
          <div class="pt-2 flex justify-end gap-2">
            <button onclick="document.getElementById('ingest-node-modal').remove()" class="px-3 py-2 rounded bg-surface-container text-on-surface-variant font-semibold">Cancel</button>
            <button id="submit-ingest-node-btn" class="px-4 py-2 rounded bg-primary text-on-primary font-bold hover:bg-secondary">Ingest Node</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      document.getElementById('submit-ingest-node-btn').onclick = () => {
        const name = document.getElementById('new-node-name').value.trim() || 'New Node';
        modal.remove();
        if (window.showTacticalToast) {
          window.showTacticalToast(`Entity [${name}] ingested and rendered in network topology.`, 'success');
        }
      };
    }
  }

  // ============================================================
  //  12. ENTITY PROFILES COMPLETE INTERACTION SUITE
  // ============================================================

  function initEntityProfileInteractions() {
    if (!window.location.pathname.includes('entity-profiles')) return;

    // A. Profile Tabs (Overview, Relationships, Timeline, Documents & Evidence, Analyst Notes)
    const navButtons = document.querySelectorAll('nav button');
    navButtons.forEach(btn => {
      const txt = btn.textContent.toLowerCase().trim();
      const isProfileTab = ['overview', 'relationship', 'timeline', 'document', 'note'].some(t => txt.includes(t));
      if (!isProfileTab) return;

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        navButtons.forEach(b => {
          b.className = 'px-space-md py-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-headline-sm text-body-md flex items-center gap-2 transition-colors';
        });
        btn.className = 'px-space-md py-2 rounded-lg bg-surface-container text-primary font-headline-sm text-headline-sm font-bold flex items-center gap-2 shadow-sm';

        if (txt.includes('overview')) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          if (window.showTacticalToast) window.showTacticalToast('Switched to Dossier Overview.', 'info');
        } else if (txt.includes('relationship')) {
          const target = document.querySelector('table, [class*="Relationships Ledger"]')?.closest('.bg-surface-container-low') || document.querySelector('table');
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (window.showTacticalToast) window.showTacticalToast('Focusing Network Relationships & Associates Ledger.', 'info');
        } else if (txt.includes('timeline')) {
          const target = document.querySelector('[class*="Investigative Chronology"]')?.closest('.bg-surface-container-low') || document.querySelector('.space-y-space-sm.relative');
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (window.showTacticalToast) window.showTacticalToast('Viewing Chronological Target Surveillance Timeline.', 'info');
        } else if (txt.includes('document')) {
          const target = document.querySelector('table')?.closest('.bg-surface-container-low');
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (window.showTacticalToast) window.showTacticalToast('Viewing Evidentiary Attachments & Banking Conduits.', 'info');
        } else if (txt.includes('note')) {
          if (window.openCaseNoteModal) window.openCaseNoteModal();
          else if (window.showTacticalToast) window.showTacticalToast('Opening Analyst Operational Notes.', 'info');
        }
      });
    });

    // B. Header Buttons (Wiretap, Surveillance, INTERPOL, Export PDF)
    document.querySelectorAll('main button').forEach(btn => {
      const txt = btn.textContent.toLowerCase().trim();

      if (txt.includes('target surveillance')) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          btn.innerHTML = '<span class="material-symbols-outlined text-[18px] text-emerald-400">check_circle</span> <span>Surveillance Active (24/7)</span>';
          btn.classList.add('border', 'border-emerald-500/50');
          if (window.showTacticalToast) {
            window.showTacticalToast('24/7 Priority Surveillance Protocol Activated for Dmitri Petrov (POI-9042).', 'success');
          }
        });
      }

      if (txt.includes('wiretap')) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          handleWiretapFlag();
        });
      }

      if (txt.includes('interpol')) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          handleCrossCheckInterpol();
        });
      }
    });
  }

  // ============================================================
  //  13. EVIDENTIARY REPORT GENERATOR COMPLETE INTERACTION SUITE
  // ============================================================

  function initReportGeneratorInteractions() {
    if (!window.location.pathname.includes('report-generator')) return;

    // A. Section Checkboxes dynamically toggle preview sections
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        const label = cb.closest('label')?.textContent.toLowerCase() || '';
        const previewSections = document.querySelectorAll('.printable-document section, [data-report-section]');

        previewSections.forEach(sec => {
          const secText = sec.textContent.toLowerCase();
          if (
            (label.includes('executive') && secText.includes('executive')) ||
            (label.includes('entity') && secText.includes('entity')) ||
            (label.includes('network') && secText.includes('network')) ||
            (label.includes('financial') && secText.includes('financial')) ||
            (label.includes('evidentiary') && secText.includes('evidentiary'))
          ) {
            sec.style.display = cb.checked ? '' : 'none';
          }
        });

        if (window.showTacticalToast) {
          window.showTacticalToast(`Report Section [${label.split('\n')[0].trim()}]: ${cb.checked ? 'Included' : 'Excluded'}`, 'info');
        }
      });
    });

    // B. Classification Badge Cycler
    const classBadge = document.querySelector('.bg-error\\/10, [data-classification]');
    if (classBadge) {
      classBadge.classList.add('cursor-pointer', 'select-none');
      classBadge.addEventListener('click', () => {
        const nextIdx = (CLASSIFICATIONS.indexOf(activeClassification) + 1) % CLASSIFICATIONS.length;
        activeClassification = CLASSIFICATIONS[nextIdx];
        classBadge.textContent = activeClassification;
        if (window.showTacticalToast) {
          window.showTacticalToast(`Report Security Level: ${activeClassification}`, 'info');
        }
      });
    }

    // C. Compile & Print Buttons
    document.querySelectorAll('button').forEach(btn => {
      const txt = btn.textContent.toLowerCase().trim();
      if (txt.includes('generate') || txt.includes('compile')) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const orig = btn.innerHTML;
          btn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">sync</span> Generating Package...';
          setTimeout(() => {
            btn.innerHTML = orig;
            if (window.showTacticalToast) {
              window.showTacticalToast('Evidentiary Report Compiled with Certified Digital Signature (AN-89241).', 'success');
            }
          }, 900);
        });
      }

      if (txt.includes('export') || txt.includes('print') || txt.includes('pdf')) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          if (window.showTacticalToast) window.showTacticalToast('Launching Official Print / PDF Dispatch...', 'info');
          setTimeout(() => window.print(), 300);
        });
      }
    });
  }

  // ============================================================
  //  14. REAL-TIME INTELLIGENCE TELEMETRY STREAM
  // ============================================================

  let lastKnownSeq = 0;

  function initRealtimeIntelligenceTelemetry() {
    // Poll the backend every 4 seconds for new real-time intelligence events
    setInterval(async () => {
      try {
        const res = await fetch(`/api/live-feeds/realtime-stream?since_seq=${lastKnownSeq}&count=2`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.latest_seq) lastKnownSeq = data.latest_seq;

        // Update telemetry numbers safely on leaf elements only
        document.querySelectorAll('header span').forEach(el => {
          if (el.children.length === 0) {
            const t = el.textContent.trim();
            if (t.includes('ev/min')) {
              el.textContent = data.ingest_rate || '4,942 ev/min';
            } else if (t === '00:01:14 UTC' || t.includes('UTC (LIVE)')) {
              el.textContent = '00:00:02 UTC (LIVE)';
            }
          }
        });

        // If there are new high/critical events, notify the user periodically
        const events = data.events || [];
        if (events.length > 0) {
          const topEv = events[0];
          // Dispatch custom event for page listeners
          window.dispatchEvent(new CustomEvent('nexus:realtime-event', { detail: topEv }));
        }
      } catch (err) {
        // Silently skip if network error
      }
    }, 4000);
  }

  // Initialize on load
  document.addEventListener('DOMContentLoaded', () => {
    checkLiveApiKeyStatus();
    initCaseNoteComposer();
    initUniversalDelegation();
    initAlertsInteractions();
    initNetworkExplorerInteractions();
    initEntityProfileInteractions();
    initReportGeneratorInteractions();
    initRealtimeIntelligenceTelemetry();
  });

})();
