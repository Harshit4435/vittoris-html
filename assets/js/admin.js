/**
 * VITTORIS AI - Master Scheduling & Executive Admin Portal
 * Pure Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdminPortal();
});

function initAdminPortal() {
  const urlParams = new URLSearchParams(window.location.search);
  const action = urlParams.get('action');
  const reqId = urlParams.get('reqId');
  const slotNum = urlParams.get('slot');

  let requests = loadRequests();
  let lockedSlots = loadLockedSlots();

  // 1. Process URL 1-Click Action from Email
  if (action && reqId) {
    processUrlAction(action, reqId, slotNum, requests, lockedSlots);
  }

  // 2. Render Tables & Views
  renderAdminView(requests, lockedSlots);

  // 3. Bind UI actions
  bindAdminEvents();
}

function loadRequests() {
  try {
    const raw = localStorage.getItem('vittoris_meeting_requests');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading requests:', e);
  }
  return [];
}

function loadLockedSlots() {
  try {
    const raw = localStorage.getItem('vittoris_locked_slots');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading locked slots:', e);
  }
  return [
    { date: '2026-10-12', time: '10:00 AM', client: 'Enterprise Candidate', reason: 'Strategic AI Architecture Review' },
    { date: '2026-10-14', time: '02:00 PM', client: 'Private Equity Sponsor', reason: 'Performance Acquisition Scoping' }
  ];
}

function saveRequests(requests) {
  localStorage.setItem('vittoris_meeting_requests', JSON.stringify(requests));
}

function saveLockedSlots(lockedSlots) {
  localStorage.setItem('vittoris_locked_slots', JSON.stringify(lockedSlots));
}

function processUrlAction(action, reqId, slotNum, requests, lockedSlots) {
  const alertBox = document.getElementById('adminActionAlert');
  const targetReq = requests.find(r => r.id === reqId);

  if (!targetReq) {
    if (alertBox) {
      alertBox.className = 'admin-alert-banner alert-warning';
      alertBox.innerHTML = `
        <strong>Notice:</strong> Meeting Request <code>${reqId}</code> was not found in local browser state. It may have been submitted from another terminal or cleared.
      `;
      alertBox.style.display = 'block';
    }
    return;
  }

  if (action === 'approve') {
    const slotIndex = parseInt(slotNum || '1', 10) - 1;
    const chosenSlot = targetReq.slots[slotIndex] || targetReq.slots[0];

    targetReq.status = 'approved';
    targetReq.confirmedSlot = chosenSlot;
    targetReq.updatedAt = new Date().toISOString();

    // Lock slot on Master Calendar if not already locked
    const alreadyLocked = lockedSlots.some(s => s.date === chosenSlot.date && s.time === chosenSlot.time);
    if (!alreadyLocked) {
      lockedSlots.push({
        date: chosenSlot.date,
        time: chosenSlot.time,
        client: `${targetReq.name} (${targetReq.company})`,
        reqId: targetReq.id,
        reason: 'Confirmed Discovery Consultation'
      });
      saveLockedSlots(lockedSlots);
    }

    saveRequests(requests);

    if (alertBox) {
      alertBox.className = 'admin-alert-banner alert-success';
      alertBox.innerHTML = `
        <strong>Request Approved:</strong> <code>${targetReq.id}</code> for <strong>${targetReq.name}</strong> has been locked for <strong>${chosenSlot.date} at ${chosenSlot.time} (${chosenSlot.tz})</strong>.
        This window is now locked against other candidate bookings.
      `;
      alertBox.style.display = 'block';
    }
  } else if (action === 'ignore') {
    targetReq.status = 'ignored';
    targetReq.updatedAt = new Date().toISOString();
    saveRequests(requests);

    if (alertBox) {
      alertBox.className = 'admin-alert-banner alert-info';
      alertBox.innerHTML = `
        <strong>Request Ignored:</strong> Request <code>${targetReq.id}</code> has been archived. No calendar lock was applied.
      `;
      alertBox.style.display = 'block';
    }
  }
}

function renderAdminView(requests, lockedSlots) {
  // Update KPI counters
  const totalReqsEl = document.getElementById('kpiTotalRequests');
  const pendingReqsEl = document.getElementById('kpiPendingRequests');
  const approvedReqsEl = document.getElementById('kpiApprovedRequests');
  const lockedCountEl = document.getElementById('kpiLockedSlots');

  const pendingCount = requests.filter(r => r.status === 'pending_admin_approval').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;

  if (totalReqsEl) totalReqsEl.innerText = requests.length.toString();
  if (pendingReqsEl) pendingReqsEl.innerText = pendingCount.toString();
  if (approvedReqsEl) approvedReqsEl.innerText = approvedCount.toString();
  if (lockedCountEl) lockedCountEl.innerText = lockedSlots.length.toString();

  // Render Requests Table
  const tbodyReqs = document.getElementById('requestsTableBody');
  if (tbodyReqs) {
    if (requests.length === 0) {
      tbodyReqs.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-muted" style="padding: 2.5rem;">
            No incoming candidate discovery requests recorded.
          </td>
        </tr>
      `;
    } else {
      tbodyReqs.innerHTML = requests.map(req => {
        const slotsFormatted = req.slots.map((s, idx) => 
          `<div class="slot-mini-badge"><strong>S0${idx+1}:</strong> ${s.date} ${s.time}</div>`
        ).join('');

        let statusBadge = '<span class="status-badge pending">Pending</span>';
        if (req.status === 'approved') {
          statusBadge = `<span class="status-badge approved">Approved (${req.confirmedSlot ? req.confirmedSlot.time : 'Slot Locked'})</span>`;
        } else if (req.status === 'ignored') {
          statusBadge = '<span class="status-badge ignored">Ignored</span>';
        }

        return `
          <tr data-req-id="${req.id}">
            <td>
              <strong>${req.id}</strong><br>
              <small class="text-muted">${new Date(req.createdAt).toLocaleDateString()}</small>
            </td>
            <td>
              <strong>${escapeHtml(req.name)}</strong><br>
              <span class="text-muted">${escapeHtml(req.email)}</span><br>
              <small>${escapeHtml(req.company || 'Enterprise')} • ${escapeHtml(req.phone || 'N/A')}</small>
            </td>
            <td>${slotsFormatted}</td>
            <td>${statusBadge}</td>
            <td>
              <div class="action-btn-group">
                <button class="btn btn-xs btn-primary btn-approve-slot" data-id="${req.id}" data-slot="1" title="Approve Slot 1">Approve S1</button>
                <button class="btn btn-xs btn-outline btn-approve-slot" data-id="${req.id}" data-slot="2" title="Approve Slot 2">Approve S2</button>
                <button class="btn btn-xs btn-outline btn-approve-slot" data-id="${req.id}" data-slot="3" title="Approve Slot 3">Approve S3</button>
                <button class="btn btn-xs btn-danger btn-ignore-req" data-id="${req.id}" title="Ignore / Archive">Ignore</button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // Render Master Locked Slots Table
  const tbodySlots = document.getElementById('lockedSlotsTableBody');
  if (tbodySlots) {
    if (lockedSlots.length === 0) {
      tbodySlots.innerHTML = `
        <tr>
          <td colspan="5" class="text-center text-muted" style="padding: 2.5rem;">
            No slots currently locked on master calendar.
          </td>
        </tr>
      `;
    } else {
      tbodySlots.innerHTML = lockedSlots.map((s, idx) => `
        <tr>
          <td><strong>${s.date}</strong></td>
          <td><span class="badge-gold">${s.time}</span></td>
          <td>${escapeHtml(s.client || 'Corporate Executive')}</td>
          <td><span class="text-muted">${escapeHtml(s.reason || 'Strategic Consultation')}</span></td>
          <td>
            <button class="btn btn-xs btn-outline btn-unlock-slot" data-index="${idx}">Unlock Window</button>
          </td>
        </tr>
      `).join('');
    }
  }
}

function bindAdminEvents() {
  document.addEventListener('click', (e) => {
    // Approve Slot button
    const approveBtn = e.target.closest('.btn-approve-slot');
    if (approveBtn) {
      const id = approveBtn.getAttribute('data-id');
      const slotNum = approveBtn.getAttribute('data-slot');
      let requests = loadRequests();
      let lockedSlots = loadLockedSlots();
      processUrlAction('approve', id, slotNum, requests, lockedSlots);
      renderAdminView(requests, lockedSlots);
    }

    // Ignore button
    const ignoreBtn = e.target.closest('.btn-ignore-req');
    if (ignoreBtn) {
      const id = ignoreBtn.getAttribute('data-id');
      let requests = loadRequests();
      let lockedSlots = loadLockedSlots();
      processUrlAction('ignore', id, null, requests, lockedSlots);
      renderAdminView(requests, lockedSlots);
    }

    // Unlock slot button
    const unlockBtn = e.target.closest('.btn-unlock-slot');
    if (unlockBtn) {
      const idx = parseInt(unlockBtn.getAttribute('data-index'), 10);
      let lockedSlots = loadLockedSlots();
      lockedSlots.splice(idx, 1);
      saveLockedSlots(lockedSlots);
      renderAdminView(loadRequests(), lockedSlots);
    }
  });

  // Clear all demo data button
  const resetBtn = document.getElementById('btnResetData');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Reset demo calendar slots and request backlog to factory state?')) {
        localStorage.removeItem('vittoris_meeting_requests');
        localStorage.removeItem('vittoris_locked_slots');
        window.location.href = 'admin.html';
      }
    });
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
