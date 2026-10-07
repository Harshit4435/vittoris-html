/**
 * VITTORIS AI - Platform Core JavaScript Engine
 * Theme Switching, ROI Calculator, Interactive Aesthetics
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  initRoiCalculator();
  initNavigation();
  initScrollEffects();
  initLucideIcons();
});

/**
 * 1. 3-Way Theme Switcher (Dark / Light / Eye-Protection)
 */
function initThemeEngine() {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('vittoris_theme') || 'dark';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('vittoris_theme', theme);

    // Update active state in theme toggler UI buttons if present
    document.querySelectorAll('[data-set-theme]').forEach(btn => {
      if (btn.getAttribute('data-set-theme') === theme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Apply stored or default theme
  applyTheme(savedTheme);

  // Bind click listeners to theme switcher buttons
  document.querySelectorAll('[data-set-theme]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const theme = btn.getAttribute('data-set-theme');
      applyTheme(theme);
    });
  });
}

/**
 * 2. Enterprise Growth & ROI Capacity Calculator
 */
function initRoiCalculator() {
  const leadsSlider = document.getElementById('calcLeads');
  const convSlider = document.getElementById('calcConversion');
  const dealSlider = document.getElementById('calcDealValue');
  const repsSlider = document.getElementById('calcReps');

  if (!leadsSlider || !convSlider || !dealSlider) return;

  const leadsDisplay = document.getElementById('dispLeads');
  const convDisplay = document.getElementById('dispConversion');
  const dealDisplay = document.getElementById('dispDealValue');
  const repsDisplay = document.getElementById('dispReps');

  const baselineRevEl = document.getElementById('resBaselineRevenue');
  const projectedRevEl = document.getElementById('resProjectedRevenue');
  const additionalRevEl = document.getElementById('resAdditionalRevenue');
  const hoursSavedEl = document.getElementById('resHoursSaved');
  const roiMultipleEl = document.getElementById('resRoiMultiple');

  function formatCurrency(num) {
    return '$' + Math.round(num).toLocaleString('en-US');
  }

  function calculate() {
    const leads = parseFloat(leadsSlider.value) || 200;
    const convRate = parseFloat(convSlider.value) || 3.5;
    const dealValue = parseFloat(dealSlider.value) || 20000;
    const reps = repsSlider ? (parseFloat(repsSlider.value) || 4) : 4;

    // Update display labels
    if (leadsDisplay) leadsDisplay.innerText = leads.toLocaleString();
    if (convDisplay) convDisplay.innerText = convRate.toFixed(1) + '%';
    if (dealDisplay) dealDisplay.innerText = formatCurrency(dealValue);
    if (repsDisplay) repsDisplay.innerText = reps.toString();

    // Baseline Metrics
    const baselineDeals = leads * (convRate / 100);
    const baselineRevenue = baselineDeals * dealValue;

    // Vittoris Speed-to-lead & Multi-tier AI Screening Lift (+65% higher conversion)
    const improvedConvRate = Math.min(convRate * 1.65, 45);
    const projectedDeals = leads * (improvedConvRate / 100);
    const projectedRevenue = projectedDeals * dealValue;
    const additionalRevenue = projectedRevenue - baselineRevenue;

    // Operational Time Liberated: 24 hours per sales rep/month in automated prospecting
    const hoursSaved = reps * 24;

    // Estimated ROI Multiple (based on typical tier investment)
    const estTierCost = Math.max(4500, baselineRevenue * 0.08);
    const roiMultiple = (additionalRevenue / estTierCost).toFixed(1) + 'x';

    // Render results
    if (baselineRevEl) baselineRevEl.innerText = formatCurrency(baselineRevenue);
    if (projectedRevEl) projectedRevEl.innerText = formatCurrency(projectedRevenue);
    if (additionalRevEl) additionalRevEl.innerText = '+' + formatCurrency(additionalRevenue);
    if (hoursSavedEl) hoursSavedEl.innerText = `${hoursSaved} hrs/mo`;
    if (roiMultipleEl) roiMultipleEl.innerText = roiMultiple;
  }

  // Bind input listeners
  [leadsSlider, convSlider, dealSlider, repsSlider].forEach(slider => {
    if (slider) {
      slider.addEventListener('input', calculate);
    }
  });

  // Run initial calculation
  calculate();
}

/**
 * 3. Mobile Navigation & Header State
 */
function initNavigation() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('primaryNav');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('nav-open');
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('nav-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/**
 * 4. Scroll Header Blur & Smooth Interactions
 */
function initScrollEffects() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/**
 * 5. Lucide Icons Renderer
 */
function initLucideIcons() {
  if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}
