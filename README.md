# Bhuvaneshwari B. — Digital Marketing & Performance Analytics Portfolio

> **"The Reconciled Ledger"** — An accountant’s precision and quantitative rigor applied to full-funnel digital marketing, paid advertising, and technical SEO.

---

## 🌟 Overview

This is the portfolio of **Bhuvaneshwari B.**, a certified digital marketing professional based in Chennai, India. Bringing 4+ years of financial analytics experience together with triple certifications (GUVI, Meta, NSDC) covering Google Ads, Meta Ads Manager, and SEO (GUVI · Meta · NSDC 2025), this portfolio showcases real campaign planning, live technical SEO audits, and hyperlocal marketing funnels.

The website is crafted as a presentation-grade, reel-style snap-scroll web application with smooth micro-interactions, responsive multi-device layouts, and instant load times.

---

## 🚀 Key Features

### 1. Presentation Reel Snap-Scroll Architecture
- **Controlled Section Snapping:** Seamless vertical slide navigation (`#slide-0` through `#slide-5`) with hardware-accelerated transitions.
- **Adaptive Multi-Modal Controls:**
  - **Desktop Mouse Wheel:** Debounced, inertia-suppressed trackpad and mouse wheel navigation prevents erratic multiple-slide skipping.
  - **Keyboard Navigation:** Full support for `ArrowDown`, `ArrowUp`, `PageDown`, `PageUp`, `Home`, `End`, and `Space`/`Shift+Space`.
  - **Touch & Mobile Swipes:** Natural touch gesture handling optimized for iOS Safari and Android Chrome.
  - **Navigation Dots & Navbar:** Clickable progress dots and sticky header links with real-time active state synchronization.

### 2. Strategic Case Studies & Interactive Modals
- **Apollo Dental Rebuild (Multi-City Always-On Campaign):**
  - Full-funnel search and paid social strategy across 5 Indian metros.
  - Real Screaming Frog technical SEO crawl audit with prioritization matrix.
  - DCI Code of Ethics & DPDP Act compliance notes.
  - Interactive ad creative mockups (Google Search ad, Facebook feed, Instagram retargeting).
- **Team Fitness with Yoga (Hyperlocal Marketing Funnel):**
  - 4-stage local acquisition and retention funnel (Discover, Engage, Convert, Retain) within a 5 km radius in Porur, Chennai.
  - WhatsApp Business automation, Google My Business optimization, and community referral mechanisms.
  - Three targeted audience personas with persona-specific creative hooks.

### 3. Interactive Toolkit & Skill Proficiency Visualizer
- Transparent proficiency rankings and visual skill bars across 11 marketing tools (Google Ads, Meta Ads Manager, Google Analytics 4, Canva, Premiere Pro, WhatsApp Business, etc.).
- Animated SVG progress bars triggered reactively via `IntersectionObserver`.

### 4. Verified Credentials & Certifications
- **GUVI:** Advanced Digital Marketing Certification (2025)
- **Meta:** Digital Marketing Associate (Platform Certified)
- **NSDC:** Digital Marketing Professional Certificate

### 5. Fast Load Performance & Zero-Dependency Architecture
- **Vanilla Core:** Zero heavy JavaScript frameworks (no React, Next.js, or Vue runtime overhead).
- **Optimized Network Assets:**
  - Single consolidated Google Fonts request with preconnect hints.
  - `fetchpriority="high"` for the above-the-fold hero background.
  - `loading="lazy"` and `decoding="async"` for offscreen media assets.
  - Non-blocking asynchronous script execution (`defer`).
- **Smooth 60/120 FPS Animations:** CSS transforms and opacity-based animations prevent layout thrashing and repaint spikes.

### 6. Integrated Contact Form (EmailJS)
- Native client-side form validation for inquiries, freelance projects, and full-time hiring.
- Integrated with [EmailJS](https://www.emailjs.com/) for direct inbox delivery without requiring a backend server.

---

## 📱 Responsive Layouts & Multi-Device Support

| Viewport | Screen Width | Layout Adjustments |
| :--- | :--- | :--- |
| **Desktop / Ultrawide** | `> 1024px` | Full two-column hero layout with real-time stats card, 4-column toolkit grid, 3-column cert cards, side-by-side case cards. Controlled slide snap. |
| **Tablets / Laptops** | `769px – 1024px` | Hamburger navigation, single-column case study cards, 2-column toolkit grid, compact profile stats. |
| **Mobile Phones** | `≤ 768px` | Fluid vertical rhythm (`min-height: 100dvh`), responsive typography (`clamp()`), stackable KPI metrics, horizontally scrollable case study audit tables. |

---

## 📂 Project Structure

```
portfolio-main/
├── assets/                       # Visual assets, branding logos, and case study creatives
│   ├── apollo-ad-awareness.jpg
│   ├── apollo-ad-convert.jpg
│   ├── apollo.jpeg
│   ├── hero_bg.jpg               # High-resolution textured background
│   ├── teamfitness-logo.png
│   └── teamfitness-logo.svg
├── case-studies/                 # Standalone case study pages
│   ├── apollo-dental-case-study.html
│   └── teamfitness-yoga-case-study.html
├── config/                       # Configuration files
│   └── emailjs.config.js         # EmailJS public credentials (Service, Template, Public Key)
├── app.js                        # Core application logic (snap-scroll, navigation, form, animations)
├── case-study.css                # Stylesheet for standalone case study views
├── index.html                    # Single-page application entry point with embedded modals
├── style.css                     # Primary design system, typography, and responsive media queries
└── README.md                     # Project documentation
```

---

## 🛠️ Getting Started Locally

No complex build steps or compiler tools required. You can serve the static files with any local web server:

### Option 1: Node.js (npx)
```bash
# Using http-server
npx -y http-server . -p 8080 -c-1

# Or using serve
npx -y serve -l 8080 .
```

### Option 2: Python 3
```bash
python -m http.server 8080
```

### Option 3: VS Code Live Server
Right-click on `index.html` and select **"Open with Live Server"**.

Visit `http://localhost:8080` in your web browser.

---

## ⚙️ EmailJS Configuration (Contact Form)

To enable live email delivery through the contact form:
1. Create a free account at [emailjs.com](https://www.emailjs.com/).
2. Create an Email Service (e.g. Gmail, Outlook).
3. Create an Email Template with placeholders: `{{from_name}}`, `{{from_email}}`, `{{phone}}`, `{{company}}`, `{{reason}}`, `{{message}}`.
4. Update `config/emailjs.config.js` with your credentials:
```javascript
const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'your_actual_public_key',
  SERVICE_ID: 'your_service_id',
  TEMPLATE_ID: 'your_template_id',
};
```

---

## 👤 Author & Contact

**Bhuvaneshwari Bakthavachalu**  
*Digital Marketing Professional · Chennai, Tamil Nadu, India*  

- ✉️ **Email:** [bhuvanabakthavachalu@gmail.com](mailto:bhuvanabakthavachalu@gmail.com)  
- 💼 **LinkedIn:** [linkedin.com/in/bhuvaneshwari-bakthavachalu](https://linkedin.com/in/bhuvaneshwari-bakthavachalu)  
- 📞 **Phone:** +91 99522 58495  

---

## 📄 License

© Bhuvaneshwari Bakthavachalu. All rights reserved.
