/**
 * VITTORIS AI - 3-Slot Discovery Call Scheduling Engine
 * Pure Vanilla JavaScript
 */

class VittorisScheduler {
  constructor() {
    this.modal = document.getElementById('bookingModal');
    this.currentStep = 1;
    this.candidateData = {};
    this.selectedSlots = []; // Array of max 3 objects: { id, date, time, tz }
    this.lockedSlots = this.loadLockedSlots();
    this.requests = this.loadRequests();
    
    this.initElements();
    this.initEventListeners();
  }

  loadLockedSlots() {
    try {
      const stored = localStorage.getItem('vittoris_locked_slots');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading locked slots:', e);
    }
    // Default seed locked slots for demo realism
    return [
      { date: this.getRelativeDate(1), time: '10:00 AM', reason: 'Executive Consultation' },
      { date: this.getRelativeDate(2), time: '02:00 PM', reason: 'Enterprise Architecture Review' }
    ];
  }

  loadRequests() {
    try {
      const stored = localStorage.getItem('vittoris_meeting_requests');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading requests:', e);
    }
    return [];
  }

  saveRequests() {
    localStorage.setItem('vittoris_meeting_requests', JSON.stringify(this.requests));
  }

  saveLockedSlots() {
    localStorage.setItem('vittoris_locked_slots', JSON.stringify(this.lockedSlots));
  }

  getRelativeDate(daysFromNow) {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d.toISOString().split('T')[0];
  }

  initElements() {
    this.step1El = document.getElementById('schedulerStep1');
    this.step2El = document.getElementById('schedulerStep2');
    this.step3El = document.getElementById('schedulerStep3');
    
    this.slotsContainerEl = document.getElementById('selectedSlotsContainer');
    this.slotCounterEl = document.getElementById('slotCounterText');
    this.slotInputDate = document.getElementById('slotInputDate');
    this.slotInputTime = document.getElementById('slotInputTime');
    this.slotInputTz = document.getElementById('slotInputTz');
    this.addSlotBtn = document.getElementById('btnAddSlot');
    
    this.receiptRefEl = document.getElementById('receiptRequestId');
    this.receiptClientEl = document.getElementById('receiptClientName');
    this.receiptSlotsListEl = document.getElementById('receiptSlotsList');
    this.calendlyBtnEl = document.getElementById('btnOpenCalendly');

    // Set min date for datepicker to tomorrow
    if (this.slotInputDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      this.slotInputDate.min = tomorrow.toISOString().split('T')[0];
    }
  }

  initEventListeners() {
    // Open triggers
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-open-scheduler], .open-scheduler-btn');
      if (trigger) {
        e.preventDefault();
        this.openModal();
      }
    });

    // Close triggers
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-close-scheduler]') || e.target.classList.contains('vittoris-modal-backdrop')) {
        this.closeModal();
      }
    });

    // ESC key closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal && this.modal.classList.contains('active')) {
        this.closeModal();
      }
    });

    // Step 1 Form Submit -> Proceed to Step 2
    const step1Form = document.getElementById('schedulerFormStep1');
    if (step1Form) {
      step1Form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.candidateData = {
          name: document.getElementById('candName').value.trim(),
          email: document.getElementById('candEmail').value.trim(),
          company: document.getElementById('candCompany').value.trim(),
          phone: document.getElementById('candPhone').value.trim(),
          revenue: document.getElementById('candRevenue') ? document.getElementById('candRevenue').value : 'Unspecified',
          notes: document.getElementById('candNotes').value.trim()
        };
        this.goToStep(2);
      });
    }

    // Step 2 Add Slot button
    if (this.addSlotBtn) {
      this.addSlotBtn.addEventListener('click', () => {
        this.handleAddSlot();
      });
    }

    // Step 2 Submit 3 Slots -> Proceed to Step 3
    const btnSubmitSlots = document.getElementById('btnSubmitSlots');
    if (btnSubmitSlots) {
      btnSubmitSlots.addEventListener('click', () => {
        this.handleSubmitMeetingRequest();
      });
    }

    // Step 2 Back button
    const btnBackToStep1 = document.getElementById('btnBackToStep1');
    if (btnBackToStep1) {
      btnBackToStep1.addEventListener('click', () => {
        this.goToStep(1);
      });
    }

    // Quick Time Presets
    document.querySelectorAll('.time-preset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const timeVal = e.target.getAttribute('data-time');
        if (this.slotInputTime) {
          this.slotInputTime.value = timeVal;
        }
      });
    });
  }

  openModal() {
    if (!this.modal) return;
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.goToStep(1);
  }

  closeModal() {
    if (!this.modal) return;
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  goToStep(stepNumber) {
    this.currentStep = stepNumber;
    if (this.step1El) this.step1El.style.display = stepNumber === 1 ? 'block' : 'none';
    if (this.step2El) this.step2El.style.display = stepNumber === 2 ? 'block' : 'none';
    if (this.step3El) this.step3El.style.display = stepNumber === 3 ? 'block' : 'none';

    // Update Step Indicators
    document.querySelectorAll('.modal-step-indicator').forEach(ind => {
      const step = parseInt(ind.getAttribute('data-step') || '1');
      ind.classList.remove('active', 'completed');
      if (step === stepNumber) {
        ind.classList.add('active');
      } else if (step < stepNumber) {
        ind.classList.add('completed');
      }
    });

    if (stepNumber === 2) {
      this.renderSelectedSlots();
    }
  }

  isSlotLocked(date, time) {
    return this.lockedSlots.some(s => s.date === date && s.time === time);
  }

  handleAddSlot() {
    if (this.selectedSlots.length >= 3) {
      alert('You have already selected 3 preferred time slots. Remove one to pick an alternative.');
      return;
    }

    const date = this.slotInputDate.value;
    const time = this.slotInputTime.value;
    const tz = this.slotInputTz ? this.slotInputTz.value : 'EST';

    if (!date) {
      alert('Please choose a date.');
      return;
    }
    if (!time) {
      alert('Please choose a time.');
      return;
    }

    // Check if slot is already in locked master calendar
    if (this.isSlotLocked(date, time)) {
      alert(`The slot on ${date} at ${time} is already booked or reserved on our executive calendar. Please select an alternate time.`);
      return;
    }

    // Check duplicate in current selection
    const exists = this.selectedSlots.some(s => s.date === date && s.time === time);
    if (exists) {
      alert('You have already added this exact time slot.');
      return;
    }

    this.selectedSlots.push({
      id: 'slot_' + Date.now(),
      date,
      time,
      tz
    });

    this.renderSelectedSlots();
  }

  removeSlot(index) {
    this.selectedSlots.splice(index, 1);
    this.renderSelectedSlots();
  }

  renderSelectedSlots() {
    if (!this.slotsContainerEl) return;
    this.slotsContainerEl.innerHTML = '';

    if (this.selectedSlots.length === 0) {
      this.slotsContainerEl.innerHTML = `
        <div class="empty-slots-placeholder">
          <p class="text-muted">No slots chosen yet. Please pick 3 time windows for administrative review.</p>
        </div>
      `;
    } else {
      this.selectedSlots.forEach((slot, idx) => {
        const slotCard = document.createElement('div');
        slotCard.className = 'selected-slot-pill';
        slotCard.innerHTML = `
          <div class="slot-badge-number">Slot 0${idx + 1}</div>
          <div class="slot-info">
            <span class="slot-date">${slot.date}</span>
            <span class="slot-time">${slot.time} (${slot.tz})</span>
          </div>
          <button type="button" class="btn-remove-slot" aria-label="Remove slot">&times;</button>
        `;
        slotCard.querySelector('.btn-remove-slot').addEventListener('click', () => {
          this.removeSlot(idx);
        });
        this.slotsContainerEl.appendChild(slotCard);
      });
    }

    // Update Counter & Submit Button State
    const count = this.selectedSlots.length;
    if (this.slotCounterEl) {
      this.slotCounterEl.innerText = `${count} of 3 Selected`;
      this.slotCounterEl.style.color = count === 3 ? 'var(--gold-400)' : 'var(--text-secondary)';
    }

    const btnSubmit = document.getElementById('btnSubmitSlots');
    if (btnSubmit) {
      if (count === 3) {
        btnSubmit.removeAttribute('disabled');
        btnSubmit.classList.remove('btn-disabled');
      } else {
        btnSubmit.setAttribute('disabled', 'true');
        btnSubmit.classList.add('btn-disabled');
      }
    }
  }

  async handleSubmitMeetingRequest() {
    if (this.selectedSlots.length < 3) {
      alert('Please select exactly 3 time slots to allow our executive team to match calendars.');
      return;
    }

    const btnSubmit = document.getElementById('btnSubmitSlots');
    const originalText = btnSubmit ? btnSubmit.innerHTML : 'Submit Request';
    if (btnSubmit) {
      btnSubmit.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status"></span>
        Securing Slots & Dispatching...
      `;
      btnSubmit.disabled = true;
    }

    // Generate Unique Reference ID
    const reqId = 'VIT-REQ-' + Math.floor(100000 + Math.random() * 900000);
    const meetingRecord = {
      id: reqId,
      name: this.candidateData.name,
      email: this.candidateData.email,
      company: this.candidateData.company,
      phone: this.candidateData.phone,
      revenue: this.candidateData.revenue,
      notes: this.candidateData.notes,
      slots: [...this.selectedSlots],
      status: 'pending_admin_approval', // pending_admin_approval | approved | ignored
      createdAt: new Date().toISOString()
    };

    // Save locally
    this.requests.unshift(meetingRecord);
    this.saveRequests();

    // Send notifications via EmailJS
    let dispatchResult = { success: false };
    if (window.VittorisEmail && typeof window.VittorisEmail.sendMeetingRequestEmails === 'function') {
      try {
        dispatchResult = await window.VittorisEmail.sendMeetingRequestEmails(meetingRecord);
      } catch (err) {
        console.warn('Dispatch failed, fallback active:', err);
      }
    }

    // Populate Step 3 Receipt
    if (this.receiptRefEl) this.receiptRefEl.innerText = reqId;
    if (this.receiptClientEl) this.receiptClientEl.innerText = `${meetingRecord.name} (${meetingRecord.company})`;
    
    if (this.receiptSlotsListEl) {
      this.receiptSlotsListEl.innerHTML = meetingRecord.slots.map((s, idx) => `
        <li class="receipt-slot-item">
          <strong>Slot 0${idx + 1}:</strong> ${s.date} at ${s.time} (${s.tz})
          <span class="status-badge pending">Pending Executive Lock</span>
        </li>
      `).join('');
    }

    if (this.calendlyBtnEl) {
      this.calendlyBtnEl.href = window.VittorisEmail ? window.VittorisEmail.config.CALENDLY_URL : 'https://calendly.com/tharshit2257/meetings';
    }

    // Show fallback notice if email failed
    const fallbackBox = document.getElementById('receiptFallbackNotice');
    if (fallbackBox && dispatchResult.mailtoFallback) {
      const mailtoLink = document.getElementById('receiptMailtoLink');
      if (mailtoLink) mailtoLink.href = dispatchResult.mailtoFallback;
      fallbackBox.style.display = dispatchResult.success ? 'none' : 'block';
    }

    // Transition to Step 3
    this.goToStep(3);

    if (btnSubmit) {
      btnSubmit.innerHTML = originalText;
      btnSubmit.disabled = false;
    }
  }
}

// Instantiate upon DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.vittorisScheduler = new VittorisScheduler();
});
