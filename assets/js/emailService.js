/**
 * VITTORIS AI - Enterprise Email & Notification Service
 * Pure Vanilla JavaScript EmailJS Integration
 */

const VITTORIS_EMAIL_CONFIG = {
  SERVICE_ID: 'service_iu5eb5a',
  TEMPLATE_ID: 'template_7u7tez3',
  PUBLIC_KEY: 'd7kefRJyGh4blQyYw',
  OWNER_EMAIL: 'tharshit2257@gmail.com',
  COMPANY_EMAIL: 'company@vittoris.com',
  CALENDLY_URL: 'https://calendly.com/tharshit2257/meetings'
};

// Initialize EmailJS Browser SDK
(function initEmailJS() {
  if (typeof emailjs !== 'undefined') {
    try {
      emailjs.init({
        publicKey: VITTORIS_EMAIL_CONFIG.PUBLIC_KEY
      });
      console.log('[Vittoris AI] EmailJS Engine initialized.');
    } catch (err) {
      console.warn('[Vittoris AI] EmailJS init notice:', err);
    }
  } else {
    console.warn('[Vittoris AI] EmailJS CDN script not loaded yet.');
  }
})();

/**
 * Format Slot String into Human-Readable Format
 */
function formatSlotDisplay(slot) {
  if (!slot) return 'N/A';
  if (typeof slot === 'string') return slot;
  if (slot.date && slot.time) {
    return `${slot.date} at ${slot.time} (${slot.tz || 'EST'})`;
  }
  return JSON.stringify(slot);
}

/**
 * Send 3-Slot Discovery Call Request to Owner and Confirmation to Client
 */
async function sendMeetingRequestEmails(meetingData) {
  const currentOrigin = window.location.origin || window.location.protocol + '//' + window.location.host;
  const adminUrl = `${currentOrigin}/admin.html`;
  
  const approveSlot1Link = `${adminUrl}?action=approve&reqId=${encodeURIComponent(meetingData.id)}&slot=1`;
  const approveSlot2Link = `${adminUrl}?action=approve&reqId=${encodeURIComponent(meetingData.id)}&slot=2`;
  const approveSlot3Link = `${adminUrl}?action=approve&reqId=${encodeURIComponent(meetingData.id)}&slot=3`;
  const ignoreLink = `${adminUrl}?action=ignore&reqId=${encodeURIComponent(meetingData.id)}`;

  const slot1Formatted = formatSlotDisplay(meetingData.slots[0]);
  const slot2Formatted = formatSlotDisplay(meetingData.slots[1]);
  const slot3Formatted = formatSlotDisplay(meetingData.slots[2]);

  const templateParams = {
    // Standard EmailJS form mappings
    to_email: VITTORIS_EMAIL_CONFIG.OWNER_EMAIL,
    from_name: meetingData.name,
    from_email: meetingData.email,
    reply_to: meetingData.email,
    client_name: meetingData.name,
    client_email: meetingData.email,
    client_company: meetingData.company || 'Enterprise Candidate',
    client_phone: meetingData.phone || 'Not provided',
    project_scope: meetingData.notes || 'Strategic AI Deployment / Discovery',
    request_id: meetingData.id,
    
    // 3 slots proposed
    slot_1: slot1Formatted,
    slot_2: slot2Formatted,
    slot_3: slot3Formatted,
    
    // Quick Action Links
    approve_slot_1_url: approveSlot1Link,
    approve_slot_2_url: approveSlot2Link,
    approve_slot_3_url: approveSlot3Link,
    ignore_url: ignoreLink,
    calendly_portal_url: VITTORIS_EMAIL_CONFIG.CALENDLY_URL,
    
    // Complete readable message body
    message: `
NEW 3-SLOT DISCOVERY CALL REQUEST:
---------------------------------------------
Request ID: ${meetingData.id}
Client: ${meetingData.name} (${meetingData.email})
Company: ${meetingData.company || 'N/A'}
Phone: ${meetingData.phone || 'N/A'}

PROPOSED TIME SLOTS:
- Slot 1: ${slot1Formatted}
- Slot 2: ${slot2Formatted}
- Slot 3: ${slot3Formatted}

ADMIN ACTION LINKS:
- Approve Slot 1: ${approveSlot1Link}
- Approve Slot 2: ${approveSlot2Link}
- Approve Slot 3: ${approveSlot3Link}
- Ignore Request: ${ignoreLink}

Calendly Master Portal:
${VITTORIS_EMAIL_CONFIG.CALENDLY_URL}

Client Scope Notes:
${meetingData.notes || 'Discovery Call Request'}
---------------------------------------------
`
  };

  let emailSent = false;
  let errorDetail = null;

  if (typeof emailjs !== 'undefined') {
    try {
      const response = await emailjs.send(
        VITTORIS_EMAIL_CONFIG.SERVICE_ID,
        VITTORIS_EMAIL_CONFIG.TEMPLATE_ID,
        templateParams
      );
      console.log('[Vittoris AI] Meeting request dispatch successful:', response);
      emailSent = true;
    } catch (err) {
      console.error('[Vittoris AI] EmailJS dispatch encountered an issue:', err);
      errorDetail = err;
    }
  }

  return {
    success: emailSent,
    error: errorDetail,
    data: templateParams,
    mailtoFallback: generateMailtoFallback(meetingData, templateParams)
  };
}

/**
 * Send General Contact / Scoping Inquiries
 */
async function sendContactFormEmail(contactData) {
  const templateParams = {
    to_email: VITTORIS_EMAIL_CONFIG.OWNER_EMAIL,
    from_name: contactData.name,
    from_email: contactData.email,
    reply_to: contactData.email,
    client_name: contactData.name,
    client_email: contactData.email,
    client_company: contactData.company || 'Enterprise Candidate',
    service_interest: contactData.service || 'Enterprise Consultation',
    message: `
NEW CONTACT INQUIRY:
---------------------------------------------
Client: ${contactData.name} (${contactData.email})
Company: ${contactData.company || 'N/A'}
Phone: ${contactData.phone || 'N/A'}
Service Focus: ${contactData.service || 'General Scoping'}

Scope & Objectives:
${contactData.message}
---------------------------------------------
`
  };

  let emailSent = false;
  let errorDetail = null;

  if (typeof emailjs !== 'undefined') {
    try {
      const res = await emailjs.send(
        VITTORIS_EMAIL_CONFIG.SERVICE_ID,
        VITTORIS_EMAIL_CONFIG.TEMPLATE_ID,
        templateParams
      );
      console.log('[Vittoris AI] Contact dispatch success:', res);
      emailSent = true;
    } catch (err) {
      console.error('[Vittoris AI] Contact dispatch error:', err);
      errorDetail = err;
    }
  }

  return {
    success: emailSent,
    error: errorDetail,
    data: templateParams,
    mailtoFallback: `mailto:${VITTORIS_EMAIL_CONFIG.OWNER_EMAIL}?subject=${encodeURIComponent('Inquiry from ' + contactData.name)}&body=${encodeURIComponent(templateParams.message)}`
  };
}

/**
 * Generate Mailto Fallback Link
 */
function generateMailtoFallback(meetingData, params) {
  const subject = `Vittoris Discovery Call Request - ${meetingData.name} [${meetingData.id}]`;
  const body = params.message;
  return `mailto:${VITTORIS_EMAIL_CONFIG.OWNER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Export to Global Scope
window.VittorisEmail = {
  config: VITTORIS_EMAIL_CONFIG,
  sendMeetingRequestEmails,
  sendContactFormEmail,
  formatSlotDisplay
};
