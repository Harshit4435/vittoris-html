# VITTORIS AI — Pure HTML/CSS/JS Enterprise Platform

Architecting Enterprise Pipeline With Autonomous AI Infrastructure & Pure Performance Economics.

This repository contains the standalone, production-ready **HTML5, Vanilla CSS3, and Vanilla JavaScript** implementation of the VITTORIS AI platform.

---

## 🚀 Key Platform Features

1. **Pure Standalone Architecture**:
   - Zero Node.js or `npm run build` dependencies required.
   - Ready for instant deployment to **Hostinger**, cPanel, Apache, Nginx, or GitHub Pages.
   - Production-tuned `.htaccess` included for clean URLs, HTTPS redirection, and asset caching.

2. **Luxury Visual Aesthetic & Design System**:
   - Typography: **Playfair Display**, **Plus Jakarta Sans**, and **JetBrains Mono**.
   - Obsidian dark mode, Alabaster light mode, and an **Eye-Protection Warm Amber mode**.
   - Smooth glassmorphism, gold accents (`#d4af37`), and subtle micro-animations.

3. **Ten Pillars of Enterprise AI Modernization**:
   - 01. Pay-Per-Appointment Commercial Acquisition (Zero Risk)
   - 02. Custom Enterprise AI Systems (Document & ERP Intelligence)
   - 03. Conversational AI Agents & Inbound Setters (Sub-second response)
   - 04. Enterprise AI Voice Agents (Telephony Speech Synthesis)
   - 05. Autonomous AI Appointment Setters
   - 06. Business Process Automation (BPA)
   - 07. Strategic AI Integration & SOC-2 Compliance
   - 08. AI-Driven Demand Generation
   - 09. High-Ticket ABM Acquisition ($50k+ to $1M+ ACV)
   - 10. User & Platform Acquisition (SaaS / Fintech)

4. **Interactive Capacity & ROI Calculator**:
   - Dynamic real-time calculation of revenue uplift, rep hours recovered, and ROI multiple based on lead volume, close rates, and contract values.

5. **3-Slot Discovery Call Modal with Dual Routing**:
   - **Step 1: Candidate Dossier** (Name, Work Email, Company, Phone, Scope).
   - **Step 2: Choose 3 Distinct Slots** (Live validation prevents selecting already locked slots).
   - **Step 3: Locked Receipt & Calendly Portal Button** (Displays reference ID, pending status, and direct Calendly sync).
   - **EmailJS Transmission**: Automatically emails the owner with 1-click administrative action links (`?action=approve&reqId=...&slot=1` or `?action=ignore`).

6. **Executive Governance Admin Desk (`admin.html`)**:
   - Parses 1-click email links to automatically approve or ignore incoming requests.
   - Master Calendar table locking slots permanently against double-booking.
   - KPI counters for pipeline monitoring.

---

## 📁 Project Structure

```
├── .htaccess                     # Apache / Hostinger routing & caching
├── index.html                    # Main landing page + 3-Slot Modal
├── services.html                 # 10 Enterprise AI Services catalog
├── contact.html                  # Scoping dossier submission & contact form
├── admin.html                    # Master Calendar & Executive Governance Desk
├── README.md                     # Documentation
├── favicon.svg                   # Brand mark favicon
├── favicon.png                   # Apple touch icon
├── assets/
│   ├── css/
│   │   └── style.css             # Comprehensive design system & luxury theme
│   ├── js/
│   │   ├── emailService.js       # EmailJS configuration & dispatch logic
│   │   ├── scheduler.js          # 3-slot booking modal & local calendar engine
│   │   ├── main.js               # Theme switcher, ROI calculator & navigation
│   │   └── admin.js              # URL 1-click actions & master calendar desk
│   └── images/                   # Official logo and branding graphics
└── branding/                     # Vector and high-res brand assets
```

---

## 🌐 Deploying to Hostinger (Step-by-Step)

Because this project is built entirely in pure HTML, CSS, and JavaScript, deploying to Hostinger takes less than 2 minutes:

1. Log into your **Hostinger hPanel**.
2. Navigate to **Websites** &rarr; click **Manage** next to your domain.
3. Open **File Manager** (or connect via FTP / FileZilla).
4. Enter the `public_html` directory:
   - If there is a default `default.php` or placeholder file, delete it.
5. Upload all files from this repository directly into `public_html`:
   - `index.html` must be placed directly inside `public_html/`.
   - `.htaccess`, `services.html`, `contact.html`, `admin.html`, and the `assets/` folder must all be at the root of `public_html/`.
6. Visit your domain in any browser — your platform is live immediately!

---

## ⚙️ Configuration & Credentials

All integrations are pre-configured in `assets/js/emailService.js`:

- **EmailJS Service ID**: `service_iu5eb5a`
- **EmailJS Template ID**: `template_7u7tez3`
- **EmailJS Public Key**: `d7kefRJyGh4blQyYw`
- **Owner Email**: `tharshit2257@gmail.com`
- **Company Email**: `company@vittoris.com`
- **Calendly Portal**: `https://calendly.com/tharshit2257/meetings`

---

## 📄 License

&copy; 2026 VITTORIS AI SYSTEMS. All Rights Reserved. Performance-based enterprise acquisition architecture.
